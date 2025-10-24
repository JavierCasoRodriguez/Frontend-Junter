import {useLocation,useNavigate} from 'react-router-dom';
import { useEffect,useState,useContext } from 'react';
import getToken from '../../js/verifyToken';
import Message from '../MessageForm/Message';
import NavOfQueryOption from '../../../views/Nav';
import Loader from '../../../views/processing/FastLoader';
import Suggest from '../../../components/Dashboard/AsideRight/Sugerencia'; 
import ListLocalitiesSuggest from '../../../components/Dashboard/AsideRight/ListLocalitiesSuggest'; 
// import TrendsContainer from '../../../components/Dashboard/TrendsContainer';
import {ContextUid} from '../../../views/SessionContext';
const Listli = ({index,handleClick,isActive})=>{
    return (
        <>
        <li 
         className={`li-opt-cnt-query ${isActive ? 'active' : ''}`}
         onClick={handleClick}
         >
                    {index === 0 ? 'Top':(
                        index === 1 ? 'Latest':(
                            index === 2 ? 'News':(
                                index === 3  ?'Long Posts':(
                                    ''
                                )
                            )
                        )
                    )}
        </li>
      
        </>
    )
}



function QueryContent() {
    
    const location  = useLocation();
    const navigate =  useNavigate();
    
    const [listItems,setListItem] = useState(true);
    const [posts,setPosts] = useState([]);
    const [users,setUsers] = useState([]);
    const [localities,setLocalities] = useState([]);
    const [query,setQuery] = useState('');
    const [isLoading,setLoading] = useState(true);
    const [textForFail,setTextForFail] = useState('');
    // const decodedQuery = decodeURIComponent(query);
    const tagSearch = location.search.split('tag_list')[1];
    const uid = useContext(ContextUid);
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 720);

    useEffect(() => {
        const handleResize = () => {
          setIsWideScreen(window.innerWidth > 720);
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    useEffect(()=>{
        const query  = location.search.split('&')[0].split('=')[1];
        setQuery(query);
        if(location.search)
        if(tagSearch){
            handleClick(5,query);
        }else{
            handleClick(0,query);
        }
        if(!isWideScreen){
            fetchItemSuggest(`http://localhost:5000/config/get/users/params/${query}`,setUsers);
            fetchItemSuggest(`http://localhost:5000/config/get/localities/related/to/${query}`,setLocalities);
        }else{
            setLocalities([]);
            setUsers([])
        }

    },[location.search,isWideScreen]);

    const fetchItemSuggest = async(url,setItems)=>{
        try {
        const response = await fetch(url);
         if (!response.ok) {
             throw new Error('Error al obtener los datos');
        } else{
        
            if(response.status === 204){
                setItems([]);
            }else if(response.status === 200){
                const data = await response.json();
                setItems(data);
            }  
        }      
        }   catch (error) {
          console.error('Hubo un problema:', error);

        }

    }

       const fetchData = async (url)=>{
        const token  = getToken(() => navigate('/auth/login'));


        try {
            const response = await fetch(url,{
                headers:{'Authorization': `Bearer ${token}`}
            });
                 if (!response.ok) {
                 throw new Error('Error al obtener los datos')
            }

            //envia un objeto más grande con  los users  y posts pero solo cambia en uno
            if(response.status === 200){
                const data = await response.json();
                setPosts(data);
            } else if(response.status === 204){
                setPosts([]);
                var emptyText = `Ups, no results found for <strong>${query}</strong> but maybe you could try searching for something else.`;
                setTextForFail(emptyText);
            }}
               catch (error) {
              console.error('Server errror:', error);
              var errorText = `Sorry,There has been an error searching for <strong>${query}</strong> ` 
              setTextForFail(errorText)
            } finally{
              setLoading(false);
            }
       };

    //cada vez que se recargue el index a 0;



    const handleClick = async (index,query)=>{
        setLoading(true);
        setListItem(index);
        if(index === 0){
             await fetchData(`http://localhost:5000/messages/search/query/${query}/top`);
        }else if(index === 1){
              await fetchData(`http://localhost:5000/messages/search/query/${query}/latest`);
        } else if(index === 2){
            await fetchData(`http://localhost:5000/messages/search/query/${query}/news`);
        } else if(index === 3) {
            await fetchData(`http://localhost:5000/messages/search/query/${query}/format/long`);
            // console.log(`http://localhost:5000/messages/search/query/${query}/format/long`)
        }  else if(index === 5) {
            await fetchData(`http://localhost:5000/messages/search/tags/params/${query}`);
            // console.log(`http://localhost:5000/messages/search/query/${query}/format/long`)
        }
      
    }


   
    
    return (
        <>
        <div className='container-query-content'>

            <div className="query-content-msgs" > 
            <NavOfQueryOption query={query} />
             <ul className='query-content-msgs-options'>
             {[1,2,3,4].map((item, index) => (
        <Listli
          key={index}
          item={item}
          index={index}
          isActive={ index === listItems}
          handleClick={()=> handleClick(index,query)}
        />
      ))}
      
      </ul>
        {/* <label htmlFor="user">Users</label> */}


            <div className="query-content-msgs-body">
        {users.length > 0 &&
        
         <div className="query-content-search-user" style={{borderBottom:users.length > 0 && '1px solid whitesmoke'}}>
            <div className="query-cnt-body-users">
            {users.length > 0 &&  users.map((item,index) =>(
                <Suggest key={index}  name={item.username}/>
            ))
            }
         </div>

      </div>}

      <div className="content-localities-suggest-aside" style={{marginTop:'10px',marginBottom:'15px',minHeigth:'40px',maxHeight:'129px',overflowY:'auto'}}>

        {localities?.length > 0 && (
            localities.map(item => (
                <ListLocalitiesSuggest  key={0} item={item.query} params={item.type} booleanForQueryContent={true} uid={uid.uid}/>
            ))
        )}
      </div>
                {isLoading ? (
                    <Loader />
                ): posts.length === 0 ? (
                    <div className='empty-alert-message-query' dangerouslySetInnerHTML={{ __html: textForFail }} />

                    // <span className='empty-alert-message-query'>{textForFail}</span>
                ) : (posts.map(item =>(
                    <Message
                    key={item.id_message}
                    id={item.id_message}
                    userid={item.userid}
                    username={item.username}
                    image={item.img}
                    date={item.date}
                    likes={item.likes}
                    tn={item.tn}
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
                    // iteractions={iteractions}
                    // listFollowing={listFollowing}
                    // filedPosts={filed}
                    // iteractionsEnd={iteractionsEnd}
                    thread={item.thread}
                    renderOptions={0}
                   
                    />
                 )))}
         
            </div>
            </div>
             
        </div>
    
        </>
    )
}





export default QueryContent
