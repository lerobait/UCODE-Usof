import React from 'react';

const AppInfo: React.FC = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 flex-col justify-center items-center rounded-l-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-4">CodeUnity</h1>
      <ul className="space-y-3 text-xl">
        <li>🔗 Share knowledge and experience</li>
        <li>📝 Create posts and comments</li>
        <li>⭐ Rate other users&apos; posts</li>
        <li>💬 Participate in discussions</li>
      </ul>
    </div>
  );
};

export default AppInfo;
