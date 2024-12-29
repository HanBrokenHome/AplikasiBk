// Breadcrumb.js
import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ currentPage }) => {
  return (
    <nav className="breadcrumb">
      <Link to="/">Home</Link> / <span>{currentPage}</span>
    </nav>
  );
};

export default Breadcrumb;
