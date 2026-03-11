import React from 'react';
import { MapPin, Grid, List } from 'lucide-react';

const SearchFilters = ({ 
  searchQuery, 
  setSearchQuery,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedRating,
  setSelectedRating,
  selectedLocation,
  setSelectedLocation,
  viewMode,
  setViewMode,
  specialties,
  ratings,
  locations
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clinics, doctors, specialties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Specialty Filter */}
        <div className="flex-1 min-w-50">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full px-4 py-2 border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 "
          >
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="flex-1 min-w-[200px]">
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            {ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="flex-1 min-w-[200px]">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid' 
                ? 'bg-teal-500 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            } transition-colors`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list' 
                ? 'bg-teal-500 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            } transition-colors`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Location Indicator */}
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
        <MapPin className="w-4 h-4" />
        <span>City, Town</span>
      </div>
    </div>
  );
};

export default SearchFilters;