import React, { useState } from 'react';
import Logo from "../imgs/logo.png"

import PokeCard from '../components/PokeCard';
import PokeInfo from '../components/PokeInfo';
import pikachuLoadingImage from '../imgs/pikachu-running.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch  } from '@fortawesome/free-solid-svg-icons';

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
    //console.log('handleInfoClose')
    setIsInfoOpen(false);
  };

  function handleGeneratePlaylist(genres, name, id, imgSrc) {
    generatePlaylistFromParams(genres, name, id, imgSrc);
  }

  return (
    <div className="flex flex-wrap md:block pb-4 w-full">
      <div className="sticky top-0 z-10 2xl:py-4 xl:py-4 lg:py-4 md:py-3 sm:py-3 w-full bg-[#2b292c] shadow shadow-xs">
        <div className="w-full mx-auto lg:ml-0 lg:mr-auto flex items-center 2xl:text-base xl:text-sm lg:text-sm md:text-sm sm:text-xs">
          <img src={Logo} class="2xl:h-8 xl:h-6 lg:h-6 md:h-6 sm:h-4 md:ml-4 2xl:ml-10 xl:ml-10 lg:ml-10
            2xl:block xl:block lg:block md:block sm:hidden" alt="logo"/>
          <input 
            type="text" 
            placeholder="Search for a Pokemon..." 
            value={searchTerm} 
            onChange={(event) => setSearchTerm(event.target.value)} 
            className="2xl:w-3/5 xl:w-3/5 lg:w-3/5 md:w-3/5 sm:w-full px-4 py-2 rounded-2xl border mr-auto 2xl:ml-auto xl:ml-auto lg:ml-auto md:ml-auto sm:ml-5
            border-gray-400 focus:outline-none focus:border-blue-500 bg-[#2b292c] text-white"
          />
          <button className="2xl:mr-10 xl:mr-10 lg:mr-10 md:mr-10 sm:mr-4 ml-10 bg-red-600 text-slate-50 hover:text-slate-200 hover:bg-red-700  
            font-semibold rounded-lg 2xl:px-4 xl:px-4 lg:px-4 md:px-4 sm:px-3 py-2 2xl:text-md xl:text-md lg:text-sm md:text-md sm:text-xs" onClick={handleLogout}>Logout</button>
        </div>
      </div>


      <div className="2xl:w-3/4 lg:w-8/12 xl:w-3/5 md:w-full sm:w-full 2xl:pt-14 xl:pt-14 lg:pt-14 md:pt-14 sm:pt-14" style={{ overflowY: 'auto' }}>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 xl:gap-y-14 2xl:gap-8 2xl:gap-y-14 lg:gap-6 lg:gap-y-14 md:gap-0 md:gap-y-14 sm:gap-14 mr-auto ml-auto
          2xl:w-11/12 xl:w-full lg:w-10/12 md:w-full sm:w-full content-center">
          {renderedPokemonList}
          <div id="intersection"></div>
        </div>

        <div id="loading" className={`${loading ? 'flex flex-col items-center justify-center overflow-auto fixed top-0 left-0 w-full h-full' : 'hidden'}`}>
          {loading ? 
            <>
              <img src={pikachuLoadingImage} alt="Loading..." style={{ height: '50px' }}/>
              <FontAwesomeIcon icon={faCircleNotch } spin size="3x" style={{ color: "green" }} />
            </>
            : null}
</div>

      </div>

      {selectedPokemon && evolutionChain && Object.keys(evolutionChain).length > 0 && isInfoOpen && (
        <div className="2xl:right-16 xl:right-0 lg:-right-5 md:right-0 sm:right-0 inset-0 2xl:w-1/4 xl:w-5/12 lg:w-5/12 md:w-full md:h-full 
        md:mr-auto md:ml-auto 2xl:mr-0 xl:mr-0 lg:mr-0 sticky z-10 overflow-y-auto
        2xl:p-4 xl:p-10 lg:p-8 md:p-0 sm:p-0 2xl:top-14 xl:top-10 lg:top-10 md:top-0 sm:top-0" 
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
