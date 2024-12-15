'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import HighlightTextarea from './HighlightTextarea';

function Content({ note, updateNote }) {
  const [title, setTitle] = useState(note.title);
  const [contentValue, setContentValue] = useState(note.content?.value || '');
  const searchParams = useSearchParams();
  const keyword = searchParams.get('search') || '';

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent) => {
    setContentValue(newContent);
  };

  const handleUpdate = () => {
    const updatedNote = {
      ...note,
      title,
      content: {
        ...note.content,
        value: contentValue,
      },
    };
    updateNote(updatedNote); // 서버에 업데이트 요청
  };

  return (
    <div className="flex-1 p-1 mr-24 flex flex-col items-center bg-white dark:bg-gray-800 dark:text-gray-100">
      {/* 제목 입력 필드 */}
      <input
        type="text"
        className="text-4xl font-bold w-full max-w-4xl my-6 p-4 border-b-2 border-gray-400  focus:outline-none dark:bg-gray-800 dark:text-gray-100"
        value={title}
        onChange={handleTitleChange}
        onBlur={handleUpdate} // 제목 업데이트
        placeholder="Enter title..."
      />
      {/* 하이라이트 텍스트 영역 */}
      <HighlightTextarea
        value={contentValue}
        onChange={handleContentChange}
        onBlur={handleUpdate} // 내용 업데이트
        keyword={keyword}
        className="w-full max-w-4xl h-64 p-4 border border-gray-400 rounded-md focus:outline-none dark:bg-gray-800 dark:text-gray-100"
      />
    </div>
  );
}

export default Content;
