This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
# Core Features

## 회원가입 및 로그인
- 사용자 인증 구현 (로그인, 회원가입, 로그아웃)
- **`auth/page.js`**에서 상태(state) 관리 및 POST 요청 처리
- 데이터베이스를 통해 사용자 정보 저장 및 확인
- 로그아웃 시 Local Storage 삭제 및 리다이렉트

## 노트 추가 및 삭제
- 노트 생성, 수정, 삭제 기능
- 노트 데이터는 데이터베이스에 저장
- **`src/app/notes/page.js`** 및 **`Sidebar.js`**에서 노트 렌더링
- 삭제 시 연관된 데이터 자동 삭제 (Cascading)

# Additional Features

## 노트 즐겨찾기 (Toggle Favorite)
- 별표 버튼으로 즐겨찾기 설정/해제
- 즐겨찾기 여부에 따른 노트 정렬 및 렌더링

## 테마 및 폰트 변경
- 다크 모드/라이트 모드 전환
- 폰트 선택 기능
- **`globals.css`**와 **`FontSelector`**에서 구현

## 댓글 기능
- 노트에 대한 댓글 추가, 수정, 삭제
- 댓글은 날짜와 함께 저장 및 렌더링

## 음악 업로드 및 재생
- 파일 업로드 후 로컬 파일 시스템에 저장
- 음악 재생, 일시정지, 리셋 기능
- **`react-audio-player`**를 활용한 구현

## 검색 기능
- 키워드 기반 노트 검색
- 검색 키워드 하이라이트 기능 (`<mark>` 태그 사용)

## 프로필 이미지 변경
- 프로필 사진 업로드 및 변경
- 파일 시스템에 저장 후 사이드바에 반영

# Technology Stack
- **Frontend:** React, Next.js
- **Backend:** Node.js, Prisma
- **Database:** PostgreSQL
- **Styling:** CSS Modules

# Project Structure
- **`src/app/auth`**: 사용자 인증 관련 로직
- **`src/app/notes`**: 노트 관리 기능
- **`src/app/search`**: 검색 기능 구현
- **`src/components`**: 각종 공통 컴포넌트
