import { format, addMonths, startOfMonth } from "date-fns";

// Convert numeric month (1-12) to a Date object for a given year or the current year
const monthNumberToDate = (monthNumber, year = new Date().getFullYear()) => {
  return startOfMonth(new Date(year, monthNumber - 1)); // Months are 0-based in JS Date
};

// Generate list of month names between startMonth and endMonth without year
const getMonthsInRange = (startMonthNumber, endMonthNumber, year) => {
  if (
    !startMonthNumber ||
    !endMonthNumber ||
    startMonthNumber > endMonthNumber
  ) {
    return []; // Return an empty array if parameters are not valid
  }

  const months = [];
  const startDate = monthNumberToDate(startMonthNumber, year);
  const endDate = monthNumberToDate(endMonthNumber, year);

  let currentDate = startDate;
  while (currentDate <= endDate) {
    months.push(format(currentDate, "MMMM"));
    currentDate = addMonths(currentDate, 1);
  }

  return months;
};

export default getMonthsInRange;
