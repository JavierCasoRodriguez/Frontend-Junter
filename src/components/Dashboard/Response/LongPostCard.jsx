import { useState,useEffect } from "react";
import { HiDotsVertical,HiOutlineBookmark } from "react-icons/hi";
import OptionsMessage from "../MessageForm/MsgOptions";
import MessageTools from "../MessageForm/MessageTools";
import ImageHeader from "../MessageForm/ImageHeader";
import BottomNotifBar from '../BottomNotifBar';
import {HiOutlineTrash} from 'react-icons/hi'

function formatTextForReadMore(texto, porcentaje = 20) {
    const numCaracteres = Math.ceil((texto.length * porcentaje) / 100);
    const textoCortado = texto.slice(0, numCaracteres);
  
    // Encontrar el último espacio para cortar en una palabra completa
    const ultimoEspacio = textoCortado.lastIndexOf(" ");
    return textoCortado.slice(0, ultimoEspacio);
  }


function LongPostCard({id,username,image,state,tittle,country,
    region,city,content,time,userid,replies,text,repost,uid,
    getDefaultPostLocality,renderTextWithHashtags
    ,navigate,redirectToLocality,optionsMessage,setOptionsMessage,
    checkUser,repostIcon,objectLocality,CgSmileSad,
    arrFromDbFollowing, setArrFromDbFollowing,
    filedPostsFromDb, setFiledPostsFromDb, 
    successfullOption,setSuccessfullOpt,isComment,
    iteractionsEnd,
    setDisplayOptionsRepost, displayOptionsRepost,
     iteractionsFromDb,setIteractionsFromDb,addDefaultIteraction,
      counterLikes, setCounterLikes,
      counterNews, setCounterNews,counterViews,
      counterRepost, setCounterRepost,repostIconActive,viewIcon
}) {
   

        const [displayTrashMessage,setDisplayTrashMessage] = useState(false);
        const [readMoreBtn,setReadMoreBtn] = useState(false);
        useEffect(()=>{
           console.log(content.length);
          if(content.length > 1200){
            setReadMoreBtn(true);
          }
        },[]);


        return (
        <>
        <div className="header-long-posts" >
        {/* 1. Encabezado principal */}
        <div className="main-header-long-post">
          <ImageHeader  image={image}/>
          {/* Nombre del usuario */}
          
            <h2 className="username-lg" onClick={() => navigate(`/profile/users/${username}/type/posts`)}>
          {/* {mainPost[0].username} */}
          {username}
            </h2>
          
        </div>
  
        {/* 2. Estado del usuario */}
        <div className="state-lg">
          <h3>{state}</h3>
        {/* <h3>Mi estado</h3> */}
        </div>
        <div className="options-message" >
        <div className="localities-render-type long">
           {getDefaultPostLocality(country,region,city,location) && 
            <label onClick={()=> redirectToLocality(getDefaultPostLocality(country,region,city,location),navigate)}>
              {getDefaultPostLocality(country,region,city,location).result}
           </label>}
           <label></label>
  
            </div>
            <div className="parent-aside-options">
            <div className='cont-date'>
          <span className="date-default-post">
            {time}
            </span>
         </div>
        
        <div className="cont-more-vert">
        <div className="more-vert-icon" 
        onClick={()=>  setOptionsMessage(!optionsMessage)} style={{backgroundColor: optionsMessage && 'whitesmoke'}}
      > <HiDotsVertical />
        </div></div>
                </div>
                
       <OptionsMessage param={optionsMessage} render={5}  username={username} long={true} idPost={id} userid={userid} 
       booleanForFollow={userid === uid}
       CgSmileSad={CgSmileSad}
       path={location.pathname}
       setDisplayTrashMessage={setDisplayTrashMessage}

       // booleanForFollow={userid === uid.uid ? true :false} 
       outlineBookmarkIcon={<HiOutlineBookmark />} FiUserCheck={checkUser}
       //Filed y following;
       viewIcon={viewIcon} navigate={navigate}
       arrFromDbFollowing={arrFromDbFollowing} setArrFromDbFollowing={setArrFromDbFollowing}
       filedPostsFromDb={filedPostsFromDb} setFiledPostsFromDb={setFiledPostsFromDb} successfullOption={successfullOption}
       setSuccessfullOpt={setSuccessfullOpt}
       iteractionsEnd={iteractionsEnd}/>

{/* <OptionsMessage param={optionsMessage} render={renderOptions}  
       username={username} long={long} idPost={id} userid={userid} booleanForFollow={userid === uid.uid ? true :false}  
       thread={thread} isCitation={isCitation} isLocalidades={country}
       outlineBookmarkIcon={<HiOutlineBookmark />} FiUserCheck={checkUser}
       viewIcon={<IoStatsChart  style={{color:'rgba(0, 0, 0, 0.764)'}}/>}
       navigate={navigate} isComment={isComment} */}
                
                 
        </div>
      </div>
        {/* 3. Resto del contenido */}
        <div className="overlay-lg"  >
          <h3>{renderTextWithHashtags(tittle,navigate)}</h3>

        </div>
  <div className="content-posts-lg" >
        <p  style={{ whiteSpace: "pre-line",fontSize:'14px',fontFamily:'Verdana, Geneva, Tahoma, sans-serif'}}>{readMoreBtn ? `${formatTextForReadMore(content,20)}...` :content }</p> 
       
       {readMoreBtn && 
         // }}
         <span 
         className="read-more-btn"
         onClick={()=> setReadMoreBtn(false)}
         >Read more</span>
        }
  </div>
        <div style={{position:'relative',top:'-10px',width:'92%'}}>
      
        <MessageTools  isComment={isComment} render={true} response={id} userid={userid} replies={replies} username={username} text={text} 
            params={objectLocality ? objectLocality.index : null} 
            getDefaultLocality={objectLocality ? objectLocality.result : null} 
             repost={repost} repostIcon={repostIcon} repostIconActive={repostIconActive}
            // A partir de aqui va todo lo relativo a la interacciones
            setDisplayOptionsRepost={setDisplayOptionsRepost} displayOptionsRepost={displayOptionsRepost}
             iteractionsFromDb={iteractionsFromDb} setIteractionsFromDb={setIteractionsFromDb}  iteractionsEnd={iteractionsEnd} addDefaultIteraction={addDefaultIteraction}
             counterLikes={counterLikes} setCounterLikes={setCounterLikes}
             counterNews={counterNews} setCounterNews={setCounterNews} 
            counterRepost={counterRepost} setCounterRepost={setCounterRepost} 
            viewIcon={viewIcon}  counterViews={counterViews} 
         />
              
{displayTrashMessage &&
     <BottomNotifBar trashIcon={< HiOutlineTrash color={'red'} />}   successfullOption={2}
    shortPost={6} navigate={navigate} isFastPost={true} />
    
    }

        </div>
        </>
    )
}

export default LongPostCard
