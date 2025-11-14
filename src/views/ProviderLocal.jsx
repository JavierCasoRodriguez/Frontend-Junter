import { createContext,useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import getToken from '../components/js/verifyToken';
// 1-Crea uncontexto vacío
const ContextLocal = createContext();
//otorgarle un valor predeterminado como null => reserva de ultimo recurso


// 2- Crea un provider para el context
const ContextLocalitiesProvider = ({children})=>{
  const navigate = useNavigate();
  const location  = useLocation();
      // const token  = getToken(() => navigate('/auth/login'));
    const [localidades,setLocalidades ] = useState({
        country:'',
        region:'',
        city:''
      })
    const [loaderLocalidades,isLoadingLocalidades] = useState(false);
  useEffect(()=>{
    // const token  = getToken(() => navigate('/auth/login'));
         fetch('http://localhost:5000/config/get/localities',{
         credentials:'include'
        })
        .then(response => response.json())
        .then(data => {
          // if(data){
    
            // console.log(data);
            console.log('estas son las localidades');
            console.log(data);
            // console.log(data[0]);
            // console.log(data.country);
            const {country,region,city} = data;
           setLocalidades({
            country:country,
            region:region,
            city:city,
           })
    
    
        })
        .catch(err => console.error(err))
        .finally(()=> isLoadingLocalidades(true))
      
    
      
    },[location.state]);
    
 
 return (
  <ContextLocal.Provider value={{localidades,loaderLocalidades}}>
    {children}
  </ContextLocal.Provider>

);
}



// //3- Crea una función que retorne el contxt uid


  export  {ContextLocal,ContextLocalitiesProvider};

