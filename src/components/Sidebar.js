// src/components/Sidebar.js

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Sidebar({ notes, isLoading, selectNote, addNewNote, deleteNote, userId, userImage, userName }) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const profileImage = userImage
  ? `/files/${userImage}` // DB에 저장된 이미지 이름으로 경로 생성
  : '/files/default.png'; // 기본 이미지

  const handleLogout = () => {
    // remove user ID from local storage
    localStorage.removeItem('userId');

    // redirect to login page
    router.push('/auth');
  };

  const handleProfileClick = () => {
    router.push(`/profile/${userId}`);
  };


  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchResults([]);
    setSearchQuery('');
    setSearchError(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      if (!userId) {
        throw new Error('User ID is missing');
      }

      const res = await fetch(`/api/notes?userId=${userId}&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();

      if (res.ok) {
        setSearchResults(data);
      } else {
        throw new Error(data.error || 'Failed to search notes');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (noteId) => {
    router.push(`/notes/${noteId}?highlight=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  };

  return (
    <div className="flex flex-col w-64 bg-neutral-100 text-gray-700 p-4 min-h-screen font-bold border-r border-gray-300">
      {/* 기본 정보 섹션 */}
      <div className="mb-8">
        {/* 프로필 아이콘 */}
        <div className="menu-item flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer mb-4" onClick={handleProfileClick}>
          <div className="icon-container flex items-center">
              <img src={profileImage} alt="profile" className="w-12 h-12 rounded-full" />
            </div>
          <span className="ml-2">{userName}의 페이지</span>
          <svg
            role="graphics-symbol"
            viewBox="0 0 20 20"
            className="w-5 h-5 fill-current ml-auto"
          >
            <g>
              <path d="M9.944 14.721c.104.094.216.12.336.079l1.703-.688 6.844-6.844-1.406-1.398-6.836 6.836-.711 1.68c-.052.13-.029.242.07.335zm8.102-9.484l1.414 1.406.515-.523a.917.917 0 00.282-.633.76.76 0 00-.258-.61l-.25-.25a.702.702 0 00-.578-.187.975.975 0 00-.617.297l-.508.5zM8.593z"></path>
            </g>
          </svg>
        </div>

        {/* 검색 아이콘 */}
        <div
          className="menu-item flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer"
          onClick={handleSearchClick}
        >
          <div className="icon-container flex items-center">
            <svg
              role="graphics-symbol"
              viewBox="0 0 20 20"
              className="w-5 h-5 fill-current"
            >
              <path d="M4 8.75C4 6.12665 6.12665 4 8.75 4C11.3734 4 13.5 6.12665 13.5 8.75C13.5 11.3734 11.3734 13.5 8.75 13.5C6.12665 13.5 4 11.3734 4 8.75ZM8.75 2.5C5.29822 2.5 2.5 5.29822 2.5 8.75C2.5 12.2018 5.29822 15 8.75 15C10.2056 15 11.545 14.5024 12.6073 13.668L16.7197 17.7803C17.0126 18.0732 17.4874 18.0732 17.7803 17.7803C18.0732 17.4874 18.0732 17.0126 17.7803 16.7197L13.668 12.6073C14.5024 11.545 15 10.2056 15 8.75C15 5.29822 12.2018 2.5 8.75 2.5Z"></path>
            </svg>
          </div>
          <span className="ml-2">Search</span>
        </div>

        {/* 홈 아이콘 */}
        <div className="menu-item flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
          <div className="icon-container flex items-center">
            <svg
              role="graphics-symbol"
              viewBox="0 0 20 20"
              className="w-5 h-5 fill-current"
            >
              <path d="M10.1416 3.77299C10.0563 3.71434 9.94368 3.71434 9.85837 3.77299L3.60837 8.06989C3.54053 8.11653 3.5 8.19357 3.5 8.2759V14.2499C3.5 14.9402 4.05964 15.4999 4.75 15.4999H7.5V10.7499C7.5 10.0595 8.05964 9.49987 8.75 9.49987H11.25C11.9404 9.49987 12.5 10.0595 12.5 10.7499V15.4999H15.25C15.9404 15.4999 16.5 14.9402 16.5 14.2499V8.2759C16.5 8.19357 16.4595 8.11653 16.3916 8.06989L10.1416 3.77299ZM9.00857 2.53693C9.60576 2.12636 10.3942 2.12636 10.9914 2.53693L17.2414 6.83383C17.7163 7.1603 18 7.69963 18 8.2759V14.2499C18 15.7687 16.7688 16.9999 15.25 16.9999H12.25C11.5596 16.9999 11 16.4402 11 15.7499V10.9999H9V15.7499C9 16.4402 8.44036 16.9999 7.75 16.9999H4.75C3.23122 16.9999 2 15.7687 2 14.2499V8.2759C2 7.69963 2.2837 7.1603 2.75857 6.83383L9.00857 2.53693Z"></path>
            </svg>
          </div>
          <span className="ml-2">Home</span>
        </div>
      </div>
      {isSearchOpen && (
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter keyword..."
              className="border rounded-l px-2 py-1 w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded-r"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
          {searchError && <div className="text-red-600 text-sm mb-2">{searchError}</div>}
          {searchResults.length > 0 && (
            <div className="overflow-y-auto max-h-60">
              <ul>
                {searchResults.map((note) => (
                  <li key={note.id} className="mb-2">
                    <button
                      onClick={() => handleResultClick(note.id)}
                      className="text-left w-full hover:bg-gray-200 p-2 rounded"
                    >
                      {note.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {searchResults.length === 0 && !isSearching && searchQuery.trim() !== '' && (
            <div className="text-gray-600 text-sm">No notes found.</div>
          )}
        </div>
      )}
      <h2 className="font-semibold text-gray-800 mb-4">Private</h2>
      {isLoading ? (
        <div>Loading notes...</div>
      ) : (
        <>
          {notes.length === 0 ? (
            <div>No pages available. Click "New Page" to get started.</div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="menu-item flex items-center p-2 mb-2 rounded cursor-pointer hover:bg-gray-200 "
                onClick={() => selectNote(note.id)}
              >
                <svg
                  role="graphics-symbol"
                  viewBox="0 0 20 20"
                  className="w-5 h-5 fill-current mr-2"
                >
                  <path d="M4.35645 15.4678H11.6367C13.0996 15.4678 13.8584 14.6953 13.8584 13.2256V7.02539C13.8584 6.0752 13.7354 5.6377 13.1406 5.03613L9.55176 1.38574C8.97754 0.804688 8.50586 0.667969 7.65137 0.667969H4.35645C2.89355 0.667969 2.13477 1.44043 2.13477 2.91016V13.2256C2.13477 14.7021 2.89355 15.4678 4.35645 15.4678ZM4.46582 14.1279C3.80273 14.1279 3.47461 13.7793 3.47461 13.1436V2.99219C3.47461 2.36328 3.80273 2.00781 4.46582 2.00781H7.37793V5.75391C7.37793 6.73145 7.86328 7.20312 8.83398 7.20312H12.5186V13.1436C12.5186 13.7793 12.1836 14.1279 11.5205 14.1279H4.46582ZM8.95703 6.02734C8.67676 6.02734 8.56055 5.9043 8.56055 5.62402V2.19238L12.334 6.02734H8.95703Z"></path>
                </svg>
                {note.title}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 클릭 이벤트가 note 선택에 전달되지 않도록 방지
                    deleteNote(note.id);
                  }}
                  className="text-red-500 hover:text-red-700 ml-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3a1 1 0 011-1h4a1 1 0 011 1v1h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6H5a1 1 0 110-2h4V3zm2 1v1h2V4h-2zM8 7h8v11H8V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </>
      )}
      <div
        className="menu-item flex items-center p-2 bg-gray-300 rounded cursor-pointer mt-4"
        onClick={addNewNote}
      >
        <svg
          role="graphics-symbol"
          viewBox="0 0 20 20"
          className="w-5 h-5 fill-current mr-2"
        >
          <path d="M10 1C10.5523 1 11 1.44772 11 2V9H18C18.5523 9 19 9.44772 19 10C19 10.5523 18.5523 11 18 11H11V18C11 18.5523 10.5523 19 10 19C9.44772 19 9 18.5523 9 18V11H2C1.44772 11 1 10.5523 1 10C1 9.44772 1.44772 9 2 9H9V2C9 1.44772 9.44772 1 10 1Z"></path>
        </svg>
        New Page
      </div>
      
      <div
        className="menu-item flex items-center p-2 bg-red-500 text-white rounded cursor-pointer mt-auto"
        onClick={handleLogout}
      >
        Logout
      </div>
    </div>
  );
}

export default Sidebar;
