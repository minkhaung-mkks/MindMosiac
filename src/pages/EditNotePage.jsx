// src/pages/EditNotePage.jsx
import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill' // Import React Quill for the rich text editor
import 'react-quill/dist/quill.snow.css' // Import React Quill styles
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Make sure the CSS is imported
import "../styles/NoteEditor.css";
import { useUserStore } from '../store'

const EditNotePage = () => {
  const { id } = useParams() // Get the offline_id from the URL params
  const [note, setNote] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState([]) // Store the images locally
  const { user } = useUserStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch the note from localStorage using the offline_id
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || []
    const noteToEdit = storedNotes.find(note => note.offline_id === id)

    if (noteToEdit) {
      setNote(noteToEdit)
      setTitle(noteToEdit.title)
      setContent(noteToEdit.content)
      setImages(noteToEdit.images) // Get the images stored in the note
    } else {
      toast.error('Note not found!', { position: toast.POSITION.TOP_RIGHT })
      navigate('/')
    }
  }, [id, navigate])

  const handleContentChange = (value) => {
    setContent(value)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          { file, url: reader.result }, // Store image as base64 data URL
        ])
        // Insert image into the editor
        const range = this.quill.getSelection()
        this.quill.insertEmbed(range.index, 'image', reader.result)
      }
      reader.readAsDataURL(file) // Convert image to base64
    }
  }

  const saveNoteLocally = () => {
    const updatedNote = {
      ...note,
      title,
      content,
      images, // Store images as base64 URLs
      editedAt: new Date().toISOString(),
    }

    const storedNotes = JSON.parse(localStorage.getItem('notes')) || []
    const updatedNotes = storedNotes.map((n) =>
      n.offline_id === id ? updatedNote : n
    )

    localStorage.setItem('notes', JSON.stringify(updatedNotes))

    // Show success toast and navigate to the notes page
    toast.success('Note saved locally!', { position: toast.POSITION.TOP_RIGHT })
    navigate('/')
  }

  const uploadImagesAndSaveNote = () => {
    const formData = new FormData()

    // Upload each image to the backend
    const imageUploads = images.map((image) => {
      formData.append('file', image.file)
      return axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => response.data.url) // Get the URL of the uploaded image
        .catch((error) => {
          console.error('Error uploading image:', error)
          toast.error('Error uploading image', { position: toast.POSITION.TOP_RIGHT })
          return null
        })
    })

    // Once all images are uploaded, save the note to the backend
    Promise.all(imageUploads)
      .then((imageUrls) => {
        const updatedNote = {
          title,
          content,
          images: imageUrls.filter(Boolean), // Filter out any failed uploads
          editedAt: new Date().toISOString(),
        }

        // Send the note data to the backend
        axios.put(`http://localhost:5000/notes/${id}`, updatedNote)
          .then((response) => {
            toast.success('Note uploaded and saved successfully!', { position: toast.POSITION.TOP_RIGHT })
            navigate('/') // Redirect to notes page after upload
          })
          .catch((error) => {
            console.error('Error saving note to the backend:', error)
            toast.error('Error saving note to the backend', { position: toast.POSITION.TOP_RIGHT })
          })
      })
  }

  if (!note) return <div>Note not found.</div>

  return (
    <div className='editor_box'>
      {user ? (
        <div className='note_editor'>
          <input
          className='note_title'
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
          />
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link',], // Allow image insert in the toolbar
              ],
            }}
            formats={[
              'header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'image',
            ]}
          />
          <div>
            <button onClick={saveNoteLocally}>Save Locally</button>
            {/* <button onClick={uploadImagesAndSaveNote}>Save to Backend</button> */}
          </div>
        </div>
      ) : (
        <p>Please log in to edit the note.</p>
      )}
            <button onClick={saveNoteLocally} className='save_button'>
      update
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>
     
      </button>
    </div>
  )
}

export default EditNotePage
