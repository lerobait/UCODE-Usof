import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import CategoryItem from '../components/Categories/CategoryItem';
import CategoryPostsList from '../components/Categories/CategoryPostList';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

const CategoryPosts: React.FC = () => {
  const { id } = useParams<Record<string, string>>();
  const [searchText, setSearchText] = useState('');

  const categoryId = id ? parseInt(id, 10) : 0;

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Header onSearch={handleSearch} />
      <div className="flex flex-grow pt-16">
        <div className="sticky top-16 w-64">
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col pl-8 pr-4">
          <div className="w-full mx-auto pl-20 pr-80">
            <CategoryItem categoryId={categoryId} />
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
