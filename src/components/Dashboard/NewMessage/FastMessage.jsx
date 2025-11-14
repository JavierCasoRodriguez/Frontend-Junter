import {useState,useContext} from 'react';
import { IoMdAdd,IoIosRemove } from "react-icons/io";
import {generarIdMessage,getArtificialDate} from '../../js/messageToolsFn.js'
import {newThread,deleteItemThread,sendThread,insertRelevantWords} from '../../js/sendMessages.js';
import {PickleEmticon,ContentPickleEmoticon} from './PickleEmticon.jsx';
import NoLocalityFound from './NoLocalityFound.jsx';
import BottomNotifBar from '../BottomNotifBar.jsx';
import { ContextUid } from '../../../views/SessionContext.jsx';
// import getToken from '../../js/verifyToken';







  const FastPost = ({ path, navigate, uid, setItem }) => {

    // getToken(() => navigate('/auth/login'));
    const {username,userImage} = useContext(ContextUid);
    const [thread, setThread] = useState(true);
    const [idPost,setIdPost] = useState('');
    const [inputThread, setInputThread] = useState({ 1: '' });
    const [counterThread, setCounterThread] = useState([0]);
    const [currentThread, setCurrentThread] = useState(0);
    const [alert, setAlert] = useState(null);
    // const [margBott, setMargBott] = useState('80px'); En principio no lo utilizo
    const [isPickleVisible, setPickeVisible] = useState(false);
    const [currentEmoji, setCurrentEmoji] = useState(null);
    const time = getArtificialDate();


    

   
   

    const defaultLocality = path === '/' 
      ? 'This post will be sent to the main chat: Junter' 
      : `Post to: ${ location.pathname.startsWith('/news') || location.pathname.startsWith('/friends') ? 'Junter' : decodeURIComponent(path.split('/')[2])}`;
  

   
 
  
    // const handleChange = (text) => {
    
    //   setDisplayInput(text.length > 0);
    //   const textarea = textareaRef.current;

    //   if (textarea) {
    //     textarea.style.height = "auto"; // Restablece la altura
    //     textarea.style.height = textarea.scrollHeight + "px"; // Ajusta a la altura del contenido
    //   }
    // };
   



  


    const sendMessage = (uid,text)=>{
       console.log(text.length);


      if(text.length > 0){
        // const localities = getActualPathForLocalities(location.pathname,true);
        const defaultPath = path.split('/');
        const params = defaultPath[1]
        const localitie = defaultPath[2];
        //const randomIdMessage  = generarIdMessage(16);
    
        fetch('http://localhost:5000/messages/send/post/fast',{
          method : 'POST',
          headers: {'Content-type':'application/json'},
          body: JSON.stringify({ uid,text,localitie,params })
      })
      .then(response => response.json())
      .then(data => {
        console.log('data de deb',data);
        const {content,index} = data;
        
        const {country,region,city,idPost} = content;
        setIdPost(idPost)
        console.log('este es el contenido',content);
        // data es 2 pues habría que decir que no es tu localidad cambia de localidad;
        //Igual con el BottomNotif..
        
        if(index === 1){
    
          // setInputThread((prev)=> )
            setAlert(index);
            setTimeout(() => {
              setAlert(null);
            },5000)
            setInputThread({1:''})
        if(username && userImage){
          console.log('random id message',idPost)
        
          setItem(prevPosts => {
              const newPost = {
                key: idPost,
                id_message:idPost,
                username:username,
                img:userImage,
                content: text,
                likes: 0,
                tn: 0,
                repost: 0,
                replies: 0,
                country,
                region,
                city,
                long: false,
                userid: uid,
                date:time,
                thread: false
              };

             
              return [newPost, ...prevPosts];
            });
             if(data.boolean){
      insertRelevantWords(text,randomIdMessage,data.lang);
    }
       
        }
              
        }else {
  
            setAlert(index);
            const timer = data === 2 ? 5000 : 2000;
          setTimeout(() => {
            setAlert(null);
          },timer)
        }
      })
      .catch(err => console.error(err))
       }
      }
  



    return (
      <div className="cnt-par ft-post">
        {alert === 2 ? (
          <NoLocalityFound navigate={navigate} handleText={decodeURIComponent(path.split('/')[2])} />
        ) : (
          <div className="fast-message-container">
            <div className={`main-input-text ${thread ? 'thread' : ''}`}>
  
              {thread && counterThread.map((item, index) => (
                <div key={index} className="thread-input-container">
                  <textarea
                    value={inputThread[index] || ''}
                    onClick={() => setCurrentThread(index)}
                    onChange={(e) =>
                      setInputThread((prev) => ({
                        ...prev,
                        [index]: e.target.value,
                      }))
                    }
                    placeholder={defaultLocality}
                    autoFocus
                  />
                </div>
              ))}
            </div>
  
  
            <div className='content-tools-inp-text' >
                   
                      <div className='tools-ft-right' style={{width:counterThread.length > 1 ? '175px': '145px'}} >
                      <PickleEmticon  setPickeVisible={setPickeVisible} isPickleVisible={isPickleVisible} pickleSize={20} parmasForStyles={1} paramsForEmoticonStyles={1} />
                      {/* {(counterThread.length === 0 ? inputValue.length > 0 : inputThread && inputThread[currentThread] )  */}
                      {/* // Habria que pillar el último y luego validar el resto  por ahora dejarlo así  */}
                      {inputThread[currentThread] && inputThread[currentThread].length > 0 
                      && <div className="thread-more dashboard" onClick={()=> {newThread(setThread,setCounterThread,counterThread)
                      // ,setMargBott(prev =>{const nuevoMargen = parseInt(prev, 10) + 125;  return `${nuevoMargen}px`;}  
                      // )}
                      }}>
                   <IoMdAdd color='#ff9800'/>
                  </div>}
                  {counterThread.length > 1  &&  <div className="thread-more  dashboard"  onClick={()=>{ deleteItemThread(setInputThread,setCounterThread,counterThread.length)
                  // , 
                    //  setMargBott((prev)=> {const nuevoMargen = parseInt(prev, 10) - 125;  return `${nuevoMargen}px`;})
                     }}
                     >
                   <IoIosRemove color='#ff9800'/>
                  </div>  }
              <button
                onClick={
                  (thread && counterThread.length > 1) ? //De 0 es base/predefinido
                    (e) => sendThread(inputThread, uid,path, null, true, null, null, setAlert, null, setInputThread, setCounterThread,
                      //A partir de aqui es para que se renderice en interfaz
                      setItem,username,userImage,time,
                      e)
                              // (e)=> sendThread(e,inputThread,uid,location.pathname,defInputHash.split(' '),false,setDisplayListHashtagg,setDefInputHash,setResult,setDisplaySuccess,setInputThread,setCounterThread,null,e): 
                    
                    : () => sendMessage(uid, inputThread[currentThread])
                }
                className="btn-submit"
              >
                Post
              </button>
                      </div>
            </div>
            <div >
            <ContentPickleEmoticon setCurrentEmoji={setCurrentEmoji}  currentEmoji={currentEmoji} setInput={setInputThread} isPickleVisible={isPickleVisible} paramsForStyle={4} isThread={counterThread.length > 0 ? true : false} currentThread={currentThread}/>
            </div>
            {alert === 1 && (
    // <span className="alert-msg-fast">{`${thread ? 'thread' : 'post'} uploaded successfully!`
    <BottomNotifBar    successfullOption={2}
    shortPost={1} navigate={navigate} isFastPost={true}
    // outlineReply={<IoIosCheckmarkCircleOutline  style={{color:'gray;',position:'relative',left:'-3px',top:'5px',fontSize:'22px'  }} />}
    />)}
  
          </div>
        )}
      </div>
    );
  };
  

  

  export default FastPost;