import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../../firebase'; 


const AddSound = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [audio, setAudio] = useState(null);
  const [uploading, setUploading] = useState(false); 
  const [progress, setProgress] = useState(0); 
  const db = getFirestore(app); 
  const history = useHistory()

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    setAudio(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!audio) {
      alert("Please upload an audio file.");
      return;
    }
    
    setUploading(true);
    
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `audio/${audio.name}`);
      const uploadTask = uploadBytesResumable(storageRef, audio);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressPercent);  
          console.log(`Upload is ${progressPercent}% done`);
        },
        (error) => {
          console.error("Error uploading file:", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          await addDoc(collection(db, "music"), {
            title,
            description,
            categories,
            url: downloadURL,
            createdAt: new Date()
          });

          setUploading(false);
          alert("Audio uploaded and metadata saved successfully!");
          history.push('/sound-list');
          
          setTitle('');
          setDescription('');
          setCategories('');
          setAudio(null);
          setProgress(0); 
        }
      );
      
    } catch (error) {
      console.error("Error storing metadata in Firestore:", error);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-blue-500"
            placeholder="Enter title"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-blue-500"
            placeholder="Enter description"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Category</label>
          <select
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className=" text-black w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select category</option>
            <option value="agamas">Agamas</option>
            <option value="sunya">Sunya</option>
            <option value="music">Music</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Upload Audio</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {uploading && (
          <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={uploading}
          >
            {uploading ? `Uploading... ${Math.round(progress)}%` : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSound;
