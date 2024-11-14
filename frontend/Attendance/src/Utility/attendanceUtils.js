import {
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  format,
  getWeeksInMonth,
  parseISO,
} from "date-fns";

const calculateAttendanceByWeek = (attendance, month) => {
  const year = 2024;

  const totalWeeks = getWeeksInMonth(new Date(year, month - 1)); // Adjust for 0-based month index
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);

  // Initialize week intervals
  const weekIntervals = [];

  let weekStart = monthStart;
  let weekEnd;

  while (weekStart <= monthEnd) {
    // Calculate end of the week, ensure it does not exceed the month's end
    weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Week ends 6 days after the start
    if (weekEnd > monthEnd) weekEnd = monthEnd;

    // Add the current week interval
    weekIntervals.push({
      start: weekStart,
      end: weekEnd,
      attendances: {},
      classTimes: new Set(),
      totalClassTimes: 0, // Initialize total class times for the week
    });

    // Move to the next week
    weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() + 1); // Start from the next day after the current week's end
  }
  // console.log(weekIntervals);

  const studentIds = [
    ...new Set(attendance.map(({ student_id }) => student_id)),
  ];

  weekIntervals.forEach((interval) => {
    studentIds.forEach((id) => {
      interval.attendances[id] = {
        attendedCount: 0,
      };
    });
  });

  attendance.forEach((record) => {
    const sessionDate = parseISO(record.class_time.session_date); // Parse the session date
    const weekInterval = weekIntervals.find(({ start, end }) =>
      isWithinInterval(sessionDate, { start, end })
    );

    const { student_id, attended, class_time } = record;
    const classTimeKey = `${class_time.session_date}-${class_time.id}`;

    if (weekInterval) {
      // Track unique class times
      if (!weekInterval.classTimes.has(classTimeKey)) {
        weekInterval.classTimes.add(classTimeKey);
        weekInterval.totalClassTimes += 1;
      }

      // Increment attended count if `attended` is true or a non-zero value
      if (attended) {
        weekInterval.attendances[student_id].attendedCount += 1;
      }
    }
  });

  return weekIntervals;
};

export default calculateAttendanceByWeek;
