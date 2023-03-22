import React, { useEffect, useRef } from 'react';
import './PokeInfo.css';

function PlaylistPopup(props) {
  const { name, tracks, genres, onClose } = props;

  const popupRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        console.log("Click outside");
        onClose();
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupRef, onClose]);

  function getPokemonType(genre) {
    
    const typeMap = {
      pop: "#A8A77A",
      latin: "#EE8130",
      edm: "#6390F0",
      dance: "#f2c20c",
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

  
  return (
    <div className="PokeInfo px-3 mt-20 rounded-lg text-white w-full overflow-hidden"
      style={{backgroundColor: getPokemonType(genres) }}>
      <h2 className="font-semibold text-lg mb-1 text-center">{name}</h2>
      <div className="grid gap-2">
        {tracks.map((track) => (
          <a
            key={track.id}
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:no-underline"
          >
            <div className="bg-black shadow-lg rounded-lg hover:bg-gray-700 w-full">
              <div className="py-2 pl-3 overflow-hidden text-ellipsis">
                <h3 className="font-medium text-base text-slate-50">{track.name}</h3>
                <p className="text-gray-600 font-semilight text-sm">{track.artists.map((artist) => artist.name).join(", ")}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">Close</button>
    </div>

  );
}

export default PlaylistPopup;