import React, { Component } from 'react';

import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";

import "./App.css"
import MainPage from './pages/MainPage'
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
    console.log(_token);
    if (_token) {
      // Set token
      this.setState({
        token: _token,
      });
    }
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
      console.log('intersecting')
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
    this.setState({ selectedPokemon: pokemon, loading: false });
    if (pokemon) {
      this.getDescription(pokemon);
      await this.getEvolutionChain(pokemon);
    }
  }
  
  async generatePlaylist(genres, name) {
    console.log(genres + ' ' + name);
    // Make a call to generate a new playlist
    const data = await new Promise((resolve, reject) => {
      $.ajax({
        url: `https://api.spotify.com/v1/recommendations?seed_genres=${genres}`,
        type: "GET",
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
        },
        data: {
          seed_artists: "4NHQUGzhtTLFvgF5SZesLK",
          limit: 10,
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
        },
        showPopup: true, // Set the value of showPopup to true
      },
      () => {
        console.log(this.state.playlist);
      }
    );
  }

  
  
  addPlaylistToAccount(token) {
    console.log("addPlaylistToAccount")
    console.log(this.state.playlist.tracks)
    // Add the playlist to the user's account
    // Create a new playlist
    $.ajax({
      url: `https://api.spotify.com/v1/me/playlists`,
      type: "POST",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      contentType: "application/json",
      data: JSON.stringify({
        name: "My New Playlist",
        description: "A new playlist generated by the app",
      }),
      success: (playlist) => {
        // Add tracks to the playlist
        $.ajax({
          url: `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
          type: "POST",
          beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
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
    const { pokemonDetails, loading, selectedPokemon, description, evolutionChain, offset, loadNumber, playlist, token } = this.state;

    return (
      <div className='bg-[#2b292c] w-screen h-screen overflow-y-scroll'>
        {!this.state.token && (
          <a
            className="px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`}
          >
            Login to Spotify
          </a>
        )}
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
          />
          {this.state.showPopup && 
            <PlaylistPopup 
              tracks={this.state.playlist.tracks}
              artists={this.state.artists}
              onClose={() => this.setState({ showPopup: false })}
            />
          }
      </div>
    );
  }
}
      
export default App;
