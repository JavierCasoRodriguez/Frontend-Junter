import { useLocation,useNavigate } from "react-router-dom";
import LocalidadesUser from "../components/Dashboard/LocalidadesUser"
import { useEffect, useState } from "react"
// import getToken from '../components/js/verifyToken';

//necesito que al darle click cambie la ruta
//que se active el loader;
//recopilar la data;
//=> lo único que necesitaría sería un evento al hacer click que entienda que se ha hecho click;
 function Header({setLoading,localidades,isLoading}) {
const location = useLocation();
const navigate = useNavigate();
const [displayLocalities, setdisplayLocalities] = useState(false);
const [selectedOption, setSelectedOption] = useState(null);
const [existsLocality,setExistsLocality] = useState(false);
// const renderTo = (localidades.country.length > 0 && localidades.region.length > 0 && localidades.city.length > 0) ? true :false;
// console.log(localidades,'true espero');
console.log('existsLocality',existsLocality);
const setOptionsHead = (route,index)=>{
  // console.log('route',route);
  // console.log(0,index);
  if(location.pathname === '/friends/status' ){
    index === 2 ? navigate('/news/current?timestamp=week') : navigate(route);
    //OK si está en friends qeu no sume;
  }else if(location.pathname.includes('/news/current')){
    index === 2 ? '' : navigate(route)
  } else{
    navigate(route);
  }
}


const changeOptions = (option,route,setLoading,index)=>{
  setSelectedOption(option);
  setOptionsHead(route,index);
  setLoading(true);
  // setItem(''); por ahora voy a quitar lo del setItem porque lo entiende como un error al cargarse rápido
  // handleClick();
}




useEffect(()=>{
  if(location.pathname.includes('friends')){
      setSelectedOption('Following')
  } else if(location.pathname.includes('current')){
    setSelectedOption('Top News')
  }else{
    setSelectedOption('For you')
  }

  //SE LE PUEDE HACER UNA RUTA PARA SABER SI EXISTE ESA LOCALIDAD
  if(location.pathname.split('/')[2]){
    fetch(`http://localhost:5000/Config/exists/localities/${location.pathname.split('/')[2]}`)
    .then(response => response.json())
    .then(data => {
      setExistsLocality(data)
    })
    .catch(error => {
      console.error("Error al verificar la localidad:", error);
      return false;
    });
  }
},[location.pathname])

const redirectForYou = ()=>{
  if(location.pathname.includes('country') || location.pathname.includes('region') || location.pathname.includes('city')){
    return `${location.pathname.split('/')[1]}/${location.pathname.split('/')[2]}`
  }else{
    return '/'
  }
}
const optionsNavForMapLocalities = {
  name:['For you','Following','Top News'],
  route:[redirectForYou() ,'/friends/status?following=true', location.pathname === '/' ? `${location.pathname}news/current?timestamp=week` :`${location.pathname}/news/current?timestamp=week` ]
}
console.log('existsLocality',existsLocality);

const getDefaultName = (path)=>{
  const defLocality = path.split('/')[2]
  // const arrLocalidades = [localidades.country,localidades.region,localidades.city];
  const decodedLocality = decodeURIComponent(defLocality)    
  // const result = arrLocalidades.map(item =>{
  //   if(item === decodedLocality){
  //     return true;
  //   } else {
  //     return false;
  //   }
  // })
  // const  chosenLocation= path.split('/').slice(-1).join('');
  const urls =['localidades','remember-me','contact','profile',
    'friends','news','followers','user',
  'short','long','search','users','message','status']; 

  // const defResult =  result.filter(item => item).join();
  // console.log('defResult',defResult);
  //EN EL IF iría si result... es true y todo eso;
   if(path === '/' || !existsLocality ||  urls.includes(decodedLocality) || path === '/news/current'){
    return 'JUNTER'

  }else{
    return decodeURIComponent(defLocality);
  }
}
const defaultName = getDefaultName(location.pathname,localidades);
const setStylesIcoJunter = defaultName.length > 12 ? true  : false;  


//muestra donde estás
// const chosenLocationURL = location.pathname.split('/').join('');
// const chosenPathForNews = location.pathname.split('/')[2];
// const decodedChosenLocation =  decodeURIComponent(chosenLocation);
     
         
 return (
  
  <div className="navbar">
 <div className="parent-nav-options"  >
 <div className={setStylesIcoJunter ? "icono-Junter active" :"icono-Junter" } onClick={()=> setdisplayLocalities(!displayLocalities)}>
  <h1>{defaultName}</h1>
  </div>
{displayLocalities &&  
<div className="nav-localidades visible" >
<LocalidadesUser country={localidades.country} region={localidades.region} city={localidades.city} display={setdisplayLocalities} renderTo={isLoading}/>
</div>}
 <div className="nav-options">
  
  {/* PARA TI, FRIENDS,TOP NEWS */}
  {optionsNavForMapLocalities.name.map((item,index)=>(
  <> <h2 key={index} className={selectedOption === optionsNavForMapLocalities.name[index] ? 'selected-options':''} 
  
  onClick={()=> changeOptions(optionsNavForMapLocalities.name[index],optionsNavForMapLocalities.route[index],setLoading,index)}>

   {optionsNavForMapLocalities.name[index]}
   </h2>
   </>
  
  ))}

  </div>
  </div>
</div>

     )}



     const RenderHeader = ({localidades,isLoading,username})=>{
      const location = useLocation();
      const renderComponent = ()=>{
        if(!location.pathname.startsWith('/post')  && !location.pathname.startsWith('/about-us')&& !location.pathname.startsWith('/localities') && !location.pathname.startsWith('/new/post/format') && !location.pathname.startsWith('/search')  && !location.pathname.startsWith('/profile') && !location.pathname.startsWith('/notifications') &&  !location.pathname.startsWith(`/${username}`) && !location.pathname.startsWith('/new/types/post')){
         return <Header localidades={localidades} isLoading={isLoading} />
        }
      }
      return(<>{renderComponent()}</>)
     }

export default RenderHeader;
