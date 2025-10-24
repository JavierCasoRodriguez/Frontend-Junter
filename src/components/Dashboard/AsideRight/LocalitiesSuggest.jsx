import {useEffect,useState,useContext } from "react";
import Loader from   '../../../views/processing/FastLoader';
import ListLocalitiesSuggest from "./ListLocalitiesSuggest";''
import {fetchingData} from '../../js/renderMessages';
import {ContextUid} from '../../../views/SessionContext';




const LocalitiesSuggest = ({booleanForClassName,token,isMainRender,query,isWideScreen})=>{
    // const [item,setItem] = useState(null);
    const [localities,setLocalities] = useState(0);
    const [loader,isLoading] = useState(true);
    const uid = useContext(ContextUid);
    const searchLocation  = location.pathname.startsWith('/search') ? true : false;
    const localitiesRoute = location.pathname.startsWith('/search/posts') ? `http://localhost:5000/config/get/localities/related/to/${query}`:'http://localhost:5000/config/get/localities/suggest'
    useEffect(()=>{
        if(isWideScreen){
            console.log('localitiesRoute',localitiesRoute);
            fetchingData(localitiesRoute,token).then(data => {setLocalities(data),isLoading(false)});
        }
    },[isWideScreen]);

    const getClassNameForRender = (searchLocation,booleanForClassName)=>{
        if(booleanForClassName){
            return 'suggeest-localities-aside profile-info';
        }else if(searchLocation){
            return 'suggeest-localities-aside search';
        }else if (isMainRender){
            return 'suggeest-localities-aside main'
        
    }else {
            return 'suggeest-localities-aside'
        }
    }
    return(
        
        <div className={getClassNameForRender(searchLocation,booleanForClassName)}>
            <div className="nav-localities-suggest-aside">
            {!isMainRender && <h3>{searchLocation ? 'Localities ' : 'Other chats'}</h3>}
            </div>
            <div className={"content-localities-suggest-aside"}>
                {loader ? (
                    <Loader />
                ): (localities) && 
                (
                    <>
                    {localities.map((item,index) => (
                        <ListLocalitiesSuggest  key={index} item={item.query} params={item.type} isMainRender={isMainRender} uid={uid.uid} />
                    ))}
                    </>
                )
                }
                
            </div>
        </div> 
        
        
    )
}




export  default LocalitiesSuggest;