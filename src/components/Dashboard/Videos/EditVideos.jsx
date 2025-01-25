import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../../firebase';

const EditVideos = () => {
  const { id } = useParams(); 
  const history = useHistory(); 
  const [videoData, setVideoData] = useState({ title: '', description: '', categories: '', videoUrl: '' });
  const [loading, setLoading] = useState(true);
  const [videoFile, setVideoFile] = useState(null); 
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const docRef = doc(db, 'courses', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVideoData(docSnap.data());
          setLoading(false);
        } else {
          console.error('No such document!');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        setLoading(false);
      }
    };

    fetchVideo();
  }, [db, id]);

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (videoFile) {
        const storageRef = ref(storage, `videos/${videoFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.error('Error uploading video:', error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, 'courses', id), {
              ...videoData,
              videoUrl: downloadURL,
            });
            alert('Video updated successfully');
            history.push('/video-list');
          }
        );
      } else {
        await updateDoc(doc(db, 'courses', id), videoData);
        alert('Video updated successfully');
        history.push('/video-list');
      }
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-100 animate-pulse">Loading video data...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => history.push('/video-list')}
        className="absolute top-5 right-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-black py-2 px-6 rounded-full shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
      >
        Go-Back
      </button>

      <div className="max-w-3xl mx-auto mt-16 p-8 bg-slate-700 bg-opacity-30 backdrop-blur-md rounded-lg shadow-xl border h-screen border-gray-200">
        <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-black mb-8">
          Edit Video
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-black text-lg mb-2" htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={videoData.title}
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
              value={videoData.description}
              onChange={handleChange}
              className="w-full p-4 bg-gray-700 bg-opacity-50 text-black rounded-xl shadow-inner focus:outline-none focus:ring-4 focus:ring-pink-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-black text-lg mb-2" htmlFor="categories">Category</label>
            <select
              name="categories"
              value={videoData.categories}
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
            <label className="block text-black text-lg mb-2" htmlFor="video">Upload Video File</label>
            <input
              type="file"
              name="video"
              id="video"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full p-4 bg-gray-700 bg-opacity-50 text-black rounded-xl shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
          >
            Update Video
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVideos;
