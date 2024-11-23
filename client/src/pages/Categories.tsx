import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import CategoriesList from '../components/Categories/CategoryList';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Sidebar from '../components/Sidebar/Sidebar';
import CategoryCreate from '../components/Categories/CategoryCreate';

const Categories: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [key, setKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('User is not authenticated');
    }
  }, []);

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const handleCategoryCreated = () => {
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Header onSearch={handleSearch} />
      <div className="flex flex-grow pt-16">
        <div className="sticky top-16 w-64">
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col pl-20 pr-20">
          <div className="flex-grow w-full mx-auto pl-10 pr-10 rounded-lg flex flex-col">
            <div className="flex items-center justify-between mt-8">
              <h1 className="text-4xl font-bold text-blue-500">Categories</h1>
              <CategoryCreate onCategoryCreated={handleCategoryCreated} />
            </div>
            <CategoriesList key={key} searchText={searchText} />
          </div>
          <ScrollToTop />
        </div>
      </div>
    </div>
  );
};

export default Categories;
