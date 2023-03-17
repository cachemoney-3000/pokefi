import React, { Component, Suspense, useState } from 'react';

import "./App.css"
import PokeCard from './components/PokeCard'

class App extends Component {
  constructor() {
    super();
    this.state = {
      pokemons : [],
      pokemonDetails : [],
      offset: 0,
      loadNumber: 20,
      loading: false,
      selectedPokemon: null
    }
    this.handleIntersection = this.handleIntersection.bind(this);
    this.selectPokemon = this.selectPokemon.bind(this);
  }

  getNextOffset() {
    return this.state.offset+this.state.loadNumber;
  }

  handleIntersection(entries) {
    if (entries[0].isIntersecting) {
      const newOffset = this.getNextOffset();
      this.setState({offset: newOffset, loading: true}, () => {
        this.getMorePokemon();
      });
    }
  }

  selectPokemon(pokemon) {
    console.log(pokemon);
    this.setState({selectedPokemon: pokemon});
  }
  
  componentDidMount() {
    this.getMorePokemon();
    this.observer = new IntersectionObserver(this.handleIntersection, {rootMargin: '0px', threshold: 1});
    this.observer.observe(document.querySelector('#intersection'));
  }

  getMorePokemon() {
    let url = "https://pokeapi.co/api/v2/pokemon?offset=" + this.state.offset + "&limit=" + this.state.loadNumber;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data) {
        const { pokemons } = this.state;
        this.setState({pokemons : [...pokemons, ...data.results]}) // combine new and existing pokemons
        
        data.results.forEach(pokemon => {
          fetch(pokemon.url)
          .then(response => response.json())
          .then(data => {
            if (data) {
              var temp = this.state.pokemonDetails
              temp.push(data)
              this.setState({pokemonDetails: temp}) // update pokemon details
                
              // check if all pokemon details are fetched
              if (temp.length === pokemons.length + data.results.indexOf(pokemon) + 1) {
                this.setState({ loading: false }); // set loading to false
              }
            }            
          })
          .catch(console.log)
        })
      }
    })
    .catch(console.log)
  }
  

  render() {
    const { pokemonDetails, loading, selectedPokemon } = this.state;
    const renderedPokemonList = pokemonDetails.map((pokemon) => (
      <PokeCard 
        pokemon={pokemon} 
        onClick={() => this.selectPokemon(pokemon)}
      />
    ));
  
    return (
      <div class="flex flex-wrap lg:px-10 pb-20 md:pb-32 lg:pt-5 pt-3">
        <div class="w-full lg:w-3/4 p-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mr-auto ml-auto w-fit lg:gap-5 md:gap-4 sm:gap-3 gap-2 content-center">
            {renderedPokemonList}
            <div id="intersection"></div>
          </div>
          <div id="loading">{loading ? 'Loading...' : null}</div>
        </div>
        {selectedPokemon && (
          <div class="w-58 lg:w-1/4 p-4" style={{ position: 'sticky', top: '0' }}>
            <PokeCard 
              pokemon={selectedPokemon} 
            />
          </div>
        )}
      </div>
    );
  }

}
      
export default App;
