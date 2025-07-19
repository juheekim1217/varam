import { addDays, addMonths, startOfMonth } from 'date-fns';

export const today = new Date();
export const minDateToBook = addDays(today, 2); // 2 days from today
export const maxDateToBook = addDays(today, 90); // 90 days from now
export const minMonthToBook = startOfMonth(today); // Start from the current month
export const maxMonthToBook = addMonths(today, 4); // Allow navigation up to 3 months from today

// All possible time slots
// export const allTimeSlots = [
//   '6:00 AM',
//   '7:30 AM',
//   '9:00 AM',
//   '10:30 AM',
//   '12:00 PM',
//   '1:30 PM',
//   '3:00 PM',
//   '4:30 PM',
//   '6:00 PM',
//   '7:30 PM',
// ];

// Available time slots per day of week (0 = Sunday, 1 = Monday, etc.)
export const availableSlotsByDay = {
  0: ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM'], // Sunday
  1: [], // Monday - Closed
  2: ['10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM', '7:30 PM'], // Tuesday
  3: ['10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM', '7:30 PM'], // Wednesday
  4: ['6:00 AM', '7:30 AM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM', '7:30 PM'], // Thursday
  5: ['6:00 AM', '7:30 AM', '9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM'], // Friday
  6: ['6:00 AM', '7:30 AM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM', '7:30 PM'], // Saturday
};

// Helper function to get available slots for a specific date
export const getAvailableSlotsForDate = (date) => {
  const dayOfWeek = date.getDay();
  return availableSlotsByDay[dayOfWeek] || [];
};
