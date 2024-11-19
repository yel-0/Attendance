import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DatePickerDemo = () => {
  const {
    year: pickYear,
    month: pickMonth,
    day: pickDay,
    classId,
  } = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  // Set initial value for the date input based on URL params or today's date
  useEffect(() => {
    if (pickYear && pickMonth && pickDay) {
      setSelectedDate(
        `${pickYear}-${String(pickMonth).padStart(2, "0")}-${String(
          pickDay
        ).padStart(2, "0")}`
      );
    } else {
      const today = new Date();
      setSelectedDate(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(today.getDate()).padStart(2, "0")}`
      );
    }
  }, [pickYear, pickMonth, pickDay]);

  // Handle date change and navigate to the corresponding URL
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);

    const [year, month, day] = selectedDate.split("-");
    navigate(`/attendance/${classId}/${year}/${month}/${day}`);
  };

  return (
    <div>
      <input
        id="datePicker"
        type="date"
        className="w-[280px] px-4 py-2 border border-gray-300 rounded-lg"
        onChange={handleDateChange}
        value={selectedDate}
      />
    </div>
  );
};

export default DatePickerDemo;
