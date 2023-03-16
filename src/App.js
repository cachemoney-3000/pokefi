import React, { Component, Suspense } from 'react';
import "./App.css"
import PokeCard from './components/PokeCard'

class App extends Component {
  constructor() {
    super();
    this.state = {
      pokemons : [],
      pokemonDetails : [],
      offset: 0,
      loadNumber: 24,
      loading: false
    }
    this.handleIntersection = this.handleIntersection.bind(this);
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
        this.setState({pokemons : data.results, loading: true}) // set loading to true here
  
        this.state.pokemons.map(pokemon => {
          fetch(pokemon.url)
          .then(response => response.json())
          .then(data => {
            if (data) {
              var temp = this.state.pokemonDetails
              temp.push(data)
              this.setState({pokemonDetails: temp, loading: false}) // set loading to false here
            }            
          })
          .catch(console.log)
        })
      }
    })
    .catch(console.log)
  }
  

  render() {
    const { pokemonDetails, loading } = this.state;
  
    const renderedPokemonList = pokemonDetails.map((pokemon) => (
      <PokeCard pokemon={pokemon} key={pokemon.id} />
    ));
  
    return (
      <div>
        <div className="container p-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
            {renderedPokemonList}
            <div id="intersection"></div>
          </div>
        </div>
        <div id="loading">{loading ? 'Loading...' : null}</div>
      </div>
    );
  }
  
}

export default App;
