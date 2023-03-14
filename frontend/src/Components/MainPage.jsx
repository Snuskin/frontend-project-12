import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
 const MainPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login')
  }, [])
  return (
    <>
    <div>
      Main Page
    </div>
    </>
  )
} 
export default MainPage