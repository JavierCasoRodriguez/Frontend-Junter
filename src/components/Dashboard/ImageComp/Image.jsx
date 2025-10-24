import { HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Outlet } from 'react-router-dom';
function Image() {
    const navigate = useNavigate();
   
    return (
        <div className="set-img"> 
        <div className="navbar-img">
            <HiArrowLeft onClick={()=> navigate(-1)}/>
                
         </div> 
           <Outlet />
        
        </div>
    )
}

export default Image
