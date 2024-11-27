import React, { useState } from 'react';
import Button from '../Common/Button';
import { GoSortAsc, GoSortDesc } from 'react-icons/go';

interface CommentFilterProps {
  onFilterChange: (filter: {
    sortBy: 'likes' | 'date' | undefined;
    order: 'ASC' | 'DESC' | undefined;
    status: 'active' | 'inactive' | undefined;
  }) => void;
}

const CommentFilter: React.FC<CommentFilterProps> = ({ onFilterChange }) => {
  const [sortByLikesOrder, setSortByLikesOrder] = useState<'ASC' | 'DESC'>(
    'DESC',
  );
  const [sortByDateOrder, setSortByDateOrder] = useState<'ASC' | 'DESC'>(
    'DESC',
  );
  const [status, setStatus] = useState<'active' | 'inactive' | undefined>(
    undefined,
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
    <div className="fixed right-2 top-[calc(5vh+40px)] bg-white dark:bg-gray-600 shadow-lg p-6 rounded-lg space-y-6 w-48 mr-12">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-white text-center">
        Filters
      </h1>

      <Button
        onClick={handleLikesSort}
        className="text-md flex items-center justify-between w-full py-2 px-4 dark:text-white dark:border-white dark:hover:border-2 text-blue-500 border border-blue-500 rounded-full hover:border-2 hover:border-blue-600"
      >
        By Likes
        {sortByLikesOrder === 'DESC' ? <GoSortDesc /> : <GoSortAsc />}
      </Button>

      <Button
        onClick={handleDateSort}
        className="text-md flex items-center justify-between w-full py-2 px-4 dark:text-white dark:border-white dark:hover:border-2 text-blue-500 border border-blue-500 rounded-full hover:border-2 hover:border-blue-600"
      >
        By Date
        {sortByDateOrder === 'DESC' ? <GoSortDesc /> : <GoSortAsc />}
      </Button>

      <Button
        onClick={handleStatusToggle}
        className="text-md flex items-center justify-between w-full py-2 px-4 dark:text-white dark:border-white dark:hover:border-2 text-blue-500 border border-blue-500 rounded-full hover:border-2 hover:border-blue-600"
      >
        Status:{' '}
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
      </Button>
    </div>
  );
};

export default CommentFilter;
