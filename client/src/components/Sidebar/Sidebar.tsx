import React from 'react';
import Button from '../Common/Button';

const Sidebar: React.FC = () => {
  return (
    <aside className="sticky top-16 h-[940px] bg-white shadow-lg flex flex-col p-4 w-64">
      <div className="flex-grow overflow-y-auto space-y-4">
        <Button className="w-full text-left font-semibold text-gray-700 hover:bg-gray-200 py-2 px-4 rounded">
          Trends
        </Button>
        <Button className="w-full text-left font-semibold text-gray-700 hover:bg-gray-200 py-2 px-4 rounded">
          Categories
        </Button>
        <Button className="w-full text-left font-semibold text-gray-700 hover:bg-gray-200 py-2 px-4 rounded">
          My Posts
        </Button>
        <Button className="w-full text-left font-semibold text-gray-700 hover:bg-gray-200 py-2 px-4 rounded">
          Favorites
        </Button>
        <Button className="w-full text-left font-semibold text-gray-700 hover:bg-gray-200 py-2 px-4 rounded">
          All Users
        </Button>
      </div>

      <div className="pt-4">
        <Button className="w-full text-left font-semibold text-gray-700 hover:bg-gray-200 py-2 px-4 rounded">
          Settings
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
