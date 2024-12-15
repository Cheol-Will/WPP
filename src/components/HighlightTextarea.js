'use client';

import React, { useState, useEffect } from 'react';

function HighlightTextarea({ value = '', onChange, onBlur, keyword = '', className }) {
  const [textValue, setTextValue] = useState(value);
  const [highlight, setHighlight] = useState(true); // 하이라이트 상태

  const handleChange = (e) => {
    const newValue = e.target.value;
    setTextValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleBlur = () => {
    if (onBlur) onBlur(textValue); // 블러 이벤트에서 현재 값 전달
  };

  // 페이지에 들어왔을 때 하이라이트 상태를 1초 후 해제
  useEffect(() => {
    if (keyword) {
      setHighlight(true); // 하이라이트 활성화
      const timer = setTimeout(() => setHighlight(false), 1000); // 1초 후 비활성화
      return () => clearTimeout(timer); // 타이머 정리
    }
  }, [keyword]);

  // 하이라이트를 포함한 텍스트 처리
  const getHighlightedText = (text, keyword) => {
    if (!keyword) return text;

    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() && highlight ? (
        <mark
          key={index}
          style={{
            backgroundColor: 'yellow', // 하이라이트 색상
            color: 'black',
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} className={className}>
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
        onBlur={handleBlur} // 블러 이벤트 추가
      />
    </div>
  );
}

export default HighlightTextarea;
