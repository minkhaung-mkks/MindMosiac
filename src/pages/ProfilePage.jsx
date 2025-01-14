// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure the CSS is imported
import '../styles/Profile.css'
import axios from "axios";

const ProfilePage = () => {
  const { user_id } = useParams();
  const { user, setUser, logout } = useUserStore(); // Get user from Zustand store
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState(""); // You can extend with more profile fields

  useEffect(() => {
    if (user) {
      // If the logged-in user is trying to view their own profile, load their data
      if (user_id !== user.id) {
        // Redirect to the home page if they try to access someone else's profile
        navigate("/");
      } else {
        // Load the current user's profile info
        setNickname(user.nickname);
        setEmail(user.email || ""); // If you store an email or other fields
      }
    } else {
      // If the user is not logged in, redirect to login page
      navigate("/login");
    }
  }, [user, user_id, navigate]);

  const handleSave = () => {
    if (!nickname) {
      toast.error("Nickname is required.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    // Update the user in the Zustand store and localStorage
    const updatedUser = { ...user, nickname, email };
    setUser(updatedUser); // Update the Zustand store
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Save to localStorage

    // Optionally send to the backend to update the user profile
    axios
      .put(`http://localhost:5000/user/${user.id}`, updatedUser)
      .then((response) => {
        toast.success("Profile updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error("Error updating profile.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const handleLogout = () => {
    logout(); // Clear the user session from Zustand store
    localStorage.removeItem("user"); // Remove from localStorage
    toast.info("Logged out successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    navigate("/login"); // Redirect to login page
  };

  if (!user) return null; // If no user data is available, don't render the page

  return (
    <div className="profile_page">
      <h1>{nickname}'s Profile</h1>
      <div className="profile_label_box">
        <div className="profile_labels">
          <label>Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="profile_labels">
          <label>Pronoun</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="profile_labels">
          <label>Friend ID</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <button onClick={handleSave}>Save Changes</button>
      </div>
      <div className="line"></div>
      <h3>Friends</h3>
      <div className="friends_box">
        <div className="friend_bubble">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdBwdhp1O2griaB1J6iZzTGpSNcQA4AQSGo12PnSKcC5a4hPWg-fGvzmjPecv_QdSBUWI&usqp=CAU" alt="" />
          <p>XoCool</p>
        </div>
      </div>
      <div className="line"></div>
      <h3>Bubbles</h3>
      <div className="friends_box">
        <div className="friend_bubble">
          <img src="https://umaiyomu.wordpress.com/wp-content/uploads/2024/04/sousou-no-frieren-5.jpg" alt="" />
          <p>FrienSU</p>
        </div>
      </div>
      <div className="line"></div>
      <button onClick={handleLogout}>Log Out</button>
      <br />
      <button onClick={handleLogout}>Delete account</button>
    </div>
  );
};

export default ProfilePage;
