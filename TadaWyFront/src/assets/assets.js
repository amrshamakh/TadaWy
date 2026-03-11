import calenderIcon from './calender.svg';
import logo from './TadaWy.svg';
import notificationIcon from './notification.svg';
import profileIcon from './profile.svg';
import profileIcon1 from './profileIcon1.svg';
import searchIcon from './search.svg';
import homeIcon from './home.svg';
import settingIcon from './setting.svg';
import logoutIcon from './logOut.svg';
import medicalIcon from './medical.svg';
import medical1Icon from './medical1.svg';
import allergylIcon from './allergy.svg';
import emergencyIcon from './EmergencyContact.svg';
import sunIcon from './apperance.svg';
import nightIcon from './night.svg';
import infoIcon from './protect.svg';
import languageIcon from './language.svg';
import container from './container.jpeg';
import brainIcon from './brain.svg';





export const assets = {
    calenderIcon,
    logo,
    notificationIcon,
    profileIcon,
    profileIcon1,
    searchIcon,
    homeIcon,
    settingIcon,
    logoutIcon,
    medicalIcon,
    medical1Icon,
    allergylIcon,
    emergencyIcon,
    sunIcon,
    nightIcon,
    infoIcon,
    languageIcon,
    brainIcon,
    container



}
export const clinicsData = [
  {
    id: 1,
    name: "Heart Care Center",
    doctor: "Dr. Sarah Johnson",
    rating: 4.8,
    specialty: "Cardiology",
    address: "123 Medical Plaza, Downtown",
    phone: "+1 (555) 123-4587",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&h=300&fit=crop"
  },
  {
    id: 2,
    name: "City Orthopedic Clinic",
    doctor: "Dr. James Williams",
    rating: 4.6,
    specialty: "Orthopedics",
    address: "456 Health Street, Midtown",
    phone: "+1 (555) 234-5678",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Dental Excellence",
    doctor: "Dr. Michael Chen",
    rating: 4.9,
    specialty: "Dentistry",
    address: "789 Smile Avenue, Uptown",
    phone: "+1 (555) 345-6789",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Vision Care Institute",
    doctor: "Dr. Emily Brown",
    rating: 4.7,
    specialty: "Ophthalmology",
    address: "321 Eye Street, Central",
    phone: "+1 (555) 456-7890",
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=500&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Skin Health Clinic",
    doctor: "Dr. David Lee",
    rating: 4.5,
    specialty: "Dermatology",
    address: "654 Beauty Boulevard, Westside",
    phone: "+1 (555) 567-8901",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=300&fit=crop"
  },
  {
    id: 6,
    name: "Family Medicine Center",
    doctor: "Dr. Lisa Anderson",
    rating: 4.8,
    specialty: "General Practice",
    address: "987 Family Lane, Eastside",
    phone: "+1 (555) 678-9012",
    image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&h=300&fit=crop"
  },
  {
    id: 7,
    name: "Pediatric Care Plus",
    doctor: "Dr. Robert Martinez",
    rating: 4.9,
    specialty: "Pediatrics",
    address: "147 Kids Avenue, Northside",
    phone: "+1 (555) 789-0123",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500&h=300&fit=crop"
  },
  {
    id: 8,
    name: "Women's Health Center",
    doctor: "Dr. Jennifer Taylor",
    rating: 4.7,
    specialty: "Gynecology",
    address: "258 Wellness Road, Southside",
    phone: "+1 (555) 890-1234",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500&h=300&fit=crop"
  },
  {
    id: 9,
    name: "Mental Wellness Clinic",
    doctor: "Dr. Thomas White",
    rating: 4.6,
    specialty: "Psychiatry",
    address: "369 Peace Street, Harbor",
    phone: "+1 (555) 901-2345",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&h=300&fit=crop"
  },
  {
    id: 10,
    name: "NeuroHealth Institute",
    doctor: "Dr. Patricia Garcia",
    rating: 4.8,
    specialty: "Neurology",
    address: "741 Brain Avenue, Medical District",
    phone: "+1 (555) 012-3456",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=500&h=300&fit=crop"
  },
  {
    id: 11,
    name: "Respiratory Care Center",
    doctor: "Dr. Christopher Moore",
    rating: 4.5,
    specialty: "Pulmonology",
    address: "852 Breath Lane, Health Park",
    phone: "+1 (555) 123-4560",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=300&fit=crop"
  },
  {
    id: 12,
    name: "Digestive Health Clinic",
    doctor: "Dr. Amanda Lewis",
    rating: 4.7,
    specialty: "Gastroenterology",
    address: "963 Wellness Plaza, City Center",
    phone: "+1 (555) 234-5601",
    image: "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=500&h=300&fit=crop"
  }
];

export const specialties = [
  "All Specialties",
  "Cardiology",
  "Orthopedics",
  "Dentistry",
  "Ophthalmology",
  "Dermatology",
  "General Practice",
  "Pediatrics",
  "Gynecology",
  "Psychiatry",
  "Neurology",
  "Pulmonology",
  "Gastroenterology"
];

export const ratings = [
  "All Ratings",
  "4.5+",
  "4.0+",
  "3.5+",
  "3.0+"
];

export const locations = [
  "All Locations",
  "Downtown",
  "Midtown",
  "Uptown",
  "Central",
  "Westside",
  "Eastside",
  "Northside",
  "Southside",
  "Harbor",
  "Medical District",
  "Health Park",
  "City Center"
];