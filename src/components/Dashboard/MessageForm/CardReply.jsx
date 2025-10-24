import { Link, useNavigate } from "react-router-dom"
import { CiImageOn } from "react-icons/ci";
import {PickleEmticon,ContentPickleEmoticon} from '../NewMessage/PickleEmticon';
import {localityDef} from '../../js/messageToolsFn';
import ImageHeader from './ImageHeader';
import {handleImageUpload} from '../../js/sendMessages';
import NoLocalityFound from '../NewMessage/NoLocalityFound'
import ContentImage from './ContentImage';
const CardReply = ({user,setInputVal,idParentMessage,
navigate   ,statusResponse ,sendQuote,currentEmoji,setCurrentEmoji,setPickeVisible,isPickleVisible,fileInputRef,image,setImage,activateInput})=>{
// lo de las imágenes se las pasa también a los otros componentes;


    return(
        <>
        {user && (
            <>
           {statusResponse === 2 ? (
              <NoLocalityFound navigate={navigate} handleText={location.pathname.split(' ')[6]} />          
            ): 
            <div  className={user[0].response ? 'reply-card engagements response': 'reply-card engagements'}>
                
            {user[0].response  ? 
            [1,2].map(item =>(
                    <ContentCard key={item} item={item} user={user} idParentMessage={idParentMessage}  fileInputRef={fileInputRef} image={image} setImage={setImage} activateInput={activateInput}/>
            ))
               :
               <ContentCard  item={1} user={user} idParentMessage={idParentMessage}   fileInputRef={fileInputRef} image={image} setImage={setImage} activateInput={activateInput}/>
}

        <div>
        </div>
        <ToolsCard setPickeVisible={setPickeVisible} user={user} isPickleVisible={isPickleVisible} sendDefaultOptionPost={sendQuote} setCurrentEmoji={setCurrentEmoji} currentEmoji={currentEmoji} setInputVal={setInputVal}  fileInputRef={fileInputRef} image={image}  setImage={setImage} activateput={activateInput} />
        </div>}
            </>

        )}
        </>
    )
}



const ContentCard = ({item,user,isReply,idParentMessage })=>{
const navigate = useNavigate();
const defaultHeaderUser = item === 1 ? [user[0].img,user[0].username ]: [user[0].response.img,user[0].response.username];
// const defaultUsername = item === 1 ? user[0].username : user[0].response.username
const defaultLocality = user[0].country && localityDef(user[0]) 
console.log('user[0]',user[0]);
    const setStyles = ()=>{
        if(item === 2){
            if(isReply){
          return  'content-parent-post-for-reply formatted'
            }
            else{
        return  'content-parent-post-for-reply response'
            }
        }
        else{
        return 'content-parent-post-for-reply'
    }}

    const onRedirectTo = (word,navigate, event) => {
        event.stopPropagation();
        const formattedWord = word.replace(/^#/, '');
        navigate(`/search/posts?q=${formattedWord}&tag_list=true`);
      };
    const renderTextWithHashtags = (text,navigate) => {
        // Dividir el texto en palabras
        const words = text.split(' ');
    
        // Mapear las palabras y aplicar estilos
        return words.map((word, index) => {
          if (word.startsWith('#')) {
            return (
              <span
                key={index}
                className="coloured-item"
                onClick={(event) => onRedirectTo(word,navigate, event)}
                style={{ color: '#1877F2', cursor: 'pointer' }} // Aplicar estilos directamente
              >
                {word}{' '}
              </span>
            );
          } else {
            return <span key={index}>{word} </span>;
          }
        });
      }; 



    return(
        <div  className={setStyles()} >
            <div >

        </div>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            {/* 1 Header Post */}
        <div className="main-header-parent-post">
        {/* <img src="/images/usuario.png"/> */}
        <ImageHeader image={defaultHeaderUser[0]}/>
        <h4 style={{ left:defaultHeaderUser[1].length < 7 && '5px'}}className="username">{defaultHeaderUser[1]}
        </h4>
        </div>
      {/* 2 Replying*/}
      <div className= "options-header-post">
      <span className="reply-option  quotes" 
      onClick={()=> user[0].objectReply && navigate(`/post/${user[0].objectReply.id_message}`)}
      >
        {user[0].objectReply && `replying to ${user[0].objectReply.username}`}
     
      </span>

      </div >
      {/* 3 Locality*/}

<div className="localities-render-type quotes">
{/* {objectLocality && */}
  <label 
  onClick={()=>  defaultLocality && navigate(`/${user[0].is_localidades}/${defaultLocality.filter(item => item)}`)}
  >
   {defaultLocality}
    </label>
  {/* } */}

</div>
          </div>
        
        <div className="content-parent-post"  >
            <div style={{whiteSpace:'pre-wrap',wordBreak:'break-word'}}>
            {item === 1 ? renderTextWithHashtags(user[0].content,navigate) :renderTextWithHashtags(user[0].response.content,navigate)}
            {user[0].long  && <Link to={location.pathname !=='/new/post/format/long' && `/post/format/long/${idParentMessage}`} id="lnk-lG-path">Read more</Link>}  
           <div style={{width:'100%',textAlign:'center',marginTop:'15px'}}>
            {(user[0].exist_image || user[0].response && user[0].response.exists_image ) &&
              <ContentImage contentImage={item === 1 ? user[0].content_images : user[0].response.content_images} />
              }               
           </div>
                </div>            
               
        </div>
       
              </div>
         
    )
}

//Pickle,imagen y send;
const ToolsCard = ({setPickeVisible,user,isPickleVisible,sendDefaultOptionPost,setCurrentEmoji,currentEmoji,setInputVal,isReply, fileInputRef,setImage,image, activateInput})=>{
//activateInputForImage,fileInputRef,setImage => 
    //Hay que añadir el long post para ambos por si es long;
console.log(image,'imagen del tools');
    return(
        <>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',marginTop:!user[0].response ? '18px' : '0',alignItems:'center'}} >
    <div className="img-ic-tools reply"  onClick={()=> activateInput(fileInputRef)} >
    <CiImageOn />
    </div>
    <PickleEmticon  setPickeVisible={setPickeVisible} isPickleVisible={isPickleVisible} pickleSize={20} parmasForStyles={3}/>
        </div>
        <div  style={{ display: "none" }}>
          {/* Lo dejo aquí escondido porque esta parte del input se renderiza en amos casos */}
        <div>
        <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload(setImage,image[0],0)}
        />
        </div>
       </div>

    <button  
    //onClick relativo al repost (citation);
    onClick={sendDefaultOptionPost} 
    className="btn-format-reply" style={{top:user[0].response && ( isReply ? '-9px' : '5px') }}>{isReply ?'Reply': 'Post'}</button>       
    </div>
               <ContentPickleEmoticon setCurrentEmoji={setCurrentEmoji}  currentEmoji={currentEmoji} setInput={setInputVal} isPickleVisible={isPickleVisible} paramsForStyle={2}/>
        
        </>
    )
}
export {CardReply,ContentCard,ToolsCard};