import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/Calendar.css"; // Import CSS file

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Load bookings from localStorage (stored by the booking functionality)
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
  }, []);

  const daysInMonth = currentMonth.daysInMonth();
  const startDay = currentMonth.startOf("month").day();

  const changeMonth = (offset) => {
    setCurrentMonth(currentMonth.add(offset, "month"));
  };

  const getBookingsForDay = (date) => {
    // Filter bookings that occur on the same day
    return bookings.filter((booking) =>
      dayjs(booking.bookingDate).isSame(date, "day")
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)} className="nav-btn">
          <ChevronLeft size={20} />
        </button>
        <h2>{currentMonth.format("MMMM YYYY")}</h2>
        <button onClick={() => changeMonth(1)} className="nav-btn">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="calendar-grid calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="calendar-grid">
        {/* Empty cells for days from previous month */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="empty-cell"></div>
        ))}

        {/* Render each day of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = currentMonth.date(index + 1);
          const dayBookings = getBookingsForDay(date);
          return (
            <div key={date} className="calendar-day">
              <span className="date-number">{date.date()}</span>
              {/* Display each booking for the day */}
              {dayBookings.map((booking, i) => (
                <div key={i} className="booking-event">
                  <span className="booking-therapist">
                    {booking.therapist?.name || "Therapist"}
                  </span>
                  <span className="booking-time">
                    {dayjs(booking.bookingDate).format("h:mm A")}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
