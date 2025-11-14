import {useState,useContext} from 'react';
import {ContextUid} from '../../../views/SessionContext';
import {HiOutlineHeart ,HiHeart} from 'react-icons/hi'
import { CiImageOn } from "react-icons/ci";
import { useLocation, useNavigate } from 'react-router-dom';
import {PiChatCircleDots} from 'react-icons/pi'
import {generarIdMessage} from '../../js/messageToolsFn';
import { insertRelevantWords } from '../../js/sendMessages';

function MessageTools({render,response,userid,username,
    // getDefaultLocality,
    // params
    
    viewIcon,isComment,
    // A partir de aquí las interacciones
iteractionsFromDb,setIteractionsFromDb,iteractionsEnd,
 repostIcon,repostIconActive, 
 setDisplayOptionsRepost,displayOptionsRepost,addDefaultIteraction,
 counterRepost,setCounterNews,counterNews,setCounterLikes,counterLikes,setCounterReplies,counterReplies
 ,setSuccessfullOpt,counterViews
 

}) {
const uid = useContext(ContextUid);
const location = useLocation();
const navigate = useNavigate();
const [displayResponseText, setDisplayResponseText] = useState(false);
const [input,setInput] = useState(null);
// const [success,setSuccess] = useState(2);
// const path =  location.pathname.split('/');
// const idPost = location.pathname.startsWith('/post/format/long') ? path[4] :path[2];

// console.log('estas son las interacciones',iteractions);

const showResponseText = ()=>{
    // redirección del reply;
    if(location.pathname.startsWith('/post') && !isComment){
        navigate(`/post/format/reply/${response}`)
        // getDefaultLocality ? navigate(`/post/format/reply/${idPost}/${paramsLocalitie}/${getDefaultLocality}`) : navigate(`/post/format/reply/${idPost}`);
    }else{
        setDisplayResponseText(!displayResponseText)
    }
}



const getDefaultIconIteraction = (iconByDefault,iconActive,determinedPath,origen,iconActivated,booleanForRepost)=>{
    
    
    if(!iteractionsEnd){
        // console.log('ruta 1')
        return iconByDefault;
    }
    if(determinedPath){ //por ejemplo la ruta de los likes;
        // console.log('ruta 2')
        return iconActive
    }
    if(displayOptionsRepost && booleanForRepost){
        // console.log('ruta 3')
        return  iconActivated
     }

    const isItem = iteractionsFromDb.some(item => item.origen === origen && response === item.id_message);
    // console.log('resultado de is ITEM',isItem);
    if(isItem){ 
        // setIconLikes(true);
        // setIconLikes(true);
        // console.log('ruta 4');
    return  iconActive
    }else{
        return iconByDefault;
    }
}








const sendReply = (response,text,uid,setCounterReplies,counterReplies,userIdPost)=>{ 
    // const newNumReplies = replies + 1;
    

    if(text.length > 0 && text.length < 251){
        // uid,input,username,state,idPost
        const data = {uid,text,userIdPost}
        fetch(`http://localhost:5000/messages/replies/submit/post/${response}`,{
             method : 'POST',
             headers: {'Content-type':'application/json'},
             body: JSON.stringify(data)
         })
         .then(response => response.json())
         .then(data =>

             {
              if(data.boolean){
                insertRelevantWords(text,data.idPost,data.lang);
              }
              setInput('');
                 if(data.boolean){ 
                    const newNumReplies = counterReplies + 1;
                    setCounterReplies(newNumReplies);
                    setTimeout(()=>{
                        setSuccessfullOpt(null);
                      },2500)
                      setSuccessfullOpt(2);//reply efectuada con éxito
                    
                 } 
             }
                )
         .catch(err => console.error(err))
    }
}

// console.log(location.pathname.startsWith('/post') ? true : false);
const formatNumber = (num) => {
    if (num >= 1000) {
      if (num % 1000 === 0) {
        return (num / 1000) + 'K';
      } else {
        return (num / 1000).toFixed(1) + 'K';
      }
    }
    return num;
  };


    return(
        <>
       {render &&  <div className="tools formatted">
          <div className="tool" id="chat" onClick={showResponseText}>
            <span className="count">
            {counterReplies == 0 ? '' : formatNumber(counterReplies)}
            </span>
            <PiChatCircleDots class="icon"   style={{backgroundColor: displayResponseText && 'whitesmoke' }}/>
          </div>
          
          <div className="tool" id="retweet" onClick={()=> setDisplayOptionsRepost(!displayOptionsRepost)}>
            <span className="count">
            {(counterRepost === 0 ? '' : formatNumber(counterRepost))}
            </span>
                  {getDefaultIconIteraction(repostIcon,repostIconActive ,location.pathname.includes('repost'),'repost')}          

                   

          </div>
          <div className="tool" id="heart" onClick={()=> addDefaultIteraction(iteractionsFromDb,setIteractionsFromDb,`http://localhost:5000/messages/likes/add/${response}`, `http://localhost:5000/messages/likes/delete/${response}`,counterLikes,setCounterLikes,userid,'likes')}>
            <span className="count">
            {(counterLikes === 0 ? '' : formatNumber(counterLikes))}
            </span>
            {/* <HiOutlineHeart className="icon" /> */}
            {getDefaultIconIteraction(<HiOutlineHeart className="icon"/>,<HiHeart className='icon heart' /> ,location.pathname.includes('likes'),'likes')}          

          </div>
          <div className="tool" id="tn" 
              onClick={()=>addDefaultIteraction(iteractionsFromDb,setIteractionsFromDb,`http://localhost:5000/messages/topnews/add/${response}`,`http://localhost:5000/messages/topnews/delete/${response}`,counterNews,setCounterNews,userid,'topnews')}
          >
            <span className="count">
            {counterNews  === 0 ? '' : formatNumber(counterNews)}
            </span>
            {getDefaultIconIteraction(<span className="icon top-new ">TN</span>,<span className="icon top-new active ">TN</span>,location.pathname.includes('topnews'),'topnews')}          

          </div>
          <div className="tool" id="stats">
            <span className="count">
            {formatNumber(counterViews)}
            {/* Se podría poner que se añadiesen y tal pero habría que tener una transición guapa */}
            </span>
            {viewIcon}
          </div>
        </div>
        
    }
    {displayResponseText &&
        <div className="txt-res">
        <div className="inp-res">   
          <textarea name="" id="" cols="30" rows="10" maxLength={251}  onChange={(e)=> setInput(e.target.value)} value={input} autoFocus placeholder={`replying to ${username}...`} ></textarea>
          <div className='svg-res-output'>
            <CiImageOn onClick={()=> navigate(`/post/format/reply/${response}`)}/>
            <button onClick={()=> sendReply(response,input,uid.uid,setCounterReplies,counterReplies,userid)}>Reply</button>
          </div>
        </div>
    </div>  
} 
        
         {/* {render && <div className="tools ">
        <ul>

            {thread && <li className="connenct-thread bor" >thread</li>}
        <li onClick={showResponseText} className='reply-tool'>
            <PiChatCircleDots id="reply-icon"  style={{backgroundColor: displayResponseText && 'whitesmoke' }}/>
            <span style={{fontSize:'13px',position:'relative',top:'0',left:'1px'}}>{counterReplies == 0 ? '' : formatNumber(counterReplies)}</span>
            </li>
            <li className={counterRepost?.length > 0 ? "cont-repost-tool" : 'cont-repost-tool formatted'} 
            onClick={()=> setDisplayOptionsRepost(!displayOptionsRepost)}>
             <div className={getDefaultIconIteraction('main-repost-tool','main-repost-tool active',null,'repost','main-repost-tool displayed',true)}>
             {repostIcon}
             </div>
                <span >{(counterRepost === 0 ? '' : formatNumber(counterRepost))}</span>
            </li>
          

        <li className="hrt-tool"  onClick={()=> addDefaultIteraction(iteractionsFromDb,setIteractionsFromDb,`http://localhost:5000/messages/likes/add/${response}`, `http://localhost:5000/messages/likes/delete/${response}`,counterLikes,setCounterLikes,userid,'likes')}>
             {getDefaultIconIteraction(<HiOutlineHeart id='out-hrt'/>,<HiHeart style={{color:'red'}} id='out-hrt'  /> ,location.pathname.includes('likes'),'likes')}          

             <span name="likes" style={{fontSize:'13px'}}>{(counterLikes === 0 ? '' : formatNumber(counterLikes))}</span >
        </li>
      
        <li>
            <div className="container-top-news">
            <div className={getDefaultIconIteraction('top-new','top-new active',location.pathname.includes(`/added/posts/topnews`),'topnews')}
             onClick={()=>addDefaultIteraction(iteractionsFromDb,setIteractionsFromDb,`http://localhost:5000/messages/topnews/add/${response}`,`http://localhost:5000/messages/topnews/delete/${response}`,counterNews,setCounterNews,userid,'topnews'
            )}>TN</div>
              <span className="count-news-active">
              {counterNews  === 0 ? '' : formatNumber(counterNews)}
                </span>
             </div>
         </li>
         <li className="views-tools-message">
         {viewIcon }
            <span style={{fontSize:'12px',color:'#000'}}>{formatNumber(14500)}</span>
            </li>
        </ul>
    </div>}
    {displayResponseText &&
        <div className="txt-res">
        <div className="inp-res">   
          <textarea name="" id="" cols="30" rows="10" maxLength={251}  onChange={(e)=> setInput(e.target.value)} value={input} autoFocus placeholder={`replying to ${username}...`} ></textarea>
          <div className='svg-res-output'>
            <CiImageOn onClick={()=> navigate(`/post/format/reply/${response}`)}/>
            <button onClick={()=> sendReply(response,input,uid.uid,setCounterReplies,counterReplies,userid)}>Reply</button>
          </div>
        </div>
    </div>  
} */}

        </>
    )
}


export default MessageTools
