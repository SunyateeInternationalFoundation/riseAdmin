import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { app } from "../../firebase";
import { useSelector } from 'react-redux';

const AdminList = () => {
  const user = useSelector((state) => state.auth.user); 
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const db = getFirestore(app);


  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setIsLoading(true);
        const adminQuery = query(collection(db, 'users'), where('isAdmin', '==', true));
        const adminSnapshot = await getDocs(adminQuery);
        const adminList = adminSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const filteredAdminList = adminList.filter((admin) => admin.id !== user?.uid); // exclude current user
        setAdmins(filteredAdminList);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, [db, user]);

  // Function to remove admin
  const handleRemoveAdmin = async (adminId) => {
    if (!user?.isAdmin) {
      alert("You don't have permission to perform this action.");
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', adminId));
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== adminId));
    } catch (err) {
      setError(`Failed to remove admin: ${err.message}`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-5 p-1 min-w-full">
      <h2 className="text-3xl font-bold mb-10 text-center text-gray-100">Admin List</h2>
      <div className="shadow-sm rounded-lg overflow-x-auto bg-sky-900">
        <table className="min-w-full table-auto bg-white">
          <thead className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Photo</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.map((admin, index) => (
              <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="px-6 py-4">
                  <img
                    src={admin.photo_url || '/default-avatar.png'}
                    alt="Admin"
                    className="h-12 w-12 rounded-full object-cover shadow-md"
                  />
                </td>
                <td className="px-6 py-4 text-gray-800 font-medium">{admin.display_name || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600">{admin.email || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600">{admin.phone_number || 'N/A'}</td>
                <td className="px-6 py-4">
                  {user?.isAdmin && (
                    <button
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Remove Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminList;
