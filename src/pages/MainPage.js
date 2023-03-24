import React, { useState } from 'react';
import Logo from "../imgs/logo.png"

import PokeCard from '../components/PokeCard';
import PokeInfo from '../components/PokeInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const MainPage = (props) => {
  const { pokemonDetails, loading, selectedPokemon, description, evolutionChain, offset, loadNumber, generatePlaylistFromParams, handleLogout} = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState(false);

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
            onClick={() => {
              props.selectPokemon(pokemon);
              setIsInfoOpen(true);
            }}
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

  const handleInfoClose = () => {
    console.log('handleInfoClose')
    setIsInfoOpen(false);
  };

  function handleGeneratePlaylist(genres, name, id, imgSrc) {
    generatePlaylistFromParams(genres, name, id, imgSrc);
  }

  return (
    <div className="flex flex-wrap md:block pb-4 w-full">
      <div className="sticky top-0 z-10 2xl:py-4 xl:py-4 lg:py-4 md:py-3 w-full bg-[#2b292c] shadow shadow-xs">
        <div className="w-full mx-auto lg:ml-0 lg:mr-auto flex items-center 2xl:text-base lg:text-sm">
          <img src={Logo} class="2xl:h-8 xl:h-6 lg:h-6 md:h-6 sm:h-4  md:ml-4 2xl:ml-10 xl:ml-10 lg:ml-10 " alt="logo"/>
          <input 
            type="text" 
            placeholder="Search for a Pokemon..." 
            value={searchTerm} 
            onChange={(event) => setSearchTerm(event.target.value)} 
            className="w-3/5 px-4 py-2 rounded-2xl border mr-auto ml-auto
            border-gray-400 focus:outline-none focus:border-blue-500 bg-[#2b292c] text-white"
          />
          <button className="mr-10 bg-red-600 text-slate-50 hover:text-slate-200 hover:bg-red-700  
            font-semibold rounded-lg px-4 py-2" onClick={handleLogout}>Logout</button>
        </div>
      </div>


      <div className="2xl:w-3/4 lg:w-8/12 xl:w-3/5 md:w-full 2xl:pt-8 xl:pt-8 lg:pt-4 md:pt-5" style={{ overflowY: 'auto' }}>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 xl:gap-3 2xl:gap-5 lg:gap-2 md:gap-2 2xl:mr-auto 2xl:ml-auto xl:mr-auto xl:ml-auto 2xl:w-5/6 xl:w-full lg:w-5/6 md:w-full content-center">
          {renderedPokemonList}
          <div id="intersection"></div>
        </div>

        <div id="loading" className="flex items-center justify-center h-20">{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : null}</div>
      </div>

      {selectedPokemon && evolutionChain && Object.keys(evolutionChain).length > 0 && isInfoOpen && (
        <div className="2xl:right-16 xl:right-0 lg:right-0 md:right-0 inset-0 2xl:w-1/4 xl:w-5/12 lg:w-5/12 md:w-full md:h-full 
          md:mr-auto md:ml-auto 2xl:mr-0 xl:mr-0 lg:mr-0 sticky z-10 overflow-y-auto
          2xl:p-4 xl:p-10 lg:p-10 md:p-0 2xl:top-14 xl:top-10 lg:top-10 md:top-0" 
            style={{position: 'fixed'}}>
          <React.Fragment>
            <PokeInfo 
              pokemon={selectedPokemon} 
              description={description}
              evolutionChain={evolutionChain}
              onPokemonClick={handlePokemonClick}
              onButtonClick={handleGeneratePlaylist}
              onInfoClose={handleInfoClose}
            />
          </React.Fragment>
        </div>

      )}
    </div>
  );
}

export default MainPage;
