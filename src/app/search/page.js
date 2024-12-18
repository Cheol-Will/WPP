// src/pages/SearchPage.js
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function SearchPage() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 초기화
  const [userImage, setUserImage] = useState(null); // 초기 상태를 null로 설정
  const [userName, setUserName] = useState('');

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId'); // URL에서 userId 가져오기
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // 검색 여부 추적

  useEffect(() => {
    if (userId) {
      fetchNotes();
      fetchUserData();
    } else {
      setError('User ID is missing');
    }
  }, [userId]);

  // 노트 목록 가져오기
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/notes?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      const sortedNotes = data.sort((a, b) => b.isFavorite - a.isFavorite);
      setNotes(sortedNotes);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError('Could not load notes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 데이터 가져오기
  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUserImage(data.image || null); // 기본 이미지를 null로 설정
      setUserName(data.username);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserImage(null); // 에러 발생 시에도 기본 이미지를 null로 설정
    }
  };

  // 검색 핸들러
  const handleSearch = async () => {
    if (!userId) {
      setError('User ID is missing');
      return;
    }

    setError(null);
    setIsLoading(true); // 로딩 시작
    setHasSearched(false); // 검색 시작 전 상태 초기화

    try {
      const response = await fetch(
        `/api/search?userId=${userId}&keyword=${encodeURIComponent(keyword)}`
      );
      if (!response.ok) throw new Error('Failed to fetch search results');

      const data = await response.json();
      setResults(data);
      setHasSearched(true); // 검색 완료 후 상태 업데이트
    } catch (error) {
      setError(error.message);
      setHasSearched(true); // 에러 발생 시에도 검색이 시도되었음을 표시
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 노트 클릭 핸들러
  const handleNoteClick = (noteId) => {
    router.push(`/notes?userId=${userId}&noteId=${noteId}&search=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        notes={notes}
        isLoading={isLoading}
        userId={userId}
        userName={userName}
        userImage={userImage} // userImage을 Sidebar에 전달
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-grow ml-4 md:ml-10">
        <div className="max-w-3xl mx-auto flex flex-col p-4">
          {/* Search 텍스트 */}
          <h1 className="text-2xl font-bold mb-4">Search</h1>

          {/* Input Box와 Search Button을 좌우로 배치 */}
          <div className="flex mb-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="border rounded px-4 py-2 flex-grow mr-2"
              placeholder="Enter keyword..."
              aria-label="Search keyword"
            />
            <button
              onClick={handleSearch}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ${
                keyword.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={keyword.trim() === ''}
              aria-label="Search"
            >
              Search
            </button>
          </div>

          {/* 에러 메시지 */}
          {error && <ErrorMessage message={error} />}

          {/* 검색 결과 리스트 */}
          <SearchResults
            isLoading={isLoading}
            results={results}
            hasSearched={hasSearched}
            handleNoteClick={handleNoteClick}
          />
        </div>
      </div>
    </div>
  );
}

// 에러 메시지 컴포넌트
const ErrorMessage = ({ message }) => (
  <div className="text-red-500 mb-4">{message}</div>
);

// 검색 결과 컴포넌트
const SearchResults = ({ isLoading, results, hasSearched, handleNoteClick }) => (
  <ul className="flex-grow overflow-auto">
    {isLoading ? (
      <li className="p-2 text-center text-gray-500">검색 중...</li>
    ) : results.length > 0 ? (
      results.map((note) => (
        <li
          key={note.id}
          className="p-2 border-b hover:bg-gray-100 cursor-pointer"
          onClick={() => handleNoteClick(note.id)}
        >
          {note.title}
        </li>
      ))
    ) : (
      hasSearched && (
        <li className="p-2 text-center text-gray-500">검색 결과가 없습니다.</li>
      )
    )}
  </ul>
);
