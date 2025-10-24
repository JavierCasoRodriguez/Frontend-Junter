import { HiDotsVertical, HiOutlineChat,HiOutlineBookmark,HiOutlineReply,HiOutlineX} from 'react-icons/hi'
import { FiUserCheck } from 'react-icons/fi';
import { IoStatsChartOutline,IoStatsChart } from "react-icons/io5";
import {CgSmileSad} from 'react-icons/cg'
import BottomNotifBar from '../BottomNotifBar';
import {  useNavigate,useLocation,useSearchParams } from 'react-router-dom';
import { useState,useContext,useEffect } from 'react';
import ContentMessage from './ContentMessage';
import {ContextUid} from '../../../views/SessionContext';
import OptionsMessage from './MsgOptions';
import MessageTools from './MessageTools';
import ContentLg from './ContentLongMessage';
import {formatedTime,getDefaultPostLocality,redirectToLocality,localityDef} from '../../js/messageToolsFn';
import {AiOutlineRetweet} from 'react-icons/ai'
import LongPostCard from '../Response/LongPostCard';
import ImageHeader from './ImageHeader';
import PruebaTool from './PruebaTools';



function Message({id,username,image,date,text,likes,tn,replies,repost,views,contentLong,long,thread,userid,response,parentForComment,country,region,city,iteractions,listFollowing,iteractionsEnd,filedPosts,renderLongPost,isComment,isReposted,objectReply,commentsStylesPost,isCitation,renderOptions,sendImage,setSendImage,indexImage,
  formatImage, setFormattedImage,defaultCover,setDefaultCover,contentImage,usernameAtProfileForRepost,usernameReposted
  ,setItem,setDisplayTrashMessage
}) {



  const booleanTool = true;
    const navigate = useNavigate();
    const location = useLocation();
    const uid = useContext(ContextUid);
    const renderContentPost = location.pathname.includes('new/post') ? false : true
    const [optionsMessage,setOptionsMessage] = useState(false)
    const [displayOptionsRepost,setDisplayOptionsRepost] = useState(false);
    const [iteractionsFromDb,setIteractionsFromDb] = useState([]);
    const [counterLikes, setCounterLikes] = useState(0);//recuento de likes
    const [counterNews,setCounterNews] = useState(0);
    const [counterRepost,setCounterRepost] = useState(0);
    const [counterReplies,setCounterReplies] = useState(0)
    const [counterViews,setCounterViews] = useState(0);
    const [arrFromDbFollowing, setArrFromDbFollowing] = useState([])
    const [filedPostsFromDb, setFiledPostsFromDb] = useState([])
    const [successfullOption,setSuccessfullOpt] = useState(null);
    //For not interested
    const [notInterestedIn,setNotInterestedIn] = useState(null);
    const [seenState,isSeenState] = useState(false);
    const [userState,setUserState] = useState(null);
    const [loaderUserState,setLoadingUserState] = useState(true);
    const checkUser =  <FiUserCheck className='foll-add-main active' />;
    const setId = response ? response.id_message : id;
    const styleForUserStateIcon = {color:'rgba(0, 0, 0, 0.764)',position:'relative',top:'3px',fontSize:'17px'}
    const [searchParams] = useSearchParams();

    //esto realmente sería relativo al tools y msgoptions básicamente estoy pasandolo todo;

   
      useEffect(()=>{ 
        if(iteractions?.length > 0){
            setIteractionsFromDb(iteractions);
        }
        if(listFollowing?.length > 0){
            setArrFromDbFollowing(listFollowing)
          } 
          if(filedPosts?.length > 0){
            const mappedFiledPosts = filedPosts.map(item  => item.id_message);
            setFiledPostsFromDb(mappedFiledPosts);
          }
        },[iteractionsEnd])
        
  useEffect(()=>{
            setCounterNews(tn);
            setCounterLikes(likes);
            setCounterRepost(repost);
            setCounterReplies(replies);
            setCounterViews(views);
            }, []);

           

    const  handleClick =  async (params)=> {
        // const target =  e.target;
        // const childNode = target.closest('[data-id]');
        // const idUniqueMessage = childNode.dataset.id;

        const paths = ['/new/post/format/short','/new/post/format/long' ]
        const idPost = params && long  ? id : setId;
        if(!paths.includes(location.pathname)){
          //Se podría cambiar ligeramente...  
          if(params && long){
                navigate(`/post/format/long/${id}`);
            } else if(params){ 
              navigate(`/post/${id}`);
            }else{
                navigate(`/post/${setId}`);
            }
            }
            const response = await fetch(`http://localhost:5000/messages/user/clicked/post/${idPost}`,{
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ userid})
          })
          if(!response.ok){
              console.log('fetching error');
          }
          // const result = await response.json();
      }

      const onRedirectTo = (word,navigate, event) => {
    event.stopPropagation();
    const formattedWord = word.replace(/^#/, '');
    navigate(`/search/posts?q=${formattedWord}&tag_list=true`);
  };

 

  const handleNotInterestedIn = (e)=>{
    //1º Quitas el post directamente 
    // 2º Sacas la ruta
    //3º Porque fallaba? el bottonnotifbar funciona en base a pos:absolute como nuevo elemento del message si no hay message...
  setSuccessfullOpt(2);
    setNotInterestedIn(true)
    setTimeout(()=>{
      setSuccessfullOpt(null);
      const target = e.target.closest('.cnt-par');
      target.remove();//aplicar GPT;
    },3000)
  }

  

  const renderTextWithHashtags = (text,defaultWorldColideSrch,navigate) => {
    // Dividir el texto en palabras
    const words = text.split(' ');

    // const reversedArr = words.reverse();
    // Mapear las palabras y aplicar estilos
    return words.map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <span
            key={index}
            className="coloured-item"
            onClick={(event) => onRedirectTo(word,navigate, event)}
            style={{ color: '#1877F2', cursor: 'pointer'}} // Aplicar estilos directamente
          >
            {word}{' '}
          </span >
        );
      } else {
        return <span key={index} 
        style={{color:'#000',fontFamily:'Verdana, Geneva, Tahoma, sans-serif' ,
          fontSize:'12px',fontWeight:defaultWorldColideSrch === word && 600}}>{word} </span>;
      }
    });
  }; 

    
  
  const getUserState = ()=>{
    //1 => Cambia el icono;
    isSeenState(!seenState);

    //2 => Ruta para renderizar el usuario;
    fetch(`http://localhost:5000/messages/posts/render/default/state/${username}`)
  .then(response => response.json())
   .then(result => {
    if(result === 'No state found for this user'){
      setUserState(result)
      setTimeout(()=>{
        isSeenState(false);
    },5000)
    }else{
      setUserState(result)
    }
   })
  .catch(error => {
      console.error("Error:", error);
  })
  .finally(()=>{
    setLoadingUserState(false);
  });    
    
  }
  
  
  
  const handleView = async (idPost, userId) => {
    // localStorage.removeItem('viewedPost');
    const stored = localStorage.getItem('viewedPost');
    const view = stored ? JSON.parse(stored) : [];
  
    // Evitar duplicados (solo si ese postId + userId no está ya)
    const alreadyViewed = view.some(v => v.postId === idPost && v.userId === userId);
  
    if (!alreadyViewed) {
      const updated = [...view, { postId: idPost, userId }];
      localStorage.setItem('viewedPost', JSON.stringify(updated));
  
      console.log(`Añadido post ${idPost} para el user ${userId}`);
  
      if (updated.length > 5) {
        await sendView(updated);
        localStorage.removeItem('viewedPost');
      }
    } else {
      console.log(`Post ${idPost} ya visto por el user ${userId}`);
    }
  };
  

const sendView = async (storedIdPosts)=>{

  const response = await fetch('http://localhost:5000/messages/settings/add/user/views', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uid:uid.uid,
      objectUser:storedIdPosts,
     
    })
  });

  if (!response.ok) {
    throw new Error(`Error al insertar: ${response.statusText}`);
  }

  const result = await response.json();
  //Tiras un true o false;
  if(result){
    localStorage.removeItem('viewedPost')
  }
}
  

    const onRedirectUsername = ()=>{
        if(userid === uid.uid || location.pathname.includes('/new/post/format')){
            navigate(`/${username}/posts`)
        } else{
            navigate(`/profile/users/${username}/type/posts`)
        }
    }

    const setStyles  = ()=>{
        if(response){
            return 'message-form response';
        }
        else if(location.pathname.startsWith('/post') && !location.pathname.startsWith('/post/quotes')){
          if(commentsStylesPost){
            return 'message-form children-reply'
          }
          
          if(parentForComment){
            return 'message-form-format-comment'
          }else{
            return 'message-form-format-comment children'
          }
        }
       else  if(location.pathname === '/search'){
          return 'message-form active-search'
        }
         
        // else if()
        else{
          return 'message-form'
      
         } }


    const addDefaultIteraction = (iteractionsFromDb,setIteractionsFromDb,addRoute,deleteRoute,counterItem,setCounterItem,uidPost,origen)=>{
        // console.log({iconItem:iconItem,
        //     uidPost:uidPost,
        //     // firstRenderItem:firstRenderItem
        //     })
            //params:
        //addRoute y quitRoute son las rutas;
        // iconItem => news,iconLikes
        //setIconItem => setNEWS,SETiconLikes,
        //setItemDefault =>setlikes,tn =>es el recuento que tiene el useEffect de las BDD;
        //setCounterItem => setCounterLikes,setCounterNews;
        //uidPost => uid del que envió el post
        //setFirstRenderItem => el primer renderizado para saber si le gustaron las news o likes
        //firstRenderItem => el item del primer renderizado;
        const existsIteraction = iteractionsFromDb.some(item => item.origen === origen  && id === item.id_message);
        console.log('iteracciones en general',iteractionsFromDb)
        
                if(!existsIteraction){
                    console.log('me tira esta ruta ');
                   
                    // console.log('iteracciones desde la BDD 1',iteractionsFromDb)
                    // setIconItem(true); ahora se cambia a un arrray;
                    setIteractionsFromDb((prev)=> [...prev, {origen:origen, id_message:id}])
                    // console.log('iteracciones desde la BDD 2',iteractionsFromDb)
                    // console.log(counterLikes);
                    const defNumIteractions = counterItem + 1;
                    // console.log(defNumIteractions,'newNumItem');
                    setCounterItem(defNumIteractions);
                    const data = {defNumIteractions,uid,uidPost};
                    // console.log(data,'p');
                fetch(addRoute,{
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({data})
                    })
                    .then(response => response.json())
                    .catch(err => console.log(err))        
                    // setIconItem(false);
                // setFirstRenderItem(false);
               // const newNumLikes = likes - 1;
                    }else{
                        // setIteractionsFromDb((prev)=> prev.filter(item => item.origen ===  origen && item.response  = ))
                        // console.log('iteracciones desde la BDD 3',iteractionsFromDb)
        
                         setIteractionsFromDb(prev => prev.filter(
                            (item)=> !(item.origen === origen && item.id_message === id))
                        )
                        
        
                        const defNumIteractions = counterItem - 1
                        setCounterItem(defNumIteractions);//=> aquí se puede cambair por el prev => prev -1 // sino con el counterLikes;
                        const data = {defNumIteractions,uid};
                 
                        fetch(deleteRoute,{
                            //por ahora rutas diferentes => podría ser la misma
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({data})
                        })
                        .then(response => response.json())
                        .catch(err => console.log(err))
                         }
        
                    }
        

   
      const messageFormClassName = setStyles();
      const definedUserStyles = username  && ( username.length < 7 && '7px');
      const objectLocality = getDefaultPostLocality(country,region,city,location);
    

      const defaultLocality = location.pathname.split('/')[1];
       const redirectToCitation = ()=>{
        if(defaultLocality === 'country'  || defaultLocality === 'region' || defaultLocality === 'city'){
          navigate(`/post/format/repost/quote/${id}/${defaultLocality}/${location.pathname.split('/')[2]}`)
        }else{
          navigate(`/post/format/repost/quote/${id}`)
        }
       }         

const renderFormatPost = ()=>{
  //long,true,reply
  if(location.pathname.startsWith('/post')){
    if(long){
     return  <ContentLg  tittle={text} contentLong={contentLong}
    //  tittle={tittle}
    iconClose={<HiOutlineX />}
     />
    }else{
      return  <><ContentMessage  definedUserStyles={definedUserStyles} renderTextWithHashtags={renderTextWithHashtags} text={text}  lg={long} onClick={()=> handleClick(true)} onClickRes={()=> handleClick(false)} id={id}  response={response} username={username} img={'imagen a renderizar'} navigate={navigate} location={location} localityDef={localityDef(response)} responseImage={response && <ImageHeader image={response.img}/>}  iconClose={<HiOutlineX />} sendImage={sendImage} setSendImage={setSendImage} setDefaultCover={setDefaultCover} formatImage={formatImage} setFormattedImage={setFormattedImage} defaultCover={defaultCover} contentImage={contentImage} outlineReply={<HiOutlineReply />} searchParams={searchParams} indexImage={indexImage}/></>     
    }
  }else{
   return  <><ContentMessage definedUserStyles={definedUserStyles} renderTextWithHashtags={renderTextWithHashtags} text={text}  lg={long} onClick={()=> handleClick(true)} onClickRes={()=> handleClick(false)} id={id}  response={response} username={username} img={'imagen a renderizar'} navigate={navigate} location={location} localityDef={localityDef(response)} responseImage={response && <ImageHeader image={response.img}/>} iconClose={<HiOutlineX />} sendImage={sendImage} setSendImage={setSendImage} setDefaultCover={setDefaultCover} formatImage={formatImage} setFormattedImage={setFormattedImage} defaultCover={defaultCover} contentImage={contentImage} outlineReply={<HiOutlineReply />} searchParams={searchParams} indexImage={indexImage}/></>  
  }}



return (
    <>
        <>
        <BottomNotifBar  displayOptionsRepost={displayOptionsRepost}
    successfullOption={successfullOption}
    shortPost={notInterestedIn ? 5 :0}
    navigate={navigate}
    username={username}
    outlineBookmark={<HiOutlineBookmark />}
    outlineReply={<HiOutlineReply />}
    long={long}
    id={id}
    outlineChat={<HiOutlineChat />}
    redirectToCitation={redirectToCitation}
    outlineRepost={<AiOutlineRetweet /> }
    iteractionsFromDb={iteractionsFromDb}
    fiUserCheck={<FiUserCheck className="foll-add-main active" />}
    notInterestedIn={notInterestedIn}
    CgSmileSad={<CgSmileSad style={styleForUserStateIcon}  key={3}/>} 
    addDefaultIteraction={()=> addDefaultIteraction(iteractionsFromDb,setIteractionsFromDb,`http://localhost:5000/messages/repost/add/${id}`,`http://localhost:5000/messages/repost/delete/${id}`,counterRepost,setCounterRepost,userid,'repost')}/>
        </>

        {!renderLongPost ? <div className="cnt-par" onMouseOver={()=> handleView(id,userid)}>
          
        <div className={messageFormClassName} 


        style={{border: location.pathname.includes('new/post') && 'none'}} >
            <div data-id={id} 
            >

          <header>
            
         <div className="main-header" >
    <ImageHeader image={image}/>
            <h2 className="username" onClick={onRedirectUsername} style={{left:definedUserStyles}}>{username}</h2>
        </div>
        {/* => REPLY ,ESTADO y  REPOSTS */}
            <div className={(seenState && userState?.length > 0) ?  "options-header-post ": "options-header-post"}>

              {isReposted && 
              <div className="selected-header-item reposted">
                <AiOutlineRetweet />{ location.pathname.startsWith('/friends')  ? usernameReposted : usernameAtProfileForRepost } reposted
              </div>}
            
            {(isComment && objectReply && !location.pathname.startsWith('/post'))&&
          <div className="selected-header-item">
          <span className="reply-option" onClick={()=> navigate(`/post/${objectReply.id_message}`)}>replying to {objectReply.username}</span>
          </div>}

            {seenState && 
             <div className="selected-header-item">
               <h2 className="state">{loaderUserState ? '...' : `" ${userState} "`}</h2> 
              </div>}
            </div> 
   {renderContentPost && 
         <div className="options-message">
    <div className='localities-render-type '>
           {objectLocality &&  <label onClick={()=> redirectToLocality(objectLocality,navigate)}>{ objectLocality.result}</label>}
            </div>
     <div className="parent-aside-options">
     <div className='cont-date'>
          <span className="date-default-post">
            {formatedTime(date)}
            </span>
         </div>
        
        <div className="cont-more-vert">
        <div className="more-vert-icon" onClick={()=>  setOptionsMessage(!optionsMessage)} style={{backgroundColor: optionsMessage && 'whitesmoke'}}>
       <HiDotsVertical />
        </div></div>
     </div>
       <OptionsMessage param={optionsMessage} render={renderOptions}

setDisplayTrashMessage={setDisplayTrashMessage}
       username={username} long={long} idPost={id} userid={userid} booleanForFollow={userid === uid.uid ? true :false}  
       thread={thread} isCitation={isCitation} isLocalidades={country}
       outlineBookmarkIcon={<HiOutlineBookmark  style={{position:'relative',top:'3px'}}/>} FiUserCheck={checkUser}
       viewIcon={<IoStatsChart  style={{color:'rgba(0, 0, 0, 0.764)'}}/>}
       navigate={navigate} isComment={isComment}
        seenState={seenState} getUserState={getUserState}
        CgSmileSad={<CgSmileSad style={styleForUserStateIcon}  key={3}/>} 
        styleForUserStateIcon={styleForUserStateIcon} //Mejor meter esta porción de código que el icon no?
        handleNotInterestedIn={handleNotInterestedIn}  
        setItem={setItem}

      //Filed y following;
       arrFromDbFollowing={arrFromDbFollowing} setArrFromDbFollowing={setArrFromDbFollowing}
       filedPostsFromDb={filedPostsFromDb} setFiledPostsFromDb={setFiledPostsFromDb} successfullOption={successfullOption}
       setSuccessfullOpt={setSuccessfullOpt}
       iteractionsEnd={iteractionsEnd}/>
        </div>}
            </header> 
            {/* {(location.pathname === '/post' && long === true) ?(
                <ContentLg  content={text} tittle={tittle}/>
             ):( 
                <><ContentMessage renderTextWithHashtags={renderTextWithHashtags} text={text} tittle={tittle} lg={long} onClick={()=> handleClick(true)} onClickRes={()=> handleClick(false)} id={id}  response={response} username={username} img={'imagen a renderizar'} /></>  
             )} */}
             {renderFormatPost()}

            {!booleanTool ? (
            <PruebaTool />
            ): 
           <MessageTools isComment={isComment} render={renderContentPost} response={id} userid={userid}  username={username} text={text} 
           viewIcon={<IoStatsChartOutline className="icon" />}
            
           //en teoría params y getDefaultLocality se podrían quitar;
            params={objectLocality ? objectLocality.index : null}
            getDefaultLocality={objectLocality ? objectLocality.result : null} 
            thread={thread} repost={repost} repostIcon={<AiOutlineRetweet className={displayOptionsRepost ? 'icon displayed':'icon'}  />}
            repostIconActive={<AiOutlineRetweet className={'icon active'}  />}
            // A partir de aqui va todo lo relativo a la interacciones
            setDisplayOptionsRepost={setDisplayOptionsRepost} displayOptionsRepost={displayOptionsRepost}
             iteractionsFromDb={iteractionsFromDb} setIteractionsFromDb={setIteractionsFromDb} 
             iteractionsEnd={iteractionsEnd} addDefaultIteraction={addDefaultIteraction}
             counterLikes={counterLikes} setCounterLikes={setCounterLikes}
             counterNews={counterNews} setCounterNews={setCounterNews} 
            counterRepost={counterRepost} setCounterRepost={setCounterRepost} 
            setCounterReplies={setCounterReplies} counterReplies={counterReplies}
             counterViews={counterViews}

            setSuccessfullOpt={setSuccessfullOpt}
            //User not interested in post;
          

          
         />
            }

            </div>
        </div>
    
            </div>
            : 
            (
              <LongPostCard  
              isComment={isComment}
              id={id} username={username} image={image} date={date} content={contentLong} replies={replies} uid={uid.uid}
               tittle={text}  
               repost={repost}  country={country} region={region} city={city}
                time={formatedTime(date)} userid={userid}  
               getDefaultPostLocality={getDefaultPostLocality} navigate={navigate} redirectToLocality={redirectToLocality}
               optionsMessage={optionsMessage} setOptionsMessage={setOptionsMessage}
               checkUser={checkUser} repostIcon={<AiOutlineRetweet className={displayOptionsRepost ? 'icon displayed':'icon'}  />}         
                repostIconActive={<AiOutlineRetweet className={'icon active'}  />}
                objectLocality={objectLocality}
               arrFromDbFollowing={arrFromDbFollowing} setArrFromDbFollowing={setArrFromDbFollowing}
               filedPostsFromDb={filedPostsFromDb}  setFiledPostsFromDb={setFiledPostsFromDb}
               successfullOption={successfullOption} setSuccessfullOpt={setSuccessfullOpt}
               iteractionsEnd={iteractionsEnd} 
               setDisplayOptionsRepost={setDisplayOptionsRepost} displayOptionsRepost={displayOptionsRepost}
               iteractionsFromDb={iteractionsEnd && iteractionsFromDb}  setIteractionsFromDb={setIteractionsFromDb} addDefaultIteraction={addDefaultIteraction}
               counterLikes={counterLikes}     setCounterLikes={setCounterLikes} counterNews={counterNews} setCounterNews={setCounterNews}
               counterRepost={counterRepost} 
               counterViews={counterViews}
                 setCounterRepost={setCounterRepost} 
               renderTextWithHashtags={renderTextWithHashtags}
               viewIcon={<IoStatsChartOutline className="icon" />}
               CgSmileSad={<CgSmileSad style={styleForUserStateIcon}  key={3}/>} 
               /> 
          )
        }
        </>
)}

export default Message
