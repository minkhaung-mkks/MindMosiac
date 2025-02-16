// src/pages/CommunityPage.jsx
import React, { useState, useEffect } from "react";
import "../styles/community.css";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUserStore } from "../store";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
const resources = [
  {
    name: "Dr. Marven",
    hours: "09:00 - 17:30",
    img: "https://static.vecteezy.com/system/resources/thumbnails/041/408/858/small_2x/ai-generated-a-smiling-doctor-with-glasses-and-a-white-lab-coat-isolated-on-transparent-background-free-png.png",
    address: "1xxx, soi 2, sukumvit",
    specialities: ["Depression", "General"],
  },
  {
    name: "Dr. Alice",
    hours: "10:00 - 16:00",
    img: "https://images.theconversation.com/files/304957/original/file-20191203-66986-im7o5.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=926&fit=clip",
    address: "5xxx, soi 4, sukumvit",
    specialities: ["Trauma", "Sexuality"],
  },
  {
    name: "Dr. Robert",
    hours: "08:00 - 14:00",
    img: "https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg",
    address: "8xxx, soi 8, sukumvit",
    specialities: ["Addiction", "Relationship"],
  },
  {
    name: "Dr. Emily",
    hours: "11:00 - 19:00",
    img: "https://www.findablackdoctor.com/wp-content/themes/fabd/src/assets/hp-hero.jpg",
    address: "2xxx, soi 3, sukumvit",
    specialities: ["General"],
  },
];

const CommunityPage = () => {
  const [searchedSpecialities, setSearchedSpecialities] = useState([]);
  const [safeCards, setSafeCards] = useState([
    "I feel bad about not doing my school work but can’t find motivation.",
    "I do not feel loved by my parents.",
  ]);
  const [showInput, setShowInput] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [newPost, setNewPost] = useState("");

  // Get the logged-in user from your Zustand store
  const { user, setUser } = useUserStore();

  const filters = [
    "Depression",
    "Sexuality",
    "Trauma",
    "Relationship",
    "General",
    "Addiction",
  ];

  const toggleFilter = (filter) => {
    setSearchedSpecialities((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  const filteredResources = resources.filter((resource) => {
    if (searchedSpecialities.length === 0) return true;
    return resource.specialities.some((speciality) =>
      searchedSpecialities.includes(speciality)
    );
  });

  const addSafeCard = () => {
    if (newPost.trim()) {
      setSafeCards([...safeCards, newPost.trim()]);
      setNewPost("");
      setShowInput(false);
    }
  };

  const handleTherapistClick = (resource) => {
    setSelectedTherapist(resource);
    setShowBookingModal(true);
  };

  // Helper function: Generate time slots (30-minute increments) within the consultation hours.
  const generateTimeSlots = (hours) => {
    console.log(hours)
    // "9:00 - 5:30" → split into start and end times
    const [startStr, endStr] = hours.split(" - ");
    // Parse times using dayjs. (Assume times are in "H:mm" format.)
    console.log(startStr)
    console.log(endStr)
    const start = dayjs(startStr, "HH:mm");
    const end = dayjs(endStr, "HH:mm");
    console.log("Parsed Start:", start.format("HH:mm"));
    console.log("Parsed End:", end.format("HH:mm"));
    console.log(start)
    console.log(end)
    let slots = [];
    let current = start;
    while (current.isBefore(end) || current.isSame(end)) {
      slots.push(current.format("HH:mm"));
      current = current.add(30, "minute");
    }
    console.log(slots)
    return slots;
  };

  // When the booking modal opens, set a default time based on the therapist's hours.
  useEffect(() => {
    if (showBookingModal && selectedTherapist) {
      const slots = generateTimeSlots(selectedTherapist.hours);
      if (slots.length > 0) {
        setSelectedTime(slots[0]);
      }
    }
  }, [showBookingModal, selectedTherapist]);

  const handleBooking = () => {
    if (!bookingDate || !selectedTime) return;
    // Combine the chosen date and time into one Date object.
    const [hour, minute] = selectedTime.split(":").map(Number);
    const combinedDateTime = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate(),
      hour,
      minute
    );

    const booking = {
      bookingId: Math.random().toString(36).substr(2, 9),
      therapist: selectedTherapist,
      bookingDate: combinedDateTime.toISOString(),
    };

    // Save booking to localStorage under 'bookings'
    const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    existingBookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(existingBookings));

    // Also update the user's personal therapist info in localStorage
    if (user) {
      let updatedUser = { ...user };
      if (!updatedUser.personalTherapists) {
        updatedUser.personalTherapists = [];
      }
      const exists = updatedUser.personalTherapists.some(
        (t) => t.name === selectedTherapist.name
      );
      if (!exists) {
        updatedUser.personalTherapists.push(selectedTherapist);
      }
      setUser(updatedUser);
      localStorage.setItem("user-storage", JSON.stringify(updatedUser));
    }

    alert(
      `You have booked a session with ${selectedTherapist.name} on ${combinedDateTime.toLocaleString()}`
    );
    setShowBookingModal(false);
    setSelectedTherapist(null);
  };

  return (
    <div className="community_page">
      <div className="community_space">
        <div className="safe_space">
          <h3>The safe space</h3>
          <button className="add_btn" onClick={() => setShowInput(!showInput)}>
            <svg
              className="add_btn_svg"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          {showInput && (
            <div className="safe_input">
              <input
                type="text"
                placeholder="Share your thoughts..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addSafeCard();
                }}
              />
              <button onClick={addSafeCard}>Post</button>
            </div>
          )}
          {safeCards.map((text, index) => (
            <div className="safe_cards" key={index}>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="suggestion_space mobile_only">
          <h3>Trending mental health resources</h3>
          <Link
            to="https://www.healthline.com/health/depression/how-to-fight-depression"
            className="resource_card"
          >
            <img
              src="https://clearbehavioralhealth.com/wp-content/uploads/2024/09/depression-symptoms.jpg"
              alt=""
            />
            <div className="resource_info">
              <h2>Dealing with depression.</h2>
              <p>
                Personal reflection, meditation and various other methods that
                you can use.
              </p>
            </div>
          </Link>
          <div className="resource_card">
            <img
              src="https://static.bandainamcoent.eu/high/dark-souls/dark-souls-3/00-page-setup/ds3_game-thumbnail.jpg"
              alt=""
            />
            <Link
              to="https://www.theringer.com/2021/05/13/video-games/dark-souls-sequels-gaming-in-pandemic"
              className="resource_info"
            >
              <h2>Don't you dare go hollow.</h2>
              <p>
                How the Ultra-Challenging ‘Dark Souls’ Became a Pandemic Balm.
              </p>
            </Link>
          </div>
          <Link
            to="https://medium.com/never-stop-writing/why-love-and-sexuality-are-often-kept-separate-in-asian-culture-ab05b3fb7418"
            className="resource_card"
          >
            <img
              src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*JlEUKbZuD-t9dT0RCOnB3w.jpeg"
              alt=""
            />
            <div className="resource_info">
              <h2>Sexuality and Love in Asian Culture.</h2>
              <p>
                As an Asian, I’ve noticed that many people in Asian countries
                write a lot of poems and stories about love but hesitate to speak
                about sexuality.
              </p>
            </div>
          </Link>
        </div>
        <div className="resource_center">
          <div className="resource_filters">
            <h3>Mental Help Centers</h3>
            {filters.map((filter) => (
              <div
                key={filter}
                className={`filter ${
                  searchedSpecialities.includes(filter) ? "ActiveFilter" : ""
                }`}
                onClick={() => toggleFilter(filter)}
              >
                <div className="filter_block"></div>
                <p>{filter}</p>
              </div>
            ))}
          </div>
          <div className="resources_box">
            {filteredResources.map((resource, index) => (
              <div
                onClick={() => handleTherapistClick(resource)}
                className="resource_card"
                key={index}
              >
                <img src={resource.img} alt={resource.name} />
                <div className="resource_info">
                  <h2>{resource.name}</h2>
                  <p>Consultation hours: {resource.hours}</p>
                  <p>{resource.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="suggestion_space">
        <h3>Trending mental health resources</h3>
        <Link
          to="https://www.healthline.com/health/depression/how-to-fight-depression"
          className="resource_card"
        >
          <img
            src="https://clearbehavioralhealth.com/wp-content/uploads/2024/09/depression-symptoms.jpg"
            alt=""
          />
          <div className="resource_info">
            <h2>Dealing with depression.</h2>
            <p>
              Personal reflection, meditation and various other methods that you
              can use.
            </p>
          </div>
        </Link>
        <div className="resource_card">
          <img
            src="https://static.bandainamcoent.eu/high/dark-souls/dark-souls-3/00-page-setup/ds3_game-thumbnail.jpg"
            alt=""
          />
          <Link
            to="https://www.theringer.com/2021/05/13/video-games/dark-souls-sequels-gaming-in-pandemic"
            className="resource_info"
          >
            <h2>Don't you dare go hollow.</h2>
            <p>
              How the Ultra-Challenging ‘Dark Souls’ Became a Pandemic Balm.
            </p>
          </Link>
        </div>
        <Link
          to="https://medium.com/never-stop-writing/why-love-and-sexuality-are-often-kept-separate-in-asian-culture-ab05b3fb7418"
          className="resource_card"
        >
          <img
            src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*JlEUKbZuD-t9dT0RCOnB3w.jpeg"
            alt=""
          />
          <div className="resource_info">
            <h2>Sexuality and Love in Asian Culture.</h2>
            <p>
              As an Asian, I’ve noticed that many people in Asian countries write a
              lot of poems and stories about love but hesitate to speak about
              sexuality.
            </p>
          </div>
        </Link>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedTherapist && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Book a session with {selectedTherapist.name}</h3>
            <p>Select a date:</p>
            <DatePicker
              selected={bookingDate}
              onChange={(date) => setBookingDate(date)}
              dateFormat="MMMM d, yyyy"
            />
            <p>Select a time:</p>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {selectedTherapist &&
                generateTimeSlots(selectedTherapist.hours).map((slot, idx) => (
                  <option key={idx} value={slot}>
                    {slot}
                  </option>
                ))}
            </select>
            <button onClick={handleBooking}>Book Session</button>
            <button onClick={() => setShowBookingModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
