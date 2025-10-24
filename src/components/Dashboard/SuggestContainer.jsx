import {useEffect,useState} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import getToken from '../js/verifyToken';
import Persons from './AsideRight/Sugerencia.jsx';
import FastLoader from '../../views/processing/FastLoader';
import { fetchingData } from '../js/renderMessages.js';
function SuggestContainer() {

    const location = useLocation();
    const navigate =  useNavigate();
    const token  = getToken(() => navigate('/auth/login'));
    const [data,setData] = useState([]);
    const [isLoading,setLoading] = useState(true)
    const searchPath = location.pathname.startsWith('/search') ? true : false;
    
    function getRandomUsers(users, count = 5) {
      return users.sort(() => Math.random() - 0.5).slice(0, count);
  }
   
  
  useEffect(() => {
      const key = 'random-users-list';
      const currentTime = new Date().getTime(); // Obtiene la hora actual en milisegundos
      const expirationTime = currentTime + 60 * 60 * 1000; // 1 hora en milisegundos
  
      // Obtener los datos almacenados en localStorage
      const storagedData = localStorage.getItem(key); // Obtén el objeto directamente (no lo parsees aún)
      console.log('storagedData',storagedData);
      // Verificamos si existen datos y si han expirado
      if (storagedData) {
          const parsedData = JSON.parse(storagedData); // Ahora lo parseamos correctamente
          if (currentTime > parsedData.expirationTime) {
              localStorage.removeItem(key); // Si ha expirado, eliminamos los datos
          } else {
            console.log(parsedData);
              setData(parsedData.values); // Si no ha expirado, usamos los datos almacenados
              setLoading(false);
          }
      }
  else{

    fetchingData('http://localhost:5000/config/get/users/suggest', token).then(data => {
        if (data.length > 0) {
            // No hago la validación de 6 porque siempre va a ser mayor que 6
            const randomizedUsers = getRandomUsers(data);
            setData(randomizedUsers);
            setLoading(false)
            
            // Guardar los datos en localStorage con la hora de expiración
            const dataToStore = {
                values: randomizedUsers,
                expirationTime: expirationTime
            };
            localStorage.setItem(key, JSON.stringify(dataToStore)); // Almacenamos los datos como JSON
        } else {
            setData(null);
           setLoading(false)

        }
    });
  }
      // Si no hay datos o han expirado, hacer la solicitud
  }, []);
  




  
   

    return (
        
        <div className="prss-srchq" >
          <div className="nav-prss">
            {searchPath && <h4>Persons</h4>}
          </div>
          {isLoading ? (<FastLoader />) :<div className="cnt-prssq">
          {data?.length > 0 &&  data.map((element, index) => (
              <Persons key={index} name={element.username} city={'Barcelona'} image={element.img} />  
            ))}
          </div>}
        </div>
       
       
    )

    }



export default SuggestContainer
