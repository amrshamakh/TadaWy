import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import { useTranslation } from 'react-i18next';
import { assets } from '../../assets/assets';

export const initialChats = [
  {
    id: 1,
    doctorName: "Dr. Sarah Johnson",
    specialtyKey: "discover.specialties.Cardiology",
    lastMessage: "Your test results look good. Let's schedu...",
    time: "10:30 AM",
    unread: 2,
    avatar: assets.profileIcon,
    isDefaultAvatar: true
  },
  {
    id: 2,
    doctorName: "Dr. Michael Chen",
    specialtyKey: "discover.specialties.Dentistry",
    lastMessage: "Remember to take your medication twice daily.",
    time: "Yesterday",
    unread: 0,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=500&fit=crop"
  },
  {
    id: 3,
    doctorName: "Dr. Emily Roberts",
    specialtyKey: "discover.specialties.Ophthalmology",
    lastMessage: "I've prescribed new glasses for you.",
    time: "Wednesday",
    unread: 1,
    avatar: assets.profileIcon,
    isDefaultAvatar: true
  },
  {
    id: 4,
    doctorName: "Dr. James Wilson",
    specialtyKey: "discover.specialties.General Practice",
    lastMessage: "Please upload your latest blood work results.",
    time: "Mon",
    unread: 0,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&h=500&fit=crop"
  },
  {
    id: 5,
    doctorName: "Dr. Lisa Anderson",
    specialtyKey: "discover.specialties.Orthopedics",
    lastMessage: "Your recovery is progressing well.",
    time: "Oct 12",
    unread: 0,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=500&fit=crop"
  }
];

const initialMessagesData = {
  1: [
    {
      id: 1,
      text: "Hello! I've reviewed your recent ECG results.",
      time: "10:15 AM",
      date: "October 25, 2023",
      isSentByMe: false,
    },
    {
      id: 2,
      text: "Hi Dr. Johnson, how do they look?",
      time: "10:18 AM",
      date: "October 25, 2023",
      isSentByMe: true,
      status: "seen"
    },
    {
      id: 3,
      text: "Everything looks normal. Your heart rhythm is healthy.",
      time: "10:25 AM",
      date: "October 25, 2023",
      isSentByMe: false,
    },
    {
      id: 4,
      text: "Your test results look good. Let's schedule a follow-up in 3 months.",
      time: "10:30 AM",
      date: "October 25, 2023",
      isSentByMe: false,
    }
  ],
  2: [
    {
      id: 1,
      text: "How is your tooth ache today?",
      time: "09:00 AM",
      date: "October 24, 2023",
      isSentByMe: false,
    },
    {
      id: 2,
      text: "Much better after the painkillers, thank you.",
      time: "09:15 AM",
      date: "October 24, 2023",
      isSentByMe: true,
      status: "seen"
    },
    {
      id: 3,
      text: "Remember to take your medication twice daily.",
      time: "09:20 AM",
      date: "October 24, 2023",
      isSentByMe: false,
    }
  ],
  3: [
    {
      id: 1,
      text: "Your eye exam results are ready.",
      time: "02:00 PM",
      date: "October 18, 2023",
      isSentByMe: false,
    },
    {
      id: 2,
      text: "I've prescribed new glasses for you.",
      time: "02:05 PM",
      date: "October 18, 2023",
      isSentByMe: false,
    }
  ],
  4: [
    {
      id: 1,
      text: "Did you manage to get the lab tests done?",
      time: "11:00 AM",
      date: "October 16, 2023",
      isSentByMe: false,
    },
    {
      id: 2,
      text: "Yes, I did them this morning.",
      time: "11:30 AM",
      date: "October 16, 2023",
      isSentByMe: true,
      status: "seen"
    },
    {
      id: 3,
      text: "Please upload your latest blood work results.",
      time: "11:35 AM",
      date: "October 16, 2023",
      isSentByMe: false,
    }
  ],
  5: [
    {
      id: 1,
      text: "How is your knee feeling post-surgery?",
      time: "10:00 AM",
      date: "October 12, 2023",
      isSentByMe: false,
    },
    {
      id: 2,
      text: "It's getting stronger, less pain now.",
      time: "10:15 AM",
      date: "October 12, 2023",
      isSentByMe: true,
      status: "seen"
    },
    {
      id: 3,
      text: "Your recovery is progressing well.",
      time: "10:30 AM",
      date: "October 12, 2023",
      isSentByMe: false,
    }
  ]
};

const Messages = () => {
  const { t } = useTranslation();
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(null); // start with no active chat
  const [messagesData, setMessagesData] = useState(initialMessagesData);

  const activeChat = chats.find(c => c.id === activeChatId);
  const activeMessages = activeChatId ? (messagesData[activeChatId] || []) : [];

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    // Clear unread count when opening chat
    setChats(prev => prev.map(chat => chat.id === id ? { ...chat, unread: 0 } : chat));
  };

  const handleSendMessage = (text, attachment = null) => {
    if (!activeChatId) return;

    const now = new Date();
    let timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create English date string explicitly for grouping
    const dateString = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const newMessage = {
      id: Date.now(),
      text,
      time: timeString,
      date: dateString,
      isSentByMe: true,
      status: "sent", // Newly sent message is unseen initially
      attachment: attachment
    };

    setMessagesData(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full bg-white dark:bg-[#0F172A] overflow-hidden border border-gray-100 dark:border-[#1E293B] shadow-sm">
      <ChatSidebar 
        chats={chats} 
        activeChatId={activeChatId} 
        onSelectChat={handleSelectChat} 
      />
      <ChatArea 
        activeChat={activeChat} 
        messages={activeMessages} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
};

export default Messages;
