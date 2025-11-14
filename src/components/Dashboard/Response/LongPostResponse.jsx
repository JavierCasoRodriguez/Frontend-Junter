import {  useEffect,useState } from "react";
import {  useNavigate,useLocation } from 'react-router-dom';
// import { ContextUid } from "../../../views/SessionContext";
import Message from '../MessageForm/Message';
// import OptionsMessage from '../MessageForm/MsgOptions';
// import MessageTools from '../MessageForm/MessageTools';
import InputResponse from "./InputResponse";
import Loader  from '../../../views/processing/FastLoader';
import {fetchingData} from '../../js/renderMessages';
// import getToken from "../../js/verifyToken";
import {getDefaultPostLocality} from '../../js/messageToolsFn';
// import {AiOutlineRetweet} from 'react-icons/ai'
// import { FiUserCheck } from 'react-icons/fi';
const LongPostResponse = () => {
  const navigate = useNavigate();
    const location = useLocation()
    const [mainResponses,setMainResponses] = useState(null);//mensaje principal
    const [mainPost,setMainPost] = useState(null);//renderizadk de respuestas    
    const [loading ,isLoading] = useState(false);
    const queryId  = location.pathname.split('/')[4];
    // const token  = getToken(() => navigate('/auth/login'));
    const [userIteractions,setUserIteractions] = useState(null);
    const [listFollowing,setListFollowing] = useState(null);
    const [filedPostsFromDb, setFiledPostsFromDb] = useState(null)
    const [iteractionsEnd,setIteractionsEnd] = useState(false);



    // const [counterLikes,setCounterLikes] = useState(0);
    // const [counterNews,setCounterNews] = useState(0);
    // const [counterRepost,setCounterRepost] = useState(0);
    // const [iteractionsFromDb,setIteractionsFromDb] = useState([]);
    // const [arrFromDbFollowing, setArrFromDbFollowing] = useState([])
    // const [successfullOption,setSuccessfullOpt] = useState(null);
    // const checkUser =  <FiUserCheck className='foll-add-main active' />;
    // const [displayOptionsRepost,setDisplayOptionsRepost] = useState(false);


  // const [successfullOption,setSuccessfullOpt] = useState(null);
    useEffect(()=>{
        // const fetchingData = async  (url,token,isLoading)=>{
            fetchingData(`http://localhost:5000/messages/replies/posts/${queryId}`,isLoading)
            .then(data => {

              // if(data?.length > 0){
                if(data.mainPost[0].long){
                  setMainPost(data.mainPost);
                  setMainResponses(data.responses);
                  // const {id_message,likes,repost,tn} = data.mainPost[0];
                  // setCounterNews(tn);
                  // setCounterLikes(likes);
                  // setCounterRepost(repost);
                  const idPosts = [];
                  idPosts.push(data.mainPost[0].id_message);

                  if(data.responses.length > 0){
                    const postsResponses = Object.keys(data.responses);
                    const idPostsResponses = postsResponses.map(element => data.responses[element].id_message);
                    idPosts.push(idPostsResponses);
                  }
                        console.log('id posts',idPosts);
                  if(idPosts && idPosts.length > 0){

                    fetch(`http://localhost:5000/config/get/user/iteractions/${idPosts}`,{
                    credentials:"include"
                  })
                 .then(response  => response.json())
                 .then(result => {
                   if(result.boolean){
                     setUserIteractions(result.iteractions);
                     setListFollowing(result.following);
                     setFiledPostsFromDb(result.filed);
                   }
                 })
                 .catch(err => console.log(err))   
                 .finally(()=>{
                   setIteractionsEnd(true)
                 })
                  }
              }
              // else{
              //   navigate(`/post/${queryId}`)
              // }}
            //   else{
            //     navigate('/');
            //     console.log(err,'err'),
            // }
          })

    },[location.pathname])

  

 
//     const title =['El madrid vence en anfield','mañana es navidad','qq','Dos hermanos harán historia al compartir equipo en F1'];
//   const content  = 'No habrá tiempo para celebraciones, porque la Scuderia está ante uno de los fines de semanas más importantes para ellos en los últimos años. Están a 21 puntos de McLaren y podrían ser campeones del mundo, por lo que en los entrenamientos tienen mucho trabajo para encontrar la mejor configuración posible para tener el mejo monoplaza e ir a por la victoria el domingo. No tendrán a sus dos mejores balas y Arthur, sin experiencia con el SF-24, tendrá que intentar recopilar los datos de la mejor forma posible, pues sabemos que Carlos en un maestro poniendo a punto sus coches.'
//   const listUsers  = ['JuzinhoPernambuco','Mafalda','MatiasPrat','Jai','JavierCaso'];


//   const date = new Date()
//   const now = date.now();
//por ahora copi la función en el futuro se verá
// const onRedirectTo = (word,navigate, event) => {
//     event.stopPropagation();
//     const formattedWord = word.replace(/^#/, '');
//     navigate(`/search/posts?q=${formattedWord}&tag_list=true`);
//   };

  // const renderTextWithHashtags = (text,navigate) => {
  //   // Dividir el texto en palabras
  //   const words = text.split(' ');

  //   // Mapear las palabras y aplicar estilos
  //   return words.map((word, index) => {
  //     if (word.startsWith('#')) {
  //       return (
  //         <span
  //           key={index}
  //           className="coloured-item"
  //           onClick={(event) => onRedirectTo(word,navigate, event)}
  //           style={{ color: '#1877F2', cursor: 'pointer' }} // Aplicar estilos directamente
  //         >
  //           {word}{' '}
  //         </span>
  //       );
  //     } else {
  //       return <span key={index}>{word} </span>;
  //     }
  //   });
  // }; 

console.log('user iteractions',userIteractions);

  return (
    <>
    {loading ? (
<Loader />
    ): (
        <div className="long-posts-container" >
      {/* Encabezado con imagen */}
    {mainPost && 
          <>
     <Message 
     renderLongPost={true}
     id={mainPost[0].id_message}
     image={mainPost[0].img}
     username={mainPost[0].username} 
     estado={mainPost[0].state} 
     date={mainPost[0].date} 
     likes={mainPost[0].likes}
     tn={mainPost[0].tn}
     views={mainPost[0].views}
     text={mainPost[0].content} 
     replies={mainPost[0].replies}
     repost={mainPost[0].repost}
     contentLong={mainPost[0].content_long}
      
      //  tittle={mainPost[0].tittle} 
      country={mainPost[0].country} 
      region={mainPost[0].region} 
      city={mainPost[0].city}
      userid={mainPost[0].userid} 
      isComment={mainPost[0].is_comment} 
      isCitation={mainPost[0].is_citation}
      iteractions={userIteractions}
      setIteractions={setUserIteractions}
      listFollowing={listFollowing}
      filedPosts={filedPostsFromDb}
      iteractionsEnd={iteractionsEnd}
    //  key={item.id_message}
    //  id={item.id_message}
    //  userid={item.userid}
    //  username={item.username}
    //  estado={item.state}
    //  date={item.time}
    //  likes={item.likes}
    //  tn={item.tn}
    //  replies={item.replies}
    //  long={item.long}
    //  tittle={item.tittle}
    //  text={item.content}
    //  response={item.response}
    //  country={item.country}
    //  region={item.region}
    //  city={item.city}
    //  // thread={item.thread}
    //  iteractions={userIteractions}
    //  listFollowing={listFollowing}
    //  filedPosts={filedPostsFromDb}
    // iteractionsEnd={iteractionsEnd}
    
     />
         <div style={{borderTop:'1px solid whitesmoke',height:'9px',width:'100%'}}>

         </div>
             <InputResponse  setMainResponses={setMainResponses}
                             idParentMessage={mainPost[0].id_message} 
                             width={'100%'}
                              getDefaultLocality={getDefaultPostLocality(mainPost[0].country,mainPost[0].region,mainPost[0].city,location)}
                             />
        <div className="comments-lg-posts" style={{borderTop:'1px solid whitesmoke'}}>
  {mainResponses && mainResponses.length > 0 && (
    mainResponses.map((item) => (
      <Message
        key={item.id_message}
        id={item.id_message}
        userid={item.userid}
        image={item.img}
        username={item.username}
        estado={item.state}
        date={item.date}
        likes={item.likes}
        tn={item.tn}
        replies={item.replies}
        long={item.long}
        // tittle={item.tittle}
        contentLong={item.content_long}
        text={item.content}
        response={item.response}
        country={item.country}
        region={item.region}
        city={item.city}
        isCitation={item.is_citation}
        isComment={item.is_comment}
        // thread={item.thread}
        iteractions={userIteractions}
        listFollowing={listFollowing}
        filedPosts={filedPostsFromDb}
       iteractionsEnd={iteractionsEnd}
      />
    ))
  )}
</div>
      </>
      }
  
      </div>
  
    )}
    </>
    
  );
};

export  default LongPostResponse

