'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage({ params }) {
  const [userId, setUserId] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter(); 

  // Extract userId safely
  useEffect(() => {
    (async () => {
      const resolvedParams = await params; // Ensure params is resolved
      setUserId(resolvedParams.id);
    })();
  }, [params]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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
      // Upload file
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const { fileName } = await uploadResponse.json();

      // Update DB with the uploaded file name
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
      router.back();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Profile Image</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {message && <div className="text-green-500 mb-4">{message}</div>}
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
        Change Profile Image
      </button>
    </div>
  );
}
