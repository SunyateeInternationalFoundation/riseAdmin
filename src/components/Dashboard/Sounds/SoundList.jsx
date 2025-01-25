import React, { useEffect, useState, useCallback } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../../../firebase';
import { Link } from 'react-router-dom';

const SoundList = () => {
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Debounced value for search term
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [soundsPerPage] = useState(5); 
  const db = getFirestore(app);

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'music'));
        const soundData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSounds(soundData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sounds:', error);
        setLoading(false);
      }
    };
    fetchSounds();
  }, [db]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this sound?");
    if (confirmation) {
      try {
        await deleteDoc(doc(db, 'music', id));
        setSounds((prevSounds) => prevSounds.filter(sound => sound.id !== id));
        alert("Sound deleted successfully.");
      } catch (error) {
        console.error("Error deleting sound:", error);
      }
    }
  };

  // Filter the sounds based on the debounced search term
  const filteredSounds = sounds.filter(sound => 
    sound.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const indexOfLastSound = currentPage * soundsPerPage;
  const indexOfFirstSound = indexOfLastSound - soundsPerPage;
  const currentSounds = filteredSounds.slice(indexOfFirstSound, indexOfLastSound);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Memoize pagination buttons for optimization
  const renderPageNumbers = useCallback(() => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredSounds.length / soundsPerPage); i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <button
        key={number}
        onClick={() => paginate(number)}
        className={`px-3 py-1 border border-gray-400 rounded-full mx-1 ${
          number === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {number}
      </button>
    ));
  }, [filteredSounds.length, soundsPerPage, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading sounds...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg shadow-sm border border-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          Sound Library
        </h1>
        <Link
          to="/add"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Add Music
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {currentSounds.length === 0 ? (
        <p className="text-center text-xl text-gray-300">No sounds found.</p>
      ) : (
        <ul className="space-y-4">
          {currentSounds.map((sound) => (
            <li
              key={sound.id}
              className="flex justify-between items-center p-4 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 border border-gray-400"
            >
              <div className="flex-1 flex flex-col space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">{sound.title}</h2>
                <p className="text-sm text-gray-700">{sound.description}</p>
                <span className="inline-block bg-blue-500 bg-opacity-20 text-black text-xs px-3 py-1 rounded-full">
                  {sound.categories}
                </span>
              </div>

              <audio controls controlsList='nodownload' className="w-48 mx-4">
                <source src={sound.audioURL} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>

              <div className="flex items-center space-x-4">
                <Link
                  to={`/edit-sound/${sound.id}`}
                  className="text-blue-400 hover:text-blue-600 transition-colors duration-200 font-semibold"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(sound.id)}
                  className="text-red-400 hover:text-red-600 transition-colors duration-200 font-semibold"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex justify-center">
        {renderPageNumbers()}
      </div>
    </div>
  );
};

export default SoundList;
