'use client';

import React, { useState, useEffect } from 'react';
import HighlightTextarea from './HighlightTextarea';

function Content({ note, updateNote }) {
  const [title, setTitle] = useState(note.title);
  const [contentValue, setContentValue] = useState(note.content?.value || '');

  // note 변경 시 상태 초기화
  useEffect(() => {
    setTitle(note.title);
    setContentValue(note.content?.value || '');
  }, [note]);

  // 제목 변경 시 바로 업데이트
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateNote({
      ...note,
      title: newTitle,
      content: {
        ...note.content,
        value: contentValue,
      },
    });
  };

  // 내용 변경 시 바로 업데이트
  const handleContentChange = (newValue) => {
    setContentValue(newValue);
    updateNote({
      ...note,
      title,
      content: {
        ...note.content,
        value: newValue,
      },
    });
  };

  return (
    <div className="flex-1 p-4 py-16 bg-white dark:bg-[#1F1F1F] dark:text-[#E0E0E0] dark:border-gray-600">
      {/* 제목 입력 */}
      <input
        type="text"
        className="w-full text-2xl font-bold border-b border-gray-300 p-2 mb-4 focus:outline-none dark:bg-[#1F1F1F] dark:text-[#E0E0E0] dark:border-gray-600"
        value={title}
        onChange={handleTitleChange} // 변경 즉시 업데이트
        placeholder="Enter title..."
      />
      {/* 내용 입력 */}
      <HighlightTextarea
        value={contentValue}
        onChange={handleContentChange} // 변경 즉시 업데이트
        keyword="highlight" // 키워드 하이라이트 예제
      />
    </div>
  );
}

export default Content;
