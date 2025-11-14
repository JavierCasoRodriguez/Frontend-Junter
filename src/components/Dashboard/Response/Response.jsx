import { useEffect,useState } from "react";
import Message from "../MessageForm/Message";
import { useLocation,useNavigate } from "react-router-dom";
import NavResponse from '../../../views/Nav';
import Loader from '../../../views/processing/FastLoader';
import InputResponse from "./InputResponse";
// import getToken from "../../js/verifyToken";
import { getDefaultPostLocality } from "../../js/messageToolsFn";
import BottomNotifBar from "../BottomNotifBar";
import { HiOutlineTrash } from "react-icons/hi";


//posibilidad utilizando el operador spread 
// const [responses, setResponses] = useState([]);
//const response = [/* ... */]; // Supongamos que tienes un array de respuestas
// Actualizar el estado con el spread operator
// setResponses(prevResponses => [...prevResponses, ...response]);
// sería crear otro useState
//no tendría mucho sentido porque el problema está en el servidor

function Response() {
    const location = useLocation();
    const navigate = useNavigate();
    // const queryParams =  new URLSearchParams(location.search);
    
    const queryId  = location.pathname.split('/')[2];
    const [isLoading,setLoading] = useState(true);
    const [mainResponses,setMainResponses] = useState(null);//comments
    const [mainPost,setMainPost] = useState(null);//renderizadk de respuestas
    const [userIteractions,setUserIteractions] = useState(null);
    const [listFollowing,setListFollowing] = useState(null);
    const [filed,setFiled] = useState(null);
    const [iteractionsEnd,setIteractionsEnd] = useState(false);
    const [isPickleVisible,setPickeVisible] = useState(false);
    const [displayTrashMessage,setDisplayTrashMessage] = useState(false);

    // const token  = getToken(()=> navigate('/auth/login'));

    // console.log(queryId);
   useEffect(()=>{
   
    // const parentMessage = localStorage.getItem('data');
    // const data = JSON.parse(parentMessage);
    // console.log('los datos',data);
    // setMainResponse(data);
    const id = queryId;


    const fetchingResponse = async ()=>{
      
      try {
     const response  = await fetch(`http://localhost:5000/messages/replies/posts/${id}`,
      // {
      // headers: { 'Authorization': `Bearer ${token}`},
    // }
  );
       if (!response.ok) {
        throw new Error('server internal error');
      }
      const responseData = await response.json();
      console.log('responseData',responseData);
      if(responseData){
        if(responseData.mainPost[0].long){
      navigate(`/post/format/long/${responseData.mainPost[0].id_message}`)
        }else{
      setMainPost(responseData.mainPost);
      setMainResponses(responseData.responses);
      const idPosts = [];
      const idMainPost = responseData.mainPost[0].id_message;
      idPosts.push(idMainPost);
      if(responseData.responses?.length > 0){
        const postsResponses = Object.keys(responseData.responses);
        const idPostsResponses = postsResponses.map(element => responseData.responses[element].id_message);
        idPosts.push(idPostsResponses);
      }
      if(idPosts && idPosts.length > 0){
        fetch(`http://localhost:5000/config/get/user/iteractions/${idPosts}`,{
        credentials:"include"
      })
     .then(response  => response.json())
     .then(result => {
       // console.log(result,'result');
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
      }
        }
      }
      } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
    }finally{
      setLoading(false);
    }

  };
  fetchingResponse();
},[location.pathname])
//POr ahora la dejo aqu´porque en principio solo aquí 

console.log('useriter',userIteractions);

    return (

      <div className="message-resp">
        <NavResponse  query='Posts'/>

<div className="content-main-resp">

{!isLoading && 
        (mainPost && mainPost.length > 0) && (
          <>
          <FormatMessageComp mainPost={mainPost[0]} userIteractions={userIteractions} filed={filed} isComment={mainPost[0].is_comment} iteractionsEnd={iteractionsEnd}setDisplayTrashMessage={setDisplayTrashMessage} />
       
<InputResponse  
setMainResponses={setMainResponses}
idParentMessage={mainPost ? mainPost[0].id_message : queryId}
marginCentered={'auto'} width={'90%'}
getDefaultLocality={getDefaultPostLocality(mainPost[0].country,mainPost[0].region,mainPost[0].city,location)}
isPickleVisible={isPickleVisible} setPickeVisible={setPickeVisible} userIdPost={mainPost[0].userid}
/>
<div>

</div>

</>
        )}

{isLoading ? (
  <Loader />
): (mainResponses &&  mainResponses.length > 0) && (


    mainResponses.map(item => (
                  <Message
                        key={item.id_message}
                        id={item.id_message}
                        userid={item.userid}
                        username={item.username}
                        image={item.img}
                        // estado={item.state}
                        date={item.date}
                        likes={item.likes}
                        tn={item.tn}
                        views={item.views}
                        replies={item.replies}
                        long={item.long}
                        setItem={setMainResponses}
                        //  tittle={item.tittle}
                        existImage={item.exist_image}
                        contentImage={item.content_images}
                        text={item.content}
                        response={item.response}
                        country={item.country}
                        region={item.region}
                        city={item.city}
                        // isLocalities={item.is_localidades} no lo necesitaría en este caso
                        isCitation={item.is_citation}
                        isComment={true}
                        //  red={backgroundColor}
                        iteractions={userIteractions}
                        listFollowing={listFollowing}
                        filedPosts={filed}
                        iteractionsEnd={iteractionsEnd}
                        thread={item.thread}
                        renderOptions={1}
      />
    ))
   )}
</div>
 {displayTrashMessage &&
     <BottomNotifBar trashIcon={< HiOutlineTrash color={'red'} />}   successfullOption={2}
    shortPost={6} navigate={navigate} isFastPost={true} />
    
    }
</div>
    )
}





const FormatMessageComp = ({mainPost,userIteractions,listFollowing,filed,iteractionsEnd,isComment,setDisplayTrashMessage})=>{
 return(
  <>

  {!isComment ?(
   <Message 
   key={mainPost.id_message}
   id={mainPost.id_message}
   username={mainPost.username}
   estado={mainPost.state} 
   image={mainPost.img}
   likes={mainPost.likes}
   tn={mainPost.tn}
   views={mainPost.views}
   replies={mainPost.replies}
   repost={mainPost.repost}
   long={mainPost.long}
   text={mainPost.content}
   tittle={mainPost.tittle}
   date={mainPost.date}
   userid={mainPost.userid}
   country={mainPost.country}
   region={mainPost.region}
   city={mainPost.city}
   existImage={mainPost.exist_image}
   contentImage={mainPost.content_images}
   parentForComment={true}
   thread={mainPost.thread}
   response={mainPost.response}
   objectReply={mainPost.objectReply}
   // isLocalities={item.is_localidades} no lo necesitaría en este caso
   isCitation={mainPost.is_citation}
   isComment={mainPost.is_comment}
   iteractions={userIteractions}
   listFollowing={listFollowing}
   filedPosts={filed}
   iteractionsEnd={iteractionsEnd}
   renderOptions={0}
   setDisplayTrashMessage={setDisplayTrashMessage}
   /> 
  ):(
// Vas a hacer 2 y poner primero el objectReply
  
       
           

 <div>
  {[mainPost.objectReply, mainPost].map((item, index) => (
    // Componente Message
    <Message
      key={item.id_message}
      id={item.id_message}
      username={item.username}
      estado={item.state}
      likes={item.likes}
      image={item.img}
      tn={item.tn}
      views={item.views}
      replies={item.replies}
      repost={item.repost}
      long={item.long}
      text={item.content} // No es necesario usar index aquí
      tittle={item.tittle}
      date={item.date}
      userid={item.userid}
      existImage={item.exist_image}
      contentImage={item.content_images}
      parentForComment={index !== 1} // Simplificado: true si index !== 1
      objectReply={item.objectReply}
      commentsStylesPost={index === 1} // index === 1 devuelve true/false
      isCitation={item.is_citation}
      isComment={item.is_comment}
      iteractions={userIteractions}
      listFollowing={listFollowing}
      filedPosts={filed}
      iteractionsEnd={iteractionsEnd}
      renderOptions={0}
    />
  ))}
  {/* Div que simula el borde */}
  <div style={{ width: '90%', borderBottom: '1px solid whitesmoke',position:'relative',top:'-16px' }}></div>
</div>
  )}
 
  </>
 )
}



export default Response
