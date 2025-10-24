//este es el renderizado;
import { useNavigate } from "react-router-dom"
import Loader from '../../views/processing/FastLoader';



function LocalidadesUser({country,region,city,display,renderTo}) {
  const navigate = useNavigate();


  const routeToCountry = `/country/${country}`;
  const routeToRegion = `/region/${region}`;
  const routeToCity = `/city/${city}`;

  const handleClick = (param,display)=>{
    navigate(`${param}`);
    display(false)
  }

  const objectForMapLocalities = {
        name:[country,region,city,'Junter'],
        route:[routeToCountry,routeToRegion,routeToCity, '/'],
  }
  return(  
        <>     
          {objectForMapLocalities.name.map((item,index) =>(
          <>
            <div key={index} onClick={()=> { renderTo && (index === 4 ? navigate('/') : handleClick(objectForMapLocalities.route[index],display))}}>
            <h4>{renderTo ? objectForMapLocalities.name[index] : <Loader />}</h4>
        </div>
          </>
          ))}
        </>
    
            
    )
}

export default LocalidadesUser
