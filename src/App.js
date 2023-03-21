import React, { Component, Suspense, useState, useEffect } from 'react';

import "./App.css"
import PokeCard from './components/PokeCard'
import PokeInfo from './components/PokeInfo'

class App extends Component {
  constructor() {
    super();
    this.state = {
      pokemons: [], // add an empty array to hold the pokemon
      pokemonDetails: [],
      offset: 0,
      loadNumber: 20,
      loading: false,
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
      const newOffset = this.getNextOffset();
      this.setState({offset: newOffset, loading: true}, () => {
        this.getMorePokemon();
      });
    }
  }

getMorePokemon = async () => {
    const { pokemons, offset, loadNumber } = this.state;
    const pokemonDetailsPromises = [];
    const newPokemons = pokemons.slice(offset, offset + loadNumber);
    for (let i = 0; i < newPokemons.length; i++) {
      const pokemon = newPokemons[i];
      const response = await fetch(pokemon.url);
      pokemonDetailsPromises.push(response.json());
    }
    const newPokemonDetails = await Promise.all(pokemonDetailsPromises);
    this.setState({pokemonDetails: [...this.state.pokemonDetails, ...newPokemonDetails], loading: false});
  }

  

  async getDescription(pokemon) {
    const speciesUrl = pokemon.species.url;
    const response = await fetch(speciesUrl);
    const data = await response.json();
    const englishFlavorText = data.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text.replace('', ' ');
    this.setState({ description: englishFlavorText });
  }

  async  getEvolutionChain(pokemon) {
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
    console.log(pokemon)
    this.setState({ selectedPokemon: pokemon, loading: true });
    if (pokemon) {
      this.getDescription(pokemon);
      await this.getEvolutionChain(pokemon);
    }
  }
  
  async componentDidMount() {
    try {
      const allPokemonResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118');
      const allPokemonData = await allPokemonResponse.json();
  
      const allPokemonDetailsPromises = allPokemonData.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        return pokemonResponse.json();
      });
  
      const allPokemonDetails = await Promise.all(allPokemonDetailsPromises);
  
      this.setState({ 
        pokemons: allPokemonData.results,
        pokemonDetails: allPokemonDetails,
        loading: false
      });
  
    } catch (error) {
      console.log(error);
    }
  }
  


  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedPokemon !== this.state.selectedPokemon) {
      if (this.state.loading) {
        this.setState({ loading: false });
      } else {
        this.setState({ loading: true }, () => {
          setTimeout(() => {
            this.setState({ loading: false });
          }, 1000);
        });
      }
    }
  }


  render() {
    const { pokemonDetails, loading, selectedPokemon, description, evolutionChain, searchTerm } = this.state;
    const renderedPokemonList = [];
    const renderedPokemonIds = [];
    
    pokemonDetails
      .filter((pokemon) => pokemon.name.includes(this.state.searchTerm.toLowerCase()))
      .slice(0, this.state.offset + this.state.loadNumber)
      .forEach((pokemon) => {
        if (!renderedPokemonIds.includes(pokemon.id)) {
          renderedPokemonList.push(
            <PokeCard 
              pokemon={pokemon} 
              onClick={() => this.selectPokemon(pokemon)}
            />
          );
          renderedPokemonIds.push(pokemon.id);
        }
      });

    const handlePokemonClick = async (pokemon) => {
      console.log(`You clicked on ${pokemon}!`);

      // Make API call using the name to get full Pokemon information
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
      const data = await response.json();

      // Pass result to selectPokemon function
      this.selectPokemon(data);
    };

    return (
      <div className="flex flex-wrap lg:px-10 pb-20 md:pb-32 lg:pt-5 pt-3">
        <div className="w-full lg:w-3/4 p-4" style={{ overflowY: 'auto' }}>
        <input type="text" placeholder="Search for a Pokemon..." value={searchTerm} onChange={(event) => this.setState({ searchTerm: event.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mr-auto ml-auto w-fit lg:gap-5 md:gap-4 sm:gap-3 gap-2 content-center">
            {renderedPokemonList}
            <div id="intersection"></div>
          </div>
          <div id="loading">{loading ? 'Loading...' : null}</div>
        </div>
        {selectedPokemon && evolutionChain && Object.keys(evolutionChain).length > 0 && (
          <div className="w-58 h-screen lg:w-1/4 p-4 sticky top-0 overflow-y-hidden">
            <React.Fragment>
                <PokeInfo 
                  pokemon={selectedPokemon} 
                  description={description}
                  evolutionChain={evolutionChain}
                  onPokemonClick={handlePokemonClick}
                />
              </React.Fragment>
          </div>
        )}
      </div>
    );
  }
}
      
export default App;
