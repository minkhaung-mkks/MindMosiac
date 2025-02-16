// src/pages/NotesPage.jsx
import React, { useState, useEffect } from "react";
import { useUserStore } from "../store";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import CryptoJS from "crypto-js";
import LZString from "lz-string";
import "../styles/AllNotes.css";

const NotesPage = () => {
  const [localNotes, setLocalNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Modal states for sharing
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [showTrustedModal, setShowTrustedModal] = useState(false);

  // Decrypted data state (if URL contains encrypted data)
  const [decryptedData, setDecryptedData] = useState(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setLocalNotes(storedNotes);
  }, []);

  // If URL contains a "data" query parameter, attempt decryption
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const encrypted = query.get("data");
    if (encrypted) {
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, "public_key");
        const compressedData = bytes.toString(CryptoJS.enc.Utf8);
        const originalText = LZString.decompressFromBase64(compressedData);
        const jsonData = JSON.parse(originalText);
        handleSaveDecryptedNote(jsonData);
      } catch (error) {
        toast.error("Decryption failed. Please check the data.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  }, [location.search]);

  const handleNoteClick = (offline_id) => {
    navigate(`/edit/${offline_id}`);
  };

  const handleDelete = (offline_id) => {
    const updatedNotes = localNotes.filter(
      (note) => note.offline_id !== offline_id
    );
    setLocalNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    toast.success("Note deleted successfully!");
  };

  const handleDownload = (note) => {
    const htmlContent = `
      <div style="width:800px; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px; color: #444;">${
            note.title
          }</h1>
          <div style="width:800px; font-size: 14px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; color: #555;">
              ${note.content}
          </div>
          <p style="text-align: right; font-style: italic;">Written by: ${
            note.writer || "Unknown"
          }</p>
      </div>
    `;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.html(htmlContent, {
      x: 10,
      y: 10,
      width: pageWidth - 20,
      windowWidth: 900,
      callback: function (doc) {
        doc.save(`${note.title || "Untitled Note"}.pdf`);
      },
    });

    toast.success("Note downloaded as PDF!");
  };

  // Opens the share modal for the selected note
  const handleShare = (note) => {
    setSelectedNote(note);
    setShowShareModal(true);
  };

  // Generates a QR code with the encrypted payload (using LZ-String compression)
  const handleShareViaQR = (note) => {
    const payload = {
      allowed_ids: [], // Public sharing
      title: note.title,
      content: note.content,
      by: note.writer || "Unknown",
    };

    const jsonData = JSON.stringify(payload);
    // Encrypt the payload using a public key (for public sharing)
    const compressedData = LZString.compressToBase64(jsonData);
    const encrypted = CryptoJS.AES.encrypt(compressedData, "public_key").toString();
    const baseUrl = `${window.location.origin}/decrypt`;
    const urlWithEncryptedData = `${baseUrl}?data=${encodeURIComponent(
      encrypted
    )}`;

    setQrCodeData(urlWithEncryptedData);
    setShowQRModal(true);
    setShowShareModal(false);
  };

  // Shares the note link via the Web Share API or clipboard
  const handleShareToFriends = (note) => {
    const payload = {
      allowed_ids: [],
      title: note.title,
      content: note.content,
      by: note.writer || "Unknown",
    };
  
    const jsonData = JSON.stringify(payload);
    const compressedData = LZString.compressToBase64(jsonData);
    const encrypted = CryptoJS.AES.encrypt(compressedData, "public_key").toString();
    const baseUrl = `${window.location.origin}/`;
    const shareLink = `${baseUrl}?data=${encodeURIComponent(encrypted)}`;
  
    // Copy the link to clipboard
    navigator.clipboard
      .writeText(shareLink)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  
    setShowShareModal(false);
  };
  
  

  // Opens the trusted share modal
  const openTrustedModal = () => {
    setShowTrustedModal(true);
    setShowShareModal(false);
  };

  // Handle sending to a trusted contact (friend or group)
  const handleTrustedSend = (name) => {
    toast.success(`Shared to ${name}!`);
    // Additional integration logic can be added here.
  };

  // QR Modal "Save" action
  const handleSaveQR = () => {
    toast.success("QR code saved!");
    setShowQRModal(false);
    setQrCodeData("");
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setQrCodeData("");
  };

  // Save the decrypted note into local storage
  const handleSaveDecryptedNote = (decryptedData) => {
    if (decryptedData) {
      const notes = JSON.parse(localStorage.getItem("notes")) || [];

      notes.push(decryptedData);
      localStorage.setItem("notes", JSON.stringify(notes));
      toast.success("Note added to local storage!");
      // Clear decrypted data from the URL by navigating without query parameters
      navigate("/", { replace: true });
      setDecryptedData(null);
    }
  };

  // Filter notes based on the search query
  const filteredNotes = localNotes.filter((note) =>
    (note?.title || note?.note_title).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Section to display decrypted note if URL contains encrypted data */}
      {decryptedData && (
        <div className="decrypt-section">
          <h2>Decrypted Note</h2>
          <h3>{decryptedData.note_title}</h3>
          <p>{decryptedData.content}</p>
          <p>
            <em>Written by: {decryptedData.by}</em>
          </p>
          <button onClick={handleSaveDecryptedNote}>Save Note</button>
        </div>
      )}

      <div id="html-preview"></div>
      <div style={{ padding: "0 0vw" }}>
        <div className="note_header">
          <h2>Notes</h2>
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your notes"
            />
          </div>
          <div className="sort_by"></div>
        </div>
        {filteredNotes.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "1.3rem" }}>
            No notes found.
          </p>
        )}
        {filteredNotes.map((note, idx) => (
          <div className="note_card" key={idx}>
            <div className="right_side">
              <h2>{note.title}</h2>
              <p>{note.editedAt}</p>
            </div>
            <div className="buttons_side">
              <button onClick={() => handleNoteClick(note.offline_id)}>
                {/* Edit Icon */}
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
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z"
                  />
                </svg>
              </button>
              <button onClick={() => handleDelete(note.offline_id)}>
                {/* Delete Icon */}
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
              <button onClick={() => handleShare(note)}>
                {/* Share Icon */}
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
                    d="M15 8a3 3 0 1 0-2.83-4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7.17A3 3 0 1 0 15 16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Share Options Modal */}
      {showShareModal && selectedNote && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Share Note</h3>
            <button onClick={() => handleShareViaQR(selectedNote)}>
              Share via QR
            </button>
            <button onClick={() => handleShareToFriends(selectedNote)}>
              Share via link
            </button>
            <button onClick={() => openTrustedModal()}>
              Share to Friends
            </button>
            <button onClick={() => handleDownload(selectedNote)}>
              Download
            </button>
            <button onClick={() => setShowShareModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Trusted Share Modal */}
      {showTrustedModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Share to Trusted Contacts</h3>
            <div>
              <h4>Friends</h4>
              {user && user.friends && user.friends.length > 0 ? (
                user.friends.map((friend) => (
                  <div key={friend} className="trusted-item">
                    <span>{friend}</span>
                    <button onClick={() => handleTrustedSend(friend)}>
                      Send
                    </button>
                  </div>
                ))
              ) : (
                <p>No friends available</p>
              )}
            </div>
            <div>
              <h4>Groups</h4>
              {user && user.groups && user.groups.length > 0 ? (
                user.groups.map((group) => (
                  <div key={group.groupName} className="trusted-item">
                    <span>{group.groupName}</span>
                    <button onClick={() => handleTrustedSend(group.groupName)}>
                      Send
                    </button>
                  </div>
                ))
              ) : (
                <p>No groups available</p>
              )}
            </div>
            <button onClick={() => setShowTrustedModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && qrCodeData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>QR Code</h3>
            <QRCodeCanvas value={qrCodeData} size={256} />
            <div className="qr-buttons">
              <button onClick={handleSaveQR}>Save</button>
              <button onClick={closeQRModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
