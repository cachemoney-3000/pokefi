import React, { Component } from 'react';

import * as $ from "jquery";
import { clientId, clientSecret } from "./config";
import hash from "./hash";

import "./App.css"
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import PlaylistPopup from './components/PlaylistPopup';

class App extends Component {
  constructor() {
    super();
    this.state = {
      // POKEMON
      pokemons: [],
      pokemonDetails: [],
      offset: 0,
      loadNumber: 20,
      loading: true,
      selectedPokemon: null,
      description: '',
      evolutionChain: [],

      // SPOTIFY
      token: null,
      playlist: null,
      no_data: false,
      showPopup: false,
    };    
    // Pokemon
    this.handleIntersection = this.handleIntersection.bind(this);
    this.selectPokemon = this.selectPokemon.bind(this);

    // Spotify
    this.generatePlaylist = this.generatePlaylist.bind(this);
    this.addPlaylistToAccount = this.addPlaylistToAccount.bind(this);
  }

  setSpotifyToken() {
    // Set token
    let _token = hash.access_token;
    //console.log(_token);
    if (_token) {
      // Set token
      this.setState({
        token: _token,
      });
  
      // Set interval to check token's expiration time
      setInterval(() => {
        const tokenExpirationTime = localStorage.getItem('spotifyTokenExpiration');
        if (tokenExpirationTime && Date.now() >= tokenExpirationTime) {
          // Token has expired, refresh it
          this.refreshSpotifyToken();
        }
      }, 60000); // Check token's expiration time every minute
    }
  }

  refreshSpotifyToken() {
    const refreshToken = localStorage.getItem('spotifyRefreshToken');
    const client_Id = clientId;
    const client_Secret = clientSecret;
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
  
    fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${client_Id}:${client_Secret}`)}`
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`
    })
    .then(response => response.json())
    .then(data => {
      // Update state with new access token
      this.setState({
        token: data.access_token,
      });
  
      // Store new access token in local storage
      localStorage.setItem('spotifyAccessToken', data.access_token);
  
      // Set new token expiration time
      const newTokenExpirationTime = Date.now() + (data.expires_in * 1000);
      localStorage.setItem('spotifyTokenExpiration', newTokenExpirationTime);

      // Store new refresh token in local storage
      localStorage.setItem('spotifyRefreshToken', data.refresh_token);

    })
    .catch(error => {
      console.error('Error refreshing Spotify token:', error);
    });
  }


  async componentDidMount() {
    this.setSpotifyToken()

    try {
      const allPokemonResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118');
      const allPokemonData = await allPokemonResponse.json();
  
      const allPokemonDetails = [];
      for (let i = 0; i < allPokemonData.results.length; i += 50) {
        const batchPokemonData = allPokemonData.results.slice(i, i + 50);
        const batchPokemonDetailsPromises = batchPokemonData.map(async (pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          return pokemonResponse.json();
        });
        const batchPokemonDetails = await Promise.all(batchPokemonDetailsPromises);
        allPokemonDetails.push(...batchPokemonDetails);
      }
  
      this.setState({ 
        pokemons: allPokemonData.results,
        pokemonDetails: allPokemonDetails,
        loading: false
      });
  
    } catch (error) {
      console.log(error);
    }

    this.observer = new IntersectionObserver(this.handleIntersection, {rootMargin: '0px', threshold: 1});
    this.observer.observe(document.querySelector('#intersection'));
  }

  getNextOffset() {
    return this.state.offset + this.state.loadNumber;
  }

  handleIntersection(entries) {
    if (entries[0].isIntersecting) {
      //console.log('intersecting')
      this.setState(prevState => ({
        offset: prevState.offset + prevState.loadNumber
      }));
    }
  }

  async getDescription(pokemon) {
    const speciesUrl = pokemon.species.url;
    const response = await fetch(speciesUrl);
    const data = await response.json();
    const englishFlavorText = data.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text.replace('', ' ');
    this.setState({ description: englishFlavorText });
  }

  async getEvolutionChain(pokemon) {
    const speciesUrl = pokemon.species.url;
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
  
    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evolutionChainResponse = await fetch(evolutionChainUrl);
    const evolutionChainData = await evolutionChainResponse.json();
    
    this.setState({ evolutionChain: evolutionChainData.chain });
  }
  
  // Selecting a Pokemon
  async selectPokemon(pokemon) {
    this.setState({ selectedPokemon: pokemon, loading: false,  showPopup: false});
    if (pokemon) {
      this.getDescription(pokemon);
      await this.getEvolutionChain(pokemon);
    }
  }
  
  async generatePlaylist(genres, name, id, imgSrc) {
    console.log(genres + ' ' + name + ' ' + id + ' ' + imgSrc);
    let popularity = Math.floor(Math.random() * 7) * 10 + 20;

    //console.log(popularity)

    // Generate a random letter or word to search for
    let searchQuery = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    // Make a request to the /v1/search endpoint
    let searchResponse = await fetch(`https://api.spotify.com/v1/search?type=artist&q=${searchQuery}`, {
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
    });
    let searchData = await searchResponse.json();

    // Extract a random artist ID from the search results
    let artistIds = searchData.artists.items.map((artist) => artist.id);
    let randomArtistId = artistIds[Math.floor(Math.random() * artistIds.length)];


    // Make a call to generate a new playlist
    const data = await new Promise((resolve, reject) => {
      $.ajax({
        url: `https://api.spotify.com/v1/recommendations?seed_genres=${genres}`,
        type: "GET",
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
        },
        data: {
          seed_artists: randomArtistId,
          limit: 10,
          target_popularity: popularity // set minimum popularity to 50 (out of 100)
        },
        success: (data) => {
          console.log(data);
          resolve(data);
        },
        error: (error) => {
          console.log(error);
          reject(error);
        },
      });
    });
    
    // Checks if the data is not empty
    if (!data || !data.tracks) {
      this.setState({
        no_data: true,
      });
      return;
    }

    this.setState(
      {
        playlist: {
          id: null,
          name: `${name}'s Playlist`,
          description: "This playlist was created using PokeFi",
          external_urls: null,
          tracks: data.tracks,
          genres: genres,
          added: false,
        },
        showPopup: true, // Set the value of showPopup to true
      },
      () => {
        //console.log(this.state.playlist);
      }
    );
  }

  
  addPlaylistToAccount() {
    //console.log("addPlaylistToAccount")
    //console.log(this.state.playlist.tracks)
    // Add the playlist to the user's account
    // Create a new playlist
    $.ajax({
      url: `https://api.spotify.com/v1/me/playlists`,
      type: "POST",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
      },
      contentType: "application/json",
      data: JSON.stringify({
        name: this.state.playlist.name,
        description: this.state.playlist.description,
      }),
      success: (playlist) => {
        // Add tracks to the playlist
        $.ajax({
          url: `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
          type: "POST",
          beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
          },
          contentType: "application/json",
          data: JSON.stringify({
            uris: this.state.playlist.tracks.map((track) => track.uri),
          }),
          success: () => {
            // Redirect to the new playlist URL
            window.open(playlist.external_urls.spotify, '_blank');
          },
        });
      },
    });
  }


  render() {
    const { pokemonDetails, loading, selectedPokemon, description, evolutionChain, offset, loadNumber, token} = this.state;

    return (
      <div className='bg-[#2b292c] w-screen h-screen overflow-y-scroll'>
        {this.state.token !== null ? (
          <MainPage 
            pokemonDetails={pokemonDetails}
            loading={loading}
            selectedPokemon={selectedPokemon}
            description={description}
            evolutionChain={evolutionChain}
            offset={offset}
            loadNumber={loadNumber}
            selectPokemon={(pokemon) => this.selectPokemon(pokemon)}
            generatePlaylistFromParams={this.generatePlaylist}
            handleLogout={() => this.setState({ token: null, showPopup: false })}
          />
        ) : (
          <LoginPage />
        )}

        {this.state.showPopup && 
          <div className="2xl:right-16 xl:right-0 lg:right-0 md:right-0 inset-0 2xl:w-1/4 xl:w-5/12 lg:w-5/12 md:w-full md:h-full 
            md:mr-auto md:ml-auto 2xl:mr-0 xl:mr-0 lg:mr-0 sticky z-10 overflow-y-hidden
            2xl:p-4 xl:p-10 lg:p-10 md:p-0 2xl:top-14 xl:top-10 lg:top-10 md:top-0" 
            style={{position: 'fixed'}}>
            <PlaylistPopup 
              name={this.state.playlist.name}
              tracks={this.state.playlist.tracks}
              genres={this.state.playlist.genres}
              onClose={() => this.setState({ showPopup: false })}
              onCatch={this.addPlaylistToAccount}
            />
          </div>
        }
      </div>
    );
  }
}
      
export default App;
