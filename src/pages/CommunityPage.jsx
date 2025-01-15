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
  return (
    <div className="community_page">
      <div className="community_space">
        <div className="safe_space">
          <h3>The safe space</h3>
          <div className="safe_cards">
            <p>
              I feel bad about not doing my school work but can’t find
              motivation.
            </p>
          </div>
          <div className="safe_cards">
            <p>I do not feel loved by my parents.</p>
          </div>
          <div className="safe_cards">
            <p>I do not feel attraction to anyone.</p>
          </div>
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
              <div className="resource_card" key={index}>
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
