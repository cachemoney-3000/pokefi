import React, { Component } from 'react';

import "./App.css"
import MainPage from './pages/MainPage'

class App extends Component {
  constructor() {
    super();
    this.state = {
      pokemons: [], // add an empty array to hold the pokemon
      pokemonDetails: [],
      offset: 0,
      loadNumber: 20,
      loading: true,
      selectedPokemon: null,
      description: '',
      evolutionChain: [],
      searchTerm: '',
    };    
    this.handleIntersection = this.handleIntersection.bind(this);
    this.selectPokemon = this.selectPokemon.bind(this);
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
  
  async componentDidMount() {
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
  

  render() {
    const { pokemonDetails, loading, selectedPokemon, description, evolutionChain, searchTerm, offset, loadNumber } = this.state;

    return (
      <div className='bg-[#2b292c] w-screen h-screen overflow-y-scroll'>
        <MainPage 
          pokemonDetails={pokemonDetails}
          loading={loading}
          selectedPokemon={selectedPokemon}
          description={description}
          evolutionChain={evolutionChain}
          offset={offset}
          loadNumber={loadNumber}
          selectPokemon={(pokemon) => this.selectPokemon(pokemon)}
        />
      </div>
    );
  }
}
      
export default App;
