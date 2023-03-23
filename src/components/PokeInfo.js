import React, { memo, useState } from 'react';
import './PokeInfo.css';


const PokeInfo = ({ pokemon, description, evolutionChain, onPokemonClick, onButtonClick }) => {
  const { id, name, types, height, weight, abilities, stats } = pokemon;
  const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
  const imgSrc = pokemon.sprites && pokemon.sprites['front_default'];
  const noGif = id > 649;
  const nameRevise = name.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  function getPokemonGenres(pokemonType) {
    const genreMap = {
      normal: "pop",
      fire: "latin",
      water: "edm",
      electric: "dance",
      grass: "indie",
      ice: "chill",
      fighting: "rock",
      poison: "metal",
      ground: "hip-hop",
      flying: "r&b",
      psychic: "soul",
      bug: "reggae",
      rock: "punk",
      ghost: "classical",
      dragon: "instrumental",
      dark: "blues",
      steel: "metalcore",
      fairy: "folk",
    };
  
    return genreMap[pokemonType] || "pop";
  }
  
  function handleClick() {
    onButtonClick(getPokemonGenres(types[0].type.name), nameRevise, id, imgSrc);
  }

  let bgColor = '';
  switch (types[0]?.type.name) {
    case 'normal':
      bgColor = '#A8A77A';
      break;
    case 'fire':
      bgColor = '#EE8130';
      break;
    case 'water':
      bgColor = '#6390F0';
      break;
    case 'electric':
      bgColor = '#f2ab0c';
      break;
    case 'grass':
      bgColor = '#7AC74C';
      break;
    case 'ice':
      bgColor = '#96D9D6';
      break;
    case 'fighting':
      bgColor = '#C22E28';
      break;
    case 'poison':
      bgColor = '#A33EA1';
      break;
    case 'ground':
      bgColor = '#E2BF65';
      break;
    case 'flying':
      bgColor = '#A98FF3';
      break;
    case 'psychic':
      bgColor = '#F95587';
      break;
    case 'bug':
      bgColor = '#A6B91A';
      break;
    case 'rock':
      bgColor = '#B6A136';
      break;
    case 'ghost':
      bgColor = '#735797';
      break;
    case 'dragon':
      bgColor = '#6F35FC';
      break;
    case 'dark':
      bgColor = '#705746';
      break;
    case 'steel':
      bgColor = '#B7B7CE';
      break;
    case 'fairy':
      bgColor = '#D685AD';
      break;
    default:
      bgColor = '#FFFFFF';
      break;
  }

  const typeSpans = types.map((type, index) => (
    <span
      key={index}
      className="block bg-white rounded-lg text-sm px-3 py-1 leading-none 
        flex items-center mr-0 font-semibold"
      style={{ marginBottom: '5px', color: bgColor }}
    >
      {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
    </span>
  ));

  const abilitiesSpans = abilities.map((ability, index) => (
    <span
      key={index}
      className="block bg-white rounded-lg text-sm px-3 py-2 leading-none flex items-center 
      justify-center mr-0 font-semibold"
      style={{ marginBottom: '5px', color: bgColor }}
    >
      {ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}
    </span>
  ));

  const evoNameStyle = 'text-xs px-2 font-light mr-2 pb-2 flex items-center justify-center flex-col bg-slate-100 bg-opacity-30 hover:bg-opacity-50 rounded-2xl cursor-pointer'
  const headerStyle = "font-medium text-base text-white mb-2 leading-none flex items-center justify-center mr-0"
  const evolutionChainStyle = 'h-20 w-20'
  return (
    <div className="PokeInfo p-4 mt-8 rounded-lg shadow-lg text-white" style={{ backgroundColor: bgColor }}>
        <div className="flex justify-center mb-4">
          <img src={noGif ? imgSrc : gifUrl} onError={(e) => { e.target.onerror = null; e.target.src = imgSrc }} alt={name} 
            className="h-24 absolute top-2 left-1/2 transform -translate-x-1/2 z-30"
          />
        </div>
      <div className="font-light text-sm">No. {pokemon.id}</div>
      <div className="font-medium text-2xl mb-1">{nameRevise}</div>
      <div className="flex gap-2">{typeSpans}</div>
      <div className="text-sm font-light mt-2 mb-2">{description}</div>

      <div className="grid grid-cols-2 gap-3 mb-1 mr-auto ml-auto w-3/4">
        <div>
          <div className={headerStyle}>Height</div>
          <div className="block bg-slate-100 rounded-lg text-sm px-3 py-2 leading-none flex items-center 
          justify-center mr-0 font-semibold" style={{ color: bgColor }}>{`${height / 10} m`}</div>
        </div>
        <div >
          <div className={headerStyle}>Weight</div>
          <div className="block bg-white rounded-lg text-sm px-3 py-2 leading-none flex items-center 
          justify-center mr-0 font-semibold" style={{ color: bgColor }}>{`${weight / 10} kg`}</div>
        </div>
      </div>


      <div className="grid grid-rows-2 gap-0.5 mb-2 mr-auto ml-auto w-3/4">
        <div className="font-medium text-base text-white leading-none flex items-center 
        justify-center -mb-2">Abilities</div>
        {abilitiesSpans}
      </div>


      <div className="mb-3">
        <div className="font-semibold text-lg leading-none mb-2">Stats</div>
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center mb-0.5 text-sm">
            <div className="w-1/6 font-light text-md">
              {`${stat.stat.name === 'special-attack' ? 'Sp. Atk' : (stat.stat.name === 'special-defense' ? 'Sp. Def' : stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1))}`}</div>
            <div className="w-1/6 flex justify-center text-md">{stat.base_stat}</div>
            <div className="w-4/6">
              <div className="relative h-2 w-full bg-slate-100 bg-opacity-40 rounded-md overflow-hidden">
                <div className="absolute h-full bg-slate-100" 
                style={{ width: `${(stat.base_stat/1000) * 500}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className='mb-3'>
        <div className="font-semibold text-lg leading-none mb-2">Evolution Chain</div>
        <div className="">
          <div className="flex items-center">
            <div className={evoNameStyle} onClick={() => onPokemonClick(evolutionChain.species.name)}>
              <img className={evolutionChainStyle}
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionChain.species.url.split('/')[6]}.png`} alt={evolutionChain.species.name} />
              <div className='-mt-1'>{evolutionChain.species.name.charAt(0).toUpperCase() + evolutionChain.species.name.slice(1)}</div>
            </div>
            {evolutionChain.evolves_to.length > 0 && (
              <React.Fragment>
                <div className="text-md font-bold mr-2">→</div>
                <div className={evoNameStyle} onClick={() => onPokemonClick(evolutionChain.evolves_to[0].species.name)}>
                  <img className={evolutionChainStyle}
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionChain.evolves_to[0].species.url.split('/')[6]}.png`} alt={evolutionChain.evolves_to[0].species.name} />
                  <div className='-mt-1'>{evolutionChain.evolves_to[0].species.name.charAt(0).toUpperCase() + evolutionChain.evolves_to[0].species.name.slice(1)}</div>
                </div>
                {evolutionChain.evolves_to[0].evolves_to.length > 0 && (
                  <React.Fragment>
                    <div className="text-md font-bold mr-2">→</div>
                    <div className={evoNameStyle} onClick={() => onPokemonClick(evolutionChain.evolves_to[0].evolves_to[0].species.name)}>
                      <img className={evolutionChainStyle}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionChain.evolves_to[0].evolves_to[0].species.url.split('/')[6]}.png`} alt={evolutionChain.evolves_to[0].evolves_to[0].species.name} />
                      <div className='-mt-1'>{evolutionChain.evolves_to[0].evolves_to[0].species.name.charAt(0).toUpperCase() + evolutionChain.evolves_to[0].evolves_to[0].species.name.slice(1)}</div>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>

      <div class="text-center w-fit mr-auto ml-auto">
        <button class="bg-[#1a1a1a] hover:bg-[#484848] text-sm font-bold py-2.5 px-4 rounded-full mx-auto w-full focus:outline-none" 
        style={{ color: bgColor }} onClick={handleClick}>
          View {nameRevise}'s Playlist
        </button>
      </div>
    </div>
  );
};

export default  memo(PokeInfo);