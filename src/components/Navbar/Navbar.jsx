import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Navbar = ({ setShowLogin, isLoggedIn, handleLogout, food_list }) => {
  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase().trim();
    setSearchTerm(term);

    // Filter the food list by name
    const results = food_list.filter((item) =>
      item.food_name.toLowerCase().includes(term)
    );
    setFilteredItems(results);
  };

  // Toggle search bar visibility
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const getTotalCartAmount = () => {
    // Placeholder function for cart items; customize based on your logic
    return 0;
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src={assets.logo} alt="Logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mob-app")}
          className={menu === "mob-app" ? "active" : ""}
        >
          mobile app
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact")}
          className={menu === "contact" ? "active" : ""}
        >
          contact us
        </a>
      </ul>
      <div className="navbar-right">
        <img
          src={assets.search_icon}
          alt="Search"
          onClick={toggleSearch}
          style={{ cursor: "pointer" }}
        />
        <Link to="/cart" className="navbar-search-icon">
          <img src={assets.basket_icon} alt="Basket" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!isLoggedIn ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>

      {isSearchOpen && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="search-results">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.food_id} className="search-item">
                  <img src={item.food_image} alt={item.food_name} />
                  <div>
                    <h4>{item.food_name}</h4>
                    <p>₹{item.food_price}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No items found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
