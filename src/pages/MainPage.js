import React, { useState } from 'react';
import * as $ from "jquery";

import PokeCard from '../components/PokeCard';
import PokeInfo from '../components/PokeInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const MainPage = (props) => {
  const { pokemonDetails, loading, selectedPokemon, description, evolutionChain, offset, loadNumber, generatePlaylistFromParams} = props;
  const [searchTerm, setSearchTerm] = useState('');

  const renderedPokemonList = [];
  const renderedPokemonIds = [];

  pokemonDetails
    .filter((pokemon) => pokemon.name.includes(searchTerm.toLowerCase()))
    .slice(0, offset + loadNumber)
    .forEach((pokemon) => {
      if (!renderedPokemonIds.includes(pokemon.id)) {
        renderedPokemonList.push(
          <PokeCard 
            key={pokemon.id}
            pokemon={pokemon} 
            onClick={() => props.selectPokemon(pokemon)}
          />
        );
        renderedPokemonIds.push(pokemon.id);
      }
    });

  const handlePokemonClick = async (pokemon) => {
    // Make API call using the name to get full Pokemon information
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await response.json();

    // Pass result to selectPokemon function
    props.selectPokemon(data);
  };

  function handleGeneratePlaylist(genres, name, id, imgSrc) {
    generatePlaylistFromParams(genres, name, id, imgSrc);
  }

  return (
    <div className="flex flex-wrap pb-4 md:pb-4 w-full">
      <div className="sticky top-0 z-10 py-4 w-full bg-[#2b292c] shadow shadow-xs">
        <div className="w-3/5 mx-auto lg:ml-0 lg:mr-auto">
          <input 
            type="text" 
            placeholder="Search for a Pokemon..." 
            value={searchTerm} 
            onChange={(event) => setSearchTerm(event.target.value)} 
            className="w-full px-4 py-2 rounded-xl border 
            border-gray-400 focus:outline-none focus:border-blue-500 bg-[#2b292c] text-white"
          />
        </div>
      </div>

      <div className="w-full lg:w-3/4 p-4" style={{ overflowY: 'auto' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mr-auto ml-auto w-fit lg:gap-5 md:gap-4 sm:gap-3 gap-2 content-center">
          {renderedPokemonList}
          <div id="intersection"></div>
        </div>

        <div id="loading" className="flex items-center justify-center h-20">{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : null}</div>
      </div>

      {selectedPokemon && evolutionChain && Object.keys(evolutionChain).length > 0 && (
        <div className="right-6 w-58 h-screen lg:w-1/4 p-4 sticky top-14 z-10 overflow-y-hidden" style={{position: 'fixed'}}>
          <React.Fragment>
            <PokeInfo 
              pokemon={selectedPokemon} 
              description={description}
              evolutionChain={evolutionChain}
              onPokemonClick={handlePokemonClick}
              onButtonClick={handleGeneratePlaylist}
            />
          </React.Fragment>
        </div>
      )}
    </div>
  );
}

export default MainPage;
