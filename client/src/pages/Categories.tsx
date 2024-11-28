import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import CategoriesList from '../components/Categories/CategoryList';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Sidebar from '../components/Sidebar/Sidebar';
import CategoryCreate from '../components/Categories/CategoryCreate';
import Snackbar from '@mui/joy/Snackbar';
import { SiTicktick } from 'react-icons/si';

const Categories: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [key, setKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('User is not authenticated');
    }
  }, []);

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

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const handleCategoryCreated = () => {
    setKey((prevKey) => prevKey + 1);
    setSnackbarMessage('Category created successfully!');
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative flex min-h-screen bg-gray-100 dark:bg-gray-400">
      <Header onSearch={handleSearch} toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow pt-16">
        {isSidebarOpen && (
          <div
            role="button"
            tabIndex={0}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={toggleSidebar}
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
        <div className="flex-grow flex flex-col md:pl-10 md:pr-10">
          <div className="flex flex-wrap items-center justify-between mt-8">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-white">
              Categories
            </h1>
            <div className="mt-4 md:mt-0">
              <CategoryCreate onCategoryCreated={handleCategoryCreated} />
            </div>
          </div>
          <CategoriesList key={key} searchText={searchText} />
        </div>
        <ScrollToTop />
      </div>

      <Snackbar
        variant="solid"
        color="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        onClose={handleSnackbarClose}
        startDecorator={<SiTicktick />}
        autoHideDuration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </div>
  );
};

export default Categories;
