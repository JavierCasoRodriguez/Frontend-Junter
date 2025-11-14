import { useEffect,useState,useContext } from "react";
import { ContextUid } from "../../../views/SessionContext";
import { CiImageOn } from "react-icons/ci";
import {fetchUserData} from '../../js/sendMessages';
// import getToken from "../../js/verifyToken";
import { useNavigate } from "react-router-dom";
import {PickleEmticon,ContentPickleEmoticon} from '../NewMessage/PickleEmticon';
import BottomNotifBar from "../BottomNotifBar";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import {getArtificialDate} from '../../js/messageToolsFn';

const InputResponse  = ({setMainResponses,idParentMessage,marginCentered,width,isPickleVisible, setPickeVisible,userIdPost
})=>{
  const navigate =  useNavigate();
  // const token  = getToken(() => navigate('/auth/login'));
  const {uid,username,userImage} = useContext(ContextUid);
    const [inputResponse,setInputResponse] = useState(''); 
    const [loaderUserData,isLoadingFetchingUserData] = useState(true);
    const [userData,setUserData] = useState(null);
    const [statusResponse,setStatusResponse] = useState(2);
    const [placeholder,setPlaceholder] = useState('');
    const [currentEmoji,setCurrentEmoji] = useState(null)
    const indexPlaceholder = Math.floor(Math.random() * 3);
    const [idPost,setIdPost] = useState('');

    const getPlaceholder = ()=>{
     if(indexPlaceholder === 0){
       return "Share your thoughts...";
     } else if(indexPlaceholder === 1){
       return "Add a comment..."
     } else{
       return "Leave a comment..."
     }
    }
    useEffect(()=>{
        const defaultPlacehoder = getPlaceholder();
        setPlaceholder(defaultPlacehoder);
        fetchUserData(setUserData,null,isLoadingFetchingUserData);
    },[])
    // console.log(userData);
    const setResponseHeight = (input) => {

        if (input.length > 155) {
          return '145px';
        }
        else if (input.length > 120) {
          return '125px';
        }
         else if (input.length > 81) {
          return '110px';
        } else if (input.length > 55) {
          return '100px';
        } else if (input.length > 32) {
          return '86px';
        } else {
          return '76px'; // You can specify a default height here
        }
      };

   const style ={  
    height: setResponseHeight(inputResponse),
    paddingTop:inputResponse.length  > 35 ? '10px' : '5px',
    margin:marginCentered,
    width:width
   };


  const submitResponse = (text,uid,idMessage,username,image)=>{
      

    if(text.length > 0 && text.length < 420){
      // console.log('userData',userData.length);
      if(userData && !loaderUserData){
        const {state} = userData;
    const data  = {text,uid,username,state,userIdPost};
   fetch(`http://localhost:5000/messages/replies/submit/post/${idMessage}`,{
    method : 'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
  setStatusResponse(data.boolean);
  console.log(data.idPost)
   setIdPost(data.idPost)
  setTimeout(()=>{
    setInputResponse(''); 
    setStatusResponse(2);
   },2000)
  }
  )
  .catch(err => console.error(err))


if(statusResponse === 2 ){
      const isoDate = getArtificialDate();

  //   console.log(isoDate,'isoDate');
  console.log({
      idPost:idPost,
      // username:userData.username,
      estado: userData.state,
      content:text,
      time:isoDate,
  })
  setMainResponses(prevPosts => [
    {
      key: idPost,
      id_message: idPost,
      username:username,
      img:image,
      estado: userData.state,
      content:text,
      likes:0,
      tn:0,
      repost:0,
      replies:0,
      // replies:null,
      long:false,
      userid:uid,
      date:isoDate,
      thread:false// no haría falta ponerlo
    },
    ...prevPosts,
  ])
  }
}

}

}



//se repite código ya esta en el tools;
//tiene ligereas modificaciones por lo de que no aparece el response text;






    return (
    <div className="cnt-response" style={style}> 
       <div className="main-cnt-response"  >
      
        <textarea name="" id="" value={inputResponse} placeholder={placeholder} onChange={(e)=> setInputResponse(e.target.value)}  autoFocus ></textarea>
        <div className="tools-response-cnt"  >
          <div style={{display:'flex',justfyContent:'space-between',width:'23%',alignItems:'center',position:'relative',top:'-7px',left:'-10px'}}>
            <div  className="img-ic-tools pst"  onClick={()=> navigate(`/post/format/reply/${idParentMessage}`)} ><CiImageOn  /></div>
            <PickleEmticon  setPickeVisible={setPickeVisible} isPickleVisible={isPickleVisible} pickleSize={18} paramsForEmoticonStyles={2} parmasForStyles={3}/>
          </div>
        </div>
      
       
        {statusResponse !== 2 && (
          <>
            <BottomNotifBar   successfullOption={2} shortPost={0}
         navigate={navigate} outlineReply={ <IoIosCheckmarkCircleOutline  style={{color:'gray;',position:'relative',left:'-3px',top:'5px',fontSize:'22px'}}/>} />
          </>
        )}
      
          </div>  
  <div className="response-tools-send">
      <button onClick={()=> submitResponse(inputResponse,uid,idParentMessage,username,userImage)}  className="btn-response-cnt-type-submit">Reply</button>
      </div>
      <ContentPickleEmoticon setCurrentEmoji={setCurrentEmoji}  currentEmoji={currentEmoji} setInput={setInputResponse} isPickleVisible={isPickleVisible} paramsForStyle={3}/>

      </div>
    );
}

export default InputResponse;