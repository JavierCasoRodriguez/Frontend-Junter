import {useLocation,useSearchParams} from 'react-router-dom';
import {useEffect,useState} from 'react';
import SearchAside from '../components/Dashboard/AsideRight/SearchAside'
import FilterNews from '../components/Dashboard/AsideRight/FilterNews'
import LocalitiesSuggest from '../components/Dashboard/AsideRight/LocalitiesSuggest';
import SuggestContaier from '../components/Dashboard/SuggestContainer';
import Suggest from '../components/Dashboard/AsideRight/Sugerencia'
import TrendsContainer from '../components/Dashboard/TrendsContainer';
import FastLoader from './processing/FastLoader'
import '../styles/Haside/Haside.scss';
import { fetchingData } from '../components/js/renderMessages';
function AsideRight({localidades,token,isWideScreen,searchParams}) {

  

   return (
    <>
        <>
          <div className="srch-aside-right-query-fast">
            <SearchAside />
          </div>
  
        
<div  style={{marginBottom:'40px'}}>
<LocalitiesSuggest  isMainRender={true}  token={token} isWideScreen={isWideScreen}/>
</div>
         <SuggestContaier />
        </>
   <TrendsContainer localidades={localidades} searchParams={searchParams} isWideScreen={isWideScreen}/>
    </>
   );
  

 } 

 const ProfileAsideRight  = ({path,token,searchParams,isWideScreen})=>{
  const [suggests,setSuggests] = useState(null);
  const [loader,isLoading] = useState(true);
  const queryContentPath = path.startsWith('/search/posts');
  const query = searchParams.get('q');
  console.log('query',query);
  const defUrl  = queryContentPath ? `http://localhost:5000/config/get/users/params/${query}` :'http://localhost:5000/config/get/users/suggest'
  

  useEffect(()=>{
    if(isWideScreen){
      fetchingData(defUrl,token).then(data => {isLoading(false),setSuggests(data)})

    }
  },[path,isWideScreen])

  return (
      
         <div className="cont-aside-suggest-user-profile">
         <div className="sugg-prs-users-profile">
              <h3>{queryContentPath ? 'Related users ' : 'Users you may know'}</h3>
              <div className='content-sugg-profile'>
              {loader ? (
  <FastLoader />
 
) : (
  suggests && suggests.length > 0 && (
    suggests.map(element => (
      <Suggest key={element.username} name={element.username} image={element.img} />
    ))
  )
)}  
                  </div>
          </div>
          <LocalitiesSuggest  booleanForClassName={true} token={token} query={query} isWideScreen={isWideScreen}/>
          {queryContentPath && <TrendsContainer localidades={[{country:'',region:'',city:''}]} isWideScreen={isWideScreen} searchParams={searchParams}/>}
          </div>
      

  )
}



const RedirectAsideRight = ({localidades,token,username})=>{
  // const [item,setItem] = useState(null);
  const location = useLocation();
  const mainRoute = location.pathname;
const [searchParams] = useSearchParams();
const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 720);

useEffect(() => {
  const handleResize = () => {
    setIsWideScreen(window.innerWidth > 720);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
 
//1 => Filter News;
//2 => Localidades Suggests
//3 => General;
const renderMainComp = ()=>{
if(mainRoute.includes('/news/current')){
 return  <FilterNews />
} else if(mainRoute.startsWith('/profile') || mainRoute.startsWith('/search') || mainRoute.startsWith(`/${username}`)  ){
 return  <ProfileAsideRight  path={mainRoute} token={token} searchParams={searchParams} isWideScreen={isWideScreen} />
}  else if (mainRoute !== '/localities' && !mainRoute.startsWith('/new') ){
 return <AsideRight localidades={localidades} token={token} isWideScreen={isWideScreen} searchParams={searchParams}/> 
}}
  return (<>{renderMainComp()}</>)
}





export default RedirectAsideRight;
