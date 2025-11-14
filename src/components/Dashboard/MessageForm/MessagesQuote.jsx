import { useState,useContext,useRef } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import NavReply from '../../../views/Nav';
import { ContextUid } from "../../../views/SessionContext";
import Loader from "../../../views/processing/FastLoader";
import {fetchingData} from '../../js/renderMessages'
import {CardReply} from './CardReply';
import { HiOutlineChat,HiOutlineX  } from "react-icons/hi";
import {activateInput,insertRelevantWords} from '../../js/sendMessages';
import ContentImage from './ContentImage';
import { useQuery } from "@tanstack/react-query";



function MessagesQuote() {
    const location = useLocation();
    const path = location.pathname.split('/');
    const navigate = useNavigate();
    const uid = useContext(ContextUid);
    const [inputVal,setInputVal] = useState('');
    // const [user,setUser] = useState(null);
    // const [loader,isLoading] = useState(true);
    const [statusResponse,setStatusResponse] = useState(3);
    const [username,setUsername] = useState('');//username sacado al final;
    const [isPickleVisible,setPickeVisible] = useState(false);
    const [currentEmoji,setCurrentEmoji] = useState(null)
    const idParentMessage = path[5];
    const paramsLocality = path[6];
    const defLocality = path[7]

//Para el envio con imágenes
const fileInputRef = useRef(null);
const [image,setImage] = useState([]);
const [defaultCover,setDefaultCover] = useState(false);
const [formatImage,setFormattedImage] = useState(1);
const [sendingImage,isSendingImage] = useState(false);


    // useEffect(()=>{
    //     fetchingData(`http://localhost:5000/messages/content/post/format/reply/${idParentMessage}?format=quote`,token,isLoading).then(data =>{
    //         console.log('estso ',data);
    //       setUser(data);
    //     })
    //    },[location.pathname]);
 
    //    console.log(image);

       const {data:user,isLoading} = useQuery({
           queryKey: ['repliesPosts', idParentMessage],
           queryFn: () => fetchingData(`http://localhost:5000/messages/content/post/format/reply/${idParentMessage}?format=quote`),
           enabled: !!idParentMessage, // evita correr antes de que estén listos
           // staleTime: 1000 * 60 * 5,
       })
       const sendQuote = (url,text,locality,params,uid,userIdPost,image)=>{
        if(image || (text.length > 0 && text.length < 250)){

            let body;
            let headers = {};
            if (image) {
                const resultImage = image.image;
                // Usar FormData si hay imagen
                isSendingImage(true);
                body = new FormData();
                body.append('text', text);
                body.append('uid', uid);
                body.append('localities', locality); // Si es array/objeto
                body.append('userIdPost',userIdPost);
                // body.append('tags', tags); los tags los saco en el backend
                if (resultImage.length > 1) {
                    // Si hay varias imágenes
                    image.forEach((item) => {
                      body.append(`image`, item); // Agregar cada imagen con un nombre único
                    });
                  } else {
                    // Si solo hay una imagen
                    console.log('va por aqui');
                    body.append("image", resultImage);
                  }              } else {
                // Usar JSON si no hay imagen
                body =  JSON.stringify({text,locality,params,uid,userIdPost})
                headers['Content-Type'] = 'application/json'; // Solo necesario en JSON
              }
           
            fetch(url,{
                method : 'POST',
                headers, // Solo se envía si es JSON
                body,
            })
            .then(response => response.json())
            .then(data => {
                console.log('estos son los datos',data)
                if(data.index === 1){
                insertRelevantWords(text,data.idPost,data.lang);
                isSendingImage(false);
                    setUsername(data.username)
                    setStatusResponse(1);
                setTimeout(() => {
                    setStatusResponse(3)
                }, 5000);
                setInputVal('');
                console.log('success')
                }else if(data.index === 2){
                isSendingImage(false);
                    setStatusResponse(2);
                    setTimeout(() => {
                        setStatusResponse(3)
                    }, 5000);//ojo porque se repite código;
                }
            })

            .catch(err => {
                console.error(err);
                isSendingImage(false);
              });
        }
       }


       const setHeightInputCard = ()=>{
        if(image){
            if(inputVal.length > 130){
                return '18%';     
                 }else{
                     return '13%';
                 }
        }else{
            if(inputVal.length > 130){
           return '30%';     
            }else{
                return '20%';
            }
        }
       }
  
    return (
        <div className={sendingImage ? 'container-engagement-from-repost active' : "container-engagement-from-repost"}>
            <NavReply query='Engagements '/>
               <div className={statusResponse === 1 ? "container-reposts-options scc-options" :'container-reposts-options hidden'}>
                <div style={{textDecoration:'none'}}>
                <HiOutlineChat />
                <span> The citation has been  succesfully executed!! </span>
                <span style={{color:'#1877F2'}}className="see-more-rep" onClick={
                     ()=> navigate(`/${username}/posts`)}>see more</span>
                 </div>
                </div>
            {isLoading ? (
            <Loader />
            ): (
                <>
                 <div className={image ? 'engagement-card-input image':"engagement-card-input"} style={{height:setHeightInputCard()}}>
                <textarea maxLength={251} name="" id="" cols="30" rows="10" onChange={(e)=> setInputVal(e.target.value)}  
                value={inputVal} autoFocus 
                placeholder={!defLocality ? 'Citation on Junter' : `Citation on ${decodeURIComponent(defLocality)}...`}
                style={{height:image ? '50%':'100%'}}
                >
                </textarea>
                </div> 
               <>
               <div style={{padding:'5px',margin:'auto',width:'90%'}}>
                {image &&  <ContentImage isNewPost={true}  iconClose={<HiOutlineX />} indexImage={0} sendImage={image[0] && image[0].image  || []} defaultCover={defaultCover} text={''} setSendImage={setImage} image={image[0] && image[0].image  || []} setDefaultCover={setDefaultCover} formatImage={formatImage} setFormattedImage={setFormattedImage}/>}
                {/* {image &&  <ContentImage isNewPost={true}  iconClose={<HiOutlineX />} indexImage={0} sendImage={image[0] && image[0].image  || []} defaultCover={defaultCover} text={''} setSendImage={setImage} image={image[0] && image[0].image  || []} setDefaultCover={setDefaultCover} formatImage={formatImage} setFormattedImage={setFormattedImage}/>} */}

                </div>

                {inputVal.length > 0 &&
                <div className="counter-inp-rep">
                <span>{`${inputVal.length}/251`}</span>
                </div> }
               <CardReply user={user} setInputVal={setInputVal}
               sendQuote={()=> sendQuote(`http://localhost:5000/messages/send/post/repost/engagements/${idParentMessage}`,inputVal,defLocality,paramsLocality,uid.uid,user[0].useridpost,image[0])}
                setPickeVisible={setPickeVisible} isPickleVisible={isPickleVisible} 
                currentEmoji={currentEmoji} setCurrentEmoji={setCurrentEmoji}
                idParentMessage={idParentMessage} navigate={navigate} statusResponse={statusResponse}
                // Relativo a las imágenes
                fileInputRef={fileInputRef} image={image} setImage={setImage} activateInput={activateInput}
               />
               </>
               {sendingImage && <div className="loader-snd-image"><Loader  style={{color:'red'}}/></div>}                </>
            )}
            </div>

    )
}

export default MessagesQuote
