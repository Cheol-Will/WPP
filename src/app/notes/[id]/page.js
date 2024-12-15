// src/app/notes/[id]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Content from '../../components/Content';
import CommentsSidebar from '../../components/CommentsSidebar';
import { useSearchParams } from 'next/navigation';

export default function NotePage({ params }) {
  const { id: noteId } = params; // Dynamic route?? ?? ID ????
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId'); // URL?? userId ????

  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(noteId);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        setError('Could not load notes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotes();
  }, [userId]);

  const updateNote = async (updatedNote) => {
    try {
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedNote.title,
          content: { value: updatedNote.content.value },
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

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        notes={notes}
        isLoading={isLoading}
        selectNote={setSelectedNoteId}
        userId={userId}
      />
      {error && <div className="error-message text-red-600 p-4">{error}</div>}
      {selectedNote && (
        <Content note={selectedNote} updateNote={updateNote} />
      )}
      {selectedNote && <CommentsSidebar noteId={selectedNote.id} />}
    </div>
  );
}
