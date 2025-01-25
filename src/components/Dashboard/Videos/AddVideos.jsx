/*eslint-disable*/
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../../../firebase';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [video, setVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoURL, setVideoURL] = useState('');
  const history =  useHistory()

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      alert('Please upload a video first.');
      return;
    }

    const storageRef = ref(storage, `videos/${video.name}`);
    const uploadTask = uploadBytesResumable(storageRef, video);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setVideoURL(downloadURL);

        try {
          await addDoc(collection(db, 'courses'), {
            title,
            description,
            category,
            url: downloadURL,
            timestamp: new Date(),
          });

          alert('Video uploaded and details saved successfully!');
          // Reset form fields
          setTitle('');
          setDescription('');
          setCategory('');
          setVideo(null);
          setUploadProgress(0);
          history.push('/video-list');
        } catch (error) {
          console.error('Error saving video details to Firestore:', error);
          alert('Error saving video details, please try again.');
        }
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg border border-gray-700">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-gray-800">
        Admin Dashboard
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-black font-semibold mb-3">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 bg-white bg-opacity-10 text-black border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-700"
            placeholder="Enter video title"
            required
          />
        </div>

        <div>
          <label className="block text-black font-semibold mb-3">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-white bg-opacity-10 text-black border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-700"
            placeholder="Enter video description"
            rows="5"
            required
          />
        </div>

        <div>
          <label className="block text-black font-semibold mb-3">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 bg-white bg-opacity-10 text-black border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="Meditation">Meditation</option>
            <option value="Sleep">Sleep</option>
            <option value="Music">Music</option>
            <option value="Panchsheel">Panchsheel</option>
            <option value="Podcast">Podcast</option>
            <option value="Calming Everyday Anxiety">Calming Everyday Anxiety</option>
            <option value="New and Polpular">New and Popular</option>
            <option value="Meantal Health Matters">Mental Health Matters</option>
            <option value="Challenging Times">Challenging Times</option>
            <option value="Beginning Meditation">Beginning Meditation</option>
            <option value="Guide to Sleep">Guide to Sleep</option>
          </select>
        </div>

        <div>
          <label className="block text-black font-semibold mb-3">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="w-full p-4 bg-black bg-opacity-10 text-black border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {uploadProgress > 0 && (
          <div className="text-black">
            Upload Progress: {Math.round(uploadProgress)}%
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
