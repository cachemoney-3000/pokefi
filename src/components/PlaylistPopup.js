import React from 'react';

function PlaylistPopup(props) {
  const { tracks, onClose } = props;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-md rounded-lg p-4 max-h-80 overflow-y-scroll">
    <h2 className="text-lg font-bold mb-4">Playlist Tracks</h2>
    <ul className="list-disc list-inside mb-4">
        {tracks.map((track) => (
        <li key={track.id}>
            {track.name} - {track.artists.map((artist) => artist.name).join(", ")}
        </li>
        ))}
    </ul>
    <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">Close</button>
    </div>

  );
}

export default PlaylistPopup;