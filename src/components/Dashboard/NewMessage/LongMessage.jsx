import { useEffect, useState,useContext } from "react";
import {ContextUid} from '../../../views/SessionContext.jsx';
import BottomNotifBar from '../BottomNotifBar.jsx';
// import { CiImageOn } from "react-icons/ci";
import ContentImage from '../MessageForm/ContentImage.jsx';
import getToken from "../../js/verifyToken.js";
import { useNavigate,useLocation } from "react-router-dom";
import {handleDecodedTextUri,handleChangeTextLocalities,getActualPathForLocalities, removeParentHashtagg} from '../../js/sendMessages.js';
import {HashtaggComp} from './HashtaggComp.jsx';
import { HiOutlineX } from "react-icons/hi";
import {PickleEmticon,ContentPickleEmoticon} from './PickleEmticon.jsx';
import NoLocalityFound from './NoLocalityFound.jsx';
import {ContextLocal} from '../../../views/ProviderLocal.jsx' 
import FastLoader from '../../../views/processing/FastLoader.jsx';


function LongMessage() {

    const uid = useContext(ContextUid);
    const navigate =  useNavigate();
    // const token  = getToken(() => navigate('/auth/login'));
    const location = useLocation();
    const [sendingPost,isSendingPost] = useState(false);
    const [topNew,activeTopNew] = useState(false);
    const {localidades,loaderLocalidades} = useContext(ContextLocal) ;
    const [localities,setLocalities] = useState([]);
    const [displayLocalities,setDisplayLocalities] = useState(true);
    const [displayBarTopNews,setDisplayBarTopNews] = useState(false);
    const [isPickleVisible,setPickeVisible] = useState(false);
    const [currentEmoji,setCurrentEmoji] = useState(null);

    // const [blur,setInputBur] = useState(false);
    // const [preview,setPreview] = useState(false);
    const [tag,setTag] = useState(false);
    const [displayListHashtagg,setDisplayListHashtagg] = useState(false);
    const [defInputHash,setDefInputHash]  = useState([]);
    const [tittle,setTittle] = useState('');
    const [content,setContent] = useState('');
    const [lastInputClicked,setLastInputClicked] = useState(true);
    const [userLocality,setUserLocality] = useState(false);

    //Imagenes
    // const fileInputRef = useRef(null); //para que al darle click a la imagen haga el efecto del input;
    const [image,setImage] = useState(null);
    const [defaultCover,setDefaultCover] = useState(false);
    const [formatImage,setFormattedImage] = useState(1); 
    
    useEffect(()=>{
        const newLocalities = { ...localidades, nuevaClave: "Junter" };
        const result = Object.values(newLocalities);
        setLocalities(result) 
    },[])





    const handleTopNew = (activeTopNew)=>{
    activeTopNew(!topNew);
    if(!topNew){
        setDisplayBarTopNews(true);
        setTimeout(()=>{
            setDisplayBarTopNews(false);
        },2500)

    }else{
        setDisplayBarTopNews(false);
    }
    }

    const objectTools = {
        name:[location.pathname === '/new/post/format/long'? '  JUNTER': handleDecodedTextUri(),
            //  <div key={1} className="img-ic-tools long"><CiImageOn    /></div>,
        <div className={tag ? "add-tag-lg active" : "add-tag-lg"} key={4}>#</div>,<div key={5} className={topNew ? "top-new-long active" : "top-new-long"}>TN</div>,<PickleEmticon key={5} setPickeVisible={setPickeVisible} isPickleVisible={isPickleVisible} pickleSize={17} paramsForEmoticonStyles={0}/>],
        className:[displayLocalities ? "localities-options-lg" : 'localities-options-lg active','',""],
        onClick:[()=>setDisplayLocalities(!displayLocalities)
            // ()=> activateInput(fileInputRef)
            ,()=>setTag(!tag),()=> handleTopNew(activeTopNew)],            

    }

    return (
        <div className={sendingPost ? "container-lgMsg active" :"container-lgMsg "}>
            <textarea id="tittle-lgMsg" placeholder='Tittle...' value={tittle} onChange={(e) => setTittle(e.target.value)}>
            </textarea>
            <>
            {userLocality &&  <NoLocalityFound navigate={navigate} handleText={handleDecodedTextUri()} />}
            </>
            {tittle.length > 0  &&  <span className="length-tittle">{tittle.length}/130</span>}
            {image &&  <ContentImage isNewPost={true}  iconClose={<HiOutlineX />} sendImage={image} defaultCover={defaultCover} text={''} setSendImage={setImage} setDefaultCover={setDefaultCover} formatImage={formatImage} setFormattedImage={setFormattedImage}/>}
         {displayListHashtagg && <div className="list-tags-format-long" >
            <label>{defInputHash}</label>
              <HiOutlineX className="cls-ic-hashtagg" onClick={()=> removeParentHashtagg(setDisplayListHashtagg,setDefInputHash)}/>
            </div>}
            
           {sendingPost && <div style={{position:'absolute',left:'50%'}}>
                <FastLoader />
            </div>}
            <textarea name="content" id="body-lgMsg" cols="30" rows="10" placeholder="writting..." value={content} onChange={(e) => setContent(e.target.value)} onClick={()=> setLastInputClicked(false)} style={{border:image && 'none'}}></textarea>

            <div className="tools-lg" >
        <ul>
            {objectTools.name.map((item,index)=>(
                <li className={objectTools.className[index]} onClick={objectTools.onClick[index]} key={index}>{item}</li>
            ))}
        </ul>
    </div> 
            <button onClick={()=>sendLgMessage(tittle,content,uid.uid,defInputHash,topNew)} className="btn-submit"  style={{position:'relative',top:'-40px'}}>Post</button>
          
          <><HashtaggComp tag={tag} setDisplayListHashtagg={setDisplayListHashtagg} setTag={setTag}  setDefInputHash={setDefInputHash}/></>
          <ContentPickleEmoticon setCurrentEmoji={setCurrentEmoji}  currentEmoji={currentEmoji} setInput={lastInputClicked ? setTittle : setContent} isPickleVisible={isPickleVisible} paramsForStyle={1} />
          {displayBarTopNews && <BottomNotifBar   successfullOption={2}
 shortPost={4} navigate={navigate} 
//  <IoIosCheckmarkCircleOutline  style={{color:'gray;',position:'relative',left:'-3px',top:'5px',fontSize:'22px'}}/>

/>}
{/* <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload(setImage)}
      /> */}

          {!displayLocalities && <div className="localites-cont-display-lg visible" >
         
            {
                localities.map((element,index) => (
                       <div key={index}
                       onClick={()=>{
                        handleChangeTextLocalities(index,'long',localities[0],localities[1],localities[2],navigate),
                        setDisplayLocalities(false)}}><h4 style={{padding:localities[index].length > 15 && '2px'}}>{!loaderLocalidades ? '...' : localities[index]}</h4></div>
            
                ))}
            </div>}
            </div>
    )
}



export default function LongPost() {


      const uid = useContext(ContextUid);
    const navigate =  useNavigate();
    // const token  = getToken(() => navigate('/auth/login'));
    const location = useLocation();
    const [sendingPost,isSendingPost] = useState(false);
    const [topNew,activeTopNew] = useState(false);
    const {localidades,loaderLocalidades} = useContext(ContextLocal) ;
    const [localities,setLocalities] = useState([]);
    const [displayLocalities,setDisplayLocalities] = useState(true);
    const [displayBarTopNews,setDisplayBarTopNews] = useState(false);
    const [isPickleVisible,setPickeVisible] = useState(false);
    const [currentEmoji,setCurrentEmoji] = useState(null);

    // const [blur,setInputBur] = useState(false);
    // const [preview,setPreview] = useState(false);
    const [tag,setTag] = useState(false);
    const [displayListHashtagg,setDisplayListHashtagg] = useState(false);
    const [defInputHash,setDefInputHash]  = useState([]);
    const [title, setTitle] = useState("");
    const [content,setContent] = useState('');
    const [lastInputClicked,setLastInputClicked] = useState(true);
    const [userLocality,setUserLocality] = useState(false);

    //Imagenes
    // const fileInputRef = useRef(null); //para que al darle click a la imagen haga el efecto del input;
    const [image,setImage] = useState(null);
    const [defaultCover,setDefaultCover] = useState(false);
    const [formatImage,setFormattedImage] = useState(1); 
    
    useEffect(()=>{
        const newLocalities = { ...localidades, nuevaClave: "Junter" };
        const result = Object.values(newLocalities);
        setLocalities(result) 
    },[])





    const handleTopNew = (activeTopNew)=>{
    activeTopNew(!topNew);
    if(!topNew){
        setDisplayBarTopNews(true);
        setTimeout(()=>{
            setDisplayBarTopNews(false);
        },2500)

    }else{
        setDisplayBarTopNews(false);
    }
    }

 
    //   console.log('estas son las localidades',Object.values(localities))
    const sendLgMessage = async  (tittle,content,uid,defInputHash,topNew,e)=>{
       //repetir el código de shortMessage;
       e.preventDefault();
       const localities = getActualPathForLocalities(location.pathname);
       isSendingPost(true);
       if(image || (tittle.length > 0 && tittle.length < 250)){ //Triple validación
        // const tags = [defInputHash];
        const tags  = defInputHash.length === 0 ? defInputHash :  [defInputHash];

        const data = {tittle,content,uid,localities,tags,topNew};
        const response  =  await fetch('http://localhost:5000/messages/send/post/long',{
            method:'POST',
            headers:{
             'Content-type':'application/json',
         },
         credentials:"include",
         body: JSON.stringify({data})
     })
  
     if (!response.ok) {
        throw new Error('Error al enviar los datos');
      }else{
        const data = await response.json();
        const {boolean,idPost} = data;
        isSendingPost(false);
        // console.log('data',data);
        if(boolean){
            navigate(`/post/format/long/${idPost}`)
        }else if(data === 2){ //Es la manera de hacer la comprobación sin objeto
            setUserLocality(true);
            setTimeout(()=>{
                setUserLocality(false);
            },8000)

        }else{
            alert('There has been an error uploading the post.Try again later');
        }
    }    
       } 
    }

   
    const objectTools = {
        name:[location.pathname === '/new/post/format/long'? '  JUNTER': handleDecodedTextUri(),
            //  <div key={1} className="img-ic-tools long"><CiImageOn    /></div>,
        <div className={tag ? "add-tag-lg active" : "add-tag-lg"} key={4}>#</div>,<div key={5} className={topNew ? "top-new-long active" : "top-new-long"}>TN</div>,<PickleEmticon key={5} setPickeVisible={setPickeVisible} isPickleVisible={isPickleVisible} pickleSize={17} paramsForEmoticonStyles={0}/>],
        className:[displayLocalities ? "localities-options-lg" : 'localities-options-lg active','',""],
        onClick:[()=>setDisplayLocalities(!displayLocalities)
            // ()=> activateInput(fileInputRef)
            ,()=>setTag(!tag),()=> handleTopNew(activeTopNew)],            

    }
  return (
    <div className={sendingPost ? "longpost-container active" : "longpost-container"}>
      <form onSubmit={(e)=> sendLgMessage(title,content,uid.uid,defInputHash,topNew,e)} className="longpost-form">
        {/* Título */}
        <input
          type="text"
          className="longpost-title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={240}
          required
        />
         {title.length > 0  &&  <span className="length-tittle">{title.length}/240</span>}
        
          <>
            {userLocality &&  <NoLocalityFound navigate={navigate} handleText={handleDecodedTextUri()} />}
            </>
        {/* Cuerpo */}
        <textarea
          className="longpost-body"
          placeholder="Start writting your story here..."
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          
        />

            {displayListHashtagg && <div className="list-tags-format-long" >
            <label>{defInputHash}</label>
              <HiOutlineX className="cls-ic-hashtagg" onClick={()=> removeParentHashtagg(setDisplayListHashtagg,setDefInputHash)}/>
            </div>}
            {sendingPost && <div style={{position:'absolute',left:'50%'}}>
                <FastLoader />
            </div>}
        {/* Herramientas */}
        <div className="longpost-tools">
          {objectTools.name.map((item,index) =>(
              <button type="button" className={index === 0 ? objectTools.className[index] :"tool-item"} onClick={objectTools.onClick[index]}>{item}</button>
          ))}
        </div>
       
           <><HashtaggComp tag={tag} setDisplayListHashtagg={setDisplayListHashtagg} setTag={setTag}  setDefInputHash={setDefInputHash}/></>


        {/* Botón de envío */}
        <button type="submit" className="longpost-submit">Post</button>
                    {displayBarTopNews && <BottomNotifBar   successfullOption={2}
                    shortPost={4} navigate={navigate} 
        //  <IoIosCheckmarkCircleOutline  style={{color:'gray;',position:'relative',left:'-3px',top:'5px',fontSize:'22px'}}/>
                         />}
                         
        <ContentPickleEmoticon setCurrentEmoji={setCurrentEmoji}  currentEmoji={currentEmoji} setInput={lastInputClicked ? setTitle : setContent} isPickleVisible={isPickleVisible} paramsForStyle={1} />
          {!displayLocalities && <div className="localites-cont-display-lg visible" >
            {
                localities.map((element,index) => (
                    <div key={index}
                    onClick={()=>{
                        handleChangeTextLocalities(index,'long',localities[0],localities[1],localities[2],navigate),
                        setDisplayLocalities(false)}}><h4 style={{padding:localities[index].length > 15 && '2px'}}>{!loaderLocalidades ? '...' : localities[index]}</h4></div>
                        
                    ))}
                  
            </div>}
                       

      </form>
    </div>
  );
}
