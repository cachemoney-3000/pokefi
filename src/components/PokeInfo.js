import React, { memo } from 'react';

const PokeInfo = ({ pokemon, description, evolutionChain }) => {
  const { id, name, types, height, weight, abilities, stats } = pokemon;
  const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
  console.log(evolutionChain)
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
      className="block bg-white rounded-lg text-sm px-3 py-2 leading-none 
        flex items-center mr-0 font-semibold"
      style={{ marginBottom: '5px', color: bgColor }}
    >
      {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
    </span>
  ));

  const abilitiesSpans = abilities.map((ability, index) => (
    <span
      key={index}
      className="block bg-white rounded-lg text-sm px-3 py-2.5 leading-none flex items-center 
      justify-center mr-0 font-semibold"
      style={{ marginBottom: '5px', color: bgColor }}
    >
      {ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}
    </span>
  ));

  const evoNameStyle = 'text-md font-semibold mr-2 pb-1 flex items-center justify-center flex-col bg-white rounded-2xl'
  const headerStyle = "font-medium text-base text-slate-50 text-opacity-80 mb-2 leading-none flex items-center justify-center mr-0"
  return (
    <div className="p-4 mt-14 rounded-lg shadow-lg text-white" style={{ backgroundColor: bgColor }}>
        <div className="flex justify-center mb-4">
          <img src={gifUrl} alt={name} 
            className="h-32 absolute top-4 left-1/2 transform -translate-x-1/2"
            />
      </div>
      <div className="font-light text-sm">No. {pokemon.id}</div>
      <div className="font-medium text-2xl">{name.charAt(0).toUpperCase() + name.slice(1)}</div>
      <div className="flex gap-2">{typeSpans}</div>
      <div className="text-base font-light mt-2 mb-2">{description}</div>

      <div className="grid grid-cols-2 gap-3 mb-1 mr-auto ml-auto w-3/4">
        <div>
          <div className={headerStyle}>Height</div>
          <div className="block bg-white rounded-lg text-sm px-3 py-2.5 leading-none flex items-center 
          justify-center mr-0 font-semibold" style={{ color: bgColor }}>{`${height / 10} m`}</div>
        </div>
        <div >
          <div className={headerStyle}>Weight</div>
          <div className="block bg-white rounded-lg text-sm px-3 py-2.5 leading-none flex items-center 
          justify-center mr-0 font-semibold" style={{ color: bgColor }}>{`${weight / 10} kg`}</div>
        </div>
      </div>


      <div className="grid grid-rows-2 gap-0.5 mb-2 mr-auto ml-auto w-3/4">
        <div className="font-medium text-base text-slate-50 text-opacity-80 leading-none flex items-center 
        justify-center -mb-2">Abilities</div>
        {abilitiesSpans}
      </div>


      <div className="mb-3">
        <div className="font-semibold text-lg text-slate-50 text-opacity-80 leading-none mb-2">Stats</div>
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center mb-0.5">
            <div className="w-1/6 mr-2 font-light text-md">
              {`${stat.stat.name === 'special-attack' ? 'Sp. Atk' : (stat.stat.name === 'special-defense' ? 'Sp. Def' : stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1))}`}</div>
            <div className="w-1/6 flex justify-center text-md">{stat.base_stat}</div>
            <div className="w-4/6">
              <div className="relative h-2 w-full bg-slate-100 bg-opacity-40 rounded-md overflow-hidden">
                <div className="absolute h-full bg-slate-100" 
                style={{ width: `${stat.base_stat}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div>
        <div className="font-semibold text-lg text-slate-50 text-opacity-80 leading-none mb-2">Evolution Chain</div>
        <div className="mb-3">
          <div className="flex items-center">
            <div className={evoNameStyle} style={{ color: bgColor }}>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionChain.species.url.split('/')[6]}.png`} alt={evolutionChain.species.name} />
              <div className='-mt-2'>{evolutionChain.species.name.charAt(0).toUpperCase() + evolutionChain.species.name.slice(1)}</div>
            </div>
            {evolutionChain.evolves_to.length > 0 && (
              <React.Fragment>
                <div className="text-md mr-2">→</div>
                <div className={evoNameStyle} style={{ color: bgColor }}>
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionChain.evolves_to[0].species.url.split('/')[6]}.png`} alt={evolutionChain.evolves_to[0].species.name} />
                  <div className='-mt-2'>{evolutionChain.evolves_to[0].species.name.charAt(0).toUpperCase() + evolutionChain.evolves_to[0].species.name.slice(1)}</div>
                </div>
                {evolutionChain.evolves_to[0].evolves_to.length > 0 && (
                  <React.Fragment>
                    <div className="text-md mr-2">→</div>
                    <div className={evoNameStyle} style={{ color: bgColor }}>
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionChain.evolves_to[0].evolves_to[0].species.url.split('/')[6]}.png`} alt={evolutionChain.evolves_to[0].evolves_to[0].species.name} />
                      <div className='-mt-2'>{evolutionChain.evolves_to[0].evolves_to[0].species.name.charAt(0).toUpperCase() + evolutionChain.evolves_to[0].evolves_to[0].species.name.slice(1)}</div>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default  memo(PokeInfo);