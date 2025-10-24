import { useContext } from 'react';
import AsideLeft from '../AsideLeft';
import {Outlet, useLocation,useNavigate} from 'react-router-dom';
// import Loader from '../processing/Loader';
import getToken from '../../components/js/verifyToken'
// import RenderHeader from '../Header';
import RedirectAsideRight from '../../views/AsideRight';
import { ContextUid } from '../SessionContext';
import {ContextLocal} from '../ProviderLocal';
function ContainerMessages() {
  
  // const [isLoading,setLoading] = useState(true);
  // const [item,setItem] = useState([]);
  // const [displayMore,setDisplayMore] = useState(false);
  // const [activeFastLoader,setActiveFastLoader] = useState(false);
  // const [morePosts,setMorePosts] = useState('');
  const navigate =  useNavigate();
  const location = useLocation();
  const token  = getToken(() => navigate('/auth/login'));
  const {username} = useContext(ContextUid);
  const {localidades} = useContext(ContextLocal);


// const [selectedCheckbox, setSelectedCheckbox] = useState(null);





const defineClassName = (index)=>{
  let arr;
  if(location.pathname.startsWith('/new/post/format') ){
     arr =  ["cont-posts-dashboard-junter active",'prn-cnt-main active'];
  } else{
     arr =  ["cont-posts-dashboard-junter",'prn-cnt-main']

  }

  return arr[index]
}

    return (
        <>
    

                    <>
                    {/* Habría que ponerlo en otro componente => News */}
                 
                    {/* 1 dIV => POSTS */}
                    </>
                    <AsideLeft    token={token} username={username} />
                    <div className={defineClassName(1)} style={{width:location.pathname.startsWith('/search') && '90%'}}>
                    <div className={defineClassName(0)} >
                   <Outlet />
                    </div>
                {/* 2 aSIDE DE LA DERECHA */}
             <div className="lateral-aside-right-cnt-dashboard">
              <RedirectAsideRight  localidades={localidades} token={token} username={username}/>
                </div>
                    </div>
          </>
      )
    }



//Estos 3 componentes lo que hacemos es repetir el código => CAMBIAR




//Faltan varios componentes
// 1 News => Por Semana;
// 2 News =>Por dia
// 3 News =>Por mes
//combinaciones
// 4 News =>Por dia/pais
// 5 News =>Por semana/pais
// 6 News =>Por mes/pais
// 7 News =>Por dia/region
// 8 News =>Por semana/region
// 9 News =>Por mes/region
// 10 News =>Por dia/ciudad
// 11 News =>Por mes/ciudada
// 12 News => Por mes/ciudad;
// 13 Main => País
// 14 Main => Región
// 15 Main => Ciudad






export  default ContainerMessages;