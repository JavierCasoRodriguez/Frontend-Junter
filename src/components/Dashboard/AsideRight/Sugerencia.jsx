import { useLocation,useNavigate } from "react-router-dom"
import Seguir from "../Seguir"
import ImageHeader from "../MessageForm/ImageHeader";

function Sugerencia({name,isUser,image,listFollow}) {
    const navigate =  useNavigate();
    const location = useLocation();
    
    return (
        <>
          <div className={listFollow ? 'usr-mainpro active': "usr-mainpro"}
        onClick={()=> navigate(`/profile/users/${name}/type/posts`)}>
       <div className="main-header-sugg">
       <ImageHeader image={image}/>
       <h3>{name}</h3>
       </div>
           {/* {(location.pathname !== '/search' || isUser) && <Seguir username={name}/> } */}
           {!location.pathname.startsWith('/search') && !isUser && <Seguir username={name}/>}

          </div>
        </>
    )}

export default Sugerencia
