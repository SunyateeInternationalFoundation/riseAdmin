/* eslint-disable */
import React from "react";
import { useSelector } from "react-redux";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Auth/Login";
import Sidebar from "./components/Auth/Navbar";
import Signup from "./components/Auth/Signup";
import AdminList from "./components/Dashboard/AdminList";
import BugList from "./components/Dashboard/BugList";
import Main from "./components/Dashboard/Main";
import Profile from "./components/Dashboard/Profile";
import AddSound from "./components/Dashboard/Sounds/AddSound";
import EditSound from "./components/Dashboard/Sounds/EditSound";
import SoundList from "./components/Dashboard/Sounds/SoundList";
import UserList from "./components/Dashboard/UserList";
import Video from "./components/Dashboard/Videos/AddVideos";
import EditVideos from "./components/Dashboard/Videos/EditVideos";
import VideosList from "./components/Dashboard/Videos/VideosList";
import ErrorPage from "./components/UI/ErrorPage";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="bg-slate-100 min-h-screen flex">
        {isAuthenticated && <Sidebar />}
        <div
          className={
            isAuthenticated ? "ml-64 w-full p-6 bg-inherit" : "w-full p-6"
          }
        >
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route exact path="/login">
              {isAuthenticated ? <Redirect to="/admin" /> : <Login />}
            </Route>
            <Route exact path="/admin">
              {isAuthenticated ? <Main /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/video">
              {isAuthenticated ? <Video /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/video-list">
              {isAuthenticated ? <VideosList /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/sound-list">
              {isAuthenticated ? <SoundList /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/list">
              {isAuthenticated ? <UserList /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/admin-list">
              {isAuthenticated ? <AdminList /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/add">
              {isAuthenticated ? <AddSound /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/edit-sound/:id">
              {isAuthenticated ? <EditSound /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/edit-video/:id">
              {isAuthenticated ? <EditVideos /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/bug-list">
              {isAuthenticated ? <BugList /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/profile">
              {isAuthenticated ? <Profile /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/">
              {isAuthenticated ? (
                <Redirect to="/admin" />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="*">
              <ErrorPage message="Oops! This page does not exist." />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
