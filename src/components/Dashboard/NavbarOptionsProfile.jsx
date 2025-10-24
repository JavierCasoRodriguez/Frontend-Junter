import { HiHeart,HiChat,HiUser,HiCog} from "react-icons/hi"
import {useNavigate,useLocation} from 'react-router-dom';


function NavbarOptionsProfile({isProfile,username}) {
    
    const navigate = useNavigate();
    const location = useLocation();
    const setDefaultStyles = (params) => { return location.pathname.includes(`/${params}`) || location.pathname === `/profile/users/${username}/type/${params}` ? 'icon-profile active': 'icon-profile'}
   
//configurar el nombre de las rutas
    const contentHeader = {
      main:{icon:<HiUser  className={(location.pathname === `/${username}` || location.pathname === `/profile/users/${username}/type/main`) ? 'icon-profile active': 'icon-profile'} onClick={isProfile  ? ()=> navigate(`/${username}`) : ()=> navigate(`/profile/users/${username}/type/main`)} />},
      messages:{icon:<HiChat className={setDefaultStyles('posts')} onClick={isProfile ? ()=>navigate(`/${username}/posts`): ()=> navigate(`/profile/users/${username}/type/posts`)} />},
      likes:{icon: isProfile && <HiHeart className={setDefaultStyles('likes')} onClick={isProfile ? ()=>navigate(`/${username}/likes`): ()=> navigate(`/profile/users/${username}/type/likes`)}/>},
      setting:{icon: isProfile &&<HiCog  className={setDefaultStyles('settings')} onClick={()=> navigate(`/${username}/settings`)} />}
    }
    

    return (
    
        <div className="header-body-profile">
          {Object.keys(contentHeader).map(key =>(
            <>{contentHeader[key].icon}</>
))}
  </div>
    )
}

export default NavbarOptionsProfile
