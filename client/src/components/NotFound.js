// src/components/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" style={styles.link}>
        Go back to Home
      </Link>
    </div>
  );
};

// Optional styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
  },
  message: {
    fontSize: '1.2rem',
    margin: '20px 0',
  },
  link: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
  },
};

export default NotFound;