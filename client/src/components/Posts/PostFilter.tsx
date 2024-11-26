import React, { useState } from 'react';
import { GoSortAsc, GoSortDesc } from 'react-icons/go';
import Button from '../Common/Button';

interface PostFilterProps {
  onFilterChange: (filter: {
    sortBy: 'likes' | 'date' | undefined;
    order: 'ASC' | 'DESC' | undefined;
    status?: 'active' | 'inactive' | undefined;
  }) => void;
}

const PostFilter: React.FC<PostFilterProps> = ({ onFilterChange }) => {
  const [sortByLikesOrder, setSortByLikesOrder] = useState<'ASC' | 'DESC'>(
    'DESC'
  );
  const [sortByDateOrder, setSortByDateOrder] = useState<'ASC' | 'DESC'>(
    'DESC'
  );
  const [status, setStatus] = useState<'active' | 'inactive' | undefined>(
    undefined
  );

  const handleLikesSort = () => {
    const newOrder = sortByLikesOrder === 'DESC' ? 'ASC' : 'DESC';
    setSortByLikesOrder(newOrder);
    onFilterChange({ sortBy: 'likes', order: newOrder, status });
  };

  const handleDateSort = () => {
    const newOrder = sortByDateOrder === 'DESC' ? 'ASC' : 'DESC';
    setSortByDateOrder(newOrder);
    onFilterChange({ sortBy: 'date', order: newOrder, status });
  };

  const handleStatusToggle = () => {
    const newStatus =
      status === 'active'
        ? 'inactive'
        : status === 'inactive'
        ? undefined
        : 'active';
    setStatus(newStatus);
    onFilterChange({ sortBy: undefined, order: undefined, status: newStatus });
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg border">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">
        Filters
      </h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap md:flex-row md:flex-wrap lg:flex-col lg:gap-2">
        <Button
          onClick={handleLikesSort}
          className="w-full sm:w-auto text-md flex items-center justify-between py-2 px-4 text-blue-500 border border-blue-500 rounded-full hover:border-2 hover:border-blue-600"
        >
          By Likes
          {sortByLikesOrder === 'DESC' ? <GoSortDesc /> : <GoSortAsc />}
        </Button>
        <Button
          onClick={handleDateSort}
          className="w-full sm:w-auto text-md flex items-center justify-between py-2 px-4 text-blue-500 border border-blue-500 rounded-full hover:border-2 hover:border-blue-600"
        >
          By Date
          {sortByDateOrder === 'DESC' ? <GoSortDesc /> : <GoSortAsc />}
        </Button>
        <Button
          onClick={handleStatusToggle}
          className="w-full sm:w-auto text-md flex items-center justify-between py-2 px-4 text-blue-500 border border-blue-500 rounded-full hover:border-2 hover:border-blue-600"
        >
          Status: {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
        </Button>
      </div>
    </div>
  );  
};

export default PostFilter;
