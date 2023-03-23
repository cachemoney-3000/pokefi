import React, { useState } from 'react';
import Logo from "../imgs/logo.png"

import PokeCard from '../components/PokeCard';
import PokeInfo from '../components/PokeInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const MainPage = (props) => {
  const { pokemonDetails, loading, selectedPokemon, description, evolutionChain, offset, loadNumber, generatePlaylistFromParams, handleLogout} = props;
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
      <div className="sticky top-0 z-10 xl:py-4 lg:py-4 w-full bg-[#2b292c] shadow shadow-xs">
        <div className="w-full mx-auto lg:ml-0 lg:mr-auto flex items-center xl:text-base lg:text-sm">
          <img src={Logo} class="xl:h-8 lg:h-6 sm:h-4 md:h-6 ml-10" alt="logo"/>
          <input 
            type="text" 
            placeholder="Search for a Pokemon..." 
            value={searchTerm} 
            onChange={(event) => setSearchTerm(event.target.value)} 
            className="w-3/5 px-4 py-2 rounded-xl border  mr-auto ml-auto
            border-gray-400 focus:outline-none focus:border-blue-500 bg-[#2b292c] text-white"
          />
          <button className="mr-10 bg-red-600 text-slate-50 hover:text-slate-200 hover:bg-red-700  
            font-semibold rounded-lg px-4 py-2" onClick={handleLogout}>Logout</button>
        </div>
      </div>


      <div className="w-full xl:w-3/4 lg:w-4/6 xl:pt-8 lg:pt-4" style={{ overflowY: 'auto' }}>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 xl:gap-4 lg:gap-2 mr-auto ml-auto w-fit content-center">
          {renderedPokemonList}
          <div id="intersection"></div>
        </div>

        <div id="loading" className="flex items-center justify-center h-20">{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : null}</div>
      </div>

      {selectedPokemon && evolutionChain && Object.keys(evolutionChain).length > 0 && (
        <div className="xl:right-6 lg:right-0 xl:w-1/4 lg:w-5/12 h-screen xl:p-4 lg:p-10 sticky xl:top-14 lg:top-10 z-10 overflow-y-hidden" 
            style={{position: 'fixed'}}>
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
