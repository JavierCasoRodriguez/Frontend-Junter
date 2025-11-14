import '../../../styles/SendMessages.scss';
import { useState,useRef, useEffect,useContext } from 'react';
import {ContextUid} from '../../../views/SessionContext.jsx';
import {useNavigate,useLocation } from 'react-router-dom';
import BottomNotifBar from '../BottomNotifBar.jsx';
// import getToken from '../../js/verifyToken';
import Message from '../MessageForm/Message.jsx';
import {ContextLocal} from '../../../views/ProviderLocal.jsx' 
import {handleDecodedTextUri,handleChangeTextLocalities,getActualPathForLocalities,newThread,deleteItemThread, handleImageUpload, sendThread,activateInput,insertRelevantWords} from '../../js/sendMessages.js';
import FastLoader from '../../../views/processing/FastLoader.jsx';
import {HashtaggComp,ListHashtagg} from './HashtaggComp.jsx';
import { CiImageOn } from "react-icons/ci";
import {IoMdAdd,IoIosRemove}  from "react-icons/io";
import {PickleEmticon,ContentPickleEmoticon} from './PickleEmticon.jsx';
import NoLocalityFound from './NoLocalityFound.jsx';


// import data from '@emoji-mart/data'
// import {MdInsertEmoticon} from 'react-icons/md'

 //useRef es muy parecido a useStaet pero por ejemplo no se vuelve a renderizar
 //uso es para casos concretos manipulaciond del DOM
 //porque es necesario renderizar por ejemplo un contador que no aparece en jsx de manera directa 


function ShortMessage() {

  const navigate = useNavigate();
  const location = useLocation();
  //  getToken(() => navigate('/auth/login'));
  const {uid,username,userImage} = useContext(ContextUid);
  const {localidades} = useContext(ContextLocal) ;

 const inputRef = useRef(null);
//  const [isloading,setLoading] = useState(true);
 const [displayInputState,setdisplayInputState] = useState(false);
 const [inputState,setInputState] = useState('');
 const [tag,setTag] = useState(null);
 const [isPickleVisible,setPickeVisible] = useState(false);
 const [currentEmoji,setCurrentEmoji] = useState(null)
 const [result, setResult] = useState(false);
 const [display,setDisplay] =  useState(true);
 const [displaySucces,setDisplaySuccess] = useState(true);
 const [input, setInput] = useState('');
 const [displayLocalities,setDisplayLocalities] = useState(false);
 const [displayListHashtagg,setDisplayListHashtagg] = useState(false);
 const [defInputHash,setDefInputHash]  = useState('');
 const [thread,setThread] = useState(false);
 const [inputThread,setInputThread] = useState({
  1:'',
 });
 const [counterThread,setCounterThread] = useState([0]);
 const [selectedIndexThread,setSelectedIndexThread] = useState(0);
 const [listImagesThread,setListImagesThread] = useState([]);


//  const [data,setData] = useState({
//     username:'',
//     state:'',
//  });
 const [localities,setLocalities] = useState([]);
 const [displayBarForState,setDisplayBarForState] = useState(false);

 //Imágenes
 const fileInputRef = useRef(null); //para que al darle click a la imagen haga el efecto del input;
//  const [image,setImage] = useState(null);
 const [defaultCover,setDefaultCover] = useState(false);
 const [formatImage,setFormattedImage] = useState(1);

 const [sendingImage,isSendingImage] = useState(false);
 
 useEffect(()=>{
  // 1º Sacar las localidades como array;
  const newLocalities = { ...localidades, nuevaClave: "Junter" };
  const result = Object.values(newLocalities);
  setLocalities(result) 


 },[]);



 
  
const handleEnter = (uid,inputState,setInputState) => {

  if (inputState.length  > 0) {
    console.log("Me estás tirando la ruta");
    const text = inputState;
    
    fetch("http://localhost:5000/config/update/user/state", {
      method: "POST",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify({ uid, text }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error posting the state");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setInputState('');
          // [displayBarForState,setDisplayBarForState]
          setDisplayBarForState(true);
          setTimeout(() => {
            setDisplayBarForState(false);
          }, 6000);
        }
      })
      .catch((err) => console.error(err));
  }
};


//1 Envio del mensage
const sendMessage = async (text,uid,tags,image,cover,formatStyle) => {
  console.log({
    text:text,
    uid:uid,
    tags:tags,
    image:image,
  })

   // const data ={text,uid,localities,tags,image};
   if (!image && (text.length === 0 || text.length > 255)) {
    console.log(image ? true : false);
    console.log(text);
    console.log(text.length < 255);
    console.log("Mensaje no enviado: debe incluir una imagen o un texto mayor a 255 caracteres.");
    return; // Detiene la ejecución si no cumple la condición (yo estaba utilizand un preventDefault)
  }

  let body;
  let headers = {};
  const localities = getActualPathForLocalities(location.pathname);

  if (image) {
    // Usar FormData si hay imagen
    body = new FormData();
    body.append('text', text);
    body.append('uid', uid);
    body.append('localities', JSON.stringify(localities)); // Si es array/objeto
    body.append('tags', JSON.stringify(tags));
    if (image.length > 1) {
      // Si hay varias imágenes
      image.forEach((item) => {
        body.append(`image`, item); // Agregar cada imagen con un nombre único
      });
    } else {
      // Si solo hay una imagen

      console.log('va por alla');
      body.append("image", image);
    }
    body.append('imageCover',cover);
    body.append('imageFormat',formatStyle);
    isSendingImage(true)//incializamos la var como verdadera;

  } else {
    // Usar JSON si no hay imagen
    body = JSON.stringify({ text, uid, localities, tags });
    headers['Content-Type'] = 'application/json'; // Solo necesario en JSON

  }

   
    try {
      const response = await fetch('http://localhost:5000/messages/send/post/short', {
        method: 'POST',
        headers, // Solo se envía si es JSON
        body,
      });
      if (!response.ok) {
        isSendingImage(false)//siempre en falso
        throw new Error('Error al enviar los datos');

      }else{
        const data = await response.json();
        //Es todo igual excepto que independientemente vaya bien o mal hacemos todo;
        setResult(data.boolean) //a veces puede ser 2
        isSendingImage(false)//siempre en falso
          setInputThread({
        1:''
      })
        setDisplayListHashtagg(false);
        setDefInputHash('');
        setDisplaySuccess(true);
        //En el caso de que todo haya ido bien llamamos a la función para que inserte palabras relevantes;
        insertRelevantWords(text,data.idPost,data.lang);
        setTimeout(()=>{
          setResult(null); 
        },5000)
      }
    } catch (error) {
        setDisplay(false);
        isSendingImage(false)//siempre en falso
        console.error('Error:', error);
    } 
  };




const objectTools = {
  item:[<h4  key={1} className={!displayLocalities ?'text-loc-opt-sh':'text-loc-opt-sh active' }>
   {location.pathname === '/new/post/format/short'? 'JUNTER': handleDecodedTextUri()}</h4>,<CiImageOn   key={2}/>,<div className="cont-hastagg-short" key={3}>#</div>,'Change State',<PickleEmticon  key={5} setPickeVisible={setPickeVisible} isPickleVisible={isPickleVisible} pickleSize={20}/>],
  className:['localities-options-sh',"img-ic-tools short",tag ? "add-tag-sh active" : "add-tag-sh",displayInputState ? 'setting-post-sh-state active' :'setting-post-sh-state'],
  onClick:[()=> setDisplayLocalities(!displayLocalities),()=> activateInput(fileInputRef), ()=>setTag(!tag),()=> setdisplayInputState(!displayInputState)]
}

console.log({
  input:inputThread,
  index:selectedIndexThread,
  listImage:listImagesThread,
  imagenIndexada:listImagesThread[selectedIndexThread],

})

    return (
       <>
       {/* problema que para el programa aunque data esté vacio siempre es true  */}
       { <div className={sendingImage ? 'container-shortMessage active':"container-shortMessage"} > 
                        <div  style={{ display: "none" }}>
                  <div>
                  <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageUpload(setListImagesThread,listImagesThread[selectedIndexThread],selectedIndexThread)}

                />
                  </div>
                </div>
             {counterThread.map((item,index) =>{
            return  <div key={index} >
                <textarea name="" className={`inputText-shMsg thread`}  value={inputThread[index] || ''}  onClick={()=> setSelectedIndexThread(index)}style={{marginTop:index === 0 && '30px',border:selectedIndexThread === index && counterThread.length > 1  &&  '1px solid rgb(242, 194, 105)'}}
             onChange={(e) =>
               setInputThread((prev) => ({
                 ...prev, 
                 [index]: e.target.value, 
               })) }
               maxLength={251}  ref={inputRef} placeholder={'writting...'}></textarea>
               {/* {listImagesThread[index] && listImagesThread[index].image || '' } */}
               {listImagesThread[index] && <div  className="cont-bar-image" onClick={()=> setSelectedIndexThread(index)}>
               {listImagesThread[index].image.map(index => (
                <>
                  <div  className="image-bar" key={index} >
              <CiImageOn  /> img.
               </div></>
               ))}
               </div>}
              
              {counterThread[counterThread.length -1] === item &&
              <>
              {inputThread[index] && <span className="short-length">{inputThread[index].length}/250</span>}
             {(inputThread[index]?.length > 0 || listImagesThread[selectedIndexThread]) && (
              <div className="thread-more" onClick={()=> newThread(setThread,setCounterThread,counterThread,index,setInputThread)}>
               <IoMdAdd />
              </div>
             )}
               {index !== 0 && <div className="thread-more" onClick={()=> deleteItemThread(setInputThread,setCounterThread,index)}>
                 <IoIosRemove />
                </div>  }     
              </>
               } 
                </div>
             })}
           
             {/* {(input.length > 0 && counterThread.length ===  0 ) && (
              <>
                <span className="short-length">{input.length}/250</span>
              <div className="thread-more" onClick={()=> newThread(setThread,setCounterThread,counterThread)}>
              <IoMdAdd />
                </div>
              </>
             )} */}
        <button onClick={(thread && counterThread.length > 0) ? 
          (e)=> sendThread(e,inputThread,uid,location.pathname,defInputHash.split(' '),false,setDisplayListHashtagg,setDefInputHash,setResult,setDisplaySuccess,setInputThread,setCounterThread,null,null,null,null,e): 
          (e)=> sendMessage(inputThread[selectedIndexThread],uid,defInputHash.split(' '),listImagesThread[selectedIndexThread] && listImagesThread[selectedIndexThread].image,defaultCover,formatImage,e)} className="btn-submit">Post</button>
            
            {result   && <SuccessMessage navigate={navigate} username={username} setDisplaySuccess={setDisplaySuccess} displaySucces={displaySucces}/> }
            { display ? '' : <ErrorMessage />}

            <>
          {result !== 2 ? (
           <div className='parent-post-format-sh'>

    <Message 
            image={userImage } //si no hay imagen de perfil crashea seguro;
            username={username}
            sendImage={
              listImagesThread[selectedIndexThread]  && 
              listImagesThread[selectedIndexThread].image || []}
              // setSendImage={setImage} //aqui creo que jodimos;
            setSendImage={setListImagesThread}
            defaultCover={defaultCover} 
            setDefaultCover={setDefaultCover}
            formatImage={formatImage}
            setFormattedImage={setFormattedImage}
            indexImage={selectedIndexThread}
            // estado={defaultState}
            // El estado lo voy a cambiar de sitio en el futuro
            
            text={inputThread[selectedIndexThread] || ''} 
            />
          
          <div className="parent-cont-tools-sh">
           {objectTools.item.map((data,index) =>(
            <div  className="main-cont-tools-sh"   key={index}>
              <div className={objectTools.className[index]} onClick={objectTools.onClick[index]}>
               {data}
                </div>
              </div>
           ))}
            </div>
            
           </div>

           ):
         <NoLocalityFound navigate={navigate} handleText={handleDecodedTextUri()} />          
          }
            </>
         
           <><ListHashtagg displayListHashtagg={displayListHashtagg} defInputHash={defInputHash} setDisplayListHashtagg={setDisplayListHashtagg}  setDefInputHash={setDefInputHash}  /> </>
           <><HashtaggComp tag={tag} setDisplayListHashtagg={setDisplayListHashtagg} setTag={setTag}  setDefInputHash={setDefInputHash} booleanStyles={'short'}/></>
                {
                    displayInputState && <div className='setting-state-change-format-text'>
                       <input type="text" name="" id="" maxLength={30} placeholder='what is your mood about this post' onChange={(e)=> setInputState(e.target.value)} value={inputState}/>
                       <button className="btn-upd-state" onClick={()=> handleEnter(uid,inputState,setInputState)}>Update</button>
                       <span className="counter-update-text" >{inputState.length > 30 && 'Maxlength = 30'}</span>
                    </div>
                }

{displayBarForState &&
 <BottomNotifBar   successfullOption={2}
 shortPost={2} navigate={navigate} 
//  outlineReply={ <IoIosCheckmarkCircleOutline  style={{color:'gray;',position:'relative',left:'-3px',top:'5px',fontSize:'22px'}}/>
// }
/>
 }

<input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload(setListImagesThread,listImagesThread[selectedIndexThread],selectedIndexThread)}
      />

<ContentPickleEmoticon setCurrentEmoji={setCurrentEmoji}  currentEmoji={currentEmoji} setInput={setInput} isPickleVisible={isPickleVisible} paramsForStyle={0}/>
         {displayLocalities && <div className='settings-options-localities visible'>
                {localities.map((element,index) => (
                  <div key={index} 
                  onClick={()=>{
                    handleChangeTextLocalities(index,'short',localities[0],localities[1],localities[2],navigate),
                    setDisplayLocalities(false)}}><h4 style={{padding:localities[index].length > 15 && '2px'}}>{localities[index]}</h4></div>
                  ))}
            </div>}
        </div>}
                  {sendingImage && <div className="loader-snd-image"><FastLoader  style={{color:'red'}}/></div>}
       </>
    )
  }







  const SuccessMessage = ({username,setDisplaySuccess,displaySucces,navigate})=>{
    setTimeout(() => {
      setDisplaySuccess(false);
    }, 12000);
    
    return (
        <>
        {displaySucces && (

        <BottomNotifBar  username={username} successfullOption={2}
        shortPost={1} navigate={navigate} 
        // outlineReply={ <IoIosCheckmarkCircleOutline  style={{color:'gray;',position:'relative',left:'-3px',top:'5px',fontSize:'22px'}}/>
    // }
/>
        )}
        </>
    )
};
const ErrorMessage = ()=>{
    const [display,setDisplay] = useState(true);
    setTimeout(()=>{  setDisplay(true)},500);

    return (
      <>
       {!display && (
        <div className='er-msg'>
        <span>Ha habido un error a la hora de enviar el mensaje por favor intentelo más tarde</span>
    </div>)}
      </>
    )

}




export default ShortMessage
