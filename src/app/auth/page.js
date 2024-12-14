'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false); // 회원가입 폼 여부
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async () => {
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'An error occurred');
        return;
      }

      setMessage(data.message || 'Success!');

      if (!isRegister) {
        // 로그인 성공 시 노트 페이지로 리디렉션
        router.push(`/notes?userId=${data.user.id}`);
      } else {
        // 회원가입 성공 후 로그인 화면으로 전환
        setIsRegister(false);
        setMessage('Registration successful! Please log in.');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setMessage('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-96 p-8 bg-white border border-gray-300 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Note App</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={handleAuth}
            className="w-full px-4 py-2 text-white bg-black rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
          <p className="text-sm text-center">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage('');
              }}
            >
              {isRegister ? 'Login' : 'Register'}
            </span>
          </p>
          {message && <p className="text-red-500 text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
}
