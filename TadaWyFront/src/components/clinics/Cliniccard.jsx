import React from 'react';
import { Star, MapPin, Phone } from 'lucide-react';

const ClinicCard = ({ clinic, onBookAppointment }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Clinic Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={clinic.image} 
          alt={clinic.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Clinic Info */}
      <div className="p-4">
        {/* Clinic Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {clinic.name}
        </h3>

        {/* Doctor Name */}
        <p className="text-sm text-gray-600 mb-2">{clinic.doctor}</p>

        {/* Rating and Specialty */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{clinic.rating}</span>
          </div>
          <span className="text-sm text-gray-500">• {clinic.specialty}</span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-600">{clinic.address}</p>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
          <p className="text-sm text-gray-600">{clinic.phone}</p>
        </div>

        {/* Book Appointment Button */}
        <button 
          onClick={() => onBookAppointment(clinic)}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default ClinicCard;