'use client';

import React, { useState, useEffect } from 'react';

function Content({ note, updateNote }) {
  const [title, setTitle] = useState(note.title);
  const [contentValue, setContentValue] = useState(note.content?.value || '');

  useEffect(() => {
    setTitle(note.title);
    setContentValue(note.content?.value || '');
  }, [note]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContentValue(e.target.value);
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
    updateNote(updatedNote);
  };

  return (
    <div className="flex-1 p-16 flex flex-col items-center bg-white">
      <input
        type="text"
        className="text-4xl font-bold w-3/4 my-6 p-2 border-b-2 border-gray-400 focus:outline-none"
        value={title}
        onChange={handleTitleChange}
        onBlur={handleUpdate}
        placeholder="Enter title..."
      />
      <textarea
        className="w-3/4 h-64 p-4 border border-gray-300 rounded mb-6 focus:outline-none"
        value={contentValue}
        onChange={handleContentChange}
        onBlur={handleUpdate}
        placeholder="Enter content here..."
      />
    </div>
  );
}

export default Content;
