import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../Utils/supabaseClient.js';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      try {
        if (error) {
          console.error('Error fetching user:', error);
        } else {
          const {data} = await axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/user/find`, { user_id: user.id }, {signal});
          setUser(data);
          // console.log(data);
        }
        setLoading(false);
      } catch (error) {
        if(error.response.data.msg == 'User not found!'){
          axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/user/register`, { user_id: user.id });
        }
        // if(){
        // }
        
      }
    };
    supabase.auth.getSession().then(({data:{session}}) => {
      if(session) fetchUser();
      else setLoading(false);
    });
    return () => {
      controller.abort();
    }
    // fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
