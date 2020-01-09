import React, {useState, useEffect} from 'react';
import Note from './components/Note';

import noteService from './services/notes';

const App = (props) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true);

    useEffect(() => {
        noteService
            .getAll()
            .then(response => {
                setNotes(response.data)
            })
    }, [])
    const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id);
        const changedNote = {...note, important: !note.important}
        noteService
            .update(id, changedNote)
            .then(response => {
                setNotes(notes.map(note => note.id !== id ? note : response.data))
            })
      }
    const rows = () =>
        notesToShow.map((note, index) => <Note key={index} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />);

    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() > 0.5,
            id: notes.length + 1
        }
        noteService
            .create(noteObject)
            .then(response => {
                setNotes(notes.concat(response.data))
                setNewNote('')
            })
    }

    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }
    return (
        <div>
            <h1>Notes</h1>
            <button onClick={() => setShowAll(!showAll)}>
                show {showAll ? 'important': 'all'}
            </button>
            <ul>
                {rows()}
            </ul>
            <form onSubmit={addNote}>
                <input 
                    value={newNote}
                    onChange={handleNoteChange} />
                <button type="submit">save</button>
            </form>
        </div>
    )
}

export default App