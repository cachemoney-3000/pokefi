import React, { memo, useRef } from 'react';
import './PokeInfo.css';
import {
	TYPE_COLOR_MAP,
	TYPE_GENRE_MAP,
	FALLBACK_ACCENT_COLOR,
	COLOR_SURFACE,
	COLOR_TEXT_DARK,
	GIF_MAX_POKEMON_ID,
	STAT_MAX,
	HEIGHT_WEIGHT_DIVISOR,
	STAT_DISPLAY_NAMES,
	DEFAULT_GENRE,
	SPRITE_BASE_URL,
} from '../utils/constants';


const PokeInfo = ({ pokemon, description, evolutionChain, onPokemonClick, onButtonClick, onInfoClose, generatingPlaylist, playlistError, onRetryPlaylist }) => {
	const { id, name, types, height, weight, abilities, stats } = pokemon;
	const gifUrl = `${SPRITE_BASE_URL}/versions/generation-v/black-white/animated/${id}.gif`;
	const imgSrc = pokemon.sprites && pokemon.sprites['front_default'];
	const noGif  = id > GIF_MAX_POKEMON_ID;
	const nameRevise = name.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

	function getPokemonGenre(pokemonType) {
		return TYPE_GENRE_MAP[pokemonType] || DEFAULT_GENRE;
	}

	function handleCatch() {
		const primaryGenre   = getPokemonGenre(types[0].type.name);
		const secondaryGenre = types[1] ? getPokemonGenre(types[1].type.name) : null;
		const genreSeeds     = secondaryGenre && secondaryGenre !== primaryGenre
			? [primaryGenre, secondaryGenre]
			: [primaryGenre];

		onButtonClick(genreSeeds, nameRevise, id, stats);
	}

	function handleClose() {
		onInfoClose();
	}

	function getBgColor(type) {
		return TYPE_COLOR_MAP[type] || FALLBACK_ACCENT_COLOR;
	}

	const bgColor = getBgColor(types[0]?.type.name);

	const typeSpans = types.map((type, index) => (
		<span
			key={index}
			className="px-3 py-1 rounded-lg text-xs font-semibold"
			style={{
				color: bgColor,
				backgroundColor: `${bgColor}25`,
				marginBottom: '5px',
			}}
		>
			{type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
		</span>
	));

	const abilitiesSpans = abilities.map((ability, index) => (
		<div
			key={index}
			className="px-3 py-1.5 rounded-lg text-xs font-medium text-center bg-white/[0.05] text-gray-200"
			style={{ marginBottom: '4px' }}
		>
			{ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}
		</div>
	));

	const evoNameStyle = (isActive = false) => ({
		className: `text-xs px-2 pt-2 pb-2 flex items-center justify-center flex-col rounded-xl cursor-pointer mr-2 transition-all duration-150`,
		style: {
			backgroundColor: isActive ? `${bgColor}25` : `${bgColor}12`,
			border: `1.5px solid ${bgColor}${isActive ? '70' : '40'}`,
		}
	});
	const headerStyle = "text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 text-center";
	const evolutionChainStyle = '2xl:h-20 2xl:w-20 xl:h-20 xl:w-20 lg:h-0 lg:w-0 md:h-20 md:w-20';

	const modalRef = useRef(null);

	function PokemonEvolution({ species, onPokemonClick }) {
		const [hovered, setHovered] = React.useState(false);
		const { className, style } = evoNameStyle(hovered);
		return (
			<div
				className={className}
				style={style}
				onClick={() => {
					onPokemonClick(species.name);
					if (modalRef.current) {
						modalRef.current.scrollIntoView({ behavior: 'smooth' });
					}
				}}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				<img
					className={evolutionChainStyle}
					src={`${SPRITE_BASE_URL}/${species.url.split('/')[6]}.png`}
					alt={species.name}
				/>
				<div className="mt-1 text-gray-200">{species.name.charAt(0).toUpperCase() + species.name.slice(1)}</div>
			</div>
		);
	}

	function EvolutionChain({ evolutionChain, onPokemonClick }) {
		const evoScrollRef = React.useRef(null);
		const [canScrollLeft, setCanScrollLeft] = React.useState(false);
		const [canScrollRight, setCanScrollRight] = React.useState(false);

		const updateArrows = React.useCallback(() => {
			const el = evoScrollRef.current;
			if (!el) return;
			setCanScrollLeft(el.scrollLeft > 1);
			setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
		}, []);

		React.useEffect(() => {
			updateArrows();
			window.addEventListener('resize', updateArrows);
			return () => window.removeEventListener('resize', updateArrows);
		}, [updateArrows]);

		const scroll = (dir) => {
			const el = evoScrollRef.current;
			if (!el) return;
			el.scrollBy({ left: dir * 90, behavior: 'smooth' });
		};

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
			<div className="mb-3 w-full mr-auto ml-auto">
				<div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Evolution Chain</div>
				<div className="relative flex items-center gap-1">
					{/* Left arrow */}
					{canScrollLeft && (
						<button
							onClick={() => scroll(-1)}
							className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.15] transition-colors duration-150 text-gray-400 hover:text-white z-10"
						>
							<svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="15 18 9 12 15 6"/>
							</svg>
						</button>
					)}
					{/* Scrollable row — scrollbar hidden, edges faded via mask */}
					<div
						ref={evoScrollRef}
						className="evo-scroll flex items-center overflow-x-auto flex-1"
						onScroll={updateArrows}
						style={{
							maskImage: canScrollLeft && canScrollRight
								? 'linear-gradient(to right, transparent, black 18%, black 82%, transparent)'
								: canScrollLeft
								? 'linear-gradient(to right, transparent, black 18%)'
								: canScrollRight
								? 'linear-gradient(to right, black 82%, transparent)'
								: 'none',
							WebkitMaskImage: canScrollLeft && canScrollRight
								? 'linear-gradient(to right, transparent, black 18%, black 82%, transparent)'
								: canScrollLeft
								? 'linear-gradient(to right, transparent, black 18%)'
								: canScrollRight
								? 'linear-gradient(to right, black 82%, transparent)'
								: 'none',
						}}
					>
						<PokemonEvolution species={evolutionChain.species} onPokemonClick={onPokemonClick} />
						{evolutionChain.evolves_to.length > 0 && renderEvolutions(evolutionChain.evolves_to)}
					</div>
					{/* Right arrow */}
					{canScrollRight && (
						<button
							onClick={() => scroll(1)}
							className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.15] transition-colors duration-150 text-gray-400 hover:text-white z-10"
						>
							<svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="9 18 15 12 9 6"/>
							</svg>
						</button>
					)}
				</div>
			</div>
		);
	}

	return (
		<div
			className="PokeInfo overflow-y-auto text-white w-full rounded-2xl max-h-[85vh]
				p-4 md:p-8 lg:p-6 xl:p-6 2xl:p-5"
			style={{
				backgroundColor: COLOR_SURFACE,
				boxShadow: `0 0 0 1.5px ${bgColor}50, 0 16px 48px rgba(0,0,0,0.6)`,
				position: 'relative',
			}}
		>
			{/* Sprite */}
			<div ref={modalRef} className="flex justify-center mb-1">
			<img
				src={noGif ? imgSrc : gifUrl}
				onError={(e) => { e.target.onerror = null; e.target.src = imgSrc }}
				alt={name}
				className="h-16 md:h-28 lg:h-24 xl:h-24 2xl:h-24 pokemon-gif"
			/>
			</div>

			{/* ID + name + close */}
		<div className="text-gray-500 text-xs font-normal mb-0.5">No. {pokemon.id}</div>
		<div className="flex items-start justify-between mb-2">
			<div className="text-white font-semibold text-lg md:text-xl leading-tight">{nameRevise}</div>
				<div className="rounded-xl p-[1.5px] ml-3 shrink-0" style={{ background: `${bgColor}40` }}>
					<button
						onClick={handleClose}
						className="flex items-center justify-center w-7 h-7 rounded-[10px] text-gray-400 hover:text-white text-xs font-bold transition-colors duration-150"
						style={{ backgroundColor: COLOR_SURFACE }}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
					</button>
				</div>
			</div>

			{/* Type badges */}
			<div className="flex gap-2 flex-wrap mb-3">{typeSpans}</div>

			{/* Description */}
			<p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-3">{description}</p>

			{/* Height and Weight */}
			<div className="grid grid-cols-2 gap-2 mb-3 mx-auto 2xl:w-3/4 xl:w-2/4 lg:w-full md:w-3/4 sm:w-full">
			<div>
				<div className={headerStyle}>Height</div>
				<div className="bg-white/[0.06] rounded-lg py-1.5 md:py-2 text-center text-xs md:text-sm font-semibold text-white">
					{`${height / HEIGHT_WEIGHT_DIVISOR} m`}
				</div>
			</div>
			<div>
				<div className={headerStyle}>Weight</div>
				<div className="bg-white/[0.06] rounded-lg py-1.5 md:py-2 text-center text-xs md:text-sm font-semibold text-white">
					{`${weight / HEIGHT_WEIGHT_DIVISOR} kg`}
				</div>
			</div>
			</div>

			{/* Abilities */}
		<div className="mb-3 mx-auto 2xl:w-3/4 xl:w-2/4 lg:w-full md:w-3/4 sm:w-full">
			<div className={headerStyle}>Abilities</div>
				<div className="flex flex-col gap-1">{abilitiesSpans}</div>
			</div>

			{/* Stats */}
			<div className="mb-3 mx-auto 2xl:w-full xl:w-full lg:w-full md:w-4/5">
				<div className={`${headerStyle} text-left`}>Stats</div>
				{stats.map((stat, index) => (
					<div key={index} className="flex items-center mb-1.5 text-xs">
						<div className="w-1/6 text-gray-400 font-medium">
							{STAT_DISPLAY_NAMES[stat.stat.name]
								?? (stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1))}
						</div>
						<div className="w-1/6 text-center text-white font-semibold">{stat.base_stat}</div>
						<div className="w-4/6">
							<div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
								<div
									className="absolute h-full rounded-full"
									style={{
										width: `${Math.min((stat.base_stat / STAT_MAX) * 100, 100)}%`,
										backgroundColor: bgColor,
										opacity: 0.85,
									}}
								/>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Evolution Chain */}
			<EvolutionChain evolutionChain={evolutionChain} onPokemonClick={onPokemonClick} />

			{/* View Playlist button */}
			<div className="mt-3 mx-auto text-center">
				{playlistError && (
					<p className="text-xs text-red-400 mb-2 opacity-80">{playlistError}</p>
				)}
				<div
					className="inline-block rounded-2xl p-[1.5px]"
					style={{ backgroundColor: bgColor }}
				>
				<button
					className={`text-xs md:text-sm font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-[14.5px] focus:outline-none transition-all duration-200 flex items-center justify-center gap-2.5 ${
						generatingPlaylist
							? 'cursor-not-allowed opacity-70'
							: 'cursor-pointer hover:brightness-110 active:scale-[0.97]'
					}`}
					style={{ backgroundColor: bgColor, color: COLOR_TEXT_DARK, minWidth: '160px' }}
						onClick={playlistError ? (onRetryPlaylist || handleCatch) : handleCatch}
						disabled={generatingPlaylist}
					>
					{generatingPlaylist ? (
						<>
							<svg className="pokeball-loader" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								{/* Top half */}
								<path d="M10 2a8 8 0 0 1 8 8H2a8 8 0 0 1 8-8z" fill="currentColor" opacity="0.9"/>
								{/* Bottom half */}
								<path d="M10 18a8 8 0 0 1-8-8h16a8 8 0 0 1-8 8z" fill="currentColor" opacity="0.4"/>
								{/* Center divider */}
								<line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5"/>
								{/* Outer button ring */}
								<circle cx="10" cy="10" r="2.8" fill="currentColor" opacity="0.9"/>
								{/* Inner button */}
								<circle cx="10" cy="10" r="1.5" fill="#111" opacity="0.8"/>
							</svg>
							<span>Scanning Pokédex...</span>
						</>
						) : playlistError ? (
							'Try Again'
						) : (
							`View ${nameRevise}'s Playlist`
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(PokeInfo);
