// src/pages/NotesPage.jsx
import React, { useState, useEffect } from "react";
import { useUserStore } from "../store";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../styles/AllNotes.css";

const NotesPage = () => {
  const [localNotes, setLocalNotes] = useState([]);
  const { user } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch local notes from localStorage
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setLocalNotes(storedNotes);
  }, []);

  const handleNoteClick = (offline_id) => {
    // Navigate to the EditNotePage for this note
    navigate(`/edit/${offline_id}`);
  };

  return (
    <div>
      <div>
        <div className="note_header">
          <h2>Notes</h2>
          <div className="search-bar">
            <input type="text" placeholder="Search your notes" />
          </div>
          <div className="sort_by"></div>
        </div>
        {localNotes.length === 0 && <p>No notes found.</p>}
        {localNotes.map((note, idx) => (
          <div className="note_card" key={idx}>
            <div className="right_side">
              <h2>{note.title}</h2>
              <p>{note.editedAt}</p>
            </div>
            <div className="buttons_side">
              <button onClick={() => handleNoteClick(note.offline_id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* <div>
        <h2>Online Notes</h2>
        {onlineNotes.length === 0 && <p>No online notes found.</p>}
        {onlineNotes.map((note, idx) => (
          <div key={idx}>
            <p>{note.title}</p>
            <button onClick={() => handleNoteClick(note.offline_id)}>Edit</button>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default NotesPage;
