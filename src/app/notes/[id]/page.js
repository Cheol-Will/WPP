// src/app/notes/[id]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Content from '../../components/Content';
import CommentsSidebar from '../../components/CommentsSidebar';
import { useSearchParams } from 'next/navigation';
import Highlight from 'react-highlight-words';
import Link from 'next/link';

export default function NotePage({ params }) {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId'); // URL에서 userId 추출
  const highlight = searchParams.get('highlight') || ''; // URL에서 highlight 추출

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
        setNotes(data);
        // selectedNoteId가 없다면 첫 번째 노트 선택
        if (!selectedNoteId && data.length > 0) {
          setSelectedNoteId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        setError('Could not load notes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotes();
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
      console.log(`Attempting to delete note with ID: ${noteId}`);
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
  
      console.log(`Note with ID: ${noteId} deleted successfully`);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      setError(error.message);
    }
  };

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        notes={notes}
        isLoading={isLoading}
        selectNote={setSelectedNoteId}
        addNewNote={addNewNote}
        deleteNote={deleteNote}
      />
      {error && <div className="error-message text-red-600 p-4">{error}</div>}
      {selectedNote && (
        <Content
          note={selectedNote}
          updateNote={updateNote} // `updateNote`를 전달
        />
      )}
       {selectedNote && <CommentsSidebar noteId={selectedNote.id} />}
    </div>
  );
}
