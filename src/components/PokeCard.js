import React from 'react';
import '../index.css';

const PokeCard = ({ pokemon, onClick }) => {
  const frontSprite = pokemon.sprites && pokemon.sprites['front_default'];
  const id = pokemon.id;
  const name = pokemon.name;
  const type =
    pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].type.name : '';

  const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;

  let bgColor = '';

  switch (type) {
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
      bgColor = '#F7D02C';
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

  const handleClick = () => {
    console.log(id);
  };

  

  return (
    <div
      className="flex-shrink-0 m-6 relative overflow-hidden rounded-lg max-w-xs shadow-lg h-full cursor-pointer"
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      <div className="relative h-40 pt-10 px-10 flex items-center justify-center">
        <img
          className="relative w-40"
          src={frontSprite}
          alt={pokemon.name}
        />
      </div>
      <div className="relative text-white px-6 pb-6">
        <span className="block opacity-75 -mb-1">{type}</span>
        <div className="flex justify-between">
          <span className="block font-semibold text-xl">{name}</span>
          <span className="block bg-white rounded-full text-purple-500 text-xs font-bold px-3 py-2 leading-none flex items-center">
            ID: {pokemon.id}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PokeCard;
