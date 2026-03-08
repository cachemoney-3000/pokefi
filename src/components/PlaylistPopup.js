import './PokeInfo.css';
import React from 'react';
import SpotifyText from "../imgs/logo_text.png"
import {
	GENRE_COLOR_MAP,
	FALLBACK_ACCENT_COLOR,
	COLOR_SURFACE,
	COLOR_TEXT_DARK,
	TABLET_BREAKPOINT_PX,
	TRACK_NAME_MAX_CHARS_MOBILE,
	TRACK_NAME_MAX_CHARS_DESKTOP,
	ARTIST_MAX_CHARS_MOBILE,
	ARTIST_MAX_CHARS_DESKTOP,
	ARTIST_SEPARATOR,
	ELLIPSIS,
} from "../utils/constants";

function PlaylistPopup({ name, tracks, genres, onClose, onCatch }) {
	const accentColor = GENRE_COLOR_MAP[genres] || FALLBACK_ACCENT_COLOR;
	const isMobile = window.innerWidth <= TABLET_BREAKPOINT_PX;

	function displayedTrackString(track) {
		const maxChars = isMobile ? TRACK_NAME_MAX_CHARS_MOBILE : TRACK_NAME_MAX_CHARS_DESKTOP;
		return track.name.length > maxChars
			? track.name.substring(0, maxChars) + ELLIPSIS
			: track.name;
	}

	function displayedArtistString(track) {
		const maxChars = isMobile ? ARTIST_MAX_CHARS_MOBILE : ARTIST_MAX_CHARS_DESKTOP;
		const str = track.artists.map(a => a.name).join(ARTIST_SEPARATOR);
		return str.length > maxChars ? str.substring(0, maxChars) + ELLIPSIS : str;
	}

	return (
		<div
			className="PokeInfo w-full overflow-hidden flex flex-col rounded-2xl max-h-[85vh]"
			style={{
				backgroundColor: COLOR_SURFACE,
				boxShadow: `0 0 0 1.5px ${accentColor}55, 0 20px 60px rgba(0,0,0,0.65)`,
			}}
		>
	{/* Header */}
	<div className="flex items-center justify-between px-4 md:px-5 pt-3 md:pt-4 pb-2.5 md:pb-3 border-b border-white/[0.07] shrink-0">
		<div>
			<h2 className="text-white font-semibold text-sm md:text-base leading-tight">{name}</h2>
			<p className="text-xs mt-0.5 capitalize font-medium" style={{ color: accentColor }}>
				{genres} · {tracks.length} tracks
			</p>
		</div>

		{/* Back button — icon only on mobile */}
		<div
			className="rounded-xl p-[1.5px] transition-all duration-200 hover:opacity-80"
			style={{ backgroundColor: `${accentColor}35` }}
		>
			<button
				onClick={onClose}
				className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 rounded-[10px] text-xs font-medium transition-colors duration-200 hover:bg-white/[0.05] active:scale-[0.97]"
				style={{ backgroundColor: COLOR_SURFACE, color: accentColor }}
			>
				<svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
					<polyline points="15 18 9 12 15 6"/>
				</svg>
				<span className="hidden md:inline">Back</span>
			</button>
		</div>
	</div>

	{/* Track list */}
	<div className="flex-1 min-h-0 overflow-y-auto px-3 md:px-5 py-2 md:py-3 flex flex-col gap-1">
		{tracks.map((track) => (
			<a
				key={track.id}
				href={track.external_urls.spotify}
				target="_blank"
				rel="noopener noreferrer"
				className="no-underline group"
			>
				<div className="px-3 md:px-4 py-2 md:py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] transition-colors duration-150">
					<p className="text-white text-xs md:text-sm font-medium leading-tight">
						{displayedTrackString(track)}
					</p>
					<p className="text-gray-500 text-xs mt-0.5">
						{displayedArtistString(track)}
					</p>
				</div>
			</a>
		))}
	</div>

	{/* Footer */}
	<div className="flex items-center justify-between px-4 md:px-5 pb-3 md:pb-4 pt-2.5 md:pt-3 border-t border-white/[0.07] shrink-0">
		{/* Catch button */}
		<div className="rounded-2xl p-[1.5px]" style={{ backgroundColor: accentColor }}>
			<button
				onClick={onCatch}
				className="px-3 py-1.5 md:px-4 md:py-2 rounded-[14.5px] text-xs md:text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
				style={{ backgroundColor: accentColor, color: COLOR_TEXT_DARK }}
			>
				Catch {name}
			</button>
		</div>

		<img
			src={SpotifyText}
			alt="Spotify"
			className="h-4 md:h-5"
			style={{ filter: 'brightness(0) invert(1)', opacity: 0.6 }}
			draggable="false"
		/>
	</div>
		</div>
	);
}

export default PlaylistPopup;
