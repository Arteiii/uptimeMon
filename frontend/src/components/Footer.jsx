"use client";

import React, { useState } from "react";

const Footer = () => {
  // State to manage the theme mode
  const [darkMode, setDarkMode] = useState(false);

  // Toggle between dark and light mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <footer
      className={`p-4 text-center ${
        darkMode ? "bg-gray-800" : "bg-white"
      } text-${darkMode ? "white" : "black"}`}
    >
      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        &copy; 2024 Your Company |{" "}
        <a
          href="https://www.yourwebsite.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`hover:text-blue-300 transition duration-300 ${
            darkMode ? "text-blue-400" : "text-blue-700"
          }`}
        >
          Website
        </a>{" "}
        |{" "}
        <a
          href="https://github.com/yourusername/your-repository"
          target="_blank"
          rel="noopener noreferrer"
          className={`hover:text-blue-300 transition duration-300 ${
            darkMode ? "text-blue-400" : "text-blue-700"
          }`}
        >
          GitHub
        </a>{" "}
        |{" "}
        <a
          href="/license"
          className={`hover:text-blue-300 transition duration-300 ${
            darkMode ? "text-blue-400" : "text-blue-700"
          }`}
        >
          License
        </a>
        {/* Add other relevant links here */}
      </p>

      {/* Dark mode toggle button */}
      <button onClick={toggleDarkMode} className="mt-2">
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
    </footer>
  );
};

export default Footer;
