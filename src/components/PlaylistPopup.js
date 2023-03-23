import React from 'react';
import './PokeInfo.css';

function PlaylistPopup(props) {
  const { name, tracks, genres, onClose, onCatch } = props;

  function getPokemonType(genre) {
    
    const typeMap = {
      pop: "#A8A77A",
      latin: "#EE8130",
      edm: "#6390F0",
      dance: "#f2ab0c",
      indie: "#7AC74C",
      chill: "#96D9D6",
      rock: "#C22E28",
      metal: "#A33EA1",
      "hip-hop": "#E2BF65",
      "r&b": "#A98FF3",
      soul: "#F95587",
      reggae: "#A6B91A",
      punk: "#B6A136",
      classical: "#735797",
      instrumental: "#6F35FC",
      blues: "#705746",
      metalcore: "#B7B7CE",
      folk: "#D685AD",
    };
  
    return typeMap[genre] || "normal";
  }

  function displayedArtistString (track) {
    const maxWidth = window.innerWidth;
    const maxChars = maxWidth <= 1024 ? 35 : 50;
    let artistString = track.artists.map((artist) => artist.name).join(", ");
    let truncatedArtistString = artistString.substring(0, maxChars);
    if (artistString.length > maxChars) {
      truncatedArtistString = truncatedArtistString + "...";
    } 
    return truncatedArtistString;
  }
  
  function displayedTrackString (track) {
    const maxWidth = window.innerWidth;
    const maxChars = maxWidth <= 1024 ? 30 : 50;
    let truncatedTrackString = track.name.substring(0, maxChars);
    if (track.name.length > maxChars) {
      truncatedTrackString = truncatedTrackString + "...";
    } 
    return truncatedTrackString;
  }

  function handleCatch() {
    onCatch();
  }

  return (
    <div className="PokeInfo 2xl:p-4 lg:p-4 2xl:mt-8 xl:mt-6 2xl:border-t-0 border-t-4 border-slate-900 border-opacity-30  lg:mt-10 rounded-lg text-white"
      style={{backgroundColor: getPokemonType(genres) }}>
      <div className='flex 2xl:mb-3 lg:mb-2'>
        <h2 className="font-semibold 2xl:text-2xl lg:text-lg text-white 2xl:mt-2 lg:mt-1">{name}</h2>
        <button onClick={onClose} className="bg-[#1a1a1a] hover:bg-[#484848]
          text-xs font-bold px-3 py-2 rounded-full ml-auto"
          style={{color: getPokemonType(genres) }}>Close</button>
      </div>
      <div className="grid gap-2 mb-3">
        {tracks.map((track) => (
          <a
            key={track.id}
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:no-underline"
          >
            <div className="bg-slate-200 bg-opacity-30 hover:bg-opacity-50 text-slate-50 hover:text-[#1a1a1a] shadow-sm rounded-lg">
              <div className="py-2 pl-3 overflow-hidden">
                <h3 className="font-medium 2xl:text-base lg:text-sm">{displayedTrackString(track)}</h3>
                <p className="font-semilight text-xs">
                  {displayedArtistString(track)}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className='2xl:mb-3 lg:mb-2'>
        <button onClick={handleCatch} className="bg-[#1a1a1a] hover:bg-[#484848] 
            2xl:text-sm lg:text-sm font-bold px-3 py-2 rounded-full ml-auto"
            style={{color: getPokemonType(genres) }}>Catch {name}</button>
      </div>
    </div>
  );
}

export default PlaylistPopup;