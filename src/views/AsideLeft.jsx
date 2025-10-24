import '../styles/Haside/Haside.scss';
import { useState,useEffect } from "react"

import {useLocation,useNavigate, } from "react-router-dom";
import { TiHome } from "react-icons/ti";
import { MdInfoOutline } from "react-icons/md";
import { HiBell,HiGlobe,HiPencilAlt,HiViewList, HiSearch,HiUser,HiPlusSm} from 'react-icons/hi';
import {fetchingData} from '../components/js/renderMessages';

function AsideLeft({event,username,showRem,displayedInputFt,
    //NUEVO
    token

}) {

 
 const navigate = useNavigate();
  const location = useLocation();
 const [displayNewMessage,setDisplayNewMessage] = useState(false); 
 const [options,setOptions,] = useState(true);
 const [existsNotif,setExistsNotif] = useState(false);//en prxincipio no hay notificaciones
 const [loader,isLoading] = useState(false);//Puedes usarlo para un pequeño cambio en las localidades si eso pero poco más



  useEffect(()=>{
  // 2º Pillar si tiene notificaciones;
  fetchingData('http://localhost:5000/Notifications/exists/dashboard',token,isLoading).then(data =>{
    if(!data.result || data.message === 'No notificacions for this user' ){
      console.log('no hay notificaciones sin ver para este usuario');
    }else{
      setExistsNotif(data.result);
    }
  });
  },[])


    // , <HiChat key={4} />
   // const getHomePath = location.pathname === '' ? 
   //mirar para recargar la página al estar en home 
   //o tirar algun input para que se pueda ver más posts;
const displayFastPost = location.pathname === '/' || location.pathname.startsWith('/region') || location.pathname.startsWith('/country') || location.pathname.startsWith('/city') || location.pathname.startsWith('/friends');

const aside = {
     main: {
          icons: [<TiHome key={0} />, <HiPencilAlt key={1} />,<HiSearch  key={2}/>,<HiUser  key={4}/>,(existsNotif && location.pathname !== '/notifications') ? <div className="bell-notif"><HiBell key={3} /><div></div></div> :<HiBell key={3} />  ,<HiGlobe key={1}/>, <HiPlusSm  key={4}/>],
          labels:['Home','New post','Search','Profile','Notifications','Localities','More'],
          onClick:[ ()=> navigate('/'),()=> navigate('/new/types/post'),()=> navigate('/search'),()=> navigate(`/${username}/posts`),()=> navigate('/notifications'),()=> navigate('/localities'),()=>  setOptions(!options),()=> showRem(),()=> navigate('/'),()=>  setOptions(!options)]},

     moreOptions:{
        icons:[<MdInfoOutline key={1}/>, <HiViewList key={2}/>],
        labels:['About-us','Notes']

        }
};

const handleClickOptions = (index)=>{
    if(index === 0){
        navigate('/about-us'),
        setOptions(true)
    } else if(index === 1){
        return showRem()
    }
}

// console.log(username);
    return( 
        
         <>
         {username !== '' &&  <div className="aside" 
        //  style={{border: location.pathname.includes('/post') && '1px solid whitesmoke'}}
         >
           <div className="aside main"> 
               {aside.main.icons.map((element,index)=>(
                  <div className={(index === 4 && existsNotif)?'template-aside bell' :"template-aside"} key={index} onClick={aside.main.onClick[index]}>
                    {element} 
                    <span className="label-aside">{aside.main.labels[index]}</span>
                </div>))}
                   </div>
   
               <div  className={options ? 'more-aside-options hidden': "more-aside-options"}>
                   {aside.moreOptions.icons.map((element,index)=>(
                       <div className='template-aside-more' key={index} onClick={()=> handleClickOptions(index)}>
                        {element}
                        <span>{aside.moreOptions.labels[index]}</span>
                        </div>
                   ))} 
                   </div>
               
           </div> }
         
         </>

    )
}

export default AsideLeft
