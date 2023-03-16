import React from 'react'
import '../index.css';


const PokeCard = ({pokemon}) => {
    const frontSprite = pokemon.sprites && pokemon.sprites['front_default'];
    const id = pokemon.id;
    const name = pokemon.name;
    const type = pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].type.name : '';

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
    return (
<div class="flex-1 m-4 mt-16 p-8 relative cursor-pointer border-2 border-white transition duration-100 
    hover:border-gray-300 hover:-translate-y-1 hover:scale-105 h-32 w-full" style={{ backgroundColor: bgColor }}>
    <img class="search-pokemon-image transform transition duration-100" src={frontSprite} alt={name} />
    <span class="font-bold text-sm">N° {id}</span>
    <h3 class="text-lg">{name}</h3>
    {type}
</div>


      )
       
};



export default PokeCard;
