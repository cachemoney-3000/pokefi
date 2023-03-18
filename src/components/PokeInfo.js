const PokeInfo = ({ pokemon, description }) => {
  const { id, name, types, height, weight, abilities, stats, sprites } = pokemon;
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
    <div className="p-4 mt-16 rounded-lg shadow-lg text-white" style={{ backgroundColor: bgColor }}>
        <div className="flex justify-center mb-4">
          <img src={gifUrl} alt={name} 
            className="h-28 absolute top-4 left-1/2 transform -translate-x-1/2"
            />
      </div>
      <div className="font-light text-sm">No. {pokemon.id}</div>
      <div className="font-medium text-xl mb-1">{name.charAt(0).toUpperCase() + name.slice(1)}</div>
      <div className="flex gap-2">{typeSpans}</div>
      <div className="text-sm mb-2">{description}</div>

      <div className="flex items-center mb-2">
        <div className="font-medium text-gray-700 mr-2">Height:</div>
        <div>{`${height / 10} m`}</div>
      </div>
      <div className="flex items-center mb-2">
        <div className="font-medium text-gray-700 mr-2">Weight:</div>
        <div>{`${weight / 10} kg`}</div>
      </div>
      <div className="flex items-center mb-2">
        <div className="font-medium text-gray-700 mr-2">Abilities:</div>
        <div>
          {abilities.map((ability, index) => (
            <span key={index}>
              {`${ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}`}
              {index < abilities.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-2">
        <div className="font-medium text-gray-700 mb-1">Stats:</div>
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center">
            <div className="w-1/3">{`${stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}:`}</div>
            <div className="w-2/3">
              <div className="relative h-2 w-full bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-green-500"
                  style={{ width: `${stat.base_stat}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokeInfo;
