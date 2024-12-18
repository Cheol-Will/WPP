// src/components/MusicSidebar.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player'; // 3rd-party 라이브러리
import axios from 'axios';

export default function MusicSidebar({ userId }) {
  const [musics, setMusics] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // 음악 재생 상태 관리

  const audioPlayerRef = useRef(null); // ReactAudioPlayer의 ref

  useEffect(() => {
    if (userId) {
      fetchMusics();
    }
  }, [userId]);

  const fetchMusics = async () => {
    try {
      const response = await axios.get(`/api/music?userId=${userId}`);
      setMusics(response.data.musics);
    } catch (err) {
      console.error('Error fetching musics:', err);
      setError('Could not load musics.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a music file to upload.');
      return;
    }

    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId); // 사용자 ID 포함

    try {
      const response = await axios.post('/api/music/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setFile(null);
      fetchMusics(); // 업로드 후 음악 목록 새로 고침
    } catch (err) {
      console.error('Error uploading music:', err);
      setError(err.response?.data?.error || 'Failed to upload music');
    }
  };

  const handlePlay = (music) => {
    if (currentAudio && currentAudio.id === music.id) {
      // 같은 음악을 클릭한 경우 토글
      if (isPlaying) {
        audioPlayerRef.current.audioEl.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayerRef.current.audioEl.current.play();
        setIsPlaying(true);
      }
    } else {
      // 다른 음악을 클릭한 경우
      setCurrentAudio(music);
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    if (currentAudio) {
      audioPlayerRef.current.audioEl.current.currentTime = 0;
      audioPlayerRef.current.audioEl.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className={`flex flex-col min-h-screen p-4 bg-gray-100 text-gray-800 dark:bg-[#1F1F1F] dark:text-[#E0E0E0] dark:border-gray-100`}>
      {/* 음악 업로드 섹션 */}
      <div className="mb-6">
        {error && <div className="text-red-500 mb-2 font-bold">{error}</div>}
        {message && <div className="text-green-500 mb-2 font-bold">{message}</div>}
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="mb-2 p-2 border rounded"
        />
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition dark:bg-[#333333] dark:hover:bg-[#444444]"
        >
          Upload Music
        </button>
      </div>

      {/* 음악 목록 */}
      <ul>
        {musics.map((music) => (
          <li key={music.id} className="mb-4">
            <div className="flex flex-col py-4">
              <span className="font-semibold">{music.fileName}</span>
              <div className="flex space-x-2 py-2">
                <button
                  onClick={() => handlePlay(music)}
                  className="bg-green-500 text-white w-[70px] px-4 py-1 rounded hover:bg-green-600 transition"
                  aria-label={`Play ${music.fileName}`}
                >
                  {currentAudio && currentAudio.id === music.id && isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={handleReset}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  aria-label={`Reset ${music.fileName}`}
                >
                  Reset
                </button>
              </div>
            </div>
            {/* 음악 재생 컨트롤 */}
            {currentAudio && currentAudio.id === music.id && (
              <ReactAudioPlayer
                ref={audioPlayerRef}
                src={`/music/${music.fileName}`}
                controls
                autoPlay
                className="mt-2 w-full"
                onEnded={handleAudioEnded}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
