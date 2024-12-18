'use client';

import React, { useState, useEffect } from 'react';

export default function FontSelector() {
  const [selectedFont, setSelectedFont] = useState('sans'); // 기본 폰트 설정

  useEffect(() => {
    // 로컬 스토리지에서 폰트 로드
    const savedFont = localStorage.getItem('font') || 'sans';
    setSelectedFont(savedFont);
    // 초기 렌더링 시 폰트 클래스 적용
    document.documentElement.classList.add(`font-${savedFont}`);
  }, []);

  const handleFontChange = (font) => {
    if (selectedFont === font) {
      // 같은 폰트를 클릭하면 사이드바를 닫는 로직을 추가할 경우 여기에 구현
      return;
    }
    // 이전 폰트 클래스 제거
    document.documentElement.classList.remove(`font-${selectedFont}`);
    // 새로운 폰트 클래스 추가
    document.documentElement.classList.add(`font-${font}`);
    // 상태 및 로컬 스토리지 업데이트
    setSelectedFont(font);
    localStorage.setItem('font', font);
  };

  return (
    <div className="p-1">
      <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-[#E0E0E0]">Select Font</h3>
      <div className="flex space-x-1">
        <button
          onClick={() => handleFontChange('sans')}
          className={`px-4 py-2 border rounded ${
            selectedFont === 'sans'
              ? 'bg-blue-500 text-white dark:bg-[#BB86FC] dark:text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-[#333333] dark:text-[#E0E0E0] dark:hover:bg-[#444444]'
          }`}
        >
          Sans
        </button>
        <button
          onClick={() => handleFontChange('serif')}
          className={`px-4 py-2 border rounded ${
            selectedFont === 'serif'
              ? 'bg-blue-500 text-white dark:bg-[#BB86FC] dark:text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-[#333333] dark:text-[#E0E0E0] dark:hover:bg-[#444444]'
          }`}
        >
          Serif
        </button>
        <button
          onClick={() => handleFontChange('mono')}
          className={`px-4 py-2 border rounded ${
            selectedFont === 'mono'
              ? 'bg-blue-500 text-white dark:bg-[#BB86FC] dark:text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-[#333333] dark:text-[#E0E0E0] dark:hover:bg-[#444444]'
          }`}
        >
          Mono
        </button>
      </div>
    </div>
  );
}
  