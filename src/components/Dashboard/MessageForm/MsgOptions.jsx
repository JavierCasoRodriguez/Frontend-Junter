import {HiBookmark} from 'react-icons/hi2'
import {HiOutlineTrash} from 'react-icons/hi'
import { FiUserPlus } from "react-icons/fi";

import { AiOutlineEye,AiOutlineEyeInvisible } from 'react-icons/ai';
import {useState,
  useEffect,
  useContext} from 'react';
import { ContextUid } from '../../../views/SessionContext';
import { useLocation } from 'react-router-dom';


function OptionsMessage({param,render,username,long,idPost,userid,booleanForFollow,
  outlineBookmarkIcon,FiUserCheck,viewIcon,
  iteractionsEnd,setDisplayTrashMessage,
  arrFromDbFollowing ,setArrFromDbFollowing,
  filedPostsFromDb, setFiledPostsFromDb,
  setSuccessfullOpt,navigate,isCitation,thread,isLocalidades,isComment
  ,seenState,getUserState,handleNotInterestedIn,CgSmileSad,styleForUserStateIcon,setItem
}) {

const uid = useContext(ContextUid);  
const location  = useLocation();//No tiene mucho sentido mejor que pase padre
const [filed,setFiled] = useState(false);
const [isFollowing,setFollowing] = useState(false);

// const [listOfFollUsers, setListOfFollUsers] = useState([])
// console.log(arrFromDbFollowing,'arr creado');
// console.log(listFollowing);
useEffect(()=>{

if(location.pathname.includes('/saved/posts')){
  setFiled(true);
} else if(location.pathname.startsWith('/friends/status')){
  setFollowing(true);
}
},[])

// useEffect(()=>{
// if(listFollowing){
//   setArrFromDbFollowing(listFollowing)
// } 
// if(filedPosts?.length > 0){
//   const mappedFiledPosts = filedPosts.map(item  => item.id_message);
//   setFiledPostsFromDb(mappedFiledPosts);
// }
// },[iteractionsEnd])







//   const getIdMessage = (params)=>{
//     const target =  params.target;
//     const childNode = target.closest('[data-id]');
//     const idUniqueMessage = childNode.dataset.id;
//     return idUniqueMessage;
// }
const deletePost = (long,uid)=>{
// render params
  const responsePost = location.pathname.startsWith('/post'); 

if((responsePost && long) || (responsePost && render === 0)){
  alert('va por aqui');
  setDisplayTrashMessage(true);
}else{
  setItem((prev)=> prev.filter(item  => item.id_message !== idPost))//mirar con GPT;
}

  



fetch(`http://localhost:5000/messages/delete/post/id/${idPost}`,{
    method : 'POST',
    headers: {'Content-type':'application/json'},
    //Con saber el country(islOcalidades === country) ya es parámetro de localidades
    //También se deben de poder borrar comentarios;
    body: JSON.stringify({ long,uid,isCitation,thread,isLocalidades,isComment })
})
.then(response => response.json())
.then(data => {
  if((data && responsePost && long) || ( data && responsePost && render === 0)){//Cambiar GPT(REPITE DATA)
    setTimeout(()=>{
      const defaultRedirectNewPost  = long ? 'long': 'short';
      navigate(`/new/post/format/${defaultRedirectNewPost}`);
    },2000)
  }
})
.catch(err => console.error(err))
}


const addFiledMessage = (setFiled,idUniqueMessage,uidPost,uid,boolean)=>{

  // const idUniqueMessage = getIdMessage(e);
  if(boolean){
    // console.log('en cuanto a la eliminacion 1')
    // if(filedPostsFromDb.includes(userIdPost) || filed)
    // setFiledPostsFromDb((prev) => prev.filter((item) => item !== idUniqueMessage));
     setFiledPostsFromDb((prev) => [idUniqueMessage, ...prev]);

  }else{
    // console.log('en cuanto a la eliminacion 2')
    setFiled(!filed);
  }
    // setFiled(!filed);
    // setFiledPostsFromDb((prev) => [idUniqueMessage, ...prev]);


    fetch(`http://localhost:5000/messages/save/post/filed/${idUniqueMessage}`,{
        method : 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({uid,uidPost})
    })
    .then(response => response.json())
    .then(data => {
      if(data){
        setTimeout(()=>{
          setSuccessfullOpt(null);
        },2500)
        setSuccessfullOpt(0);//saved
      }
    })
    .catch(err => console.error(err))
}


const deleteFiledMessage = (setFiled,idUniqueMessage,uidPost,uid,boolean)=>{
    console.log('filed posts from d',filedPostsFromDb);
    
    
    if(boolean){
      console.log('en cuanto a la eliminacion 3')
      // if(filedPostsFromDb.includes(userIdPost) || filed)
      setFiledPostsFromDb((prev) => prev.filter((item) => item !== idUniqueMessage));
    }else{
      console.log('en cuanto a la eliminacion 4')
      setFiled(false);
    }

    fetch(`http://localhost:5000/messages/quit/saved/post/${idUniqueMessage}`,{
        method : 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({uid,uidPost})
    })
    .then(response => response.json())
    .catch(err => console.error(err))
}

const defaultFnForFiledMessage = ()=>{
if(filedPostsFromDb?.length > 0){
  console.log('lo incluye',filedPostsFromDb.includes(idPost))
if(!filedPostsFromDb.includes(idPost)){
  console.log('va por aqui 1')
  addFiledMessage(setFiled,idPost,userid,uid,true)

}else{
  console.log('va por aqui 2')
  deleteFiledMessage(setFiled,idPost,userid,uid,true)
}
}else{
  if(!filed){
    console.log('va por aqui 3')
    addFiledMessage(setFiled,idPost,userid,uid,false)
  }else{
  console.log('va por aqui 4')
    deleteFiledMessage(setFiled,idPost,userid,uid,false)
  }
}
}


const addFoll = (uid, username, follow, useridPost) => {
  console.log('Ejecutando la función addFoll...');

  // 1º Verificar si el array existe y si tiene una longitud de 0
  if (!arrFromDbFollowing || arrFromDbFollowing.length === 0) {
    console.log('El array está vacío o no existe.');
    setFollowing(true); // Cambia el estado `isFollowing`

    // Realiza una petición al servidor para agregar el usuario
    const data = { uid, username, follow };
    fetch('http://localhost:5000/Profile/add/follower/to?format=post&option=fast-options&type=add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.boolean) {
          setTimeout(()=>{
            setSuccessfullOpt(null);
          },2500)
          setSuccessfullOpt(1);//follower
          localStorage.setItem('usersFoll', JSON.stringify(data));
        }
      })
      .catch((err) => console.error('Error al agregar el usuario:', err));

    return; // Termina aquí si el array estaba vacío
  }

  // 2º Verificar si el array no incluye el `useridPost`
  if (!arrFromDbFollowing.includes(useridPost)) {
    console.log('El array tiene elementos, pero no incluye el useridPost.');

    // Actualizar el array de forma inmutable
    setArrFromDbFollowing((prev) => [useridPost, ...prev]);

    // Realiza la petición POST
    const data = { uid, username, follow };
    fetch('http://localhost:5000/Profile/add/follower/to?format=post&option=fast-options&type=add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.boolean) {
          console.log('Usuario añadido correctamente.');
          localStorage.setItem('usersFoll', JSON.stringify(data));
          setTimeout(()=>{
            setSuccessfullOpt(null);
          },2500)
          setSuccessfullOpt(1);//saved
        }
      })
      .catch((err) => console.error('Error al agregar el usuario:', err));
  } else {
    console.log('El usuario ya existe en el array. No se añade.');
  }
};


const quitFoll = (uid,username,follow,useridPost)=>{
  console.log('esta yendo por esta segunda ruta ')
  //Digamos que estaría separado por una lógica de interfaz y otra lógica
  if(arrFromDbFollowing.length === 0){
    setFollowing(!isFollowing);
 } else{
  if(arrFromDbFollowing.includes(useridPost)){
    setArrFromDbFollowing((prev) => prev.filter((item) => item !== useridPost));
    // setFollowing(!isFollowing);
}else{
  return;
}}

const data = {uid,username,follow}
fetch('http://localhost:5000/Profile/quit/follower/to?format=post&option=fast-options&type=delete',{
  method : 'POST',
  headers: {'Content-type':'application/json'},
  body: JSON.stringify({data})
})
.then(response => response.json())
.catch(err => console.error(err))
}
const setDefaultListFollowing = () => {
  const  quitCheckUser= [<FiUserPlus key={2} className="foll-add-main" />,`follow ${username}`]
  const  checkUser= [FiUserCheck,`unfollow ${username}`]

  if(arrFromDbFollowing?.length > 0){
 // 1º Verificar si estamos en la ruta '/friends/status' y retornar el icono correspondiente.
 if (location.pathname.startsWith('/friends/status')) {
  return checkUser;
  
}

// 2º Si `iteractionsEnd` no ha terminado, retornar el icono de añadir usuario.
if (!iteractionsEnd) {
  return quitCheckUser
}

// 3º Verificar si el `userid` está en `arrFromDbFollowing` y retornar el icono correspondiente.
if (arrFromDbFollowing.some((element) => userid === element)) {
  return checkUser;

}

// 4º Si no se cumple ninguna condición, retornar el icono de añadir usuario.
return quitCheckUser
  }else{
if(isFollowing){
  return checkUser;

}else{
  return quitCheckUser

}
  }
  
 
};
const setClickForFollowing = ()=>{
  console.log('la función la pilla');
  if(arrFromDbFollowing.length > 0){
    if(arrFromDbFollowing.includes(userid)){
      console.log('lo incluye');
      quitFoll(uid.uid,username,isFollowing,userid) 
    } else{
      console.log('no lo incluye');
      addFoll(uid.uid,username,isFollowing,userid) 
  }
}else{
  if(!isFollowing){
    addFoll(uid.uid,username,isFollowing,userid)
  }else{
    quitFoll(uid.uid,username,isFollowing,userid)
  }
}
   
    // !isFollowing ? ()=> addFoll(uid.uid,username,isFollowing,userid) : 
    // quitFoll(uid.uid,username,isFollowing,userid)
  
}


// const path = location.pathname.split('/')[1];
//     if (path[1] !== 'saved'
// console.log(location.pathname.split('/')[2]);

const getFiledPostsByFirstRender = ()=>{
  const params = location.pathname.split('/')[1];
  const saved = [<HiBookmark  key={1} style={{position:'relative',top:'3px'}}/>, 'Quit saved post'];
  const unSaved = [outlineBookmarkIcon,'Save post'];
  if(params !== 'saved' && !iteractionsEnd){
      return unSaved
  }

  if(params === 'saved'){
    return saved ;
  }

  if(filedPostsFromDb?.length > 0){
      const isFiled = filedPostsFromDb.some(item => item === idPost);
      // console.log(isFiled);
      if(isFiled || filed){
          return saved
      }else{
          return unSaved
      }
  }
  else{
        if(filed){
          return saved 
        } else{
          return unSaved
        }
      }
  }





//Estaría bien añadir cosas como related posts de este y cosas así 



const objectRender = {
  icons:[booleanForFollow ? <HiOutlineTrash  style={{color:'red',fontSize:'16px',position:'relative',top:'2px'}}/> : setDefaultListFollowing()[0],getFiledPostsByFirstRender()[0] ,viewIcon,CgSmileSad,seenState ? <AiOutlineEyeInvisible key={4} style={{color:'rgba(0, 0, 0, 0.764)',position:'relative',top:'3px',fontSize:'17px'}} /> :<AiOutlineEye key={4} style={styleForUserStateIcon} /> ],
  text:[booleanForFollow  ? 'Delete post' : setDefaultListFollowing()[1],getFiledPostsByFirstRender()[1], 'View Post Engagements','Not interested in this post',seenState ? 'Hide user state': 'View user state'],
  onClick:[booleanForFollow ? (e)=> deletePost(long,uid.uid,e) :setClickForFollowing,defaultFnForFiledMessage,()=> navigate(`/posts/engagements/quotes/${idPost}`),handleNotInterestedIn,getUserState]
}

const getOptionsClassName = ()=>{
  if(param){
    if(render === 3 ){
  return 'more-options profile'
    }else if(render === 4){
  return 'more-options response'
    }else if(render === 5){
      return 'more-options long'
    }
      else{
  return "more-options" 
    }
  }else{
    return 'more-options hidden'
  }
  // render  === 3 ? 'more-options active':"more-options" 
}



    return (
       <>

    <div className={getOptionsClassName()}
    // style={{height:(booleanForFollow && render  === 0)?  '120px':'160px' }}
    >
 
      {objectRender.text.map((item,index) => (
      // (render !== 3 && index !== 0 && booleanForFollow ) &&  
     param  &&  <div  key={index} className="diff"  onClick={objectRender.onClick[index]}> 
     <div style={{display:'flex',width:'100%',alignItems:'center'}}>
     <div style={{width:'20%',fontSize:'15px',position:'relative',top:index === 0 && '3px'}}>
     {objectRender.icons[index]} 
       </div>
     <div style={{width:'80%',fontFamily:'Lexend',fontSize:'12px'}}>
     {/* {index === 0 ? item.split('').map((item) =>(
       item === username ? <><b>{item}</b></> : item
     )) : item} */}
     {item}
       </div>
       </div>
       </div>
      ))}
    </div>
  




       </>      
    )    
}

export default OptionsMessage;
