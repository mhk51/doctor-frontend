import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
const AuthenticatedRoute = ({ element }) => {
  const token = localStorage.getItem('token'); // Check if a token is stored
  const tokenExpiration = Cookies.get('tokenExpiration');

  // If a token is not available, redirect to the login page
  if (!token || (tokenExpiration && new Date(tokenExpiration) <= new Date())) {
    // Token is missing or has expired, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the route content
  return element;
};

export default AuthenticatedRoute;