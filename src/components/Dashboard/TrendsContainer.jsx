import { useEffect,useState } from 'react';
import Trends from './AsideRight/Trends';
import FastLoader from '../../views/processing/FastLoader';
import { IoMdAdd } from 'react-icons/io';
import { useLocation,useNavigate } from 'react-router-dom';

function TrendsContainer({localidades,isWideScreen,searchParams}){

    const location = useLocation();
    const navigate = useNavigate();
    const searchPath = location.pathname.startsWith('/search') ? true : false;
    // const queryContentPath = location.pathname.startsWith('/search/posts') ? true : false;
    const queryParams = searchParams &&   searchParams.get('q');


    const [listTrends,setListTrends] = useState();
    const [secondAmount ,setSecond] = useState(null);
    const [thirdAmount ,setThird] = useState(null);
    const [forthAmount ,setFourth] = useState(null);
    const [fifthAmount ,setFifth] = useState(null);
    const randomNumberForSplice = Math.floor(Math.random() * (10 - 6 + 1)) + 6;


    const [isLoading,setLoading] = useState(true);
    const [smallTrend,setSmallTrend] = useState(false);
    const [counter,setCounter ] = useState(1);
     useEffect(()=>{
      if(isWideScreen){
        getTrends(setListTrends,counter,setSmallTrend);
      }
      },[location.pathname]);
//2 Trends
const getDefaultUrl = ()=>{
    if(!location.pathname.startsWith('/search') &&  location.pathname !== '/' && !location.pathname.startsWith('/friends') && !location.pathname.startsWith('/post')){
      const arrPath = location.pathname.split('/');
      const locality = arrPath[arrPath.length -1];
      const params = arrPath[arrPath.length -2];
      return  `http://localhost:5000/trends/render/localities/${params}/${locality}`
   }else{
    return `http://localhost:5000/trends/fetching/main`
   }
  } //añadir la ruta del trends con parámetro para el queryContent;
   const getTrends = async (setListTrends,counter,setSmallTrend)=>{
    // const token = getToken();
      //la clave sería recomendar en torno a 10 y ir recortando
      //Lateral => 3 o 5;
      // Search a 10 mismos
      try {
        const url = getDefaultUrl();
        const response = await fetch(url);
               if (!response.ok) {
               throw new Error('Error al obtener los datos');
          }
          const result = await response.json();
          if(result.boolean){
            // setBooleaForSh(true)          
            //son 50 por lo que no hace falta sacar el object keys
            frameTrends(result.data,setSmallTrend);
          }else{
            setListTrends([])
          }

          }   catch (error) {
            console.error('Hubo un problema:', error);
          }  finally{
            setLoading(false)
          }
     }

     const frameTrends = (data,setSmallTrend,)=>{
      //He puesto  un límite de 120 para empezar puede que haya que ir revisandolo
      const trends = Object.keys(data);
      const lengthNumTrends = trends.length;
  
      if(lengthNumTrends < 20){
        setListTrends(data);
        setSmallTrend(false);
      }
  else{
  
      portionTrend(data,lengthNumTrends,6,null,setListTrends); 
      portionTrend(data,lengthNumTrends,4,setSecond);
      portionTrend(data,lengthNumTrends,3,setThird);
      portionTrend(data,lengthNumTrends,2,setFourth);
      setFifth(data);
    } 
  }

  const portionTrend = (data,length,num,setObjectTrends,setListTrends) =>{
    const index = Math.round(length / num);
    const firstAmount = data.slice(0,index);
    //Se podría meter el ternario pero así se entiende mejor.
    if(num === 6){
        setListTrends(firstAmount);
    } else{
        setObjectTrends(firstAmount);
    }
  }
 


  const getMoreTrends = (setCounter,counter,setSmallTrend)=>{
    setCounter(counter + 1);
    setSmallTrend(true);
    setTimeout(()=>{
     setSmallTrend(false);
    },3000);
    if(counter === 1){
     setListTrends(secondAmount)
    } else if(counter === 2){
     setListTrends(thirdAmount)
    }else if(counter === 3){
     setListTrends(forthAmount)
    }else if(counter === 4){
     setListTrends(fifthAmount)
    }
 }
//
const getDefaultTrend = (path,localidades)=>{
    const defLocality = path.split('/')[2];
    // console.log(localidades);
    const arrLocalidades = [localidades.country,localidades.region,localidades.city];
    const decodedLocality = decodeURIComponent(defLocality)    
    const result = arrLocalidades.map(item =>{
     return item === decodedLocality ? true : false;
    })
//Función que se repite con el header;
//puede que tenga ligeras variaciones por lo de las urls y news/curent;
  // const  chosenLocation= path.split('/').slice(-1).join('');
  const urls =['localidades','remember-me','contact','profile',
    'friends','news','followers','user',
  'short','long','search','users','message','status']; 

  const defResult =  result.filter(item => item).join();
  if(!defResult || urls.includes(decodedLocality)){
    return 'Top Trends'
  }else{
    return `Trending in ${decodeURIComponent(defLocality)}`;
  }
}



    return (
        <div className={searchPath ? "trends-srchq" :'trend'} >
          {/* Podría ser interesante que fuese azul el tag_list */}
        {searchPath  ? <div className={queryParams ? 'nav-trendsq query': 'nav-trendsq'}>
            <h4>{queryParams ? `Related to ${queryParams ? '#' : ''}${decodeURIComponent(queryParams)}` :`Trends`}</h4>
        </div> :
        <div className="nav-trends">
         
             <h2>
            {/* Trending in <b>{location.pathname.split('/')[2]}</b>  */}
            {getDefaultTrend(location.pathname,localidades)} 
            </h2>
            </div>
         }
        <ul className={searchPath ? "cnt-trendsq" :'list-trends'} style={{display:'block'}}>
            {isLoading ?  (
                <FastLoader />
            ): 
        listTrends && listTrends.splice(0,randomNumberForSplice).map((item,index) => (
            <Trends key={index}   name={item.name} number={item.count} index={!queryParams && index} />
        ))
        }
       {(!smallTrend && secondAmount )  && <div className="show-more-trends" 
      //  onClick={()=> getMoreTrends(setCounter,counter,setSmallTrend)}
      onClick={()=> navigate('/search/trends')}
       
       >
          <IoMdAdd />
        </div>}
    </ul>
</div>
    )
}


export default TrendsContainer