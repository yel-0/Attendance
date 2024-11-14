import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

// Helper function to get the week number of the month
const getWeekOfMonth = (date) => {
  const startOfMonthDate = startOfMonth(date);
  return Math.ceil((date.getDate() - startOfMonthDate.getDate() + 1) / 7);
};

// Function to calculate attendance grouped by weeks in a specific month
const calculateAttendanceByWeek = (attendances = [], month) => {
  const weeksAttendance = {};
  const year = new Date().getFullYear();

  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(startDate);

  // Initialize weeks
  for (let week = 1; week <= 4; week++) {
    weeksAttendance[`Week ${week}`] = {
      attendedCount: 0,
      totalSessions: 0,
    };
  }

  attendances.forEach(({ class_time, attended }) => {
    if (class_time && class_time.session_date) {
      const sessionDate = new Date(class_time.session_date);

      // Check if the session date is within the specified month
      if (isWithinInterval(sessionDate, { start: startDate, end: endDate })) {
        const weekOfMonth = getWeekOfMonth(sessionDate);

        // Ensure week of month is between 1 and 4
        if (weekOfMonth >= 1 && weekOfMonth <= 4) {
          const weekKey = `Week ${weekOfMonth}`;

          // Increment total sessions for the week
          weeksAttendance[weekKey].totalSessions += 1;

          // Increment attended count if attended is true
          if (attended) {
            weeksAttendance[weekKey].attendedCount += 1;
          }
        }
      }
    }
  });

  return weeksAttendance;
};

export default calculateAttendanceByWeek;
