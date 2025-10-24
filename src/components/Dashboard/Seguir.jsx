import { useState,useContext, useEffect } from "react";
import {ContextUid} from '../../views/SessionContext';
import getToken from "../js/verifyToken";
import { useNavigate,useLocation } from "react-router-dom";
import BottomNotifBar from  '../Dashboard/BottomNotifBar';
import { FiUserCheck } from 'react-icons/fi';


function Seguir({username,handleCLick,booleanProfile,setFollowFromProfile,contentButtonNotifs}) {

    //Hay algunas cosas aqui como el token y el navigate 
    const uid = useContext(ContextUid).uid;
    const navigate = useNavigate();
    const location = useLocation();
    const token  = getToken(() => navigate('/auth/login'));
    const [follow, setFollow] = useState(true);
    const [success,setSuccess] = useState(false);
    useEffect(()=>{
        if(location.pathname.includes('following')){
            setFollow(false);
        }
        if(username){
            fetch(`http://localhost:5000/Profile/following/true/user/${username}`,{
                headers: {'Authorization': `Bearer ${token}`
            }
            })
            .then(response => {
                if(!response.ok){
                    throw new Error('Error on response');
                }
                return response.json();
            })  
            .then(data =>{
                console.log('estos son los datos',data);
                setFollow(data);
                if(booleanProfile){
                    setFollowFromProfile(true);
                }
            })
            .catch(error => console.log('error on response',error))
        }
    },[])


    const addFollow = (e)=>{
        e.stopPropagation();
        setFollow(!follow);
        if(booleanProfile){
            handleCLick();
            
        }
      
       
        const data = {username,uid,follow};
        if(follow){
            fetch('http://localhost:5000/Profile/add/follower/to',{
           method : 'POST',
           headers: {'Content-type':'application/json'},
           body: JSON.stringify({ data })
       })
       .then(response => {
        setSuccess(true);
        setTimeout(()=>{
            setSuccess(false);
        },5000)
        return response.json()
    })
       .catch(err => console.error(err))
        } else{
            fetch('http://localhost:5000/Profile/quit/follower/to',{
                method : 'POST',
                headers: {'Content-type':'application/json'},
                body: JSON.stringify({ data })
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
        }
        }

        //Habría que mejorarlo un poco pero no queda mal;

    return (
     
         
    <>
    {success && (
        <BottomNotifBar username={username}  successfullOption={1} fiUserCheck={<FiUserCheck className="foll-add-main active"/>}/>
    )}
    
    <>

</>
        {uid &&  <div className={follow ? 'foll-options-seguir-bg-orange' : 'follow-sug-active'} onClick={addFollow} style={{width:contentButtonNotifs ? '105px': '52px'}} >
           {contentButtonNotifs  ? (
            follow ? `following ${username.splice(0,1)}` : `follow ${username}`
           ): (
            follow ? 'Follow' : 'Following'
           )}
           {/* {follow ? 'follow' : 'following'} */}
              </div>}  
        </>
     )
}

export default Seguir
