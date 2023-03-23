import React, { useState } from 'react';
import '../index.css';

const PokeCard = ({ pokemon, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const frontSprite = pokemon.sprites && pokemon.sprites['front_default'];
  const id = pokemon.id;
  const name = pokemon.name;
  const types = pokemon.types || [];
  const nameRevise = name.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;

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
      className="block bg-white rounded-lg text-xs px-3 py-2 leading-none 
        flex items-center mr-0 font-semibold"
      style={{ marginBottom: '5px', color: bgColor }}
    >
      {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
    </span>
  ));

return (
  <div
    className="m-4 relative rounded-lg max-w-xs shadow-lg h-fit w-20 sm:w-32 md:w-52 lg:w-72 cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
    style={{ backgroundColor: bgColor }}
    onClick={onClick}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <div className="relative h-fit pb-6 flex items-center justify-center">
      <img
        className="absolute top-0 left-1/2 transform -translate-x-1/2"
        style={{ top: "-50px" }}
        src={frontSprite}
        alt={pokemon.name}
      />
    </div>
    <div className="relative text-white px-6 py-6 h-fit justify-center mb-2">
      <div className="flex justify-between">
        <div>
          <div className="font-light text-sm">No. {pokemon.id}</div>
          <div className="font-medium text-xl mb-2">{nameRevise}</div>
          <div className="flex gap-2">{typeSpans}</div>
        </div>
        <div className="bg-slate-100 flex justify-center items-center rounded-full px-2" style={{ aspectRatio: '1/1', height: '25%', width: '25%' }}>
          <div className="font-medium text-xs mr-1" style={{ color: bgColor }}>HP</div>
          <div className="font-semibold text-md" style={{ color: bgColor }}>{pokemon.stats && ` ${pokemon.stats[0].base_stat}`}</div>
        </div>
      </div>
    </div>
  </div>
);
};

export default PokeCard;
