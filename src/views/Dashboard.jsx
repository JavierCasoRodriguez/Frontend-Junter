import { useState,useContext,useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// import  getToken from '../components/js/verifyToken';
import RememberMe from '../components/Dashboard/Rememberme'
import {fetchingData} from '../components/js/renderMessages';
import RenderHeader from './Header';
import '../styles/App.scss';
import { ContextUid } from './SessionContext';
import {ContextLocal} from './ProviderLocal';


//Sacar las variables globales de USERNAME y LOCALIDADES en el dashboard y luego continuar;

function Dashboard() {

  const {username} = useContext(ContextUid);
  console.log('Este es el usuario',username);
  const {localidades,loaderLocalidades} = useContext(ContextLocal);
  // const [node,setNode] = useState(true);
  const [displayRemember,setDisplayRemember] = useState(null);

    return (
       <>
       <>
       { displayRemember && <RememberMe display={()=> setDisplayRemember(!displayRemember)} />}
       </>
       
       <div className='container' >
        {(username)?

       (
    <>
<RenderHeader localidades={localidades} 
 isLoading={loaderLocalidades}
handleClick={fetchingData}
username={username}
/>
          <div 
        className={'cnt-portable-app-include-render-all-junter'} >
          <Outlet />
         </div>
      
         
         {/* 1) Profile pero solo sugerencias(en principio)
         2) En Dashboard */}
      </>
  
       ):  <div className='icon-junter-main-render'>
        <div className='render-image-logo-container' >
        <img src='/images/logo.jpg' style={{width:'102px',height:'110px'}}></img>
        <span>JUNTER</span>
       </div>
       </div>
       }
      </div>

       </>
    )
}


export default Dashboard
