'use client';

import React, { useEffect, useState } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState('light'); // 기본 테마: 라이트 모드

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
    <div className="settings p-4">
      <h2 className="text-lg font-bold mb-4">Settings</h2>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Theme</h3>
        <button
          onClick={() => handleThemeChange('light')}
          className={`mr-2 px-4 py-2 ${
            theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Light Mode
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={`px-4 py-2 ${
            theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Dark Mode
        </button>
      </div>
    </div>
  );
}
