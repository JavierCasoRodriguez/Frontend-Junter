import {useEffect, useState,useRef} from 'react'
import {useLocation,useNavigate} from 'react-router-dom'
import Loader from '../../views/processing/FastLoader';
// import {HiArrowLeft} from 'react-icons/hi'
import getToken from '../js/verifyToken';
import Sugerencia from './AsideRight/Sugerencia';
import Nav from '../../views/Nav';
function Followers() {
    //const navigate =  useNavigate();
    // const token  = getToken(() => navigate('/auth/login'));
    const [userList,setUserList] = useState([]);
    const [loading,setLoading] = useState(true);
    const isFirstRun = useRef(true);
    // const navigate = useNavigate();
    const location = useLocation();
    const username = location.pathname.split('/')[3];
    

    useEffect(() => {

        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        const fetchUserData = async () => {
            try {
                let response;
                if (location.pathname === `/profile/users/${username}/followers`) {
                    response = await fetch(`http://localhost:5000/Profile/get/followers/seguidores/list/${username}/staus?token=no`, {
                    });
                }else if(location.pathname === '/profile/followers'){
                    response = await fetch(`http://localhost:5000/Profile/get/followers/seguidores/list/myself`, {
                        credentials:"include"
                    });

                } else if(location.pathname === '/profile/following'){
                    response = await fetch(`http://localhost:5000/Profile/get/following/seguidos/list/myself`, 
                        {
                        credentials:"include"
                }       
                    );
                } else if(location.pathname === `/profile/users/${username}/following`){
                    response = await fetch(`http://localhost:5000/Profile/get/following/seguidos/list/${username}/staus?token=no`);
                }
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
    
                const data = await response.json();
                setUserList(data);
            } catch (error) {
                console.error('Hubo un problema:', error);
            }finally{
                setLoading(false)
            }
        }; fetchUserData();
    }, [location.pathname, username]);


    return (
        <div className='foll-list-q'>
            {/* <div className="foll-list-nav">
              <HiArrowLeft  onClick={()=> navigate(-1)}/>
                {location.pathname.includes('followers') ? <h4>Seguidores</h4>: <h4>Seguidos</h4>}
                {/* vaya con la location */}
                {/* aqui va a estar un futuro  search */}
            {/* </div> */} 
            <>
            <Nav  query={location.pathname.includes('followers') ? 'Followers': 'Following'}/>
            </>
            <div className="foll-list-body">
                <div className="card-list-foll">
               {/* <ul> */}
              {loading ? <Loader /> : (
                 userList.length > 0  && (
                    userList.map((element, index) => (
                        <Sugerencia key={index} name={element.username} image={element.img} listFollow={true}/>
                    ))
                    )
                
              )}
</div>
               {/* </ul> */}

            </div>
            
        </div>
    )
}

export default Followers
