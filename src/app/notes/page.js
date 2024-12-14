'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Content from '../../components/Content';
import { useSearchParams } from 'next/navigation';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    async function fetchNotes() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/notes?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        setError('Could not load notes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    if (userId) {
      fetchNotes();
    }
  }, [userId]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        notes={notes}
        isLoading={isLoading}
        selectNote={setSelectedNoteId}
      />
      {error && <div className="error-message text-red-600">{error}</div>}
      {selectedNote && (
        <Content
          note={selectedNote}
          updateNote={(updatedNote) =>
            setNotes(
              notes.map((note) =>
                note.id === updatedNote.id ? updatedNote : note
              )
            )
          }
        />
      )}
    </div>
  );
}
