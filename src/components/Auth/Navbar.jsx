/* eslint-disable */
import React from 'react';
import { Link , useLocation , useHistory} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const name = user?.name || "Guest";
  const handleLogout = () => {
    dispatch(logout());
    history.push('/');
  };

  const getNavClass = (path)=>{
    return location.pathname === path
      ? 'block px-4 py-2 text-white bg-sky-600 rounded-lg transition duration-300'
      : 'block px-4 py-2 text-gray-300 hover:bg-sky-600 hover:text-white rounded-lg transition duration-300';
  };

  return (
    <div className="flex h-screen">
      <aside className="fixed top-0 left-0 h-full w-55 bg-gray-900 text-white z-50">
        <div className="p-6">
          <Link to="/" className="flex items-center mb-4">
            <span className="font-semibold text-xl tracking-wider">Rise Admin</span>
          </Link>
          {isAuthenticated && (
            <div className="text-left space-y-4 my-4">
              <span className="text-gray-300">Welcome, </span>
              <span className="font-bold text-white">{name}</span>
            </div>
          )}
          <nav className="space-y-4">
            <Link
              to="/admin"
              className={getNavClass('/admin')}
            >
              Home
            </Link>
            <Link
              to="/video-list"
              className={getNavClass('/video-list')}
            >
            Courses
            </Link>
            <Link
              to="/sound-list"
              className={getNavClass('/sound-list')}
            >
            Audio
            </Link>
            <Link
              to="/list"
              className={getNavClass('/list')}
            >
              Subscriptions
            </Link>
          </nav>
          <div className="mt-4 space-y-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={getNavClass('/profile')}
                >
                  Profile
                </Link>
                <Link
                  to="/admin-list"
                  className={getNavClass('/admin-list')}
                >
                  Settings
                </Link>
                <Link
                  to="/bug-list"
                  className={getNavClass('/bug-list')}
                >
                  Bugs
                </Link>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 mt-4 bg-red-600 text-white hover:bg-red-700 rounded-lg transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 bg-sky-600 text-white hover:bg-sky-700 rounded-lg transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 mt-4 border border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white rounded-lg transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
