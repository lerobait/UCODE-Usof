// CommentFilter.tsx
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
    <div className="fixed right-2 top-[calc(5vh+40px)] bg-white shadow-lg p-6 rounded-lg space-y-6 w-48 border border-gray-200 mr-12">
      <h2 className="text-xl font-semibold text-gray-800">Comment Filters</h2>

      <Button
        onClick={handleLikesSort}
        className="flex items-center justify-between w-full bg-blue-500 text-white py-2 px-4 rounded-md border border-blue-700 hover:bg-blue-600 transition-colors"
      >
        By Likes
        {sortByLikesOrder === 'DESC' ? <GoSortDesc /> : <GoSortAsc />}
      </Button>

      <Button
        onClick={handleDateSort}
        className="flex items-center justify-between w-full bg-green-500 text-white py-2 px-4 rounded-md border border-green-700 hover:bg-green-600 transition-colors"
      >
        By Date
        {sortByDateOrder === 'DESC' ? <GoSortDesc /> : <GoSortAsc />}
      </Button>

      <Button
        onClick={handleStatusToggle}
        className="w-full bg-gray-500 text-white py-2 px-4 rounded-md border border-gray-700 hover:bg-gray-600 transition-colors"
      >
        Status:{' '}
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
      </Button>
    </div>
  );
};

export default CommentFilter;
