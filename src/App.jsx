import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Outlet, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Post from './Pages/Post';
import Login from './Pages/Login';
import Register from './Pages/Register';
import axios from 'axios';
import Loading from './Components/Loading';
import { supabase } from './Utils/supabaseClient';
import { useState } from 'react';
import { UserProvider, useUser } from './Components/UserContext';
import Chats from './Pages/Chats';
axios.defaults.withCredentials = true;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function requestPermission() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

function sendNotification(text) {
  if (Notification.permission === "granted") {
    new Notification(text);
  } else {
    alert("Please enable notifications to receive updates.");
  }
}
const ProtectedRoute = () => {
  const { user, loading } = useUser();
  if (loading) {
    return <Loading/>
  }
  // setUser(user);
  return user ? <Outlet me={user}/> : <Navigate to="/login" />;
};

export default function App() {
  const [user, setUser] = useState();
  requestPermission();
  useEffect(() => {
    const channel = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats' }, (payload) => {
                if (payload.new.receiver_id != user?.id) return
                sendNotification(payload.new.body);
            })
            .subscribe();
    AOS.init();
    return
  }, [])
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Home title={"Home"}/>} />
          <Route path='/post' element={<Post title={"Post"} />} />
          <Route path='/profile' element={<Profile title={"Profile"} />} />
          <Route path='/profile/:id' element={<Profile title={"Profile"} />} />
          <Route path='/post/:id/:idpost' element={<Home title={"Post"} />} />
          <Route path='/chats' element={<Chats title={"Chats"} />} />
          <Route path='/chat/:id' element={<Chats title={"Chats"} />} />
        </Route>
        <Route path='/login' element={<Login title={"Login"} />} />
        <Route path='/register' element={<Register title={"Register"} />} />
      </Routes>
    </Router>
    </UserProvider>
  )
}