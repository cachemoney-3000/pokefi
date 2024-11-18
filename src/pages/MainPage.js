// React & Hooks
import React, { useState, useEffect } from 'react';

// Component Imports
import PokeCard from '../components/PokeCard';
import PokeInfo from '../components/PokeInfo';
import PlaylistPopup from '../components/PlaylistPopup';

// Asset Imports
import Logo from "../imgs/logo.png";
import pikachuLoadingImage from '../imgs/pikachu-running.gif';


const MainPage = (props) => {
	const { pokemonDetails, loading, selectedPokemon, description, evolutionChain, offset, loadNumber, generatePlaylistFromParams, handleLogout, showPlaylistPopup, playlist, onPlaylistPopupClose, onPlaylistCatch } = props;
	const [searchTerm, setSearchTerm] = useState('');
	const [isInfoOpen, setIsInfoOpen] = useState(false);

	const filteredPokemonList = pokemonDetails
	.filter(pokemon => pokemon.name.includes(searchTerm.toLowerCase()))
	.slice(0, offset + loadNumber);

	const renderedPokemonList = filteredPokemonList.map(pokemon => (
		<PokeCard
			key={pokemon.id}
			pokemon={pokemon}
			onClick={() => {
				props.selectPokemon(pokemon);
				setIsInfoOpen(true);
			}}
		/>
    ));


	const handlePokemonClick = async (pokemon) => {
		// Make API call using the name to get full Pokemon information
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
		const data = await response.json();
		// Pass result to selectPokemon function
		props.selectPokemon(data);
	};

	const handleInfoClose = () => setIsInfoOpen(false);

	const handleGeneratePlaylist = (genres, name, id, imgSrc) => generatePlaylistFromParams(genres, name, id, imgSrc);

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

	return (
		<div id="mainPage" className="lg:pb-0 md:pb-0 sm:pb-8 flex flex-wrap md:block w-full justify-center">
			<div className="sticky top-0 z-10 2xl:py-4 xl:py-4 lg:py-4 md:py-3 sm:py-3 w-full shadow shadow-xs bg-[#2b292c]">
				<div className="w-full mx-auto lg:ml-0 lg:mr-auto flex items-center 2xl:text-base xl:text-sm lg:text-sm md:text-sm sm:text-xs">
					<img src={Logo} className="2xl:h-8 xl:h-6 lg:h-6 md:h-6 sm:h-4 md:ml-4 2xl:ml-10 xl:ml-10 lg:ml-10
						2xl:block xl:block lg:block md:block sm:hidden" alt="logo"/>
					<input
						type="text"
						placeholder="Search for a Pokemon"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						className="2xl:w-3/5 xl:w-3/5 lg:w-3/5 md:w-3/5 sm:w-full px-4 py-2 rounded-xl border mr-auto 2xl:ml-auto xl:ml-auto lg:ml-auto md:ml-auto sm:ml-5
						border-gray-400 focus:outline-none focus:border-blue-500 bg-[#2b292c] text-white"
					/>
					<button
						className="2xl:mr-10 xl:mr-10 lg:mr-10 md:mr-10 sm:mr-4 ml-10 bg-red-600 text-slate-50 hover:text-slate-200 hover:bg-red-700 font-semibold rounded-lg 2xl:px-4 xl:px-4 lg:px-4 md:px-4 sm:px-3 py-2 2xl:text-md xl:text-md lg:text-sm md:text-md sm:text-xs"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>
			</div>

			<div className='max-w-screen-2xl mx-auto flex justify-center items-center w-full h-full'>
				<div className="w-full">
					<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-4 xl:gap-y-14 2xl:gap-8
						2xl:gap-y-14 lg:gap-6 lg:gap-y-14 md:gap-0 md:gap-y-14 sm:gap-14 mr-auto ml-auto
						w-full p-5 content-center overflow-y-auto"
					>
						{renderedPokemonList}
						<div id="intersection"></div>
					</div>

					<div id="loading" className={`${loading ? 'flex flex-col items-center justify-center fixed top-0 left-0 w-full h-full' : 'hidden'}`}>
						{loading && (
							<div className="flex flex-col items-center justify-center fixed top-0 left-0 w-full h-full z-20">
								<img src={pikachuLoadingImage} alt="Loading..." style={{ height: '50px' }}/>
								<p className="mt-2 text-lg text-white">Loading, please wait...</p>
							</div>
						)}
					</div>
				</div>

				{/** Modal */}
				{selectedPokemon && evolutionChain && Object.keys(evolutionChain).length > 0 && isInfoOpen && (
					<div className='flex flex-col items-center justify-center fixed top-0 left-0 w-screen h-full z-30'
						style={{ maxHeight: "90vh" }}>
						<div
							className="fixed inset-0 bg-black opacity-60"
							style={{ backdropFilter: 'blur(10px)' }}
						/>
						<div
							className="2xl:w-8/12 xl:w-7/12 lg:w-6/12 md:w-full md:h-full sm:h-full sm:w-full
								2xl:p-4 xl:p-10 lg:p-8 md:p-0 sm:p-0
								2xl:top-20 xl:top-20 lg:top-20 md:top-0 sm:top-0
								z-30 sticky flex justify-center"
							style={{position: 'fixed'}}
						>
							<React.Fragment>
								{showPlaylistPopup && playlist !== null ?
									<PlaylistPopup
										name={playlist.name}
										tracks={playlist.tracks}
										genres={playlist.genres}
										onClose={onPlaylistPopupClose}
										onCatch={onPlaylistCatch}
									/>
									:
									<PokeInfo
										pokemon={selectedPokemon}
										description={description}
										evolutionChain={evolutionChain}
										onPokemonClick={handlePokemonClick}
										onButtonClick={handleGeneratePlaylist}
										onInfoClose={handleInfoClose}
									/>
								}
							</React.Fragment>
						</div>
					</div>
				)}
			</div>

		</div>
	);
}

export default MainPage;
