import { useEffect,useState,useContext } from 'react';
import Nav from '../../../views/Nav';
import {fetchingData} from '../../js/renderMessages'
// import getToken from '../../js/verifyToken';
import { useNavigate,useLocation } from 'react-router-dom';
import MappedPosts from '../../../views/main/MappedPosts';
import Loader from '../../../views/processing/FastLoader';
import { HiOutlineChat,HiChat } from "react-icons/hi";
import {AiOutlineRetweet} from 'react-icons/ai'
import Sugerencia from '../AsideRight/Sugerencia';
import { ContextUid } from "../../../views/SessionContext";

const PostEngagements = ()=>{
    const navigate = useNavigate();
    const location = useLocation();
    const uid = useContext(ContextUid);
    const path = location.pathname.split('/');
    const idParentPost = path[4];
    console.log(idParentPost);
   

    console.log(path[3])
 
    return(
        <div className="container-post-engagements">
              <Nav query={'Post engagements'} />
              <div className="navbar-options-engagements">
            {[{svg:path[3] === 'quotes' ? <HiChat />:<HiOutlineChat />,name:'Quotes'},{svg:<AiOutlineRetweet />,name:'Reposts'}].map((item,index) => (
             <>
              <div className={path[3] === item.name.toLowerCase() ? 'opt-engagements active':'opt-engagements'} onClick={()=> navigate(`/posts/engagements/${item.name.toLowerCase()}/${idParentPost}`)} style={{borderRight:index === 0  && '1px solid whitesmoke'}}>
              {item.svg}
              <span>{item.name}</span>
            
              </div>
              </>
            ))}
              </div>

              <div className="content-post-engagements">
           {path[3] === 'quotes' ? <Quotes uid={uid.uid} navigate={navigate} location={location}  idParentPost={idParentPost}/> : (
            path[3] === 'reposts' && <Reposts uid={uid.uid} navigate={navigate} location={location} idParentPost={idParentPost}/>
           )}
              </div>

        </div>
    )
}


const Quotes = ({idParentPost,location,uid})=>{

  return(
<>
<MainComponent uid={uid} index={0}   location={location} url={`http://localhost:5000/messages/engagements/quotes/${idParentPost}`}/>
</>
  )
} 

const Reposts = ({location,idParentPost,uid})=>{

  return(
    <>
   <MainComponent    uid={uid} index={1} location={location} url={`http://localhost:5000/messages/engagements/reposts/${idParentPost}`}/>
    
    </>
  )
}

const MainComponent = ({url,index,location,uid})=>{
  const [loader,isLoading] = useState(true);
  const [data,setData] = useState(null);
  useEffect(()=>{
    fetchingData(url).then(data =>{
       if(data){
         if(data.message === 'No interactions found'){
          isLoading(false);
          setData([]);
         }else{
          isLoading(false);
           setData(data.result);
         }
       }
    })
},[]);
  
  return(
    <>
     {!loader ? (
      data?.length > 0 && 
        <>
        {index === 0 ? <MappedPosts item={data} 
      //   iteractions={userIteractions} 
      //   listFollowing={listFollowing} 
      //   iteractionsEnd={iteractionsEnd} 
      //   filed={filed} 
        location={location}/> :
        <ul className="content-reposts">
          {data.map((item,index) => (
            <>
           <Sugerencia isUser={uid === item.userid ? true : false} key={index} name={item.username}
           //Añadirle la fotografía
           />
            </>
          ))}
        </ul>
        }
        </>
     
      ): <Loader />}
    </>
  )
}
export {PostEngagements,Quotes,Reposts};