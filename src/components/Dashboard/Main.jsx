import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { app } from "../../firebase";

const Main = () => {
  const [videoCount, setVideoCount] = useState(0);
  const [musicCount, setMusicCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const db = getFirestore(app);
  
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true);

        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        setVideoCount(coursesSnapshot.size);

        const musicSnapshot = await getDocs(collection(db, 'music'));
        setMusicCount(musicSnapshot.size);

        const usersQuery = query(collection(db, 'users'), where('isAdmin', '==', false));
        const usersSnapshot = await getDocs(usersQuery);
        setUserCount(usersSnapshot.size);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching counts: ', error);
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [db]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 flex justify-center items-center">
      <div className="container max-w-screen-lg mx-auto text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8">
          Dashboard Overview
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 bg-slate-600 bg-opacity-10 rounded-lg backdrop-filter backdrop-blur-lg hover:scale-105 transform transition-transform duration-500">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full shadow-lg">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276a1 1 0 011.447.894v6.764a1 1 0 01-1.447.894L15 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h9a1 1 0 011 1v5z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl text-black font-semibold">Total Videos</h2>
            <p className="text-4xl text-black mt-2">{videoCount}</p>
          </div>

          <div className="p-6 bg-slate-600 bg-opacity-10 rounded-lg backdrop-filter backdrop-blur-lg hover:scale-105 transform transition-transform duration-500">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-full shadow-lg">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-2v13M9 10l12-2" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl text-black font-semibold">Total Music</h2>
            <p className="text-4xl text-black mt-2">{musicCount}</p>
          </div>

          <div className="p-6 bg-slate-600 bg-opacity-10 rounded-lg backdrop-filter backdrop-blur-lg hover:scale-105 transform transition-transform duration-500">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-red-500 p-4 rounded-full shadow-lg">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 13.793A4 4 0 0114 10V5a4 4 0 11-8 0v5a4 4 0 019 2.793 4.001 4.001 0 01-1.121 7.207M12 14v1a4 4 0 004 4h.172a4 4 0 00.732-7.964" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl text-black font-semibold">Total Users (Excluding Admins)</h2>
            <p className="text-4xl text-black mt-2">{userCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
