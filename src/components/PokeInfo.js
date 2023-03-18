const PokeInfo = ({ pokemon, description }) => {
  const { id, name, types, height, weight, abilities, stats } = pokemon;


  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="font-semibold text-lg mb-2">{`${id}. ${name.charAt(0).toUpperCase() + name.slice(1)}`}</div>
      <div className="text-sm mb-2">{description}</div>
      <div className="flex flex-wrap items-center mb-2">
        {types.map((type, index) => (
          <span
            key={index}
            className="bg-gray-300 text-gray-700 rounded-full text-xs font-semibold px-2 mr-1 mb-1"
          >
            {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
          </span>
        ))}
      </div>
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
