import {HiAnnotation,HiOutlineTrash} from 'react-icons/hi'
import { IoClose } from "react-icons/io5";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import {useState,useContext,useEffect} from 'react';
import { ContextUid } from '../../views/SessionContext';




// const ServerMessageForDeleting = (text)=>{
//     return(
//         <>
//         <span>{text}</span>
//         </>
//     )
// } esto para enviar el mensaje de error/acierto cuando se borra un mensaje



function Rememberme({display}) {

    const uid = useContext(ContextUid);
    const [input,setInput] = useState('');
    const [errorResponse,setErrorResponse ] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const [contentNotes, setContentNotes] = useState([]);
    const [displayTrash, setDisplayTrash] = useState({});
    // const [flashMessage, setFlashMessage] = useState({});
    const generateNoteId = () =>
        `${Math.random().toString(36).substr(2, 24)}`;
      
    const selectInputVal = (e)=>{
       setInput(e.target.value)
    }
      const showTrash = (id)=>{
         setDisplayTrash(prevState => ({
            ...prevState,
            [id]: !prevState[id]
         }))
       } 
    
    const removeNote = (idNote,uid)=>{
      fetch('http://localhost:5000/remember/deleteNote',{
            method : 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify({ idNote,uid })
        })
        .then(response => response.json())
        .then(data => {
            const {deleted} = data;
            // const {deleted,message} = data;

            if(deleted){
                const li = document.getElementById(idNote);
                li.remove();

                // setFlashMessage(deleted,message);
            }else{
                // setFlashMessage(deleted,message);
                console.log('item eliminado con éxito');
            }
        })
        .catch(err => console.error(err))

    } 



    //getNotes
    useEffect(()=>{
        const id = uid.uid;
     
        fetch('http://localhost:5000/remember/getContentNotes',{
            method : 'POST',
            headers: {
                'Content-type':'application/json'
            
            },
            body:JSON.stringify({id})
        })
        .then(response => response.json())
        .then(data => {
            setContentNotes(data)
            setLoading(false);
        })
        .catch(err => console.error(err));
    },[]);


    //enviar
    const sendNote  = (uid,text)=>{
        const idNote = generateNoteId()
      const data = {uid,text,idNote}
      fetch('http://localhost:5000/remember/sendNote',{
          method : 'POST',
          headers: {'Content-type':'application/json'},
          body: JSON.stringify({ data })
      })
      .then(response => response.json())
      .then(data => {       
        setErrorResponse(data);
        setInput('');
      })
      .catch(err => console.error(err))


      const ul = document.querySelector('.ul-rem');
      if(!errorResponse){
          const errorTemplate = `<li style="color:green,fontSize:13px,fontFamily:Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",padding:3px> Failed uploading the note</li>`;
          ul.insertAdjacentHTML('afterend',errorTemplate);
        }else{
           
            setContentNotes((prev) => {
                const newNote = { id_note:idNote, text }; // Crea la nueva nota
              
                return {
                  ...prev, // Copia las demás propiedades existentes
                  empty:prev.empty === true , // Cambia `empty` si es necesario
                  data: [...prev.data, newNote], // Añade la nueva nota al array `data`
                };
              });
        //   const template = `
        //   <li style="
        // font-size: 13px; font-family: 'Trebuchet MS',
        // 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; 
        // padding: 3px;">
        //   ${text}
        //   </li>`;
        //   ul.insertAdjacentHTML('afterend',template);

        
      }
    };

    return (
        <div className="rem-me">
          <div className="nav-rem">
             <HiAnnotation />
            <h4>Remember-me</h4>
             <div>
               <IoClose id="rem-cl" onClick={()=> display(false)}/> 
             </div>
            </div> 
            <div className="cnt-rem">
                <ul className='ul-rem'>
        {
            isLoading  ? <div><li>Loading ...</li></div>
            :
            (contentNotes.data.length > 0  && 
            contentNotes.data.map(({id_note,text})=>(
               <li key={id_note} id={id_note} onClick={()=> showTrash(id_note)}>
                {text}
               {displayTrash[id_note] && <HiOutlineTrash id="rem-trash" onClick={()=> removeNote(id_note,uid.uid)}/> }
                </li>
                
            ))
        )
        }
                </ul>
            </div>

            <div className="rem-input-group">
            <input type="text" name="" id="" placeholder='task,note..' value={input} onChange={selectInputVal}  autoFocus/>
            <HiOutlinePaperAirplane  onClick={()=> sendNote(uid.uid,input)}/>
            </div>
        </div>


    )
}

export default Rememberme
