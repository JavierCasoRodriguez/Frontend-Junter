import { useLocation } from 'react-router-dom';
import Login from '../views/auth/Login';
import Register from '../views/auth/Registro';
import {Localidades} from './main/Localidades';
function RedirectAuth() {
    const location = useLocation();
    const route = location.pathname.split('/');
    console.log(route);
    const defaultAuthComponent = ()=>{
        if(route[2] === 'login'){
            if(route[3] === 'default'){
                return <Localidades  />    
            }else{
                return <Login />
            }
        }else if(route[2] === 'register'){
           if(route[3] === 'complete'){
            return <Localidades />
           }else{
            return <Register />
           }
        }
       
      }

    return (
        <>
        {defaultAuthComponent()}
        </>
    )
}

export default RedirectAuth

// , {
//   path: "/auth",
//   children: [
//     {
//       path: "login",
//       element: <NewLogin />,
//     },
//     {
//       path: "register",
//       element: <NewLogin />,
//     },
//     {
//       path: "register/complete",
//       element: <Localidades />,
//     },
//   ],
// },
//   // Rutas adicionales
// {
// path: "/auth/login/default",
// element: <Localidades />,
// },