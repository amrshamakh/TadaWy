import React from 'react';
import ClinicCard from './ClinicCard';

const ClinicGrid = ({ clinics, onBookAppointment, viewMode }) => {
  if (clinics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No clinics found matching your criteria.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'flex flex-col gap-4'
    }>
      {clinics.map((clinic) => (
        <ClinicCard 
          key={clinic.id} 
          clinic={clinic} 
          onBookAppointment={onBookAppointment}
        />
      ))}
    </div>
  );
};

export default ClinicGrid;