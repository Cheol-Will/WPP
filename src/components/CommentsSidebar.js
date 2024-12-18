'use client';
import React, { useState, useEffect } from 'react';

export default function CommentsSidebar({ noteId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

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

  const toggleComments = () => {
    setIsCommentsOpen((prev) => !prev);
  }

  return (
    <div className={`flex flex-col min-h-screen p-4 bg-gray-100 text-gray-800 font-bold dark:bg-[#1F1F1F] dark:text-[#E0E0E0] dark:border-gray-100`}
      >
      
        <div className='bg-gray-100 dark:bg-[#1F1F1F] dark:text-[#E0E0E0] dark:border-gray-600'>
          {error && <div className="text-red-500">{error}</div>}
          
          <div className="flex mb-4 py-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              className="flex-1 p-2 border rounded-l dark:text-[#1F1F1F] "
            />
            <button
              onClick={addComment}
              className="bg-blue-500 text-white px-1 rounded-r hover:bg-blue-600 dark:bg-[#333333] dark:hover:bg-[#444444]"
            >
              Submit
            </button>
          </div>
          
          <ul>
            {comments.map((comment) => {
              // Format the createdAt to show only date and time up to minutes
              const formattedDate = new Intl.DateTimeFormat('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // 24-hour format
              }).format(new Date(comment.createdAt));
  
              return (
                <li key={comment.id} className="mb-4 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center space-x-4">
                      <span>{comment.content}</span>
                      <span className="text-gray-500 text-sm">{formattedDate}</span>
                    </div>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

    </div>
  );
}