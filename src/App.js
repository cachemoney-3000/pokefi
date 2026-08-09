import React, { Component } from 'react';

import * as $ from "jquery";
import { clientId } from "./config";
import { exchangeCodeForToken } from "./utils/auth";
import { CACHE_KEY, CACHE_TTL, INITIAL_COUNT, BATCH_SIZE } from "./utils/constants";

import "./App.css"
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'

class App extends Component {
	constructor() {
		super();
		this.spotifyRefreshInterval = null;
		this.state = {
			// Pokemons
			pokemons: [],
			pokemonDetails: [],
			offset: 0,
			loadNumber: 20,
			loading: true,
			selectedPokemon: null,
			description: '',
			evolutionChain: [],

			// Spotify
			token: null,
			playlist: null,
			no_data: false,
			showPlaylistPopup: false,
			generatingPlaylist: false,
			playlistError: null,
			observerInitialized: false,
			backgroundLoading: false,
	
			// Caught Pokemon (IDs whose playlists have been saved to Spotify)
			caughtPokemonIds: JSON.parse(localStorage.getItem('caughtPokemonIds') || '[]'),
		};
		// Pokemon
		this.handleIntersection = this.handleIntersection.bind(this);
		this.selectPokemon = this.selectPokemon.bind(this);

		// Spotify
		this.generatePlaylist = this.generatePlaylist.bind(this);
		this.addPlaylistToAccount = this.addPlaylistToAccount.bind(this);
		this.recordCaughtPokemon = this.recordCaughtPokemon.bind(this);
	}

	startSpotifyRefreshInterval() {
		if (this.spotifyRefreshInterval) return;
		this.spotifyRefreshInterval = setInterval(() => {
			const expirationTime = localStorage.getItem('spotifyTokenExpiration');
			if (expirationTime && Date.now() >= parseInt(expirationTime, 10)) {
				this.refreshSpotifyToken();
			}
		}, 30000);
	}


	async setSpotifyToken() {
		// Check for authorization code in URL
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code) {
			// Clear the code from the URL immediately (synchronous) so that React
			// StrictMode's second componentDidMount invocation does not attempt to
			// exchange the same single-use code a second time.
			window.history.replaceState({}, document.title, "/");

			try {
				// Exchange the code for tokens
				const { access_token, refresh_token, expires_in } = await exchangeCodeForToken(code);

				if (!access_token) {
					this.setState({ token: null });
					return;
				}

				// Set token in state
				this.setState({
					token: access_token
				});

				// Store tokens
				localStorage.setItem('spotifyAccessToken', access_token);
				localStorage.setItem('spotifyRefreshToken', refresh_token);

				// Set token expiration
				const expirationTime = Date.now() + (expires_in * 1000);
				localStorage.setItem('spotifyTokenExpiration', expirationTime);

				this.startSpotifyRefreshInterval();
			} catch (error) {
				console.error('Error exchanging code for token:', error);
				this.setState({ token: null });
			} finally {
				localStorage.removeItem('code_verifier');
			}
		}
		else {
			// Check if we have a valid stored token (guard against a previously stored "undefined" string)
			const storedToken = localStorage.getItem('spotifyAccessToken');
			if (storedToken && storedToken !== 'undefined' && storedToken !== 'null') {
				const tokenExpirationTime = localStorage.getItem('spotifyTokenExpiration');
				if (tokenExpirationTime && Date.now() >= parseInt(tokenExpirationTime, 10)) {
					// Token already expired; silently refresh before setting state.
					this.refreshSpotifyToken();
				}
				else {
					this.setState({ token: storedToken });
				}

				this.startSpotifyRefreshInterval();
			}
		}
	}

	refreshSpotifyToken() {
		const refreshToken = localStorage.getItem('spotifyRefreshToken');
		const client_Id = clientId;
		const tokenEndpoint = 'https://accounts.spotify.com/api/token';

		const params = new URLSearchParams();
		params.append('grant_type', 'refresh_token');
		params.append('refresh_token', refreshToken);
		params.append('client_id', client_Id);

		fetch(tokenEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: params
		})
		.then(response => response.json())
		.then(data => {
			if (!data.access_token) {
				throw new Error(data.error_description || data.error || 'Token refresh failed');
			}

			// Update state with new access token
			this.setState({
				token: data.access_token,
			});

			// Store new access token in local storage
			localStorage.setItem('spotifyAccessToken', data.access_token);

			// Set new token expiration time
			const newTokenExpirationTime = Date.now() + (data.expires_in * 1000);
			localStorage.setItem('spotifyTokenExpiration', newTokenExpirationTime);

			// Store new refresh token if provided
			if (data.refresh_token) {
				localStorage.setItem('spotifyRefreshToken', data.refresh_token);
			}
		})
		.catch(error => {
			console.error('Error refreshing Spotify token:', error);
			// Handle error - maybe redirect to login
			this.setState({ token: null, selectedPokemon: null, showPlaylistPopup: false });
		});
	}

	async componentDidMount() {
		this._isMounted = true;
		this.setSpotifyToken();


		try {
			// Try cache first
			const cached = localStorage.getItem(CACHE_KEY);
			if (cached) {
				const parsed = JSON.parse(cached);
				const { timestamp } = parsed;
				// Support both old format { data } and new format { list, details }
				const details = parsed.details || parsed.data;
				const list = parsed.list || details.map(p => ({ name: p.name, url: `https://pokeapi.co/api/v2/pokemon/${p.id}/` }));
				if (timestamp && Date.now() - timestamp < CACHE_TTL && details && details.length > 0) {
					this.setState({ pokemons: list, pokemonDetails: details, loading: false });
					// Resume background loading if cache is incomplete
					if (details.length < list.length) {
						this.loadRemainingPokemon(list, details);
					}
					return;
				}
			}

			const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118');
			const listData = await listResponse.json();
			const list = listData.results;

			// Load only the first batch to show the UI without delay
			const firstDetails = await Promise.all(
				list.slice(0, INITIAL_COUNT).map(p => fetch(p.url).then(r => r.json()))
			);

			if (!this._isMounted) return;
			this.setState({ pokemons: list, pokemonDetails: firstDetails, loading: false });

			// Save partial progress to cache immediately
			this.savePokemonCache(list, firstDetails);

			// Load the rest in the background
			this.loadRemainingPokemon(list, firstDetails);
		} catch (error) {
			console.log(error);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (this.spotifyRefreshInterval) {
			clearInterval(this.spotifyRefreshInterval);
			this.spotifyRefreshInterval = null;
		}
	}

	savePokemonCache(list, details) {
		try {
			localStorage.setItem(CACHE_KEY, JSON.stringify({
				timestamp: Date.now(),
				list,
				details
			}));
		} catch (e) {
			// Storage quota exceeded skip caching
		}
	}

	async loadRemainingPokemon(list, existingDetails) {
		const allDetails = [...existingDetails];
		const startIdx = existingDetails.length;

		if (startIdx >= list.length) return;
		this.setState({ backgroundLoading: true });

		for (let i = startIdx; i < list.length; i += BATCH_SIZE) {
			if (!this._isMounted) break;
			const batch = list.slice(i, Math.min(i + BATCH_SIZE, list.length));
			try {
				const batchDetails = await Promise.all(
					batch.map(p => fetch(p.url).then(r => r.json()))
				);
				allDetails.push(...batchDetails);
				if (!this._isMounted) break;
				this.setState({ pokemonDetails: [...allDetails] });
				// Keep cache up to date after every batch
				this.savePokemonCache(list, allDetails);
			} catch (e) {
				console.log('Batch load error:', e);
			}
		}

		if (this._isMounted) this.setState({ backgroundLoading: false });
	}

	componentDidUpdate(prevProps, prevState) {
		// Re-attempt observer setup whenever loading is done and it hasn't been
		// successfully attached yet. This handles the case where loading finishes
		// before the Spotify token arrives (MainPage not yet in the DOM).
		if (!this.state.loading && !this.state.observerInitialized) {
			const attached = this.initializeObserver();
			if (attached) {
				this.setState({ observerInitialized: true });
			}
		}
	}

	initializeObserver = () => {
		const intersectionElement = document.querySelector('#intersection');
		if (intersectionElement) {
			this.observer = new IntersectionObserver(this.handleIntersection, {
				rootMargin: '0px',
				threshold: 1
			});
			this.observer.observe(intersectionElement);
			return true;
		}
		return false;
	};

	getNextOffset() {
		return this.state.offset + this.state.loadNumber;
	}

	handleIntersection(entries) {
		if (entries[0].isIntersecting) {
			this.setState(prevState => ({
				offset: prevState.offset + prevState.loadNumber
			}));
		}
	}

	async getDescription(pokemon) {
		const speciesUrl = pokemon.species.url;
		const response = await fetch(speciesUrl);
		const data = await response.json();
		const englishFlavorText = data.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text.replace('', ' ');
		this.setState({ description: englishFlavorText });
	}

	async getEvolutionChain(pokemon) {
		const speciesUrl = pokemon.species.url;
		const speciesResponse = await fetch(speciesUrl);
		const speciesData = await speciesResponse.json();

		const evolutionChainUrl = speciesData.evolution_chain.url;
		const evolutionChainResponse = await fetch(evolutionChainUrl);
		const evolutionChainData = await evolutionChainResponse.json();

		this.setState({ evolutionChain: evolutionChainData.chain });
	}

	// Selecting a Pokemon
	async selectPokemon(pokemon) {
		this.setState({ selectedPokemon: pokemon, loading: false,  showPlaylistPopup: false});
		if (pokemon) {
			this.getDescription(pokemon);
			await this.getEvolutionChain(pokemon);
		}
	}

	requestSpotify(url, activeToken, data = {}) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url,
				type: 'GET',
				beforeSend: (xhr) => {
					xhr.setRequestHeader('Authorization', 'Bearer ' + activeToken);
				},
				data,
				success: resolve,
				error: reject,
			});
		});
	}

	async searchTracksByGenre(genres, activeToken) {
		const genreList = (Array.isArray(genres) ? genres : [genres]).filter(Boolean);
		const searches = (genreList.length > 0 ? genreList : ['pop']).slice(0, 2).map((genre) =>
			this.requestSpotify('https://api.spotify.com/v1/search', activeToken, {
				q: `genre:"${genre}"`,
				type: 'track',
				limit: 10,
			})
		);
		const responses = await Promise.all(searches);
		const uniqueTracks = new Map();

		responses.forEach((response) => {
			(response?.tracks?.items || []).forEach((track) => {
				if (track?.id) uniqueTracks.set(track.id, track);
			});
		});

		return Array.from(uniqueTracks.values())
			.sort(() => Math.random() - 0.5)
			.slice(0, 10);
	}

	async generatePlaylist(genres, name, id, stats) {
		this.setState({ generatingPlaylist: true, playlistError: null });

		const tokenExpirationTime = localStorage.getItem('spotifyTokenExpiration');

		// Silently refresh if the token is expired before proceeding
		if (!tokenExpirationTime || Date.now() >= parseInt(tokenExpirationTime, 10)) {
			await new Promise((resolve) => {
				const refreshToken = localStorage.getItem('spotifyRefreshToken');
				if (!refreshToken) {
					this.setState({ token: null, selectedPokemon: null, showPlaylistPopup: false, generatingPlaylist: false });
					resolve();
					return;
				}
				const params = new URLSearchParams();
				params.append('grant_type', 'refresh_token');
				params.append('refresh_token', refreshToken);
				params.append('client_id', clientId);
				fetch('https://accounts.spotify.com/api/token', {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: params
				})
				.then(r => r.json())
				.then(data => {
				if (data.access_token) {
					this.setState({ token: data.access_token });
					localStorage.setItem('spotifyAccessToken', data.access_token);
					localStorage.setItem('spotifyTokenExpiration', Date.now() + (data.expires_in * 1000));
					if (data.refresh_token) {
						localStorage.setItem('spotifyRefreshToken', data.refresh_token);
					}
				} else {
					this.setState({ token: null, selectedPokemon: null, showPlaylistPopup: false, generatingPlaylist: false });
				}
				resolve();
			})
			.catch(() => {
				this.setState({ token: null, selectedPokemon: null, showPlaylistPopup: false, generatingPlaylist: false });
				resolve();
			});
			});
		}

		// Read token directly from localStorage so we always have the freshest value,
		// regardless of whether React has flushed the setState from the refresh above yet.
		const activeToken = localStorage.getItem('spotifyAccessToken');
		if (!activeToken) {
			this.setState({ generatingPlaylist: false });
			return;
		}

		if (this.state.token !== null || activeToken) {
			try {
				// --- Derive audio features from the Pokemon's stats ---
				// Each stat is normalized to [0, 1] then given a small random jitter
				// so repeated generations for the same Pokemon still vary.
				const getStat = (statName) =>
					(stats || []).find(s => s.stat.name === statName)?.base_stat ?? 65;

				const attack  = getStat('attack');
				const spAtk   = getStat('special-attack');
				const defense = getStat('defense');
				const speed   = getStat('speed');

				// Jitter helpers - keeps values in valid API ranges
				const jitter = (val, range = 0.1) =>
					parseFloat(Math.max(0.05, Math.min(0.95, val + (Math.random() - 0.5) * 2 * range)).toFixed(2));
				const jitterTempo = (base, range = 15) =>
					Math.round(Math.max(60, Math.min(200, base + (Math.random() - 0.5) * 2 * range)));

				const targetEnergy       = jitter(attack / 190);              // high attack -> intense
				const targetValence      = jitter(spAtk / 180);               // high sp.atk -> positive/happy
				const targetDanceability = jitter(speed / 190);               // fast -> danceable
				const targetAcousticness = jitter(1 - defense / 220);         // tanky -> less acoustic
				const targetTempo        = jitterTempo(70 + (speed / 200) * 130); // 70-200 BPM
				// Up to 5 genre seeds from both types (Spotify limit)
				const seedGenres = (Array.isArray(genres) ? genres : [genres]).slice(0, 5).join(',');

				let tracks;
				try {
					const data = await this.requestSpotify(
						'https://api.spotify.com/v1/recommendations',
						activeToken,
						{
							seed_genres:          seedGenres,
							limit:                10,
							target_energy:        targetEnergy,
							target_valence:       targetValence,
							target_danceability:  targetDanceability,
							target_acousticness:  targetAcousticness,
							target_tempo:         targetTempo,
						}
					);
					tracks = data?.tracks || [];
					if (tracks.length === 0) {
						const genreOnlyData = await this.requestSpotify(
							'https://api.spotify.com/v1/recommendations',
							activeToken,
							{
								seed_genres: seedGenres,
								limit: 10,
							}
						);
						tracks = genreOnlyData?.tracks || [];
					}
					if (tracks.length === 0) {
						tracks = await this.searchTracksByGenre(genres, activeToken);
					}
				} catch (error) {
					// Recommendations is unavailable to new and Development Mode
					// Spotify apps. Search remains available and returns compatible
					// track objects, so use it as the generation fallback.
					if (error.status !== 403 && error.status !== 404) throw error;
					tracks = await this.searchTracksByGenre(genres, activeToken);
				}

				if (tracks.length === 0) {
					this.setState({
						no_data: true,
						generatingPlaylist: false,
						playlistError: 'Spotify could not find tracks for this Pokémon. Please try again.',
					});
					return;
				}

			this.setState({
				playlist: {
					id: null,
					pokemonId: id,
					name: `${name}'s Playlist`,
					description: 'This playlist was created using PokeFi',
					external_urls: null,
					tracks,
					genres: Array.isArray(genres) ? genres[0] : genres,
					added: false,
				},
				showPlaylistPopup: true,
				generatingPlaylist: false,
			});
		} catch (error) {
			console.error('Error during playlist generation:', error);
			if (error.status === 401) {
				this.refreshSpotifyToken();
			}
			this.setState({ generatingPlaylist: false, playlistError: 'Could not generate playlist. Please try again.' });
		}
		}
	}

	recordCaughtPokemon(pokemonId) {
		if (!pokemonId) return;
		this.setState(prev => {
			if (prev.caughtPokemonIds.includes(pokemonId)) return null;
			const updated = [...prev.caughtPokemonIds, pokemonId];
			localStorage.setItem('caughtPokemonIds', JSON.stringify(updated));
			return { caughtPokemonIds: updated };
		});
	}

	addPlaylistToAccount() {
		// Fetch the user's playlists
		$.ajax({
			url: `https://api.spotify.com/v1/me/playlists`,
			type: "GET",
			beforeSend: (xhr) => {
			xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
			},
			success: (playlistsResponse) => {
				const playlists = playlistsResponse.items;
				// Check if there is already a playlist with the same name
				let existingPlaylist = null;
				for (let i = 0; i < playlists.length; i++) {
					if (playlists[i].name === this.state.playlist.name) {
						existingPlaylist = playlists[i];
						break;
					}
				}

				if (existingPlaylist) {
					// If there is an existing playlist with the same name, update it
					$.ajax({
					url: `https://api.spotify.com/v1/playlists/${existingPlaylist.id}/items`,
					type: "PUT",
						beforeSend: (xhr) => {
							xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
						},
						contentType: "application/json",
						data: JSON.stringify({
							uris: this.state.playlist.tracks.map((track) => track.uri),
						}),
					success: () => {
						window.open(existingPlaylist.external_urls.spotify, '_blank');
						this.recordCaughtPokemon(this.state.playlist.pokemonId);
					},
					});
				}

				else {
					// If there is no existing playlist with the same name, create a new one
					$.ajax({
						url: `https://api.spotify.com/v1/me/playlists`,
						type: "POST",
						beforeSend: (xhr) => {
							xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
						},
						contentType: "application/json",
						data: JSON.stringify({
							name: this.state.playlist.name,
							description: this.state.playlist.description,
						}),
						success: (playlist) => {
							// Add tracks to the playlist
							$.ajax({
						url: `https://api.spotify.com/v1/playlists/${playlist.id}/items`,
							type: "POST",
								beforeSend: (xhr) => {
									xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
								},
								contentType: "application/json",
								data: JSON.stringify({
									uris: this.state.playlist.tracks.map((track) => track.uri),
								}),
							success: () => {
								window.open(playlist.external_urls.spotify, '_blank');
								this.recordCaughtPokemon(this.state.playlist.pokemonId);
							},
							});
						},
					});
				}
			},
		});
	}


	render() {
		const { pokemonDetails, loading, selectedPokemon, description, evolutionChain, offset, loadNumber, token, showPlaylistPopup, playlist, generatingPlaylist, playlistError, backgroundLoading } = this.state;

		return (
			<div className='bg-[#2b292c] h-dvh'>
				{token !== null ? (
					<MainPage
						pokemonDetails={pokemonDetails}
						loading={loading}
						selectedPokemon={selectedPokemon}
						description={description}
						evolutionChain={evolutionChain}
						offset={offset}
						loadNumber={loadNumber}
						selectPokemon={(pokemon) => this.selectPokemon(pokemon)}
						generatePlaylistFromParams={this.generatePlaylist}
						handleLogout={() => this.setState({ token: null, showPlaylistPopup: false })}
						showPlaylistPopup={showPlaylistPopup}
						generatingPlaylist={generatingPlaylist}
						playlistError={playlistError}
						backgroundLoading={backgroundLoading}
						playlist={playlist}
						onPlaylistPopupClose={() => this.setState({ showPlaylistPopup: false })}
						onPlaylistCatch={this.addPlaylistToAccount}
					/>
				) : (
					<div className='flex justify-center items-center'>
						<LoginPage/>
					</div>
				)}
			</div>
		);
	}
}

export default App;
