'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId'); // URL에서 userId 가져오기
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!userId) {
      setError('User ID is missing');
      return;
    }

    try {
      const response = await fetch(
        `/api/search?userId=${userId}&keyword=${encodeURIComponent(keyword)}`
      );
      if (!response.ok) throw new Error('Failed to fetch search results');

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNoteClick = (noteId) => {
    // router.push(`/notes/${noteId}`); // notes?userId=2
    router.push(`/notes?userId=${userId}&noteId=${noteId}&search=${keyword}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Search Notes</h1>
      <div className="mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border rounded px-4 py-2 w-full mb-2"
          placeholder="Enter keyword..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ul>
        {results.map((note) => (
          <li
            key={note.id}
            className="p-2 border-b hover:bg-gray-100 cursor-pointer"
            onClick={() => handleNoteClick(note.id)}
          >
            {note.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
