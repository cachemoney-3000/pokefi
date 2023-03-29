import React from 'react';
import './PokeInfo.css';
import SpotifyLogo from "../imgs/logo_icon.png"
import SpotifyText from "../imgs/logo_text.png"

function PlaylistPopup(props) {
  const { name, tracks, genres, onClose, onCatch } = props;
  const screenWidth = window.innerWidth;
  const isMediumScreenSize = screenWidth <= 1080;
  console.log(screenWidth)

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
    <div className="PokeInfo 2xl:p-4 xl:p-4 lg:p-4 md:p-12 sm:p-6 2xl:mt-24 xl:mt-6 lg:mt-6 md:mt-0 sm:mt-0 
      2xl:border-t-0 xl:border-t-4 lg:border-t-4 md:border-t-0 sm:border-t-0 border-slate-900 
      border-opacity-30 rounded-lg text-white 2xl:h-fit xl:h-fit lg:h-fit md:h-screen sm:h-screen overflow-y-auto"
      style={{backgroundColor: getPokemonType(genres) }}>
      <div className='flex 2xl:mb-3 xl:mb-2 lg:mb-2 md:mb-2 sm:mb-3'>
        <h2 className="font-semibold 2xl:text-2xl xl:text-xl lg:text-lg md:text-xl sm:text-lg text-white 2xl:mt-2 xl:mt-1 lg:mt-1 md:mt-1 sm:mt-1">{name}</h2>
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
              <div className="py-2 pl-3 overflow-auto">
                <h3 className="font-medium 2xl:text-md xl:text-sm lg:text-sm md:text-md sm:text-md">{displayedTrackString(track)}</h3>
                <p className="font-semilight text-xs">
                  {displayedArtistString(track)}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className='2xl:mb-6 xl:mb-2 lg:mb-2 md:mb-3 sm:mb-4'>
        <button onClick={handleCatch} className="bg-[#1a1a1a] hover:bg-[#484848] 
            2xl:text-sm xl:text-sm lg:text-sm md:text-md sm:text-sm font-bold px-3 py-2 rounded-full ml-auto"
            style={{color: getPokemonType(genres) }}>Catch {name}</button>
        {isMediumScreenSize ? (
          <img src ={SpotifyLogo} alt="Spotify" className="float-right h-6 m-2" draggable="false"/>
        ) : (
          <img src ={SpotifyText} alt="Spotify" className="float-right h-6 m-2" draggable="false"/>
        )}
      </div>
    </div>
  );
}

export default PlaylistPopup;