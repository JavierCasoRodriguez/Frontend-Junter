import { useLocation,useNavigate } from "react-router-dom"
import Seguir from "../Seguir"
import ImageHeader from "../MessageForm/ImageHeader";
import {useState} from 'react'

function Sugerencia({name,isUser,image,listFollow}) {
    const navigate =  useNavigate();
    const location = useLocation();
    const [isNotFollowing,setFollower] = useState(false)
    return (
        <>
        {isNotFollowing &&   <div className={listFollow ? 'usr-mainpro active': "usr-mainpro"}
        onClick={()=> navigate(`/profile/users/${name}/type/posts`)}>
       <div className="main-header-sugg">
       <ImageHeader image={image}/>
       <h3>{name}</h3>
       </div>
           {/* {(location.pathname !== '/search' || isUser) && <Seguir username={name}/> } */}
           {!location.pathname.startsWith('/search') && !isUser && <Seguir username={name} setFilterFollow={setFollower}/>}

          </div>}
        </>
    )}

export default Sugerencia
