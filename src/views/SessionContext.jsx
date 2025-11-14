import { createContext,useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import getToken from '../components/js/verifyToken';
// 1-Crea uncontexto vacío
const ContextUid = createContext();
//otorgarle un valor predeterminado como null => reserva de ultimo recurso


// 2- Crea un provider para el context
const ContextProvider = ({children})=>{
  const [uid,setUid] = useState(null);
  const [username,setUsername] = useState(null);
  const [userImage,setUserImage] = useState(null);
  const navigate = useNavigate();
  // const token  = getToken(() => navigate('/auth/login'));
  // console.log('token',token)
 useEffect(()=>{
  // console.log('el token de session provider',token);
  // = localStorage.getItem('jwtToken');
  //  const token = 'd2b9602c9d4800e4'


    fetch('http://localhost:5000/config/get/main/data',{
      credentials:"include"
    })
    .then(response => {
      if(!response.ok){
        console.error('Error on response');
      }
      return response.json()
    })
    .then(data =>{
      const {uid,username,userImage,message} = data;
      setUid(uid)
      setUsername(username)
      setUserImage(userImage)
      //Se podría programar un poco mejor esto de abajo
      if(message === 'Invalid refresh token' || message === "Session expired" || message === "No tokens, please login again"){
        navigate('/auth/login')
      }
    })
    .catch(err => console.error(err))
  }

,[]);
 
 return (
  <ContextUid.Provider value={{ uid,username,userImage }}>
    {children}
  </ContextUid.Provider>

);
}



// //3- Crea una función que retorne el contxt uid


  export  {ContextUid,ContextProvider};

