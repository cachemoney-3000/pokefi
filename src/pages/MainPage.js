// React & Hooks
import React, { useState, useEffect, useMemo, useRef } from 'react';

// Component Imports
import PokeCard, { PokeCardSkeleton } from '../components/PokeCard';
import PokeInfo from '../components/PokeInfo';
import PlaylistPopup from '../components/PlaylistPopup';

// Asset Imports
import '../components/PokeInfo.css';
import { TYPE_COLOR_MAP } from '../utils/constants';

const ALL_TYPES = Object.keys(TYPE_COLOR_MAP);

const MainPage = (props) => {
	const { pokemonDetails, loading, selectedPokemon, description, evolutionChain, offset, loadNumber, generatePlaylistFromParams, handleLogout, showPlaylistPopup, generatingPlaylist, playlistError, backgroundLoading, playlist, onPlaylistPopupClose, onPlaylistCatch } = props;
	const [searchTerm, setSearchTerm] = useState('');
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [isInfoOpen, setIsInfoOpen] = useState(false);
	const [sortMode, setSortMode] = useState('shuffle'); // 'id' | 'name' | 'shuffle'
	const [shuffledList, setShuffledList] = useState([]);
	const [showHowItWorks, setShowHowItWorks] = useState(false);
	const [selectedTypes, setSelectedTypes] = useState(new Set());
	const [showFilterPanel, setShowFilterPanel] = useState(false);
	const [hoveredType, setHoveredType] = useState(null);
	const [showBackToTop, setShowBackToTop] = useState(false);
	const [showShiny, setShowShiny] = useState(false);
	const [canScrollFilterLeft, setCanScrollFilterLeft] = useState(false);
	const [canScrollFilterRight, setCanScrollFilterRight] = useState(false);
	const topSentinelRef = useRef(null);
	const filterScrollRef = useRef(null);
	const [canScrollActiveLeft, setCanScrollActiveLeft] = useState(false);
	const [canScrollActiveRight, setCanScrollActiveRight] = useState(false);
	const activeScrollRef = useRef(null);

	const updateFilterArrows = React.useCallback(() => {
		const el = filterScrollRef.current;
		if (!el) return;
		setCanScrollFilterLeft(el.scrollLeft > 1);
		setCanScrollFilterRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
	}, []);

	const updateActiveArrows = React.useCallback(() => {
		const el = activeScrollRef.current;
		if (!el) return;
		setCanScrollActiveLeft(el.scrollLeft > 1);
		setCanScrollActiveRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
	}, []);

	const scrollFilter = (dir) => {
		const el = filterScrollRef.current;
		if (!el) return;
		el.scrollBy({ left: dir * 120, behavior: 'smooth' });
	};

	const scrollActive = (dir) => {
		const el = activeScrollRef.current;
		if (!el) return;
		el.scrollBy({ left: dir * 120, behavior: 'smooth' });
	};

	const toggleType = (type) => {
		setSelectedTypes(prev => {
			const next = new Set(prev);
			if (next.has(type)) {
				next.delete(type);
			} else {
				next.add(type);
			}
			return next;
		});
	};

	const handleShuffle = () => {
		const shuffled = [...pokemonDetails].sort(() => Math.random() - 0.5);
		setShuffledList(shuffled);
		setSortMode('shuffle');
	};

	// Keep shuffledList in sync with pokemonDetails while in shuffle mode.
	// On first load: shuffle the initial batch. On subsequent background loads:
	// append new arrivals so the existing order is preserved.
	useEffect(() => {
		if (sortMode !== 'shuffle') return;
		if (shuffledList.length === 0 && pokemonDetails.length > 0) {
			// Initial shuffle
			setShuffledList([...pokemonDetails].sort(() => Math.random() - 0.5));
		} else if (pokemonDetails.length > shuffledList.length) {
			// Append newly loaded Pokémon
			const newPokemon = pokemonDetails.slice(shuffledList.length);
			setShuffledList(prev => [...prev, ...newPokemon]);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pokemonDetails.length]);

	const sortedPokemonDetails = useMemo(() => {
		if (sortMode === 'name') {
			return [...pokemonDetails].sort((a, b) => a.name.localeCompare(b.name));
		}
		if (sortMode === 'shuffle') {
			return shuffledList;
		}
		return pokemonDetails; // 'id' — already ordered by ID from the API
	}, [pokemonDetails, sortMode, shuffledList]);

	const filteredPokemonList = useMemo(() =>
		sortedPokemonDetails
			.filter(pokemon => {
				const matchesSearch = pokemon.name.includes(searchTerm.toLowerCase());
				const matchesType = selectedTypes.size === 0 ||
					pokemon.types?.some(t => selectedTypes.has(t.type.name));
				return matchesSearch && matchesType;
			})
			.slice(0, offset + loadNumber),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[sortedPokemonDetails, searchTerm, selectedTypes, offset, loadNumber]
	);

	const renderedPokemonList = useMemo(() =>
		filteredPokemonList.map(pokemon => (
			<PokeCard
				key={pokemon.id}
				pokemon={pokemon}
				showShiny={showShiny}
				onClick={() => {
					props.selectPokemon(pokemon);
					setIsInfoOpen(true);
				}}
			/>
		)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[filteredPokemonList, showShiny]
	);


	const handlePokemonClick = async (pokemon) => {
		// Make API call using the name to get full Pokemon information
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
		const data = await response.json();
		// Pass result to selectPokemon function
		props.selectPokemon(data);
	};

	const handleInfoClose = () => setIsInfoOpen(false);

	const handleGeneratePlaylist = (genres, name, id, stats) => generatePlaylistFromParams(genres, name, id, stats);

	// Disable scroll when the modal is open
	useEffect(() => {
		if (isInfoOpen) {
		    document.body.style.overflow = 'hidden'; // Disable scroll
		}
		else {
		    document.body.style.overflow = 'auto'; // Restore scroll
		}
		// Clean up and restore scroll on unmount or when modal is closed
		return () => {
		    document.body.style.overflow = 'auto';
		};
	}, [isInfoOpen]);

	// Show back-to-top button when the sentinel just below the header scrolls out of view
	useEffect(() => {
		const el = topSentinelRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => setShowBackToTop(!entry.isIntersecting),
			{ threshold: 0 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// Recalculate active-chip scroll arrows whenever the selection changes
	useEffect(() => {
		setTimeout(updateActiveArrows, 50);
	}, [selectedTypes, updateActiveArrows]);

	return (
		<div id="mainPage" className="lg:pb-0 md:pb-0 sm:pb-8 flex flex-wrap md:block w-full justify-center">

		{/* ── Navbar ── */}
		<div className="sticky top-0 z-10 w-full bg-[#2b292c]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.45)]">

	{/* Row 1: search + logout — always visible */}
	<div className="flex items-center gap-2 md:gap-3 px-3 sm:px-4 md:px-6 lg:px-10 pt-2.5 md:pt-4 pb-1.5 md:pb-2">

				{/* Search wrapper — 1.5px padding acts as the border.
				     No transition-all: prevents layout shift when wave class is applied. */}
				<div className={`search-wrapper-base relative flex-1 min-w-0 rounded-2xl p-[1.5px] ${
					isSearchFocused || searchTerm ? 'search-wave-active' : 'bg-white/[0.09]'
				}`}>

				{/* Magnifying glass */}
				<div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
					<svg
						className="h-[15px] w-[15px] md:h-[18px] md:w-[18px] text-gray-400"
							xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
						>
							<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
						</svg>
					</div>

				<input
					type="text"
					placeholder="Search Pokémon…"
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					onFocus={() => setIsSearchFocused(true)}
					onBlur={() => setIsSearchFocused(false)}
					className="relative z-[1] w-full pl-10 pr-8 md:pr-52 py-2 md:py-3 rounded-[14.5px]
					           bg-[#1c1c1e] text-white text-xs md:text-sm placeholder-gray-500
					           border-0 focus:outline-none transition-colors duration-200"
				/>

					{/* Mobile clear button */}
					{searchTerm && (
						<button
							onClick={() => setSearchTerm('')}
							className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-white transition-colors duration-150"
							aria-label="Clear search"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
							</svg>
						</button>
					)}

					{/* Desktop: sort controls + optional clear — hidden on mobile */}
					<div className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center z-10">
						{/* Divider */}
						<div className="w-px h-4 bg-gray-700/80 mx-3" />

						{/* # */}
						<button
							onClick={() => setSortMode('id')}
							title="Pokédex order"
							className={`flex items-center gap-1.5 px-2 h-7 text-xs font-medium transition-colors duration-150 ${
								sortMode === 'id' ? 'text-[#1ed760]' : 'text-gray-500 hover:text-gray-300'
							}`}
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="10" x2="14" y2="10"/><line x1="4" y1="14" x2="20" y2="14"/><line x1="4" y1="18" x2="14" y2="18"/>
							</svg>
							#
						</button>

						{/* A–Z */}
						<button
							onClick={() => setSortMode('name')}
							title="Alphabetical order"
							className={`flex items-center gap-1.5 px-2 h-7 text-xs font-medium transition-colors duration-150 ${
								sortMode === 'name' ? 'text-[#1ed760]' : 'text-gray-500 hover:text-gray-300'
							}`}
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<path d="M3 8l4-4 4 4"/><path d="M7 4v16"/><path d="M13 12h8"/><path d="M13 16h8"/><path d="M17 8h4"/>
							</svg>
							A–Z
						</button>

						{/* Shuffle */}
						<button
							onClick={handleShuffle}
							title="Shuffle"
							className={`flex items-center gap-1.5 px-2 h-7 text-xs font-medium transition-colors duration-150 ${
								sortMode === 'shuffle' ? 'text-[#1ed760]' : 'text-gray-500 hover:text-gray-300'
							}`}
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
								<polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
							</svg>
							Shuffle
						</button>

					{/* Shiny toggle — desktop */}
					<div className="w-px h-4 bg-gray-700/80 mx-1" />
					<button
						onClick={() => setShowShiny(s => !s)}
						title={showShiny ? 'Show normal sprites' : 'Show shiny sprites'}
						className={`flex items-center gap-1.5 px-2 h-7 text-xs font-medium transition-colors duration-150 ${
							showShiny ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'
						}`}
					>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
						<path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd"/>
					</svg>
						Shiny
					</button>

					{/* Clear */}
					{searchTerm && (
						<>
							<div className="w-px h-4 bg-gray-700/80 mx-2" />
								<button
									onClick={() => setSearchTerm('')}
									className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-white transition-colors duration-150"
									aria-label="Clear search"
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
									</svg>
								</button>
							</>
						)}
					</div>
				</div>

			{/* Logout — icon-only on mobile, icon+text on desktop */}
			<div className="shrink-0 rounded-2xl p-[1.5px] bg-white/[0.09] hover:bg-red-500/40 transition-colors duration-200">
				<button
				className="flex items-center gap-2 px-2.5 py-2 md:px-4 md:py-3 rounded-[14.5px]
				           bg-[#1c1c1e] text-gray-400 hover:text-red-400
				           text-xs font-medium transition-colors duration-200"
					onClick={handleLogout}
					title="Log out"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
						<polyline points="16 17 21 12 16 7"/>
						<line x1="21" y1="12" x2="9" y2="12"/>
					</svg>
					<span className="hidden md:inline">Logout</span>
				</button>
			</div>
			</div>

	{/* Row 2: mobile-only sort controls — sticky with the header */}
	<div className="md:hidden pb-1.5 overflow-x-auto type-filter-row">
	<div className="flex items-center justify-center gap-1.5 px-3 w-max mx-auto">
		<span className="text-gray-500 text-xs shrink-0">Sort</span>
		<div className="w-px h-3.5 bg-gray-700 mx-0.5" />
		{[
			{ mode: 'id',      label: 'Pokédex #', fn: () => setSortMode('id') },
			{ mode: 'name',    label: 'A–Z',       fn: () => setSortMode('name') },
			{ mode: 'shuffle', label: 'Shuffle',   fn: handleShuffle },
		].map(({ mode, label, fn }) => (
			<button
				key={mode}
				onClick={fn}
				className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors duration-150 ${
					sortMode === mode
						? 'bg-[#1ed760]/15 text-[#1ed760]'
						: 'text-gray-500 hover:text-gray-300'
				}`}
			>
				{label}
			</button>
		))}
		{/* Shiny toggle — mobile */}
		<div className="w-px h-3.5 bg-gray-700 mx-0.5" />
		<button
			onClick={() => setShowShiny(s => !s)}
			className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors duration-150 ${
				showShiny ? 'bg-yellow-400/15 text-yellow-400' : 'text-gray-500 hover:text-gray-300'
			}`}
		>
			<svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
				<path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd"/>
			</svg>
			Shiny
		</button>
	</div>
</div>

{/* Row 3: filter bar — sticky with the header */}
	<div className="px-3 sm:px-4 md:px-6 lg:px-10 pb-2 md:pb-2.5">

		{/* Collapsed row: Filter toggle + active chips (scrollable) */}
		<div className="flex items-center gap-2 min-w-0">

			{/* Filter button — always visible, never shrinks */}
			<div className={`shrink-0 rounded-xl p-[1.5px] transition-colors duration-200 ${
				showFilterPanel || selectedTypes.size > 0 ? 'bg-white/[0.18]' : 'bg-white/[0.09] hover:bg-white/[0.14]'
			}`}>
				<button
					onClick={() => { setShowFilterPanel(p => !p); setTimeout(updateFilterArrows, 50); }}
					className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#1c1c1e] text-xs font-medium transition-colors duration-200 text-gray-400 hover:text-white outline-none"
				>
					<svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
						<line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
					</svg>
					Filter
					<svg
						className={`w-3 h-3 shrink-0 transition-transform duration-150 ${showFilterPanel ? 'rotate-180' : ''}`}
						viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
					>
						<polyline points="6 9 12 15 18 9"/>
					</svg>
				</button>
			</div>

			{/* Active chips + Clear all — scrollable strip */}
			{selectedTypes.size > 0 && (
				<div className="flex items-center gap-1 min-w-0 flex-1">

					{/* Left arrow */}
					{canScrollActiveLeft && (
						<button
						onClick={() => scrollActive(-1)}
						className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.15] transition-colors duration-150 text-gray-400 hover:text-white outline-none"
						>
							<svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="15 18 9 12 15 6"/>
							</svg>
						</button>
					)}

					{/* Scrollable chips */}
					<div
						ref={activeScrollRef}
						className="type-filter-row flex items-center gap-1.5 overflow-x-auto flex-1 min-w-0"
						onScroll={updateActiveArrows}
						style={{
							maskImage: canScrollActiveLeft && canScrollActiveRight
								? 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
								: canScrollActiveLeft
								? 'linear-gradient(to right, transparent, black 12%)'
								: canScrollActiveRight
								? 'linear-gradient(to right, black 88%, transparent)'
								: 'none',
							WebkitMaskImage: canScrollActiveLeft && canScrollActiveRight
								? 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
								: canScrollActiveLeft
								? 'linear-gradient(to right, transparent, black 12%)'
								: canScrollActiveRight
								? 'linear-gradient(to right, black 88%, transparent)'
								: 'none',
						}}
					>
						{[...selectedTypes].map(type => {
							const color = TYPE_COLOR_MAP[type];
							return (
								<button
									key={type}
									onClick={() => toggleType(type)}
									className="flex items-center gap-1 shrink-0 px-2 py-1 md:px-2.5 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all duration-150 capitalize outline-none"
									style={{ backgroundColor: `${color}30`, color: color }}
								>
									{type}
									<svg className="w-2.5 h-2.5 ml-0.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
										<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
									</svg>
								</button>
							);
						})}
						<button
						onClick={() => setSelectedTypes(new Set())}
						className="shrink-0 text-[10px] md:text-xs text-gray-400 hover:text-white transition-colors duration-150 px-1 outline-none"
						>
							Clear all
						</button>
					</div>

					{/* Right arrow */}
					{canScrollActiveRight && (
						<button
						onClick={() => scrollActive(1)}
						className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.15] transition-colors duration-150 text-gray-400 hover:text-white outline-none"
						>
							<svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="9 18 15 12 9 6"/>
							</svg>
						</button>
					)}
				</div>
			)}
		</div>

		{/* Expanded panel — horizontal scrollable row with fade + arrows */}
		{showFilterPanel && (
			<div className="mt-2 rounded-2xl p-[1.5px] bg-white/[0.09]">
				<div className="rounded-[14.5px] bg-[#1c1c1e] px-2 py-2.5 flex items-center gap-1">

					{/* Left arrow */}
					{canScrollFilterLeft && (
						<button
						onClick={() => scrollFilter(-1)}
						className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.15] transition-colors duration-150 text-gray-400 hover:text-white outline-none"
						>
							<svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="15 18 9 12 15 6"/>
							</svg>
						</button>
					)}

					{/* Scrollable chips — scrollbar hidden, edges faded */}
					<div
						ref={filterScrollRef}
						className="type-filter-row flex items-center gap-1.5 overflow-x-auto flex-1"
						onScroll={updateFilterArrows}
						onLoad={updateFilterArrows}
						style={{
							maskImage: canScrollFilterLeft && canScrollFilterRight
								? 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
								: canScrollFilterLeft
								? 'linear-gradient(to right, transparent, black 12%)'
								: canScrollFilterRight
								? 'linear-gradient(to right, black 88%, transparent)'
								: 'none',
							WebkitMaskImage: canScrollFilterLeft && canScrollFilterRight
								? 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
								: canScrollFilterLeft
								? 'linear-gradient(to right, transparent, black 12%)'
								: canScrollFilterRight
								? 'linear-gradient(to right, black 88%, transparent)'
								: 'none',
						}}
					>
						{ALL_TYPES.map(type => {
							const color = TYPE_COLOR_MAP[type];
							const isActive = selectedTypes.has(type);
							const isHovered = hoveredType === type;
							return (
								<button
									key={type}
									onClick={() => toggleType(type)}
									onMouseEnter={() => setHoveredType(type)}
									onMouseLeave={() => setHoveredType(null)}
									className="shrink-0 px-2 py-1 md:px-2.5 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all duration-150 capitalize outline-none"
									style={{
										backgroundColor: isActive
											? isHovered ? `${color}50` : `${color}30`
											: isHovered ? 'rgba(255,255,255,0.08)' : 'transparent',
										color: isActive ? color : isHovered ? 'rgba(255,255,255,1)' : 'rgba(156,163,175,1)',
									}}
								>
									{type}
								</button>
							);
						})}
					</div>

					{/* Right arrow */}
					{canScrollFilterRight && (
						<button
						onClick={() => scrollFilter(1)}
						className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.15] transition-colors duration-150 text-gray-400 hover:text-white outline-none"
						>
							<svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="9 18 15 12 9 6"/>
							</svg>
						</button>
					)}
				</div>
			</div>
		)}
		</div>
	</div>

	{/* Sentinel: when this scrolls off-screen the back-to-top button appears */}
	<div ref={topSentinelRef} style={{ height: 1 }} aria-hidden="true" />

		<div className='max-w-screen-2xl mx-auto flex justify-center items-center w-full h-full'>
			<div className="w-full">

				{/* Empty state — shown when filters/search produce no results */}
				{!loading && pokemonDetails.length > 0 && filteredPokemonList.length === 0 && (
					<div className="flex flex-col items-center justify-center py-24 px-6 text-center">
						<img
							src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png`}
							alt="Psyduck"
							className="w-24 h-24 object-contain mb-4 opacity-60"
							style={{ imageRendering: 'pixelated' }}
						/>
						<h3 className="text-white font-semibold text-base mb-1">No Pokémon found</h3>
						<p className="text-gray-500 text-sm mb-5">Try a different search or clear your filters.</p>
						{(searchTerm || selectedTypes.size > 0) && (
							<div className="rounded-xl p-[1.5px] bg-white/[0.09] hover:bg-white/[0.15] transition-colors duration-200">
								<button
									onClick={() => { setSearchTerm(''); setSelectedTypes(new Set()); }}
									className="px-4 py-2 rounded-[10px] bg-[#1c1c1e] text-sm text-gray-300 hover:text-white transition-colors duration-150"
								>
									Clear all filters
								</button>
							</div>
						)}
					</div>
				)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
				gap-x-6 gap-y-16 mr-auto ml-auto
				w-full px-6 pt-16 pb-6 content-center overflow-y-auto"
			>
				{loading && pokemonDetails.length === 0
					? Array.from({ length: 20 }).map((_, i) => <PokeCardSkeleton key={i} />)
					: renderedPokemonList
				}
				{/* Skeleton cards appended during background batch loading */}
				{backgroundLoading && Array.from({ length: 5 }).map((_, i) => (
					<PokeCardSkeleton key={`bg-skeleton-${i}`} />
				))}
					<div id="intersection"></div>
				</div>
					</div>

				{/** Modal — z-50 sits above all floating buttons */}
				{selectedPokemon && evolutionChain && Object.keys(evolutionChain).length > 0 && isInfoOpen && (
					<div className="fixed inset-0 z-50">
						{/* Backdrop */}
						<div
							className="fixed inset-0"
							style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}
						/>
						{/* Centered card on all screen sizes */}
						<div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-10">
							<div className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl">
								{showPlaylistPopup && playlist !== null ? (
									<PlaylistPopup
										name={playlist.name}
										tracks={playlist.tracks}
										genres={playlist.genres}
										onClose={onPlaylistPopupClose}
										onCatch={onPlaylistCatch}
									/>
								) : (
									<PokeInfo
										pokemon={selectedPokemon}
										description={description}
										evolutionChain={evolutionChain}
										onPokemonClick={handlePokemonClick}
										onButtonClick={handleGeneratePlaylist}
										onInfoClose={handleInfoClose}
										generatingPlaylist={generatingPlaylist}
										playlistError={playlistError}
										onRetryPlaylist={handleGeneratePlaylist}
									/>
								)}
							</div>
						</div>
					</div>
				)}
			</div>

	{/* ── How It Works floating button ── */}
	<div className="fixed bottom-4 right-3 md:bottom-5 md:right-5 z-40 rounded-2xl p-[1.5px] opacity-50 hover:opacity-100 bg-white/[0.09] hover:bg-[#1ed760]/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-200">
		<button
			onClick={() => setShowHowItWorks(true)}
			className="w-8 h-8 md:w-9 md:h-9 rounded-[14.5px] bg-[#1c1c1e] text-gray-400 hover:text-white font-semibold text-sm flex items-center justify-center transition-colors duration-200"
			aria-label="How it works"
		>
			?
		</button>
	</div>

		{/* ── How It Works modal ── */}
		{showHowItWorks && (
			<div
				className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
				style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}
				onClick={() => setShowHowItWorks(false)}
			>
				{/* Outer wrapper — same 1.5px glass border as the search bar */}
				<div
					className="w-full max-w-md sm:max-w-lg lg:max-w-xl rounded-2xl p-[1.5px] bg-white/[0.09] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
					onClick={e => e.stopPropagation()}
				>
					<div className="rounded-[14.5px] bg-[#1c1c1e] overflow-hidden flex flex-col max-h-[85vh]">

						{/* Header */}
					<div className="flex items-center justify-between px-4 md:px-5 pt-3 md:pt-4 pb-3 border-b border-white/[0.07] shrink-0">
						<div>
							<h2 className="text-white font-semibold text-sm md:text-base leading-tight">How it works</h2>
							<p className="text-gray-500 text-xs mt-0.5">Pokémon-powered Spotify playlists</p>
						</div>
							{/* Close button matches the search bar style */}
							<div className="rounded-xl p-[1.5px] bg-white/[0.09] hover:bg-white/[0.15] transition-colors duration-150">
								<button
									onClick={() => setShowHowItWorks(false)}
									className="w-7 h-7 rounded-[10px] bg-[#1c1c1e] text-gray-400 hover:text-white text-sm flex items-center justify-center transition-colors duration-150"
									aria-label="Close"
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
									</svg>
								</button>
							</div>
						</div>

					{/* Steps — scrollable on small screens */}
					<div className="px-4 md:px-5 py-3 md:py-4 flex flex-col gap-3 md:gap-4 overflow-y-auto">

						{/* Steps 1–3 */}
						{[
							{
								num: '1',
								title: 'Browse',
								body: 'Scroll through all 1,118 Pokémon. Search by name, sort by Pokédex number, alphabetically, or shuffle.'
							},
							{
								num: '2',
								title: 'Pick a Pokémon',
								body: 'Tap any card to open its profile — stats, abilities, description, and evolution chain.'
							},
							{
								num: '3',
								title: 'Generate a playlist',
								body: 'Hit "View Playlist". Type sets the genre, battle stats shape the tempo and energy. Dual-type Pokémon blend two genres.'
							},
							{
								num: '4',
								title: 'Save it',
								body: 'Like what you hear? Hit "Catch" to save it to your Spotify. You can regenerate as many times as you want.'
							},
						].map(({ num, title, body }) => (
							<div key={num} className="flex gap-3">
								<div className="shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-lg bg-[#1ed760] text-[#1c1c1e] font-bold text-[10px] md:text-xs flex items-center justify-center mt-0.5">
									{num}
								</div>
								<div>
									<p className="text-white font-semibold text-xs md:text-sm">{title}</p>
									<p className="text-gray-500 text-[11px] md:text-xs mt-0.5 leading-relaxed">{body}</p>
								</div>
							</div>
						))}

						{/* Type → Genre grid */}
						<div className="mt-1 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
							<p className="text-gray-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-2">Type → Genre</p>
							<div className="grid grid-cols-2 gap-x-4 gap-y-1">
								{[
									['Normal',   'Pop'],
									['Fire',     'Hard Rock'],
									['Water',    'EDM'],
									['Electric', 'Dance'],
									['Grass',    'Indie'],
									['Ice',      'Chill'],
									['Fighting', 'Work-out'],
									['Poison',   'Metal'],
									['Ground',   'Hip-Hop'],
									['Flying',   'R&B'],
									['Psychic',  'Trip-Hop'],
									['Bug',      'Reggae'],
									['Rock',     'Punk Rock'],
									['Ghost',    'Classical'],
									['Dragon',   'Soundtracks'],
									['Dark',     'Blues'],
									['Steel',    'Metalcore'],
									['Fairy',    'Folk'],
								].map(([type, genre]) => {
									const color = TYPE_COLOR_MAP[type.toLowerCase()];
									return (
										<div key={type} className="flex items-center justify-between gap-2">
											<span className="text-[10px] md:text-xs font-medium capitalize" style={{ color }}>
												{type}
											</span>
											<span className="text-[10px] md:text-xs text-gray-500">{genre}</span>
										</div>
									);
								})}
							</div>
						</div>

					</div>
					</div>
				</div>
			</div>
		)}

	{/* Back to top button */}
	<button
		onClick={() => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
			topSentinelRef.current?.scrollIntoView({ behavior: 'smooth' });
		}}
		aria-label="Back to top"
		className="fixed bottom-14 right-3 md:bottom-16 md:right-5 z-40 rounded-2xl p-[1.5px] transition-all duration-300"
		style={{
			background: 'rgba(255,255,255,0.12)',
			opacity: showBackToTop ? 0.5 : 0,
			pointerEvents: showBackToTop ? 'auto' : 'none',
			transform: showBackToTop ? 'translateY(0)' : 'translateY(12px)',
		}}
		onMouseEnter={e => e.currentTarget.style.opacity = '1'}
		onMouseLeave={e => e.currentTarget.style.opacity = showBackToTop ? '0.5' : '0'}
	>
		<div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-[14.5px] bg-[#1c1c1e] hover:bg-white/[0.07] active:scale-95 transition-all duration-150">
			<svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
				<polyline points="18 15 12 9 6 15"/>
			</svg>
		</div>
	</button>
	</div>
	);
}

export default MainPage;
