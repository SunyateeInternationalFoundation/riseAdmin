import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../firebase'; 
import { useSelector } from 'react-redux';
import { Avatar } from '@mui/material';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [formData, setFormData] = useState({
    display_name: '',
    phone_number: '',
    age: ''
  });

  const db = getFirestore(app);
  const user = useSelector((state) => state.auth.user); 

  useEffect(() => {
    if (!user) return;

    const fetchAdminProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAdminData(data); 
          setFormData({
            display_name: data.display_name || '',
            phone_number: data.phone_number || '',
            age: data.age || ''
          });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminProfile();
  }, [db, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, formData); 
      setAdminData((prevData) => ({
        ...prevData,
        ...formData
      }));
      setIsEditing(false); 
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!adminData) {
    return <div className="text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto mt-12 p-6 bg-gray-80 rounded-lg max-w-4xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Admin Profile</h2>
      
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center space-x-6 mb-6">
          <Avatar
            src={adminData.photo_url || 'https://via.placeholder.com/150'}
            alt="Admin"
            className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-gray-200"
          />
          <div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  className="border p-2 rounded-lg w-full"
                  placeholder="Name"
                />
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="border p-2 mt-4 rounded-lg w-full"
                  placeholder="Phone Number"
                />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="border p-2 mt-4 rounded-lg w-full"
                  placeholder="Age"
                />
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-gray-800">{adminData.display_name || 'N/A'}</h3>
                <p className="text-gray-500">{adminData.phone_number || 'N/A'}</p>
                <p className="text-gray-500">{adminData.age ? `${adminData.age} years` : 'N/A'}</p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p className="text-gray-600">
            <span className="font-medium">Age:</span> {adminData.age || 'N/A'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Gender:</span> {adminData.gender || 'N/A'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">email:</span> {adminData.email || 'N/A'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Plan Type:</span> {adminData.getPlan || 'N/A'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Plan Validity:</span> {adminData.isPlanValidity ? 'Valid' : 'Expired'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Profile Completed:</span> {adminData.isProfile_completed ? 'Yes' : 'No'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Free Plan:</span> {adminData.freePlan ? 'Yes' : 'No'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Joined:</span> {adminData.created_time ? new Date(adminData.created_time.seconds * 1000).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        <div className="mt-6">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
