/* eslint-disable */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../../../firebase';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';

const VideosList = React.memo(() => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const db = getFirestore(app);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const videoData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(videoData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, [db]);

  const handleDelete = async (id) => {
    const confirmation = window.confirm('Are you sure you want to delete this video?');
    if (confirmation) {
      try {
        await deleteDoc(doc(db, 'courses', id));
        setVideos((prevVideos) => prevVideos.filter(video => video.id !== id));
        alert('Video deleted successfully.');
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const handleSearch = useCallback(debounce((term) => {
    setSearchTerm(term);
  }, 300), []);

  const handleInputChange = (e) => {
    handleSearch(e.target.value);
  };

  const filteredVideos = useMemo(() => {
    return videos.filter(video => video.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [videos, searchTerm]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVideos = filteredVideos.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg shadow-lg border border-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          Video Library
        </h1>
        <Link
          to="/video"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Add Video
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleInputChange}
        />
      </div>

      {filteredVideos.length === 0 ? (
        <p className="text-center text-xl text-gray-300">No videos found.</p>
      ) : (
        <ul className="space-y-4">
          {currentVideos.map((video) => (
            <li
              key={video.id}
              className="flex flex-col md:flex-row justify-between items-center p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 border border-gray-400"
            >
              <div className="flex-1 flex flex-col space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">{video.title}</h2>
                <p className="text-sm text-gray-700">{video.description}</p>
                <span className="inline-block bg-blue-500 bg-opacity-20 text-black text-xs px-3 py-1 rounded-full">
                  {video.categories}
                </span>
              </div>

              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Link
                  to={`/edit-video/${video.id}`}
                  className="text-blue-400 hover:text-blue-600 transition-colors duration-200 font-semibold"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="text-red-400 hover:text-red-600 transition-colors duration-200 font-semibold"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 hover:bg-blue-600'
          } text-black py-2 px-4 rounded-lg shadow-md`}
        >
          Previous
        </button>
        <span className="text-lg font-semibold text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages ? 'bg-gray-200' : 'bg-blue-500 hover:bg-blue-600'
          } text-black py-2 px-4 rounded-lg shadow-md`}
        >
          Next
        </button>
      </div>
    </div>
  );
});

export default VideosList;
