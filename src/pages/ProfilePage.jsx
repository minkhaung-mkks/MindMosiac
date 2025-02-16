// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Profile.css";
import axios from "axios";

// Hard-coded valid friend IDs for testing
const validFriendIds = ["friend1", "friend2", "friend3"];

const ProfilePage = () => {
  const { user_id } = useParams();
  const { user, setUser, logout } = useUserStore();
  const navigate = useNavigate();

  // Profile fields
  const [nickname, setNickname] = useState("");
  const [pronoun, setPronoun] = useState("");
  const [email, setEmail] = useState("");

  // Friend management
  const [friendInput, setFriendInput] = useState("");
  const [friends, setFriends] = useState([]);

  // Group management
  const [newGroupName, setNewGroupName] = useState("");
  const [groupMemberInput, setGroupMemberInput] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (user) {
      if (user_id !== user.id) {
        navigate("/");
      } else {
        setNickname(user.nickname || "");
        setPronoun(user.pronoun || "");
        setEmail(user.email || "");
        setFriends(user.friends || []);
        setGroups(user.groups || []);
      }
    } else {
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
    const updatedUser = {
      ...user,
      nickname,
      pronoun,
      email,
      friends,
      groups,
    };
    setUser(updatedUser);
    localStorage.setItem("user-storage", JSON.stringify(updatedUser));
    // Optionally update the backend
    axios
      .put(`http://localhost:5000/user/${user.id}`, updatedUser)
      .then(() => {
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

  const handleAddFriend = () => {
    if (friendInput.trim() === "") return;
    if (!validFriendIds.includes(friendInput.trim())) {
      toast.error(
        "Invalid friend ID. Valid IDs are: friend1, friend2, friend3.",
        { position: toast.POSITION.TOP_RIGHT }
      );
      return;
    }
    if (friends.includes(friendInput.trim())) {
      toast.info("Friend already added.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const updatedFriends = [...friends, friendInput.trim()];
    setFriends(updatedFriends);
    toast.success("Friend added!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    setFriendInput("");
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast.error("Group name is required.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    // Create a new group with an empty member list
    const newGroup = {
      groupName: newGroupName.trim(),
      members: [],
    };
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    toast.success("Group created!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    setNewGroupName("");
  };

  const handleAddToGroup = (groupIndex) => {
    if (!groupMemberInput.trim()) {
      toast.error("Please enter a friend ID to add.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (!friends.includes(groupMemberInput.trim())) {
      toast.error("This friend is not in your friend list.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const updatedGroups = [...groups];
    const group = updatedGroups[groupIndex];
    if (group.members.includes(groupMemberInput.trim())) {
      toast.info("Friend already in group.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    group.members.push(groupMemberInput.trim());
    setGroups(updatedGroups);
    toast.success("Friend added to group!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    setGroupMemberInput("");
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user-storage");
    toast.info("Logged out successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    // In a real app, delete from backend as well.
    logout();
    localStorage.removeItem("user-storage");
    toast.info("Account deleted.", {
      position: toast.POSITION.TOP_RIGHT,
    });
    navigate("/signup");
  };

  if (!user) return null;

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
            value={pronoun}
            onChange={(e) => setPronoun(e.target.value)}
          />
        </div>
        <div className="profile_labels">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button onClick={handleSave}>Save Changes</button>
      </div>
      <div className="line"></div>
      <h3>Add Friend</h3>
      <div className="friend_add_box">
        <input
          type="text"
          placeholder="Enter friend ID (valid: friend1, friend2, friend3)"
          value={friendInput}
          onChange={(e) => setFriendInput(e.target.value)}
        />
        <button onClick={handleAddFriend}>Add Friend</button>
      </div>
      <div className="line"></div>
      <h3>Friends</h3>
      <div className="friends_box">
        {friends.length > 0 ? (
          friends.map((f, index) => (
            <div className="friend_bubble" key={index}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdBwdhp1O2griaB1J6iZzTGpSNcQA4AQSGo12PnSKcC5a4hPWg-fGvzmjPecv_QdSBUWI&usqp=CAU"
                alt=""
              />
              <p>{f}</p>
            </div>
          ))
        ) : (
          <p>No friends added yet.</p>
        )}
      </div>
      <div className="line"></div>
      <h3>Groups</h3>
      <div className="group_create_box">
        <input
          type="text"
          placeholder="Enter new group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
      <div className="group_add_box">
        <input
          type="text"
          placeholder="Enter friend ID to add to group"
          value={groupMemberInput}
          onChange={(e) => setGroupMemberInput(e.target.value)}
        />
      </div>
      {groups.length > 0 ? (
        groups.map((group, index) => (
          <div className="group_box" key={index}>
            <h4>{group.groupName}</h4>
            <p>Members: {group.members.join(", ") || "No members yet"}</p>
            <button onClick={() => handleAddToGroup(index)}>
              Add Friend to Group
            </button>
          </div>
        ))
      ) : (
        <p>No groups created yet.</p>
      )}
      <div className="line"></div>
      <button onClick={handleLogout}>Log Out</button>
      <br />
      <button onClick={handleDeleteAccount}>Delete account</button>
    </div>
  );
};

export default ProfilePage;
