import * as React from 'react';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; 
import { app } from '../../firebase'; 
import { Avatar } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All'); // To handle subscription filtering

  const db = getFirestore(app);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const userQuery = collection(db, 'users');
      const userSnapshot = await getDocs(userQuery);
      const userList = userSnapshot.docs.map((doc) => doc.data());
      setUsers(userList);
      setFilteredUsers(userList); 
    };
    fetchUsers();
  }, [db]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterPlan(e.target.value);
  };

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch = user.display_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = filterPlan === 'All' || (filterPlan === 'Free' ? user.freePlan : !user.freePlan);
      return matchesSearch && matchesPlan;
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm, filterPlan]);

  return (
    <div className="container mx-auto mt-5 p-1 min-w-full">
      <h2 className="text-3xl font-bold mb-10 text-center text-gray-100">Subscription List</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="block w-full px-4 py-2 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="mb-4">
        <label className="block text-gray-100 mb-2">Filter by Plan</label>
        <select
          value={filterPlan}
          onChange={handleFilterChange}
          className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Plans</option>
          <option value="Free">Free</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      <TableContainer component={Paper} className="shadow-sm bg-sky-900">
        <Table sx={{ minWidth: 650 }} aria-label="user subscription table">
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <Avatar
                    src={user.photo_url}
                    alt="User"
                    className="h-12 w-12 rounded-full object-cover shadow-md"
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>{user.display_name || "N/A"}</TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>
                <TableCell>{user.phone_number || "N/A"}</TableCell>
                <TableCell>{user.age || "N/A"}</TableCell>
                <TableCell>{user.gender || "N/A"}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.freePlan ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {user.freePlan ? "Free" : "Premium"}
                  </span>
                </TableCell>
                <TableCell>
                  {user.startDate ? new Date(user.startDate.seconds * 1000).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell>
                  {user.planEndDate ? new Date(user.planEndDate.seconds * 1000).toLocaleDateString() : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
