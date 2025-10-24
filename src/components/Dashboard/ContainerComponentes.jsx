import  getToken  from '../js/verifyToken';
import Message from './MessageForm/Message';
import{useEffect,useState,useRef,useContext, useMemo} from 'react';
import {ContextUid} from '../../views/SessionContext';
import   {useLocation,useNavigate}  from 'react-router-dom';
import FastLoader from '../../views/processing/FastLoader'
import {filterDataByFrame,fetchingData,getMorePosts} from '../js/renderMessages';
import FastPost from '../Dashboard/NewMessage/FastMessage';
import { useQuery } from '@tanstack/react-query'

//Tendria que copiarlo en FriendsRoot y en la ruta del news

  const fetchMainData = async (url, token) => {
    const data = await fetchingData(url, token); // tu función custom

   
    if (data.index === 0) {
      return { notMatched: true };
    }
  
    const posts = Object.keys(data);
    const idPosts = posts.map(element => data[element].id_message);
  
    const iteractionsRes = await fetch(`http://localhost:5000/config/get/user/iteractions/${idPosts}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  
    const result = await iteractionsRes.json();
  
    return {
      data,
      iteractions: result.boolean ? result.iteractions : null,
      following: result.boolean ? result.following : null,
      filed: result.boolean ? result.filed : null
    };
  };


const getUrlFromPath = (params,localitie)=>{
const introUrl = `http://localhost:5000/messages/render/junts/posts`;
  if(params === 'country'){
    return `${introUrl}/localities/country/${localitie}`;
  } else if(params === 'region'){
    return `${introUrl}/localities/region/${localitie}`
  } else if (params === 'city'){
    return `${introUrl}/localities/city/${localitie}`
  }else if(!params){
    //ruta principal
    return `${introUrl}/main`
  }
}

const getUrlFromPathForNews = (params,localitie,time)=>{
 const introNews = `http://localhost:5000/messages/render/junts/news`;
  if(params === 'country'){
    return `${introNews}/country/${localitie}/time/${time}`;
  } else if(params === 'region'){
    return `${introNews}/region/${localitie}/time/${time}`
  } else if (params === 'city'){
    return `${introNews}/city/${localitie}/time/${time}`
  }else if(params === 'news'){
    //ruta principal
    return `${introNews}/main/posts/${time}`
  }
}





const NewsWeekComponent = ()=>{
    //una opcion sería renderizar el componete message en uno y luego en los otros 2 el componente anterior
    const token  = getToken(() => navigate('/auth/login'));
    const location = useLocation();
    const navigate =  useNavigate();
    const uid = useContext(ContextUid);
    const [item,setItem] = useState(null);
    const [counterForRender,setCounterForRender] = useState(1);
    const [secondItemShoMore,setSecondItemShoMore] =  useState(null);
    const [thirdPosts,setThird] = useState(null);
    const [userIteractions,setUserIteractions] = useState(null);
    const [listFollowing,setListFollowing] = useState(null);
    const [filedPosts,setFiledPosts] = useState(null);
    const [iteractionsEnd,setIteractionsEnd] = useState(false);
    const [secondIsLoading,setSecondIsLoading] = useState(false);
    const loaderRef = useRef(null);
    const [loader,isLoading] =  useState(true);
    const [lenPosts,setLengthPosts] = useState(0);
    const localSearch = location.search.split('=')[1];
    const arrLocal =  location.pathname.split('/');
    const params = arrLocal[1];
    const defaultLocality  = arrLocal[2];
    const url  = getUrlFromPathForNews(params,defaultLocality,localSearch);

    useEffect(()=>{ fetchingData(url,token)
      .then(data =>{
        if(data.index === 1){
          navigate(`/chat/external/${params}/${defaultLocality}`)
        }
         else if(data.index === 0){
          setItem('not matched');
        } else{
          // if(boolean){

            filterDataByFrame(data,setItem,setSecondItemShoMore,null,setThird);
            // setItem,secondItemShoMore,thirdPosts,counterForRender,setCounterForRender,setSecondIsLoading,url,token,isLoading
          const posts = Object.keys(data);
          setLengthPosts(posts.length);
          const idPosts = posts.map(element => data[element].id_message);
          isLoading(false);
          
          fetch(`http://localhost:5000/config/get/user/iteractions/${idPosts}`,{
               headers: { 'Authorization': `Bearer ${token}`},
          })
          .then(response  => response.json())
          .then(result => {
            console.log(result,'result');
            if(result.boolean){
              setUserIteractions(result.iteractions);
              setListFollowing(result.following);
              setFiledPosts(result.filed);
            }
          })
          .catch(err => console.log(err))   
          .finally(()=>{
            setIteractionsEnd(true)
          })
        }
      }
    )},[]);


    useEffect(() => {
      //Se repite el co´digo  se podría poner en una función;
      const observer = new IntersectionObserver(
        (entries) => {
          // console.log(entries,'entradas');
          if (entries[0].isIntersecting) {
            getMorePosts(setItem,secondItemShoMore,thirdPosts,counterForRender,setCounterForRender,setSecondIsLoading,url,token,isLoading);
            // getMorePosts(setItem,secondItemShoMore,thirdPosts,counterForRender,setCounterForRender,setSecondIsLoading,userData[0],token,isLoading);
          }
        },
        { threshold: 0.5 }
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
   
   
    // console.log('item',item);
    
    return (
<>
{loader ? 
<FastLoader />
: (
  <>
    <MappedPosts 
      item={item} 
      backgroundColor="orange" 
      iteractions={userIteractions} 
      listFollowing={listFollowing} 
      iteractionsEnd={iteractionsEnd} 
      filed={filedPosts}
      uid={uid.uid}
      setItem={setItem}
      navigate={navigate}
    />
  </>
)}

  {secondIsLoading && <FastLoader />}
  {lenPosts > 50 && <div  ref={loaderRef} style={{ height: '40px'}}></div>}
</>
  )

};
const NewsMonthComponent = ()=>{
    return(
        <> <NewsWeekComponent /></>
    )
};
const NewsDayComponent = ()=>{
    return(
       <><NewsWeekComponent /> </> 
    )
};


const RootNewsComponent =()=>{
    const location = useLocation();
    const localSearch = location.search.split('=')[1];
    const renderComponent = ()=>{
         switch (localSearch) {
          case 'month':
            return <NewsMonthComponent />;
          case 'about':
            return <NewsWeekComponent />;
          case 'day':
            return <NewsDayComponent />;
          default:
            return <NewsWeekComponent />;
        }
    };

    return(<>{renderComponent()}</>);

}

const DefaultMainComponent = ()=>{
  // const [item,setItem] = useState(null);
  const location = useLocation();
  const mainRoute = location.pathname.split('/')[1];



// const [loader,isLoading] = useState(true);
// const  defaultLocalitiy =   location.pathname.split('/')[-1];
const renderMainComp = ()=>{
  switch (mainRoute) {
          case 'country':
            return <CountryComponent />;
          case 'region':
            return <RegionComponent/>;
          case 'city':
            return <CityComponent />;
          default:
            return <MainRoot />;
        }
}
  return (<>{renderMainComp()}</>)
}

const MappedPosts = ({item,iteractions,listFollowing,iteractionsEnd,filed,navigate,uid,setItem})=>{
  console.log({
    item:item,
  })
  
  const params = location.pathname.split('/')[2];
  const localitie = location.pathname.split('/')[1];
  const [activeDateNews,setActiveDateNews] = useState([]);
   const updatedDates = ['today', '7 days','30 days'];
  const handleFilterNewsClick = (index)=>{
    if(index === 0){
      navigate(`${location.pathname}?timestamp=day`)
      setActiveDateNews([true,false,false]);
    } else if(index === 1){
      navigate(`${location.pathname}?timestamp=week`)
      setActiveDateNews([false,true,false]);
    }else if(index === 2){
      navigate(`${location.pathname}?timestamp=month`)
      setActiveDateNews([false,false,true]);
    }
    }

    useEffect(()=>{
      if(location.pathname.includes('/news/current')){
        const locaSearch = location.search.split('=')[1];
        if(locaSearch === 'day'){
          setActiveDateNews([true,false,false]);
        }else if(locaSearch === 'month'){
          setActiveDateNews([false,false,true]);
        }else if(locaSearch === 'week'){
          setActiveDateNews([false,true,false]);
        }
      }
    },[location.pathname]
    )
  return (
    <div className="container-posts-home" > 
     <FastPost  path={location.pathname} navigate={navigate} uid={uid.uid} setItem={setItem} />
     {location.pathname.includes('/news/current') &&<div className="container-parent-filter-date-news"> 
      <div className="header-filter-news">
                    <label>Filter by:</label>
                    <div className='content-filter-date'>
                    {updatedDates.map((item,index)=>(
                      <div key={index} className={activeDateNews[index] ? 'item-content-filter active': 'item-content-filter'}  onClick={()=> handleFilterNewsClick(index)}>{item}</div>
                    ))}
                    </div>
                    </div>
                    </div>}
      {item && (
        item === 'not matched' ? (
          <div className="not-matched-cont-components-posts">
            <span>
              <b>{params}</b> is not a valid <b style={{ marginRight: '2px' }}>{localitie}</b>,
              or it has not been included yet in our database, please try something different.
            </span>
          </div>
        ) : (
          item.map((item) => (
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
              text={item.content}
              response={item.response}
              contentImage={item.content_images}
              country={item.country}
              region={item.region}
              city={item.city}
              isLocalities={item.is_localidades}
              isCitation={item.is_citation}
              isComment={item.is_comment}
              objectReply={item.objectReply}
              isReposted={item.is_reposted}
              usernameReposted={item.username_reposted}
              setItem={setItem}//delete
              iteractions={iteractions}
              listFollowing={listFollowing}
              filedPosts={filed}
              iteractionsEnd={iteractionsEnd}
              thread={item.is_thread}
              renderOptions={0}
            
            />
          ))
        )
      )}
    </div>
  );
  

}
//Ojo porque me imagino que será igual si paso el mapped de views/main


const FriendsRoot = ()=>{

  //MainRoot
    const url = 'http://localhost:5000/messages/render/junts/posts/friends';
    const [item,setItem] = useState(null);
    const navigate =  useNavigate();
    const token  = getToken(() => navigate('/auth/login'));
    const uid = useContext(ContextUid);
    const [loader,isLoading] =  useState(false);
    useEffect(()=>{
      fetchingData(url,token)
      // .then(data => setItem(data))}

      .then(data =>{
        isLoading(false);
        setItem(data);
        // if(boolean){
         
        // const idPosts = posts.map(element => data[element].id_message);
        // setListIdPosts(idPosts);
        // fetch(`http://localhost:5000/config/get/user/iteractions/${idPosts}`,{
        //      headers: { 'Authorization': `Bearer ${token}`},
        // })
        // .then(response  => response.json())
        // .then(result => {
        //   console.log(result,'result');
        //   if(result.boolean){
        //     setUserIteractions(result.iteractions);
        //     setListFollowing(result.following);
        //   }
        // })
        // .catch(err => console.log(err))   
        // .finally(()=>{
        //   setIteractionsEnd(true)
        // })
      });}
      ,[]);


return(
  <>
  
  {loader ? (
    <FastLoader />  
    // Iría el storagedData para no cargar 2 veces 
  ) : (
    <>
      <MappedPosts 
      navigate={navigate} uid={uid} setItem={setItem}
        item={item} 
        backgroundColor="orange" 
        // iteractions={userIteractions} 
        // listFollowing={listFollowing} 
        // iteractionsEnd={iteractionsEnd} 
        // filed={filed}
      />


     
    </>
  )}
  
  
  </>
)


}





const MainRoot = ()=>{
  const navigate =  useNavigate();
  // const token  = getToken(() => navigate('/auth/login'));
  const token = useMemo(() => getToken(() => navigate('/auth/login')), []);

  // console.log('el token no se borró',token);

  const [item,setItem] = useState(null);
  const [secondItemShoMore,setSecondItemShoMore] =  useState(null);
  const [thirdPosts,setThird] = useState(null);
  // const [storagedData,setStoragedData] = useState(null);
  // const [timeStorage,setTimeStorage] = useState(false);
  const [counterForRender,setCounterForRender] = useState(1);
  const [userIteractions,setUserIteractions] = useState(null);
  const [listFollowing,setListFollowing] = useState(null);
  const [filed,setFiled] = useState(null);
  const [smallRender, setSmallRender] = useState(false);
  const [iteractionsEnd,setIteractionsEnd] = useState(false);
  // const [loader,isLoading] = useState(true);
  const location = useLocation();
  const uid = useContext(ContextUid);
// console.log(filed,'filed posts')

  const arrLocal =   location.pathname.split('/');
  const params = arrLocal[1];
  const defaultLocality  = arrLocal[2];
  const url = getUrlFromPath(params,defaultLocality)







  const { data,isLoading,isFetching } = useQuery({
    queryKey: ['mainRoot', url, token],
    queryFn: () => fetchMainData(url, token),
    staleTime: 1000 * 60 * 5,
    enabled: !!token // Evita que corra si no hay token
  });

  
console.log({
  item:item,
  data:data
})

  useEffect(() => {
    if (data?.notMatched) {
      setItem('not matched');
    } else if (data?.data) {
      filterDataByFrame(
        data.data,
        setItem,
        setSecondItemShoMore,
        setSmallRender,
        setThird,
        // setTimeStorage,
        true
      );

      setUserIteractions(data.iteractions);
      setListFollowing(data.following);
      setFiled(data.filed);
      setIteractionsEnd(true);
    }
  }, [data]);




  const [displayMore,setDisplayMore] = useState(false);
  const [activeFastLoader,setActiveFastLoader] = useState(false);
  const getMorePosts = ()=>{
      setActiveFastLoader(true);
      setDisplayMore(false);
      setCounterForRender(counterForRender +1);


      if(counterForRender === 1){
        const firstRenderPosts = secondItemShoMore.slice(0, Math.round(secondItemShoMore.length / 2));

        setItem((prevItems) => [...firstRenderPosts, ...prevItems]);
        // return <MappedPosts item={firstRenderPosts} backgroundColor='red' iteractions={userIteractions} listFollowing={listFollowing} />;
      }else if(counterForRender === 2){
        setItem((prevItems) => [...thirdPosts, ...prevItems]);
        //Por ahora sto funciona pero habría que camiar el enfoque;
        // return <MappedPosts item={secondItemShoMore} backgroundColor='violet' iteractions={userIteractions} listFollowing={listFollowing}/>;
      } else{
       fetchingData(url,token,isLoading)
        .then(data =>{
          // if(data.index === 1){
          //   navigate(`/chat/external/${params}/${defaultLocality}`)
          // } else
           if(data.index === 0){
            setItem('not matched');
          } else{
            // if(boolean){ sería la va
            // La función de llamar a más posts pero no funciona; 
          }
        });
      }

  }



  // console.log(counterForRender,'counterForRender');
  const displayShowMore = ()=>{
      if(activeFastLoader === false){
        setInterval(()=>{
          setDisplayMore(true);
          // setActiveFastLoader(false);
        },10000)
      }
    }
    displayShowMore();



  return (
    <>
    {(!location.pathname.includes('/news/current') && displayMore && item !== 'not matched' && !smallRender ) && 
    <div className="info-show-more-render" 
    onClick={getMorePosts}>
      <span>Show more</span>
    </div>}
        {/* {activeFastLoader && (
      //  <MappedPosts item={item} backgroundColor='red' iteractions={userIteractions} listFollowing={listFollowing} />
)} */}

{isFetching && <p>cargando en segundo plano</p>}

{isLoading ? (
  <FastLoader />  
) : (
  <>
    <MappedPosts 
      navigate={navigate} uid={uid} setItem={setItem}
      item={item} 
      backgroundColor="orange" 
      iteractions={userIteractions} 
      listFollowing={listFollowing} 
      iteractionsEnd={iteractionsEnd} 
      filed={filed}
    />
  </>
)}

    </>
  
  
  )
 }


const CountryComponent = ()=>{

  return (<><MainRoot /></>)
}

const RegionComponent = ()=>{
  return(
 <><MainRoot /></> 
  )
}

const CityComponent = ()=>{
  return(
<><MainRoot /></> 

  )
}







export {RootNewsComponent,FriendsRoot,DefaultMainComponent}