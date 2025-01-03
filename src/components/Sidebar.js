// src/components/Sidebar.js

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Sidebar({ notes, isLoading, selectNote, addNewNote, deleteNote, toggleFavorite, userId, userImage, userName }) {
  const router = useRouter();

  // 상태 변수 설정
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(userImage ? `/files/${userImage}` : null);
  const defaultImageUrl = '/files/profile.jpg';

  useEffect(() => {
    if (userImage) {
      setImgSrc(`/files/${userImage}`);
      setIsImageLoading(true);
    } else {
      setImgSrc(defaultImageUrl);
      setIsImageLoading(false);
    }
  }, [userImage]);

  // 이미지 로딩 성공 시 호출
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // 이미지 로딩 실패 시 호출
  const handleImageError = () => {
    if (imgSrc !== defaultImageUrl) {
      setImgSrc(defaultImageUrl);
      setIsImageLoading(true); // 기본 이미지 로딩 상태로 설정
    } else {
      setIsImageLoading(false); // 기본 이미지도 로딩 실패 시
    }
  };

  const handleLogout = () => {
    // 로컬 스토리지에서 사용자 ID 제거
    localStorage.removeItem('userId');

    // 로그인 페이지로 리디렉션
    router.push('/auth');
  };

  const handleProfileClick = () => {
    router.push(`/profile/${userId}`);
  };

  const handleHomeClick = () => {
    router.push(`/notes?userId=${userId}`);
  };

  const handleSearchClick = () => {
    router.push(`/search?userId=${userId}`);
  };

  return (
    <div className="flex flex-col w-64 bg-neutral-100 text-gray-700 p-4 min-h-screen font-bold border-r border-gray-300 dark:bg-[#1F1F1F] dark:text-[#E0E0E0] dark:border-gray-600">
      {/* 기본 정보 섹션 */}
      <div className="mb-8">
        {/* 프로필 아이콘 */}
        <div
          className="menu-item flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer mb-4 dark:hover:bg-[#333333]"
          onClick={handleProfileClick}
        >
          <div className="icon-container flex items-center">
            {/* 로딩 중일 때 스피너 표시 */}
            {isImageLoading && (
              <div className="w-12 h-12 flex items-center justify-center">
                <svg
                  className="animate-spin h-6 w-6 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            )}
            {/* 이미지 표시 */}
            {imgSrc && (
              <img
                src={imgSrc}
                alt="profile"
                className={`w-12 h-12 rounded-full ${isImageLoading ? 'hidden' : 'block'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
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
          className="menu-item flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer dark:hover:bg-[#333333]"
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
        <div
          className="menu-item flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer dark:hover:bg-[#333333]"
          onClick={handleHomeClick}
        >
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

      <h2 className="font-semibold mb-4">Private</h2>
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
                className="menu-item flex items-center py-2 px-1 mb-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-[#333333]"
                onClick={() => selectNote(note.id)}
              >
                <svg
                  role="graphics-symbol"
                  viewBox="0 0 20 20"
                  className="w-5 h-5 fill-current mr-0"
                >
                  <path d="M4.35645 15.4678H11.6367C13.0996 15.4678 13.8584 14.6953 13.8584 13.2256V7.02539C13.8584 6.0752 13.7354 5.6377 13.1406 5.03613L9.55176 1.38574C8.97754 0.804688 8.50586 0.667969 7.65137 0.667969H4.35645C2.89355 0.667969 2.13477 1.44043 2.13477 2.91016V13.2256C2.13477 14.7021 2.89355 15.4678 4.35645 15.4678ZM4.46582 14.1279C3.80273 14.1279 3.47461 13.7793 3.47461 13.1436V2.99219C3.47461 2.36328 3.80273 2.00781 4.46582 2.00781H7.37793V5.75391C7.37793 6.73145 7.86328 7.20312 8.83398 7.20312H12.5186V13.1436C12.5186 13.7793 12.1836 14.1279 11.5205 14.1279H4.46582ZM8.95703 6.02734C8.67676 6.02734 8.56055 5.9043 8.56055 5.62402V2.19238L12.334 6.02734H8.95703Z"></path>
                </svg>
                <div className="relative group">
                  <svg
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(note.id, !note.isFavorite);
                    }}
                    className={`w-5 h-5 mr-2 cursor-pointer 
                      ${note.isFavorite ? 'fill-yellow-500' : 'fill-gray-400 group-hover:opacity-100'} 
                      ${note.isFavorite ? '' : 'opacity-0'}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                {note.title}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
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
        className="menu-item flex items-center p-2 bg-gray-300 rounded cursor-pointer mt-4 hover:bg-gray-400 dark:bg-[#333333] dark:hover:bg-[#444444]"
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
