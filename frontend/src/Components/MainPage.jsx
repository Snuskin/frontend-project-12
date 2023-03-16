import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

 const MainPage = () => {
  const [content, setContent] = useState('');
  
  useEffect(() => {
    const navigate = useNavigate();
    const fetchContent = async () => {
      const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
      console.log(content)
      setContent(data) && navigate('/login')
    };

    fetchContent();
  }, []);
  return (
    <>
    <div>
      
      Main Page
      <h1>HELLO MAZAFAKA</h1>
    </div>
    </>
  )
} 
export default MainPage