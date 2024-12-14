// src/app/layout.js

import './globals.css';

export const metadata = {
  title: 'Notion Clone',
  description: 'A Notion-like application built with Next.js 13',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="w-full h-screen overflow-x-hidden">{children}</body>
    </html>
  );
}
