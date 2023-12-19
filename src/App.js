/* eslint-disable jsx-a11y/anchor-is-valid */

import './App.css';
import Preview from './components/Preview';
import Message from './components/Message';
import Notes from './components/Notes';
import Noteslist from './components/Noteslist';
import Note from './components/Note';
import NoteForm from './components/NoteForm';
import Alert from './components/Alert';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

import { useEffect, useState } from 'react';

if (process.env.REACT_APP_NODE_ENV === 'production') {
  disableReactDevTools();
}

function App() {
  const [notes,setNotes]=useState([]);
  const [title,setTitle]=useState("");
  const [content,setContent]=useState("");
  const [selectedNotes,setSelectedNotes]=useState(null);
  const [creating,setCreating]=useState(false);
  const [editing,setEditing]=useState(false);
  const [validationErrors,setValidtaionErrors]=useState([])

  useEffect(()=>{
    if (localStorage.getItem('notes')){
      setNotes(JSON.parse(localStorage.getItem('notes')))
    }else{
      localStorage.setItem('notes',JSON.stringify([]))
    }
  },[])

  useEffect(()=>{
    if (validationErrors.length !== 0){
      setTimeout(()=>{
        setValidtaionErrors([])
      },3000)

    }
  },[validationErrors])

  const validate = ()=>{
    const validationErrors = []
    let passed = true
    if (!title){
      validationErrors.push('الرجاء ادخال عنوان الملاحظة')
      passed = false
    }

    if (!content){
      validationErrors.push('الرجاء ادخال النص')
      passed = false
    }
    setValidtaionErrors(validationErrors)
    return passed
  }

  const saveToLocalStorage = (key,value)=>{
    localStorage.setItem(key,JSON.stringify(value))
  }


  const editNoteHandler=()=>{
    const note= notes.find((note=> note.id === selectedNotes)) 
    setEditing(true)
    setTitle(note.title)
    setContent(note.content)
  }

  const addNoteHandler=()=>{
    setCreating(true)
  }

  const ChangeTitleHandler = (e)=>{
    setTitle(e.target.value)

  }

  const ChangeContentHandler = (e)=>{
    setContent(e.target.value)

  }

  const saveNoteHandler = ()=>{
    if (!validate()) return ;
    const note={
      id : new Date(),
      title : title ,
      content : content
    }

    const updatesNotes =[...notes,note] 
    saveToLocalStorage('notes',updatesNotes)
    setNotes(updatesNotes)
    setCreating(false)
    setSelectedNotes(note.id)
    setTitle("")
    setContent("")
  }

  const deleteNoteHandler=()=>{
    const updateNotes = [...notes]
    const noteIndex= updateNotes.findIndex((note=> note.id === selectedNotes)) 
    notes.splice(noteIndex,1)
    saveToLocalStorage('notes',notes)
    setNotes(notes)
    setSelectedNotes(null)
  }

  const getPreview = () => {
    if ( notes.length ===0) {
      return <Message title="لا يوجد ملاحظة"/>
    }

    if (!selectedNotes) {
      return <Message title="الرجاء اختيار ملاجظة " />
    }

    const note = notes.find(note => {
      return note.id === selectedNotes
    })

    let noteDisplay = (
      <div>
        <h2> {note.title} </h2>
        <p>  {note.content} </p>
      </div>
    )

    if (editing){
      noteDisplay = (
        <NoteForm formTitle="تعديل" 
        title={title} 
        content={content} 
        titleChanged={ChangeTitleHandler} 
        contentChanged={ChangeContentHandler} 
        submitText="تعديل" 
        submitClicked={updateNodeHandler} />
      )

    } 
    return (
      <div>
        {!editing &&
        
        <div className="note-operations">
          <a href="#"   onClick={editNoteHandler}>
            <i className="fa fa-pencil-alt" />
          </a>
          <a href="#"  onClick={deleteNoteHandler} >
            <i className="fa fa-trash" />
          </a>
        </div>}
        
        {noteDisplay}
      </div>
    );
  }

  const getAddNote = () => {
    return (
      <NoteForm formTitle="ملاحظة جديدة" 
      title={title} 
      content={content} 
      titleChanged={ChangeTitleHandler} 
      contentChanged={ChangeContentHandler} 
      submitText="حفظ" 
      submitClicked={saveNoteHandler} />
    );
  };

  const selectedNoteHandler = noteId=>{
    setSelectedNotes(noteId)
    setCreating(false)
    setEditing(false)

  }

  const updateNodeHandler = ()=>{
    if (!validate()) return ;
    const updateNotes = [...notes]
    const noteIndex = notes.findIndex(note=> note.id === selectedNotes)
    updateNotes[noteIndex]={
      id : selectedNotes,
      title: title,
      content : content
    }

    saveToLocalStorage('notes',updateNotes)
    setNotes(updateNotes)
    setEditing(false)
    setTitle('')
    setContent('')
  }

  return (
    <div className="App">

      <Notes> 
      
        <Noteslist>
          {notes.map((note)=> <Note key={note.id} title={note.title} noteClicked={()=>selectedNoteHandler(note.id)} active={selectedNotes===note.id} />)}
        </Noteslist>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </Notes>
      <Preview>{creating ? getAddNote() : getPreview()}</Preview>
      {validationErrors.length !== 0 && <Alert  validationMessages={validationErrors} />}
  </div>
  );
}

export default App;
