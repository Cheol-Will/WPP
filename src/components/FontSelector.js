'use client';

import React, { useState, useEffect } from 'react';

export default function FontSelector() {
  const [selectedFont, setSelectedFont] = useState('sans'); // 기본 폰트 설정

  useEffect(() => {
    // 로컬 스토리지에서 폰트 로드
    const savedFont = localStorage.getItem('font') || 'sans';
    setSelectedFont(savedFont);
    document.documentElement.classList.add(`font-${savedFont}`);
  }, []);

  const handleFontChange = (font) => {
    // 이전 폰트 클래스 제거
    document.documentElement.classList.remove(`font-${selectedFont}`);
    // 새로운 폰트 클래스 추가
    document.documentElement.classList.add(`font-${font}`);
    // 상태 및 로컬 스토리지 업데이트
    setSelectedFont(font);
    localStorage.setItem('font', font);
  };

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">Select Font</h3>
      <div className="flex space-x-2">
        <button
          onClick={() => handleFontChange('sans')}
          className={`px-4 py-2 border rounded ${
            selectedFont === 'sans' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Sans
        </button>
        <button
          onClick={() => handleFontChange('serif')}
          className={`px-4 py-2 border rounded ${
            selectedFont === 'serif' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Serif
        </button>
        <button
          onClick={() => handleFontChange('mono')}
          className={`px-4 py-2 border rounded ${
            selectedFont === 'mono' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Mono
        </button>
      </div>
    </div>
  );
}
