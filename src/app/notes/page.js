// src/app/notes/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Content from '../../components/Content';
import CommentsSidebar from '../../components/CommentsSidebar';
import DarkModeToggle from '../../components/DarkModeToggle';
import FontSelector from '../../components/FontSelector';
import MusicSidebar from '@/components/MusicSidebar';
import { useSearchParams } from 'next/navigation';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 초기 userImage 상태를 null로 변경
  const [userImage, setUserImage] = useState(null); // 기존: '/profile.jpg' -> 변경: null
  const [userName, setUserName] = useState('');

  /* Settings, Music, Comments Open buttons */
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState(null);

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId'); // URL에서 userId 추출
  const noteId = searchParams.get('noteId'); // URL에서 noteId 추출

  useEffect(() => {
    async function fetchNotes() {
      if (!userId) {
        setError('User ID is missing');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/notes?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        const sortedNotes = data.sort((a, b) => b.isFavorite - a.isFavorite);
        setNotes(sortedNotes);

        if (noteId) {
          // noteId가 있으면 해당 노트 선택
          setSelectedNoteId(parseInt(noteId, 10));
        } else if (sortedNotes.length > 0) {
          // noteId가 없으면 첫 번째 노트 선택
          setSelectedNoteId(sortedNotes[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        setError('Could not load notes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotes();
  }, [userId, noteId]);

  useEffect(() => {
    async function fetchUserData() {
      if (!userId) return;

      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        
        // userImage을 data.image 또는 null로 설정
        setUserImage(data.image || null); // 기존: '/profile.jpg' -> 변경: null
        setUserName(data.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserImage(null); // 에러 발생 시에도 null로 설정
      }
    }

    fetchUserData();
  }, [userId]);

  const addNewNote = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Note',
          content: { type: 'text', value: '' },
          userId, // 현재 사용자 ID 전달
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create new note');
      }

      const newNote = await response.json();
      setNotes((prevNotes) => [...prevNotes, newNote]);
      setSelectedNoteId(newNote.id);
    } catch (error) {
      console.error('Failed to add new note:', error);
      setError('Could not create a new note. Please try again.');
    }
  };

  const updateNote = async (updatedNote) => {
    try {
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedNote.title,
          content: {
            value: updatedNote.content.value,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      const updatedData = await response.json();

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedData.id ? updatedData : note
        )
      );
    } catch (error) {
      console.error('Failed to update note:', error);
      setError('Could not update the note. Please try again.');
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, // 현재 사용자 ID 전달
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete note failed:', errorData);
        throw new Error(errorData.error || 'Failed to delete note');
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      setError(error.message);
    }
  };

  const toggleFavorite = async (noteId, isFavorite) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite }),
      });

      if (!response.ok) throw new Error('Failed to update favorite status');

      setNotes((prevNotes) =>
        prevNotes
          .map((note) => (note.id === noteId ? { ...note, isFavorite } : note))
          .sort((a, b) => b.isFavorite - a.isFavorite)
      );
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleMusic = () => {
    setIsMusicOpen(!isMusicOpen);
  };


  const toggleSidebar = (sidebar) => {
    setActiveSidebar((prevSidebar) => (prevSidebar === sidebar ? null : sidebar));
  };

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        notes={notes}
        isLoading={isLoading}
        selectNote={setSelectedNoteId}
        addNewNote={addNewNote}
        deleteNote={deleteNote}
        toggleFavorite={toggleFavorite}
        userId={userId}
        userName={userName}
        userImage={userImage} // 수정된 userImage 전달
      />
      
      {error && <div className="error-message text-red-600">{error}</div>}
      
      <div className="p-1 w-[260px]">
        <div className="flex justify-center space-x-2">
          {/* Settings 버튼 */}
          <button
            onClick={toggleSettings}
            className="hover:bg-gray-300 px-2 text-gray-700 ml-2 rounded-full 
                      dark:bg-[#333333] dark:hover:bg-[#444444] dark:text-[#E0E0E0]"
            aria-label="Settings"
          >
            <img
              src="/files/settings-svgrepo-com.svg"
              alt="Settings"
              className="w-6 h-6"
            />
          </button>

          {/* Comments 버튼 */}
          <button
            onClick={() => toggleSidebar('comments')}
            className={`px-4 py-2 rounded ${
              activeSidebar === 'comments' 
                ? 'bg-blue-500 text-white dark:bg-[#BB86FC] dark:text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-[#333333] dark:text-[#E0E0E0] dark:hover:bg-[#444444]'
            }`}
          >
            Comments
          </button>

          {/* Music 버튼 */}
          <button
            onClick={() => toggleSidebar('music')}
            className={`px-4 py-2 rounded ${
              activeSidebar === 'music' 
                ? 'bg-blue-500 text-white dark:bg-[#BB86FC] dark:text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-[#333333] dark:text-[#E0E0E0] dark:hover:bg-[#444444]'
            }`}
          >
            Music
          </button>
        </div>


        {isSettingsOpen && (
          <div className="px-1 py-10">
            <DarkModeToggle />
            <FontSelector />
          </div>
        )}
      </div>

      {selectedNote && (
        <Content
          note={selectedNote}
          updateNote={updateNote}
        />
      )}

      <div className="right-4 flex space-x-2">

        <div className='w-[350px]'>
          {activeSidebar === 'comments' && selectedNote && (
            <CommentsSidebar
              noteId={selectedNote.id}
            />
          )}
          {activeSidebar === 'music' && (
            <MusicSidebar
              userId={userId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
