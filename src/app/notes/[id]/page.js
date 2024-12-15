// src/app/notes/[id]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Content from '../../components/Content';
import CommentsSidebar from '../../components/CommentsSidebar';
import { useSearchParams } from 'next/navigation';

export default function NotePage({ params }) {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId'); // URL?? userId ??

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
        if (!selectedNoteId && sortedNotes.length > 0) {
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
          userId, // íÿ„ìÿ¬ ì‚¬ìÿ©ìÿÿ ID ì „ë‹¬
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
  const deleteNote = async (noteId) => {
    try {
      console.log(`Attempting to delete note with ID: ${noteId}`);
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, // íÿ„ìÿ¬ ì‚¬ìÿ©ìÿÿ ID ì „ë‹¬
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
        toggleFavorite={toggleFavorite}
      />
      {error && <div className="error-message text-red-600 p-4">{error}</div>}
      <ThemeFontSelector />
      {selectedNote && (
        <Content
          note={selectedNote}
          updateNote={updateNote} // 
        />
      )}
       {selectedNote && <CommentsSidebar noteId={selectedNote.id} />}
    </div>
  );
}
