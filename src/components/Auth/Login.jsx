import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { loginSuccess } from '../../store/authSlice'; 
import { app } from '../../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch(); 
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log(userData)
        dispatch(
          loginSuccess({
            user: {
              uid: user.uid,
              email: user.email,
              isAdmin: userData.isAdmin,
              name:userData.display_name
            },
            token: user.accessToken, 
          })
        );
        if (userData.isAdmin) {
          history.push('/admin');
        } else {
          history.push('/dashboard');
        }
      } else {
        setError('User data not found.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError(err.message);
    }
  };
  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="bg-slate-200 w-full max-w-md">
        <div className="rounded-md p-8">
          <img
            className="mx-auto h-12 w-auto"
            src="https://d1jj76g3lut4fe.cloudfront.net/processed/thumb/S1Yc7F14OY0nt2uB50.png?Expires=1726293404&Signature=r7tHcgRwxIbKV8d2SrDZ7GaKfhSivf0gYFSOGDqJIWo1RocExWxb3hOLhA6-47ua3BKlfCghHRs9AfiuguljCccUDtuIof3HVBUUovliJxBaC-9Twz0gtOgLksAm-Ygp8KjX5eyeNcIdx17FtrVMH7VCIdvEmxflvkJJ97EeM-6oYd~Y5mU-ISFoM5DcGZ7ioYE2xVRBDzNlPTw4XjwSCo9105HOuSmybjB5qfQsNzbYoK4qgjDSceV1Se-u7woqtU33CwCx5dlVuuEnXNYFtEBfihCYwsnwKPYDf9IMKa9w2E7uJ6q-Uv79eToyo1oiGFaUIbvOoZ1uu9gHEUiI2Q__&Key-Pair-Id=K2YEDJLVZ3XRI"
            alt="User Icon"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            Login to your account
          </h2>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <form className="space-y-6 mt-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email
              </label>
              <div className="mt-1">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="px-2 py-3 mt-1 block w-full rounded-md border text-black border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="px-2 py-3 mt-1 block w-full rounded-md border text-black border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-sky-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-900">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-gray-700 hover:text-gray-900">
                Sign up instead
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-800 px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              className="mt-4 flex w-full justify-center rounded-md border border-gray-600 bg-gray-800 py-2 px-4 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              onClick={() => alert('Login with Google')}
            >
              <img
                className="mr-2 h-5"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                alt="Google Logo"
              />
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
