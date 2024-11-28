import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import CategoryItem from '../components/Categories/CategoryItem';
import CategoryPostsList from '../components/Categories/CategoryPostList';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

const CategoryPosts: React.FC = () => {
  const { id } = useParams<Record<string, string>>();
  const [searchText, setSearchText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoryId = id ? parseInt(id, 10) : 0;

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-400">
      <Header onSearch={handleSearch} toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow pt-16">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={toggleSidebar}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleSidebar();
              }
            }}
          ></div>
        )}
        <div
          className={`fixed left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 md:top-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0`}
        >
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col">
          <div className="w-full mx-auto md:pl-10 md:pr-10">
            <CategoryItem categoryId={categoryId.toString()} />
            <CategoryPostsList
              categoryId={categoryId}
              searchText={searchText}
            />
          </div>
          <ScrollToTop />
        </div>
      </div>
    </div>
  );
};

export default CategoryPosts;
