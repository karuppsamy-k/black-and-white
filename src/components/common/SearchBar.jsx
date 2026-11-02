import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Reusable Search Bar Component
 */
export const SearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition shadow-sm"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 p-1 rounded-md text-gray-400 hover:text-gray-600 transition"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
