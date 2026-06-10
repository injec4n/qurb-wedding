'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Download } from 'lucide-react';
import { ThemeColors } from '@/types/wedding';

interface AddToCalendarProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  colors: ThemeColors;
}

type CalendarOption = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  type: 'link' | 'download';
};

function CalendarButtons({ calendarOptions, colors }: { calendarOptions: CalendarOption[]; colors: ThemeColors }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
      {calendarOptions.map((option, index) => (
        <motion.button
          key={option.name}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={option.action}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer"
          style={{
            backgroundColor: hoveredIndex === index ? colors.primary + '30' : colors.primary + '15',
            color: colors.primary,
            border: `1px solid ${hoveredIndex === index ? colors.primary + '50' : colors.primary + '25'}`,
            boxShadow: hoveredIndex === index ? `0 0 20px ${colors.primary}20` : 'none',
          }}
        >
          <option.icon className="w-4 h-4" />
          {option.name}
        </motion.button>
      ))}
    </div>
  );
}

export default function AddToCalendar({ groomName, brideName, weddingDate, weddingTime, venueName, venueAddress, colors }: AddToCalendarProps) {
  const title = `حفل زفاف ${groomName} و ${brideName}`;
  const location = venueAddress ? `${venueName} - ${venueAddress}` : venueName;
  
  // Parse date and time for calendar URLs
  const startDate = new Date(`${weddingDate}T${weddingTime || '19:00'}`);
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
  
  const formatDateForGoogle = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const formatDateForICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  // Google Calendar URL
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(`حفل زفاف ${groomName} و ${brideName}`)}`;
  
  // Outlook URL
  const outlookUrl = `https://outlook.live.com/calendar/0/action/compose?subject=${encodeURIComponent(title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&location=${encodeURIComponent(location)}&body=${encodeURIComponent(`حفل زفاف ${groomName} و ${brideName}`)}`;
  
  // ICS file for Apple Calendar
  const generateICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDateForICS(startDate)}`,
      `DTEND:${formatDateForICS(endDate)}`,
      `SUMMARY:${title}`,
      `LOCATION:${location}`,
      `DESCRIPTION:حفل زفاف ${groomName} و ${brideName}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-${groomName}-${brideName}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const calendarOptions = [
    {
      name: 'Google Calendar',
      icon: Calendar,
      action: () => window.open(googleUrl, '_blank'),
      type: 'link' as const,
    },
    {
      name: 'Apple Calendar',
      icon: Download,
      action: generateICS,
      type: 'download' as const,
    },
    {
      name: 'Outlook',
      icon: ExternalLink,
      action: () => window.open(outlookUrl, '_blank'),
      type: 'link' as const,
    },
  ];

  return (
    <div className="py-3 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto text-center"
      >
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-base sm:text-lg font-bold mb-3 font-serif"
          style={{ color: colors.text }}
        >
          أضف الموعد للتقويم
        </motion.h3>
        
        <CalendarButtons calendarOptions={calendarOptions} colors={colors} />
      </motion.div>
    </div>
  );
}
