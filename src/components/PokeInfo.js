import React, { memo, useRef } from 'react';
import './PokeInfo.css';


const PokeInfo = ({ pokemon, description, evolutionChain, onPokemonClick, onButtonClick, onInfoClose }) => {
	const { id, name, types, height, weight, abilities, stats } = pokemon;
	const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
	const imgSrc = pokemon.sprites && pokemon.sprites['front_default'];
	const noGif = id > 649;
	const nameRevise = name.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

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
		fairy: "folk"
	};

	const typeColorMap = {
		normal: '#A8A77A',
		fire: '#EE8130',
		water: '#6390F0',
		electric: '#f2ab0c',
		grass: '#7AC74C',
		ice: '#96D9D6',
		fighting: '#C22E28',
		poison: '#A33EA1',
		ground: '#E2BF65',
		flying: '#A98FF3',
		psychic: '#F95587',
		bug: '#A6B91A',
		rock: '#B6A136',
		ghost: '#735797',
		dragon: '#6F35FC',
		dark: '#705746',
		steel: '#B7B7CE',
		fairy: '#D685AD',
		default: '#FFFFFF' // Fallback color
	};

	function getPokemonGenres(pokemonType) {
		return genreMap[pokemonType] || "pop";
	}

	function handleCatch() {
		onButtonClick(getPokemonGenres(types[0].type.name), nameRevise, id, imgSrc);
	}

	function handleClose() {
		onInfoClose();
	}

	function getBgColor(type) {
		return typeColorMap[type] || typeColorMap.default;
	}

	const bgColor = getBgColor(types[0]?.type.name);

	const typeSpans = types.map((type, index) => (
		<span
			key={index}
			className="block bg-white rounded-lg 2xl:text-sm xl:text-xs lg:text-xs md:text-sm sm:text-sm px-3 py-1 leading-none flex items-center mr-0 font-semibold"
			style={{ marginBottom: '5px', color: bgColor }}
		>
			{type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
		</span>
	));

	const abilitiesSpans = abilities.map((ability, index) => (
		<span
			key={index}
			className="block bg-white rounded-lg 2xl:text-sm xl:text-xs lg:text-xs md:text-sm sm:text-sm px-3 py-2 leading-none flex items-center justify-center mr-0 font-semibold"
			style={{ marginBottom: '5px', color: bgColor }}
		>
			{ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}
		</span>
	));

	const evoNameStyle = 'text-xs px-2 font-normal mr-2 pb-2 lg:pt-2 flex items-center justify-center flex-col bg-slate-300 bg-opacity-30 hover:bg-opacity-50 rounded-2xl cursor-pointer';
	const headerStyle = "font-medium 2xl:text-base xl:text-sm lg:text-sm md:text-md sm:text-md text-white mb-2 leading-none flex items-center justify-center mr-0";
	const evolutionChainStyle = '2xl:h-20 2xl:w-20 xl:h-20 xl:w-20 lg:h-0 lg:w-0 md:h-20 md:w-20';

	const modalRef = useRef(null);

	function PokemonEvolution({ species, onPokemonClick }) {
		return (
			<div
				className={evoNameStyle}
				onClick={() => {
					onPokemonClick(species.name);
					if (modalRef.current) {
						modalRef.current.scrollIntoView({ behavior: 'smooth' });
					}
			    }}
			>
				<img
					className={evolutionChainStyle}
					src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.url.split('/')[6]}.png`}
					alt={species.name}
				/>
				<div className="-mt-1">{species.name.charAt(0).toUpperCase() + species.name.slice(1)}</div>
			</div>
		);
	}

	function EvolutionChain({ evolutionChain, onPokemonClick }) {
		const renderEvolutions = (evolvesTo) => {
		  return evolvesTo.map((evolution, index) => (
			<React.Fragment key={index}>
			  <div className="text-md font-bold mr-2">→</div>
			  <PokemonEvolution species={evolution.species} onPokemonClick={onPokemonClick} />
			  {evolution.evolves_to.length > 0 && renderEvolutions(evolution.evolves_to)}
			</React.Fragment>
		  ));
		};

		return (
			<div className="2xl:mb-3 xl:mb-2 lg:mb-3 md:mb-4 sm:mb-4 2xl:w-full xl:w-full lg:w-full md:w-4/5 sm:w-full mr-auto ml-auto">
				<div className="font-medium 2xl:text-base xl:text-sm lg:text-sm md:text-md sm:text-md leading-none mb-2">Evolution Chain</div>
				<div className="overflow-x-auto">
					<div className="flex items-center">
						<PokemonEvolution species={evolutionChain.species} onPokemonClick={onPokemonClick} />
						{evolutionChain.evolves_to.length > 0 && renderEvolutions(evolutionChain.evolves_to)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`PokeInfo 2xl:p-4 xl:p-6 lg:p-6 md:p-10 sm:p-5 2xl:mt-12 xl:mt-6 lg:mt-10 md:mt-0 sm:mt-0 0 2xl:h-fit xl:h-fit lg:h-fit
				md:h-full sm:h-full overflow-y-auto runded-lg shadow-lg text-white
				max-w-screen-2xl 2xl:w-1/2 xl:w-5/6 lg:w-5/6 md:w-full sm:w-full lg:max-h-[85vh]`}
			style={{
				backgroundColor: bgColor,
				position: 'relative'
			}}
		>
			{/** GIF */}
			<div ref={modalRef} className="flex justify-center">
				<img
					src={noGif ? imgSrc : gifUrl} onError={(e) => { e.target.onerror = null; e.target.src = imgSrc }}
					alt={name}
					className="2xl:h-24 xl:h-24 lg:h-24 md:h-28 sm:h-24 pokemon-gif"
				/>
			</div>

			{/** Pokémon Name */}
			<div className="font-light 2xl:text-sm xl:text-sm lg:text-sm md:text-md sm:text-md">
				No. {pokemon.id}
			</div>

			{/** Close Button */}
			<div className='flex'>
				<div className="font-medium 2xl:text-2xl xl:text-xl lg:text-xl md:text-2xl sm:text-2xl mb-1">
					{nameRevise}
				</div>
				<button
					onClick={handleClose}
					className="bg-[#1a1a1a] hover:bg-[#484848] text-xs font-bold px-3 py-2 rounded-full ml-auto"
					style={{color: bgColor }}
				>
					Close
				</button>
			</div>

			{/** Description */}
			<div className="flex gap-2">{typeSpans}</div>
			<div className="2xl:text-sm xl:text-sm lg:text-xs md:text-sm sm:text-sm font-light mt-2 2xl:mb-2 xl:mb-2 lg:mb-2 md:mb-3 sm:mb-3">{description}</div>

			{/** Height and Weight */}
			<div className="grid grid-cols-2 gap-3 mb-1 mr-auto ml-auto 2xl:w-3/4 xl:w-2/4 lg:w-full md:w-3/4 sm:w-full">
				<div>
					<div className={headerStyle}>Height</div>
					<div
						className="block bg-slate-100 rounded-lg 2xl:text-sm xl:text-xs lg:text-xs md:text-sm sm:text-sm px-3 py-2 leading-none flex items-center justify-center mr-0 font-semibold"
						style={{ color: bgColor }}
					>
						{`${height / 10} m`}
					</div>
				</div>
				<div >
					<div className={headerStyle}>Weight</div>
					<div
						className="block bg-white rounded-lg 2xl:text-sm xl:text-xs lg:text-xs md:text-sm sm:text-sm px-3 py-2 leading-none flex items-center justify-center mr-0 font-semibold"
						style={{ color: bgColor }}
					>
						{`${weight / 10} kg`}
					</div>
				</div>
			</div>

			{/** Abilities */}
			<div className="grid grid-rows-2 gap-0.5 mb-2 mr-auto ml-auto 2xl:w-3/4 xl:w-2/4 lg:w-full md:w-3/4 sm:w-full">
				<div className="font-medium 2xl:text-base xl:text-sm lg:text-sm md:text-md sm:text-md text-white leading-none flex items-center justify-center -mb-2">
					Abilities
				</div>
				{abilitiesSpans}
			</div>

			{/** Stats */}
			<div className="mb-3 2xl:w-full xl:w-full lg:w-full md:w-4/5 mr-auto ml-auto">
				<div className="font-medium 2xl:text-base xl:text-sm lg:text-sm md:text-md sm:text-md leading-none mb-2">Stats</div>
				{stats.map((stat, index) => (
					<div key={index} className="flex items-center mb-0.5 text-sm">
						<div className="w-1/6 font-light text-md">
						    {`${stat.stat.name === 'special-attack' ? 'Sp. Atk' : (stat.stat.name === 'special-defense' ? 'Sp. Def' : stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1))}`}</div>
						<div className="w-1/6 flex justify-center text-md lg:text-sm">{stat.base_stat}</div>
						<div className="w-4/6">
							<div className="relative h-2 w-full bg-slate-100 bg-opacity-40 rounded-md overflow-hidden">
								<div className="absolute h-full bg-slate-100" style={{ width: `${(stat.base_stat/1000) * 500}%` }} />
							</div>
						</div>
					</div>
				))}
			</div>

			{/** Evolition Chain */}
			<EvolutionChain evolutionChain={evolutionChain} onPokemonClick={onPokemonClick} />

			{/** View Button */}
			<div className="text-center w-fit mr-auto ml-auto">
				<button
					className="bg-[#1a1a1a] hover:bg-[#484848] text-sm font-bold py-2.5 px-4 rounded-full mx-auto w-full focus:outline-none"
					style={{ color: bgColor }}
					onClick={handleCatch}
				>
					View {nameRevise}'s Playlist
				</button>
			</div>
		</div>
	);
};

export default  memo(PokeInfo);