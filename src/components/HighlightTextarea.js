'use client';

import React, { useState, useEffect } from 'react';

function HighlightTextarea({ value = '', onChange, keyword = '' }) {
  const [textValue, setTextValue] = useState(value);

  // 부모로부터 변경된 value를 받아서 내부 상태를 업데이트
  useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setTextValue(newValue);
    if (onChange) onChange(newValue); // 부모 컴포넌트로 값 전달
  };

  const getHighlightedText = (text, keyword) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={index} style={{ backgroundColor: 'yellow' }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="relative w-full h-64 border rounded overflow-hidden"
      style={{ position: 'relative' }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden p-2"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          color: 'transparent',
          pointerEvents: 'none',
        }}
      >
        {getHighlightedText(textValue, keyword)}
      </div>
      <textarea
        className="absolute top-0 left-0 w-full h-full p-2 bg-transparent border-none resize-none"
        style={{
          backgroundColor: 'transparent',
        }}
        value={textValue}
        onChange={handleChange}
      />
    </div>
  );
}

export default HighlightTextarea;
