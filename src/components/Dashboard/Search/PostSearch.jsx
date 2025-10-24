import { useState,useEffect,useRef } from "react";
import getToken from "../../js/verifyToken";
import Message from '../MessageForm/Message';
import Loader from '../../../views/processing/FastLoader';
import {filterDataByFrame,fetchingData,getMorePosts} from "../../js/renderMessages";
import { useNavigate } from "react-router-dom";


const PostSearch = ()=>{
    const navigate =  useNavigate();
    const token  = getToken(() => navigate('/auth/login'));
    const [item,setItem] = useState(null);
    const [counterForRender,setCounterForRender] = useState(1);
    const [secondItemShoMore,setSecondItemShoMore] =  useState(null);
    const [thirdPosts,setThird] = useState(null);
    const [userIteractions,setUserIteractions] = useState(null);
    const [listFollowing,setListFollowing] = useState(null);
    const [iteractionsEnd,setIteractionsEnd] = useState(false);
    const [secondIsLoading,setSecondIsLoading] = useState(false);
    const loaderRef = useRef(null);

    const [loader,isLoading] = useState(true);
    const url = 'http://localhost:5000/messages/render/junts/posts/main';
    useEffect(()=>{ fetchingData(url,token)
  
      // filterDataByFrame(data,setItem,setSecondItemShoMore,setSmallRender,setThird,setTimeStorage)
      .then(data =>{
     
          // if(boolean){
            filterDataByFrame(data,setItem,setSecondItemShoMore,null,setThird)
            isLoading(false);
          const posts = Object.keys(data);
          const idPosts = posts.map(element => data[element].id_message);
          // setListIdPosts(idPosts);
          fetch(`http://localhost:5000/config/get/user/iteractions/${idPosts}`,{
               headers: { 'Authorization': `Bearer ${token}`},
          })
          .then(response  => response.json())
          .then(result => {
            console.log(result,'result');
            if(result.boolean){
              setUserIteractions(result.iteractions);
              setListFollowing(result.following);
            }
          })
          .catch(err => console.log(err))   
          .finally(()=>{
            setIteractionsEnd(true)
          })
        });
        
    },[]);


    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          console.log(entries,'entradas');
          if (entries[0].isIntersecting) {
            getMorePosts(setItem,secondItemShoMore,thirdPosts,counterForRender,setCounterForRender,setSecondIsLoading,url,token,isLoading);
          }
        },
        { threshold: 1 }
      );
  
      if (loaderRef.current) {
        observer.observe(loaderRef.current);
      }
  
      // Limpieza del observer al desmontar
      return () => {
        if (loaderRef.current) {
          observer.unobserve(loaderRef.current);
        }
      };
    }, [loaderRef, item]);
    // console.log(userIteractions);

// const [secondItemShoMore,setSecondItemShoMore] =  useState(null);
// const [thirdPosts,setThird] = useState(null);



 
    return(
                <>
                <div className="nav-srch-posts">
                    <h4>Posts</h4>
                </div>
               {!loader && <div className="content-posts-srch" >
            <MappedPosts item={item} iteractions={userIteractions} listFollowing={listFollowing} iteractionsEnd={iteractionsEnd}/>
           {secondIsLoading && <Loader />}
              <div ref={loaderRef} style={{ height: '20px' }}></div>
                </div>
                } 
                </>

    )
}


      
      
const MappedPosts = ({item,iteractions,listFollowing,iteractionsEnd})=>{
    const params = location.pathname.split('/')[2];
    const localitie = location.pathname.split('/')[1];
  
    return(
      <>      
      {item && 
     (
      item === 'not matched' ? (
        <div className="not-matched-cont-components-posts">
          <span><b>{params}</b> is not a vaild <b style={{marginRight:'2px'}}>{localitie}</b>,or it has not been included yet on our database, please try something different.</span>
          </div>
            ) : (
            item.map((item)=>(
              <>
              <Message
                       key={item.id_message}
                       id={item.id_message}
                       userid={item.userid}
                       username={item.username}
                       image={item.img}
                       date={item.date}
                       likes={item.likes}
                       tn={item.tn}
                       views={item.views}
                       replies={item.replies}
                       repost={item.repost}
                       long={item.long}
                      //  tittle={item.tittle}
                       text={item.content}
                       response={item.response} //habría que cambiarle el nombre
                      //  objectReply={item.objectReply}
                       contentImage={item.content_images}
                       country={item.country}
                       region={item.region}
                       city={item.city}
                       isLocalities={item.is_localidades}
                       isCitation={item.is_citation}
                       isComment={item.is_comment}
                       objectReply={item.objectReply}
                       //por ahora is thread no lo incuyo 
                       // red={backgroundColor}
                       iteractions={iteractions}
                       listFollowing={listFollowing}
                       iteractionsEnd={iteractionsEnd}
                       thread={item.thread}
                      
        
                             />
              </>
        
            )
          )
        ))}
</>
  )
}
      
      export default PostSearch;