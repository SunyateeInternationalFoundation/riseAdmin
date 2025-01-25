import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../../firebase';

const EditSound = () => {
  const { id } = useParams(); 
  const history = useHistory(); 
  const [soundData, setSoundData] = useState({ title: '', description: '', categories: '', audioUrl: '' });
  const [loading, setLoading] = useState(true);
  const [audioFile, setAudioFile] = useState(null); 
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    const fetchSound = async () => {
      try {
        const docRef = doc(db, 'music', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSoundData(docSnap.data());
          setLoading(false);
        } else {
          console.error('No such document!');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching sound:', error);
        setLoading(false);
      }
    };

    fetchSound();
  }, [db, id]);

  const handleChange = (e) => {
    setSoundData({ ...soundData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (audioFile) {
        const storageRef = ref(storage, `music/${audioFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, audioFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.error('Error uploading audio:', error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, 'music', id), {
              ...soundData,
              audioUrl: downloadURL,
            });
            alert('Sound updated successfully');
            history.push('/sound-list');
          }
        );
      } else {
        await updateDoc(doc(db, 'music', id), soundData);
        alert('Sound updated successfully');
        history.push('/sound-list');
      }
    } catch (error) {
      console.error('Error updating sound:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading sound data...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => history.push('/sound-list')}
        className="absolute top-5 right-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-black py-2 px-6 rounded-full shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
      >
        Go-Back
      </button>

      <div className="max-w-3xl mx-auto mt-16 p-8 bg-white bg-opacity-30 backdrop-blur-md rounded-lg shadow-xl border h-screen border-gray-200">
        <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-black mb-8">
          Edit Sound
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-black text-lg mb-2" htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={soundData.title}
              onChange={handleChange}
              className="w-full p-4 bg-gray-700 bg-opacity-50 text-black rounded-xl shadow-inner focus:outline-none focus:ring-4 focus:ring-pink-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-black text-lg mb-2" htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={soundData.description}
              onChange={handleChange}
              className="w-full p-4 bg-gray-700 bg-opacity-50 text-black rounded-xl shadow-inner focus:outline-none focus:ring-4 focus:ring-pink-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-black text-lg mb-2" htmlFor="categories">Category</label>
            <select
              name="categories"
              value={soundData.categories}
              onChange={handleChange}
              className="w-full p-4 bg-gray-700 bg-opacity-50 text-black rounded-xl shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              <option value="meditate">Meditation</option>
              <option value="sleep">Sleep</option>
              <option value="music">Music</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-black text-lg mb-2" htmlFor="audio">Upload Audio File</label>
            <input
              type="file"
              name="audio"
              id="audio"
              accept="audio/*"
              onChange={handleFileChange}
              className="w-full p-4 bg-gray-700 bg-opacity-50 text-black rounded-xl shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
          >
            Update Sound
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSound;
