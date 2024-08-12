import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import './Header.css';

const Header = () => {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          E-Commerce
        </Link>
      </div>
      <nav className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
      </nav>
      <div className="navbar-icons">
        <Link to="/search">
          <FaSearch />
        </Link>
        <Link to="/cart">
          <FaShoppingCart />
        </Link>
        <Link to="/login">
          <FaUser />
        </Link>
      </div>
    </header>
  );
};

export default Header;
