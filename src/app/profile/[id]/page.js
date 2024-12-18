'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function ProfilePage({ params }) {
  const [notes, setNotes] = useState([]);
  const [userImage, setUserImage] = useState(null); // 초기에는 null로 설정
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [file, setFile] = useState(null); // 선택한 파일
  const [filePreview, setFilePreview] = useState(null); // 선택한 파일의 미리보기 URL
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const router = useRouter();

  // userId 추출
  useEffect(() => {
    (async () => {
      const resolvedParams = await params; // params 비동기 처리
      setUserId(resolvedParams.id);
    })();
  }, [params]);

  // userId가 변경될 때 사용자 데이터 및 노트 데이터 가져오기
  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchNotes();
    }
  }, [userId]);

  // 사용자 데이터 가져오기
  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUserImage(data.image || '/files/profile.jpg'); 
      setUserName(data.username);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserImage('/files/profile.jpg'); // 에러 시 기본 이미지 설정
    }
  };

  // 노트 가져오기
  const fetchNotes = async () => {
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
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFilePreview(selectedFile ? URL.createObjectURL(selectedFile) : null); // 선택한 파일의 미리보기 URL 생성
  };

  // 파일 업로드 핸들러
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 파일 업로드
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const { fileName } = await uploadResponse.json();

      // DB 업데이트
      const updateResponse = await fetch('/api/user/image', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          imageName: fileName,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile image');
      }

      const { message } = await updateResponse.json();
      setMessage(message);

      // 파일 선택 및 미리보기 초기화
      setFile(null);
      setFilePreview(null);

      // 사용자 프로필 이미지 업데이트
      setUserImage(`/files/${fileName}`); // 새 이미지 설정
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        notes={notes}
        isLoading={false}
        userId={userId}
        userName={userName}
        userImage={userImage} // 데이터베이스에서 가져온 현재 프로필 이미지
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-grow ml-4 md:ml-10">
        <div className="max-w-3xl mx-auto flex flex-col p-4">
          {/* 페이지 제목 */}
          <h1 className="text-2xl font-bold mb-4">Upload Profile Image</h1>

          {/* 프로필 이미지 표시 */}
          <div className="mb-6 flex justify-center items-center">
            <div className="relative w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full overflow-hidden">
              {filePreview ? (
                <img
                  src={filePreview} // 선택된 파일 미리보기
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="absolute text-gray-500 text-sm font-semibold">Preview</span> // 파일이 없을 때 텍스트 표시
              )}
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && <ErrorMessage message={error} />}

          {/* 성공 메시지 */}
          {message && <SuccessMessage message={message} />}

          {/* 파일 입력 및 업로드 버튼 */}
          <div className="flex flex-col">
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-4 p-2 border rounded"
              aria-label="Profile image upload"
              accept="image/*"
            />
            <button
              onClick={handleUpload}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ${
                !file ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!file}
              aria-label="Upload profile image"
            >
              Change Profile Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 에러 메시지 컴포넌트
const ErrorMessage = ({ message }) => (
  <div className="text-red-500 mb-4">{message}</div>
);

// 성공 메시지 컴포넌트
const SuccessMessage = ({ message }) => (
  <div className="text-green-500 mb-4">{message}</div>
);
