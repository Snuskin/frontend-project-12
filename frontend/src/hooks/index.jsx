import { useContext } from 'react';
import authContext from '../contexts/index.jsx';
import socketContext from '../contexts/socketContext';

const useSocket = () => useContext(socketContext);

const useAuth = () => useContext(authContext);

export { useAuth, useSocket };
