import React, { useState } from "react";
import "../styles/community.css";
import { Link } from "react-router-dom";
const resources = [
  {
    name: "Dr. Marven",
    hours: "9:00 - 5:30",
    img: "https://static.vecteezy.com/system/resources/thumbnails/041/408/858/small_2x/ai-generated-a-smiling-doctor-with-glasses-and-a-white-lab-coat-isolated-on-transparent-background-free-png.png",
    address: "1xxx, soi 2, sukumvit",
    specialities: ["Depression", "General"],
  },
  {
    name: "Dr. Alice",
    hours: "10:00 - 4:00",
    img: "https://images.theconversation.com/files/304957/original/file-20191203-66986-im7o5.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=926&fit=clip",
    address: "5xxx, soi 4, sukumvit",
    specialities: ["Trauma", "Sexuality"],
  },
  {
    name: "Dr. Robert",
    hours: "8:00 - 2:00",
    img: "https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg",
    address: "8xxx, soi 8, sukumvit",
    specialities: ["Addiction", "Relationship"],
  },
  {
    name: "Dr. Emily",
    hours: "11:00 - 7:00",
    img: "https://www.findablackdoctor.com/wp-content/themes/fabd/src/assets/hp-hero.jpg",
    address: "2xxx, soi 3, sukumvit",
    specialities: ["General"],
  },
];

const timeslots = [
  "9:00 - 10:00",
  "10:00 - 11:00",
  "1:00 - 2:00 PM",
  "2:00 - 3:00 PM",
  "3:00 - 4:00 PM",
  "6:00 - 7:00 PM",
  "7:00 - 8:00 PM ( online )",
  "8:00 - 9:00 PM ( online )",
];
const CommunityPage = () => {
  const [searchedSpecialities, setSearchedSpecialities] = useState([]);

  const filters = [
    "Depression",
    "Sexuality",
    "Trauma",
    "Relationship",
    "General",
    "Addiction",
  ];
  const [safeCards, setSafeCards] = useState([
    "I feel bad about not doing my school work but can’t find motivation.",
    "I do not feel loved by my parents.",
    // "I do not feel attraction to anyone.",
  ]);
  const [showInput, setShowInput] = useState(false);
  const [showTimeslot, setShowTimeslot] = useState(false);
  const [newPost, setNewPost] = useState("");

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

  const handleBooking = (time)=>{
    setShowTimeslot(false)
    alert(`You have booked the section at ${time}`)
  }
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
          {showTimeslot && (
            <div className="timeslot_box">
              {timeslots.map((time) => (
                <div
                  onClick={() =>
                    handleBooking(time)
                  }
                  className="timeslots"
                >
                  <p>{time}</p>
                </div>
              ))}
            </div>
          )}
          {showInput && (
            <div className="safe_input">
              <input
                type="text"
                placeholder="Share your thoughts..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addSafeCard();
                  }
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
            to={
              "https://www.healthline.com/health/depression/how-to-fight-depression"
            }
            className="resource_card"
          >
            <img
              src="https://clearbehavioralhealth.com/wp-content/uploads/2024/09/depression-symptoms.jpg"
              alt=""
            />
            <div className="resource_info">
              <h2>Dealing with depression.</h2>
              <p>
                Personal reflection, meditation and various other methods that
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
              to={
                "https://www.theringer.com/2021/05/13/video-games/dark-souls-sequels-gaming-in-pandemic"
              }
              className="resource_info"
            >
              <h2>Don't you dare go hollow.</h2>
              <p>
                How the Ultra-Challenging ‘Dark Souls’ Became a Pandemic Balm.
              </p>
            </Link>
          </div>
          <Link
            to={
              "https://medium.com/never-stop-writing/why-love-and-sexuality-are-often-kept-separate-in-asian-culture-ab05b3fb7418"
            }
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
                write a lot of poems and stories about love but hesitate to
                speak about sexuality.
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
                onClick={() => setShowTimeslot(!showTimeslot)}
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
          to={
            "https://www.healthline.com/health/depression/how-to-fight-depression"
          }
          className="resource_card"
        >
          <img
            src="https://clearbehavioralhealth.com/wp-content/uploads/2024/09/depression-symptoms.jpg"
            alt=""
          />
          <div className="resource_info">
            <h2>Dealing with depression.</h2>
            <p>
              Personal reflection, meditation and various other methods that you
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
            to={
              "https://www.theringer.com/2021/05/13/video-games/dark-souls-sequels-gaming-in-pandemic"
            }
            className="resource_info"
          >
            <h2>Don't you dare go hollow.</h2>
            <p>
              How the Ultra-Challenging ‘Dark Souls’ Became a Pandemic Balm.
            </p>
          </Link>
        </div>
        <Link
          to={
            "https://medium.com/never-stop-writing/why-love-and-sexuality-are-often-kept-separate-in-asian-culture-ab05b3fb7418"
          }
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
    </div>
  );
};

export default CommunityPage;
