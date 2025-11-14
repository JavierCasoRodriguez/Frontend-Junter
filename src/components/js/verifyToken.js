// // import { useNavigate } from "react-router-dom";





// export default function useGetToken(redirect) {
//   const token = localStorage.getItem("jwtToken");
//     console.log('este es el token',token);
//   if (!token) {
//     // Usa navigate para redirigir sin recargar toda la página
//     redirect
//     //return; // Devuelve null para que el componente sepa que no hay token
//   }else{
//       return token;
//   }

// }

export default function getToken(redirectCallback) {
    // const token = localStorage.getItem('jwtToken');
 
    if (!token && typeof redirectCallback === 'function') {
      redirectCallback(); // Ejecuta la función de redirección

    }else{
      return token;
    }
  }