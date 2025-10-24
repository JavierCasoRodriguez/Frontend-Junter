import { useNavigate,useLocation } from "react-router-dom"
import { useContext } from "react";
import { ContextLocal } from "../../views/ProviderLocal";
import Loader from '../../views/processing/FastLoader'; 

const RedirectToUserLocality = ()=>{
    const {localidades,loaderLocalidades} = useContext(ContextLocal)
    // const [data,setData] = useState(null)

    
    const navigate = useNavigate();
    const location = useLocation();
    const defLocality = location.pathname.split('/')[1];
    const onRedirect = ()=>{
        const {country,region,city} = localidades;
         if(defLocality === 'country'){
            navigate(`${defLocality}/${country}`);

        }else if(defLocality === 'region'){
            navigate(`${defLocality}/${region}`);

        }else if(defLocality === 'city'){
            navigate(`${defLocality}/${city}`);    
                
        }
        // console.log(result,'result');
        // navigate(`/${defLocality}/`)
    }
    return(<>{
        loaderLocalidades ? (
            <Loader />
        ):(
            onRedirect()
        )
    }</>)
}




export default RedirectToUserLocality;