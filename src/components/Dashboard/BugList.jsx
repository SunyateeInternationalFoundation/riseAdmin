import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { app } from "../../firebase";


const BugList = () => {

const db = getFirestore(app)
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const bugQuery = collection(db, 'bugs');
        console.log(bugQuery)
        const bugSnapshot = await getDocs(bugQuery)
        const bugData = bugSnapshot.docs.map((doc) => ({ id: doc.id,...doc.data() }));
        console.log(`Bug ${bugData}`)
        setBugs(bugData);
      } catch (error) {
        console.error("Error fetching bugs:", error);
      }
    };

    fetchBugs();
  }, [db,]);
  const handleStatusUpdate = async (bugId, newStatus) => {
    try {
        const bugRef = doc(db, "bugs", bugId);
        await updateDoc(bugRef, {status: newStatus})
    } catch (error) {
        console.error("Something wrong " , error)
    }
  };

  return (
    <div className="container mx-auto p-4 shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Bug List</h1>
      {bugs.length === 0 ? (
        <p>No bugs found.</p>
      ) : (
        <ul className="space-y-4">
          {bugs.map((bug) => (
            <div className="shadow-sm">
            <li
              key={bug.id}
              className="bg-gray-100 p-4 rounded-md flex justify-between items-center"
            >
              <div >
                <h2 className="font-bold text-lg">{bug.subject}</h2>
                <p className="text-sm text-gray-600">{bug.description}</p>
                <p className="text-sm text-gray-800">Status: {bug.status || "Pending"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Update Status
                </label>
                <select
                  value={bug.status}
                  onChange={(e) => handleStatusUpdate(bug.id, e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BugList;
