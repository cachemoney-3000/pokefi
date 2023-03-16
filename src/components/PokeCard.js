import React from 'react'

const PokeCard = ({pokemon}) => {
    const frontSprite = pokemon.sprites && pokemon.sprites['front_default'];
    const id = pokemon.id;
    const name = pokemon.name;
    const type = pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].type.name : '';

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
        <div className="card text-center mx-auto mb-4" style={{ maxWidth: "18rem", minWidth: "14rem", backgroundColor: bgColor }} key={id}>
            <div className="text-white mt-4">
                <h5 className="card-title">{name}</h5>
            </div>
            <div className="card-body">
              {frontSprite && <img src={frontSprite} alt={name} className="img-fluid" />}
              <h6 className="card-subtitle mb-2 text-muted">Id: {id}</h6>
              <h6 className="card-subtitle mb-2 text-muted">Type: {type}</h6>
            </div>
        </div>
    )
};

export default PokeCard;
