import Nav from '../../views/Nav';
import Message from './MessageForm/Message';
import {useState, useEffect,useRef } from 'react';
import getToken from '../js/verifyToken';
import { useLocation,useNavigate } from 'react-router-dom';
import FastLoader from '../../views/processing/FastLoader';
import {filterDataByFrame,fetchingData,getMorePosts} from '../js/renderMessages';


 const getUsernameFromPath = (location)=>{
        if(location.pathname.includes('/profile/users')){
            return decodeURIComponent(location.pathname.split('/')[3]);
        } else {
           return  decodeURIComponent(location.pathname.split('/')[1]);
        }
    }

    
    
    
//Posts Subudos por el usuario;
const UploadPostsComponent = ({username})=>{
    return(<><UserPosts  index={1} username={username}/></>)
}
const UploadedPostsComponentExtra = ({username})=>{
  return(<><UserPosts  index={1} username={username}/></>)
}
    //Posts con Likes
const LikesComponent = ({username})=>{
    return(<><UserPosts  index={2} username={username}/></>)
}
const SavedComponent = ({username})=>{
    return(<><UserPosts  index={0} username={username}/></>)
}
const NewsComponent = ({username})=>{
    return(<><UserPosts  index={3} username={username}/></>)
}


//GENERAL;
const UserPosts = ({index,username})=>{
  const navigate =  useNavigate();
  const token  = getToken(() => navigate('/auth/login'));
  const dataForIndex = (index,username)=>{
        const data = [];
                 if(index === 0){
                    data.push({
                    className :'saved-render-messages',
                    empty: <span className="span-empty-saved-msgs">Ups no posts saved!</span>,
                    url:`http://localhost:5000/Profile/user/saved/posts/${username}`
                    })
                    return data;
            // return <span className="span-empty-saved-msgs">Ups no posts saved!</span>;
                } else if(index === 1){
                    data.push({
                        className :'my-messages',
                        empty:<EmptyMessage  message={`${username} has not uploaded any post`} />,
                        url:`http://localhost:5000/Profile/user/posts/${username}`
                        // url:`http://localhost:5000/Profile/user/posts/added/likes/${username}`
                       })
                       return data;
                    // return <EmptyMessage  message={`${username} has not uploaded any post`} />
                } else if(index === 2){
                    data.push({
                        className :'liked-msg',
                        empty:<EmptyMessage message="You have not liked any post yet"/>,
                        url:`http://localhost:5000/Profile/user/posts/added/likes/${username}`
                       })
                       return data;
                    // return <EmptyMessage message="You have not liked any post yet"/>
                } else if(index === 3){
                    data.push({
                        className :'saved-render-messages',
                        empty:<span className="span-empty-saved-msgs">You have not added any post as Top New</span>,
                        url:`http://localhost:5000/Profile/user/posts/added/news/${username}`,
                       })
                    //  return <span className="span-empty-saved-msgs">You have not added any post as Top New</span>
                    return data;
                } 
    }


    const [item,setItem] = useState([]);
    // const location = useLocation();
    // const [userData,setUserData] = useState(null);
    const [isLoading,setLoading] = useState(true);
    const [counterForRender,setCounterForRender] = useState(1);
    const [secondItemShoMore,setSecondItemShoMore] =  useState(null);
    const [thirdPosts,setThird] = useState(null);
    const [userIteractions,setUserIteractions] = useState(null);
    const [listFollowing,setListFollowing] = useState(null);
    const [filed,setFiled] = useState(null);
    const [iteractionsEnd,setIteractionsEnd] = useState(false);
    const [secondIsLoading,setSecondIsLoading] = useState(false);
    const [lenPosts,setLengthPosts] = useState(0);
    const loaderRef = useRef(null);
    const userData = dataForIndex(index,username);
    

    


    useEffect(()=>{ 


        fetchingData(userData[0].url,token)
    
          // filterDataByFrame(data,setItem,setSecondItemShoMore,setSmallRender,setThird,setTimeStorage)
          .then(data =>{
  
            console.log('los items posts',data.filter(item => item.is_resposted));
              filterDataByFrame(data,setItem,setSecondItemShoMore,null,setThird)
            const posts = Object.keys(data);
            
            setLengthPosts(posts.length);
            setLoading(false);
            const idPosts = posts.map(element => data[element].id_message);
            // console.log(`http://localhost:5000/config/get/user/iteractions/${idPosts}`);
            fetch(`http://localhost:5000/config/get/user/iteractions/${idPosts}`,{
                 headers: { 'Authorization': `Bearer ${token}`},
            })
            .then(response  => response.json())
            .then(result => {
              console.log(result,'result');
              if(result.boolean){
                setUserIteractions(result.iteractions);
                setListFollowing(result.following);
                setFiled(result.filed);
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
              getMorePosts(setItem,secondItemShoMore,thirdPosts,counterForRender,setCounterForRender,setSecondIsLoading,userData[0].url,token,isLoading);
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

return (
  <>
      <div className={userData[0].className}>
          {(index === 0 || index === 3) && (
              <Nav query={index === 3 ? 'TopNews' : 'Saved Posts'} />
          )}

      {isLoading ? (
          <FastLoader />
      ) : (
          (!item || item.length === 0) ? (
            userData[0].empty
          ) : (
              item.map((element) => (
                  <Message
                      key={element.id_message}
                      id={element.id_message}
                      username={element.username}
                      image={element.img}
                      contentImage={element.content_images}
                      estado={element.estado}
                      date={element.date}
                      likes={element.likes}
                      long={element.long}
                      tittle={element.tittle}
                      text={element.content}
                      userid={element.userid}
                      tn={element.tn}
                      views={element.views}
                      replies={element.comments}
                      response={element.response}
                      repost={element.repost}
                      country={element.country}
                      region={element.region}
                      city={element.city}
                      isCitation={element.is_citation}
                      isComment={element.is_comment}
                      isReposted={element.is_reposted}
                      objectReply={element.objectReply}
                      //nombre de usuario suyo para los reposts
                      usernameAtProfileForRepost={username}
                      // thread={element.is_thread}
                      // Me imagino que esté habra que cambiarlo por thread
                      iteractions={userIteractions}
                      listFollowing={listFollowing}
                      iteractionsEnd={iteractionsEnd}
                      filedPosts={filed}
                      renderOptions={2}
                  />
              ))
          )
      )}
      {secondIsLoading && <FastLoader />}
             { lenPosts > 50 && <div ref={loaderRef} style={{ height: '20px' }}></div>}
               
             </div>       
  </>
);





function EmptyMessage({message}){
    return (
     <div className="empt-tr-msg">
     <span>{message}</span>
     </div>
    )
 }

};


const DefaultProfilePosts = ()=>{
const location  = useLocation();
const username =  getUsernameFromPath(location);// Lo pones arriba del todo y listo;



// }
const params = location.pathname.split('/')[2];

const getProfilePosts = ()=>{
    switch (params) {
        case 'post':
          return <UploadPostsComponent username={username} />
        case 'likes':
          return <LikesComponent  username={username}/>;
        case 'saved':
           return <SavedComponent username={username}/>;
        case 'added':
               return <NewsComponent  username={username}/>;
          case 'users':
              return <UploadedPostsComponentExtra username={username} />
        default:
           return <UploadPostsComponent username={username} />;
    }
}
return(<>{getProfilePosts()}</>)
}






  
// /:username/added/posts/topnews
// export  {SavedMessages,LikedPostsProfile,UploadedPostsProfile,GetTnPosts}
export default DefaultProfilePosts
