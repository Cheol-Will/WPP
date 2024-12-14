'use client';
import React, { useState, useEffect } from 'react';

export default function CommentsSidebar({ noteId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`/api/comments?noteId=${noteId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Could not load comments.');
      }
    }

    if (noteId) {
      fetchComments();
    }
  }, [noteId]);

  const addComment = async () => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment, noteId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const comment = await response.json();
      setComments((prev) => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Could not add comment.');
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/comments?commentId=${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Could not delete comment.');
    }
  };

  return (
    <div className="w-128 bg-gray-100 p-4 text-gray-700 font-bold border-r border-gray-300">
        <h3 className="font-bold mb-4">Comments</h3>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex mb-4">
            <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="flex-1 p-2 border rounded-l"
            />
        <button
            onClick={addComment}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
        Submit
        </button>
      </div>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="mb-2">
            <div className="flex justify-between">
              <span>{comment.content}</span>
              <button
                onClick={() => deleteComment(comment.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
