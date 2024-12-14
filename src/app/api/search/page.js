// src/app/search/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Highlight from 'react-highlight-words';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === '') return;

    setIsLoading(true);

    try {
      // 사용자 ID 가져오기 (예: 로컬 스토리지)
      const userId = localStorage.getItem('userId');

      const res = await fetch(`/api/notes?userId=${userId}&query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (res.ok) {
        setSearchResults(data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Notes</h1>
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter keyword to search..."
          className="border rounded-l px-4 py-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r">
          Search
        </button>
      </form>

      {isLoading ? (
        <div>Searching...</div>
      ) : (
        <div>
          {searchResults.length === 0 ? (
            <div>No notes found containing "{query}".</div>
          ) : (
            <ul>
              {searchResults.map((note) => (
                <li key={note.id} className="mb-4">
                  <Link href={`/notes/${note.id}?highlight=${encodeURIComponent(query)}`}>
                    <h2 className="text-xl font-semibold hover:underline">
                      <Highlight
                        searchWords={[query]}
                        textToHighlight={note.title}
                        highlightClassName="bg-yellow-200"
                      />
                    </h2>
                  </Link>
                  <p>
                    <Highlight
                      searchWords={[query]}
                      textToHighlight={note.content?.value || ''}
                      highlightClassName="bg-yellow-200"
                    />
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
