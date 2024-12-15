'use client';

import React, { useEffect, useState } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Settings</h1>
      <div>
        <h2 className="mb-2">Select Theme</h2>
        <button
          onClick={() => handleThemeChange('light')}
          className={`px-4 py-2 ml-2 ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Light
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={`px-4 py-2 ml-2 ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Dark
        </button>
      </div>
    </div>
  );
}
