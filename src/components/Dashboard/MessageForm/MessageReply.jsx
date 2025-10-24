import {useState,useContext,useRef } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import NavReply from '../../../views/Nav';
import { ContextUid } from "../../../views/SessionContext";
import Loader from "../../../views/processing/FastLoader";
import {fetchingData} from '../../js/renderMessages'
import getToken from "../../js/verifyToken";
import {activateInput,insertRelevantWords} from '../../js/sendMessages';
import {generarIdMessage} from '../../js/messageToolsFn'
import ContentImage from './ContentImage';
import { HiOutlineReply,HiOutlineX } from "react-icons/hi";
import {ContentCard,ToolsCard} from './CardReply';
import { useQuery } from '@tanstack/react-query'

const MessageReply = ()=>{
    const location = useLocation();
    const navigate = useNavigate();
    const uid = useContext(ContextUid);
    const token  = getToken(() => navigate('/auth/login'));
    // const [user,setUser] = useState(true);
    const [inputVal,setInputVal] = useState('');
    // const [loader,isLoading ]= useState(true);
    const [isPickleVisible,setPickeVisible] = useState(false);
    const [currentEmoji,setCurrentEmoji] = useState(null)
    // const [loaderUserData,isLoadingFetchingUserData] = useState(true);
    // const [userData,setUserData] = useState([]);
    const [statusResponse,setStatusResponse] = useState(3);
    const path = location.pathname.split('/');
    const idParentMessage = path[4];


//Para el envio con imágenes
const fileInputRef = useRef(null);
const [image,setImage] = useState([]);
const [defaultCover,setDefaultCover] = useState(false);
const [formatImage,setFormattedImage] = useState(1);
const [sendingImage,isSendingImage] = useState(false);





const {data:user,isLoading} = useQuery({
    queryKey: ['repliesPosts', idParentMessage],
    queryFn: () => fetchingData(`http://localhost:5000/messages/content/post/format/reply/${idParentMessage}?format=reply`,token),
    enabled: !!idParentMessage && !!token, // evita correr antes de que estén listos
    // staleTime: 1000 * 60 * 5,
})




   const sendReply = (text,uid,userIdPost,image,isSendingImage)=>{
    // console.log('input',input);
    // text,uid,newNumReplies,locality,params
    //con la locality y el params más adelante;
    const idPost = generarIdMessage(16);
    if(image || (text.length > 0 && text.length < 420)){
      let body;
      let headers = {};
      if (image) {

          // Usar FormData si hay imagen
          body = new FormData();
          body.append('text', text);
          body.append('uid', uid);
          body.append('idPost', idPost);
          body.append('userIdPost',userIdPost);
          console.log('tira por aquí de manual');
          isSendingImage(true);
          console.log('',sendingImage);
          //body.append('localities', JSON.stringify(localities)); // Si es array/objeto
          //body.append('tags', JSON.stringify(tags));
          if (image.length > 1) {
            // Si hay varias imágenes
            image.forEach((item) => {
              body.append(`image`, item); // Agregar cada imagen con un nombre único
            });
          } else {
            // Si solo hay una imagen
            console.log('va por aqui');
            body.append("image", image);
          }
         


        } else {
          // Usar JSON si no hay imagen
          body =  JSON.stringify({text,uid,userIdPost,idPost})
          headers['Content-Type'] = 'application/json'; // Solo necesario en JSON
        }
      // if(userData.length === 0){
        // fetchUserData(token,setUserData,null,isLoadingFetchingUserData);
  // const fetchUserData  = (token,setData,localities,loader)=>{
    // localities en teoria =>  null;
      // }
      //NO tiene ningún loader simplemente es para cargar los datos
      // if(!loaderUserData){
        // const {username,state} = userData;
    // const data  = {input,uid,idPost,userIdPost};
   fetch(`http://localhost:5000/messages/replies/submit/post/${idParentMessage}`,{
    method : 'POST',
    headers, // Solo se envía si es JSON
    body,
  })
  .then(response => response.json())
  .then(data => {
    if(data.boolean){
      insertRelevantWords(text,idPost,data.lang);
    }
    isSendingImage(false);
    setInputVal('')
  setStatusResponse(data.boolean ? 0 : 1);
  setTimeout(()=>{
    setInputVal(''); 
    setStatusResponse(2);
   },10000)}
  )
  .catch(err => {
    console.error(err);
    isSendingImage(false);
  });
  
}}


    return (
        <>
         <div className={sendingImage  ? 'container-reply-card active' : "container-reply-card"}>
         <NavReply  query='Reply'/>
    <div className={statusResponse === 0 ? "container-reposts-options scc-options" :'container-reposts-options hidden'}>
    <div style={{textDecoration:'none'}}>
    <HiOutlineReply />
    <span> Reply succesfully executed!! </span>
    <span style={{color:'#1877F2'}}className="see-more-rep" onClick={
         ()=>{user[0].long ?  navigate(`/post/format/long/${idParentMessage}`): navigate(`/post/${idParentMessage}`)}}>see more</span>
     </div>
    </div>
        {isLoading ? (
           <><Loader /></>
        ) : 
        <>
        <div className="reply-card" >
          {user[0].response  ? 
            [1,2].map(item =>(
                    <ContentCard key={item} item={item} user={user} isReply={true} fileInputRef={fileInputRef} image={image} setImage={setImage} activateInput={activateInput}/>
                    // <ContentCard key={item} item={item} user={user} idParentMessage={idParentMessage}  fileInputRef={fileInputRef} image={image} setImage={setImage} activateInput={activateInput}/>
            ))
               :
               <ContentCard  item={1} user={user} fileInputRef={fileInputRef} image={image} setImage={setImage} activateInput={activateInput} />
}

           <div className="text-reply" style={{marginTop :user[0].response && '39px'}}>
           <textarea maxLength={251}  name="" id="" cols="30" rows="10" onChange={(e)=> setInputVal(e.target.value) }  autoFocus 
           placeholder={`Repling to ${user[0].username}...`} 
           value={inputVal} ></textarea>
           </div>  
           <div style={{padding:'5px',margin:'auto',width:'90%'}}>
           {image &&  <ContentImage isNewPost={true}  iconClose={<HiOutlineX />} indexImage={0} sendImage={image[0] && image[0].image  || []} defaultCover={defaultCover} text={''} setSendImage={setImage} image={image[0] && image[0].image  || []} setDefaultCover={setDefaultCover} formatImage={formatImage} setFormattedImage={setFormattedImage}/>}
           </div>
          

        <ToolsCard setPickeVisible={setPickeVisible} user={user} isPickleVisible={isPickleVisible} sendDefaultOptionPost={()=>sendReply(inputVal,uid.uid,user[0].useridpost,image[0],isSendingImage)} setCurrentEmoji={setCurrentEmoji} currentEmoji={currentEmoji} setInputVal={setInputVal} isReply={true} fileInputRef={fileInputRef} setImage={setImage} image={image} activateInput={activateInput}/>

           </div>
           </>
      }
        </div>
        {sendingImage && <div className="loader-snd-image"><Loader  style={{color:'red'}}/></div>}

        </>

    )
}




export default MessageReply;