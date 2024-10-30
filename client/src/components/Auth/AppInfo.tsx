import React from 'react';

const AppInfo: React.FC = () => {
  return (
    <div className="w-1/2 flex flex-col justify-center items-center bg-gray-200 p-8">
      <h1 className="text-4xl font-bold mb-4">CodeUnity</h1>
      <ul className="space-y-3 text-lg">
        <li>Share knowledge and experience</li>
        <li>Create posts and comment</li>
        <li>Rate other users&apos; posts</li>
        <li>Participate in discussions</li>
      </ul>
    </div>
  );
};

export default AppInfo;
