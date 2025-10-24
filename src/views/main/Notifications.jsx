import Nav from '../../views/Nav';
import {HiOutlineHeart,HiHeart,HiOutlineChat,HiChat,HiOutlineReply } from 'react-icons/hi'
import {GoNote } from 'react-icons/go'
import { useState,useEffect } from 'react';
import { useNavigate,Link,useLocation } from 'react-router-dom';
import FastLoader from '../../views/processing/FastLoader';
import Seguir from '../../components/Dashboard/Seguir';
import getToken from '../../components/js/verifyToken'; 
import {fetchingData} from '../../components/js/renderMessages';
import ImageHeader from '../../components/Dashboard/MessageForm/ImageHeader'
const Notifications = ()=>{

  const navigate = useNavigate();
  const  location = useLocation()
  const [activeIcon,setActiveIcon] = useState(false);
  const [existsNotification,setExistsNotifications] = useState(null);
  const [loader,isLoading] = useState(true);
  const token  = getToken(() => navigate('/auth/login'));
  const [newNotificationsLikes,setNewNotificationsLikes] = useState(null);
  const [notificationsLikes,setNotificationsLikes] = useState(null);
  const [notificationReplies,setNotificationsReplies] = useState(null);
  const [newNotificationReplies,setNewNotificationReplies] = useState(null);
  const [loaderContent,isLoadingContent] = useState(true);
  console.log({
    newNotificationsLikes:newNotificationsLikes,
    notificationsLikes:notificationsLikes,
    notificationReplies:notificationReplies,
    newNotificationReplies:newNotificationReplies

  })
  // const username = "Pepito"
    //1 solo likes y tal
    // 2 solo replies ...
    // 3 las dos
    const getOutlet = ()=>{
        if(location.pathname.split('/')[2] === 'main'){
          setActiveIcon(0);
      }else if(location.pathname.split('/')[2] === 'text'){
      setActiveIcon(1);
      }else {
      setActiveIcon(0);
        }}

        useEffect(()=>{
          firstCommonRender('http://localhost:5000/Notifications/interactions/main',token,isLoadingContent,setNotificationsReplies,setNewNotificationReplies,setNotificationsLikes,setNewNotificationsLikes);
      },[])


    useEffect(()=>{
      getOutlet();//Se debería de hacer con el outlet pero por ahora funciona;
      fetchingData('http://localhost:5000/Notifications/exists/main/component',token,isLoading).then(data =>{
        if(data.message === 'No new notification for this user'){
          console.log('no new notifications');
        }else{
          setExistsNotifications(data.result);
          console.log('new notifications');
        }
      });


    },[])
    // console.log('exists',existsNotification);
   
// Se podría hacer tipo tienes un número concreto si son menos de 5 y luego 5+ ;  9+
    return(
            <div className="notifications-cont">
       <Nav query={'Notifications'}/>
        <div className="body-notifications-cnt">
            {/* tipos de notificaciones que puedes tener */}
            <div className="header-icons-notifications">
              {loader ?(
              <>
             <CardIcon activeIcon={activeIcon} setActiveIcon={setActiveIcon} existsNotification={existsNotification} navigate={navigate}/>
              </> 
              )   : <CardIcon activeIcon={activeIcon} setActiveIcon={setActiveIcon} existsNotification={existsNotification} navigate={navigate}/>
}
        {/* sería el icono de mensajes que lo habría que cambiar */}
            </div>
            <div className='body-cont-notification' >
                {/* Content likes  => Seguir + likes*/}
                <ul className="list-notifications">
                    {activeIcon ? 
                    <ReplyNotification loader={loaderContent}  newNotifications={newNotificationReplies} seenNotifications={notificationReplies} navigate={navigate}/> 
                    : <LikeNotification  newNotifications={newNotificationsLikes} seenNotifications={notificationsLikes} loader={loaderContent} navigate={navigate}/>} 
                </ul>
            
            </div>
        </div>
            </div>
    )
}

const CardIcon = ({activeIcon,setActiveIcon,existsNotification,navigate})=>{
  
  console.log('existsNotification',existsNotification);

  const renderExistsNotification = (existsNotification,item)=>{
    if(existsNotification.length > 0){
      if(existsNotification.length === 1){
        if(existsNotification[0].group_type === item){
          return `${existsNotification[0].total_count}+`;
        }  
      }else{
        const defaultSelectiosn = item === 'main' ? `${existsNotification[0].total_count }+` :  `${existsNotification[1].total_count}+`
        return defaultSelectiosn;


      }
    }
  }
  
  return(
    
  <>
  {['main','text'].map((item,index) =>(
<>
<div 
  className={activeIcon === index ? 'icon-not-outl active' : 'icon-not-outl'}
  onClick={() => {setActiveIcon(index),navigate(`/notifications/${item}`)}} // Solo cambia el índice activo
>
  {activeIcon === index 
    ? (item === 'main' ? <HiHeart /> : <HiChat />)  // Icono activo
    : (item === 'main' ? <HiOutlineHeart /> : <HiOutlineChat />)}  

  {existsNotification?.length > 0 && (
    <div className="rounded-icon">
      {renderExistsNotification(existsNotification,item)}
      {/* {item === 'main' ? existsNotification[0].total_count  : existsNotification[1].total_count}+ */}
      {/* {existsNotification.map(item => )} */}
    </div>
  )}
</div>

</>

  ))}


                 {/* <div className={activeIcon ? "icon-not-outl active": "icon-not-outl"}
                 onClick={()=> setActiveIcon(true)}>{!activeIcon ? <HiOutlineChat /> : <HiChat/>}
                 {(existsNotification === 1 || existsNotification === 2 ) && <div className="rounded-icon">9+</div>}
                 </div> */}
  
  </>
  )
}

const getPrototype = (data) => {
  return data.map(item => {
    if (item.type === 'follow') {
      return {
        type: item.type,
        idSession: item.userid,
        idFollower: item.id_follower,
      };
    } else {
      return {
        type: item.type,
        idNotification: item.id_notification,
      };
    }
  });
};

//Sirve para no tener que rescribir todo lo que es la verificación
const firstCommonRender = (url,token,isLoading,setNotificationsLikes,setNewNotificationsLikes,setNotificationsReplies,setNewNotificationReplies)=>{
    // url === 'http://localhost:5000/Notifications/interactions/main'
    fetchingData(url,token).then(data => {
        if(data === 'No notifications found'){
          isLoading(false)  
          // setNotifications([]);
            // setNewNotifications([])
            return;
        }else{ // aqui serñia mejor un mapeo para no repetir código;
          console.log(data,'data dd');  
          isLoading(false)  
          // const newsNotifications = data.result.filter(item => !item.is_seen);
            // const notifications = data.result.filter(item => item.is_seen);
            // setNotificationsLikes,setNewNotificationsLikes,setNewNotificationsReplies,setSeenNotificationReplies
          const result = data.result;
          const seenLikes = result.seen.filter(item => item?.type === 'quotes' || item?.type === 'replies');
          const seenReplies = result.seen.filter(item => item?.type !== 'quotes' && item?.type !== 'replies');
          
          const newLikes = result.new.filter(item => item?.type === 'quotes' || item?.type === 'replies');
          const newReplies = result.new.filter(item => item?.type !== 'quotes' && item?.type !== 'replies');
          
          // Asignar estados correctamente
          setNotificationsLikes(seenLikes);
          setNewNotificationsLikes(newLikes);
          
          setNotificationsReplies(seenReplies);
          setNewNotificationReplies(newReplies);


          console.log('result.new.length',result.new.length)
          if(result.new.length > 0){
        // const prototypeForUpdate = result.new.map(item => ({
        
        //   type: item.type,
        //   id_session: item.id_session || null, // Si no existe, asigna null
        //   id_main: item.id_main || null, 
        //   id_messagge: item.id_message || null, //es necesario para las replies y quotes
        //   id_notification:item.id_notification || null
        //   // Si no existe, asigna null
        // }));

        const prototypeForUpdate = getPrototype(result.new);

        fetch(`http://localhost:5000/Notifications/update/existing/items`,{
          method:'POST',
          headers: {'Content-type':'application/json'},
          body: JSON.stringify(prototypeForUpdate)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .cath(err => console.log('server error',err))
      }
    }
      });
}
          


const LikeNotification = ({newNotifications,loader,seenNotifications,navigate})=>{
    // Serían de varias formas
    // Likes => x persona liked your post;
    //TopNews => x persona tn tu post;
    //Follow => Started Following;
    // const [data,setData] = useState(null);


    // const userList =['adams','Juzinhopermanambuco','EdeosaSimbala','jacob','LeoMessi','juanini19','pedro','marcmarquez93','javiercaso_'];
    // const listBooleans = [true,false,true,true,false,false,true,false,true,false];
   
 
    // const numbers = [1,2,3,4,5,6,7,8,9];
    
    
 

  //Distniguir item.username.length === 1 o mayor
    const contentArr = {
        likes: [' liked your post!','lets take a look '],
        topnews: [' thinks your post is a top new!','see more'],
        repost: [' has reposted your post','see more'],
        follow: [' started following you','']
    }
    const renderContent = (item)=>{
        if(item.type === 'follow'){
            return contentArr.follow
        }else if(item.type === 'likes'){
            return contentArr.likes
        }else if(item.type === 'topnews'){
            return contentArr.topnews;
        } else if(item.type === 'repost'){
            return contentArr.repost;
        }else{
            // Base por ejemplo pueden ser los likes o una vacía
        }
    }

    return (
 <>
 {loader ? (
  <FastLoader />
) : (
  newNotifications && (
    <>
      {/* Renderizado de nuevas notificaciones */}
      {newNotifications?.length > 0 &&
      <CardLikeNotification  data={newNotifications.sort((a, b) => new Date(b.date) - new Date(a.date))} renderContent={renderContent} navigate={navigate} />
        }
                {(seenNotifications?.length > 0)&&  <div className="navbar-new-notifs">
              <h3>Previous Notifications</h3>
            </div>}
          
      {/* Renderizado de todas las notificaciones */}
      <CardLikeNotification   data={seenNotifications.sort((a, b) => new Date(b.date) - new Date(a.date))} renderContent={renderContent} navigate={navigate} />
    </>
  )
)}
 </>
              )}
          


          
   
const CardLikeNotification = ({data,renderContent,navigate,color})=>{
  console.log('data',data);
    return(
        data.map((item, index) => (
        <li key={`new-${index}`}>
        <div className="content-card-notif" style={{backgroundColor:color}}>
            {/* Cambairlo por los que sean de doble */}
            {Array.isArray(item.username) ? (
            <div style={{display: 'flex'}}>
          {/* <img style={{zIndex:999}} src="/images/usuario.png" alt="User" /> */}
          {[1,2].map((index) => (
            <>
            <ImageHeader image={item.img} booleanNotifBouble={index === 2  ? true : false}/>
            </>
          ))}

            </div>
            ):
            <ImageHeader image={item.img}/>
        }
          <span style={{position:'relative',left:Array.isArray(item.username) && '-3px'}}>
        <CardUserLikes username={item.username} navigate={navigate}/>

            {renderContent(item)[0]}
             {(Array.isArray(item.username) && item.type !== 'follow') && `You have ${item.count} ${item.type} !`}
            <Link
              to={`/post/${item.id_main}`}
              style={{ color: '#1877F2', textDecoration: 'none', marginLeft: '6px' }}
            >
              {renderContent(item)[1]}
            </Link>
          </span>
          {item.type === 'follow' && <Seguir  username={item.username} 
           contentButtonNotifs={Array.isArray(item.userid)}
           />
           }
        </div>
      </li>
        ))
    )
}
    

const CardUserLikes =({navigate,username})=>{
  return(
<>
    {Array.isArray(username) ? (
      username.map((element,index) =>(
        <>
       <b onClick={() => navigate(`/profile/users/${element}/type/posts`)}>
  {element}
</b>
{index !== 2 ? ', ' : ' and more'} 
    </>
      ))
    ):
    <b onClick={() => navigate(`/profile/users/${username}/type/posts`)}>
      {username}
    </b> 
 }
    </>
  )
}


const ReplyNotification  = ({newNotifications,loader,seenNotifications,navigate})=>{
    


   
    //1 => relplies
    // 2 => reponses;
    //Futuro => menciones;
    //comentario sacar uno random por un algoritmo;
    //const username = 'jacob';
    //texto => length > 32 poner los 32 primeros + ...
    // const numbers = [1,2,3,4,5,6,7,8,9];
    // const listBooleans = [true,false,true,true,false,false,true,false,true,false];
   
   
    


       
    return (
      <>
   {loader  ? <FastLoader /> : (
   
   seenNotifications && (
       <>
       
        <CardReplyNotification  data={newNotifications.sort((a, b) => new Date(b.date) - new Date(a.date))} navigate={navigate} />
           
                   {(seenNotifications?.length > 0) &&  <div className="navbar-new-notifs">
                 <h3>Previous Notifications</h3>
               </div>}
             
         {/* Renderizado de todas las notificaciones */}
         <CardReplyNotification   data={seenNotifications.sort((a, b) => new Date(b.date) - new Date(a.date))} navigate={navigate} />
       </>
     )
   )}
      </>
      
      
    
   )}
   
   
   
   const CardReplyNotification = ({data,navigate})=>{
       return(         
           data?.length > 0 && data.map((item,index) =>(
               <li key={index}>   
               {item.type === 'quotes' ? (
               <div className="reply-conta-noti">
               <div className="icon-noti-reply">
                  <div>
                  <GoNote />
                  </div>
                  </div>
                  <div className="content-reply-notif">
                  <span >
                  <UserCardReply username={item.username}/>
                  
                  {/* <label >{Array.isArray(item.username) ? `${item.username.join(', ')} and more`: item.username}</label> */}
                  has made a citation about your post 
                      </span><Link to={`/post/${item.id_message}`} style={{color:'#1877F2',textDecoration:'none',fontSize:'11px',position:'relative',top:'-2px',right:'-3px',fontFamily:'Lexend'}}>view post engagement</Link>
                  </div>
              
                     </div> 
               ): 
               
               <div className="text-repls-notifications">   
               <div className='main-header-notifs-cmm'>
             <div className="note-icons"
              onClick={()=> navigate(`/post/${item.id_message}`)} >
              <HiOutlineReply />
             <span>
             <UserCardReply username={item.username}/>
               have replied on your post: <br></br></span>
              </div>
               </div>
               
             <p className="text-from-response">{item.content}<Link  style={{color:'#1877F2',textDecoration:'none',fontSize:'10px',marginLeft:'5px'}} to={`/post/${item.id_message}`}>see replies</Link></p>
              <p className="text-from-response active" onClick={()=> navigate(`/post/${item.id_parent_post}`)}>{item.count > 0 && `${item.count} more replies` } </p> 
               </div>
               }
             </li>
           ))
       )
}

const UserCardReply = ({username})=>{
  return(
  <>
    {Array.isArray(username) ? (
      username.map((element,index) =>(
        <>
        <label style={{color:'black',fontWeight:600}}>{element}{index <  username.length - 1 && ','}{index === username.length - 1 && ' and more'}</label>
        </>
      ))
    ):<label>{username}</label> }
  </>
  )
}
export   {Notifications,CardReplyNotification,LikeNotification}




 
   



