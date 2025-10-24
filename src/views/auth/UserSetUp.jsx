import '../../styles/auth/auth.scss';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle,HiXCircle } from "react-icons/hi";
import FastLoader from '../../views/processing/FastLoader';
import {LocalidadesContent} from '../main/Localidades'
import {HiGlobe,HiOutlineClipboardList} from 'react-icons/hi';
import { PiUserCircle,PiUserCircleCheckFill } from "react-icons/pi";


const SetUserSuccess = ()=>{
   return (
    <div className="ic-scc"> <HiCheckCircle /></div>
   )
}
const SetUserError = ()=>{
    return(
        <div id="ic-err"> <HiXCircle /></div>
    )    
}
function UserSetUp() {

    const [selectedIndex,setSelectedIndex] = useState(0);

    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [email,setEmail] = useState(null);
    const [result,setResult] = useState(false);
    const [display,setDisplay] = useState(false);
    const [selectedTopics,setSelectedTopics] = useState([]);
    const [sendingForm,isSendingForm] = useState(false);
    const [data, setData] = useState({
            country:'',
            region:'',
            city:''
    });

  
        useEffect(()=>{
            const token  = localStorage.getItem('jwtToken');
            const mail =  localStorage.getItem('junter_email_prov') ;
            //SE PODRIÍA REDIRIGIR DIRECTAMENTE SIN ALERT;
            if(token){
                alert('Access Denied, already log-in');
                navigate('/')
            }else if(!token && !mail){
                alert('No email or authentication method provided');
                navigate('/auth/login');
            } else if(mail?.length > 0){
                setEmail(mail);//Ruta correcta
            }

            
           
        },[])
    
     const checkPossibleUserName = async  (
  username
  )=>{
    // const localSearch = location.search.split('=')[1];
    // const url = `http://localhost:5000/messages/render/junts/posts/news/${localSearch}`;
    
    try {
        if(username?.length > 0)
        setUser(username);
      const response = await fetch(`http://localhost:5000/auth/signin/check/username/${username}`);
          if (!response.ok) {
          throw new Error('Error al obtener los datos');
      }
        const data = await response.json();
        setResult(data)
      }   catch (error) {
        console.error('server internal error:', error);
      }
      
    }
  
    const handleUsername = async ()=>{
    //   e.preventDefault();
        if(!result && user.length > 4){
        setSelectedIndex(1);
      }
     
        }

const handleLocalidades = (country,region,city)=>{
    if(country.length > 0 && region.length > 0 && city.length > 0){
        setSelectedIndex(2);
    }
}

const handleTopics = (item)=>{
  setSelectedTopics((prev)=> 
prev.includes(item) ? 
  prev.filter(c => c !== item):
   [...prev,item]
  )}

const handleSubmit = async(username,country,region,city,topics)=>{
    
    console.log({
        username:username,
        email:email,
        country:country,
        region:region,
        city:city
        
    })
    if(username.length > 0 && email.length > 0 && country.length > 0 && region.length > 0 && city.length > 0){
            isSendingForm(true)//Efecto de que se envia;
            //Antes =>/select/user/complete
            const url = 'http://localhost:5000/auth/signin/onboarding/check-in/new-user';
            const response  = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({ username,email,topics,country,region,city})
             })
            if(!response.ok){
                    setSelectedIndex(0);
                    isSendingForm(false);
                    alert(`Error login.`);             
            }else{
                const result = await response.json();
                const { boolean,token,error} = result
                if(boolean){
                     localStorage.setItem("jwtToken", token);
                     navigate('/')
                } else{
                    setSelectedIndex(0);
                    isSendingForm(false);
                    alert(`Error login. ${error}`);
                } 
                
                // console.log(result);
                // result ? navigate('/auth/register/complete?status=complete&step=select-localities'):alert('error');
            }}
}

const defaultErrorCheckingUser = ()=>{
    if(user.length < 4){
        return <SetUserError />
    }else{
        return result ?  <SetUserError  />: <SetUserSuccess  />
    }
}

const icons = [
    selectedIndex !== 0 ? <PiUserCircleCheckFill key={2} /> : <PiUserCircle key={2} />,
    <HiGlobe key={1} />,
    <HiOutlineClipboardList key={0} />,
  ];
    return (
        <div className={sendingForm ? 'container-chck-user active':"container-chck-user"}>

            {/* 1 3 PASOS AUTORIZACION  */}
            {/* User,localidades,topics */}
            <div className='navbar-dir-options'>
            {icons.map((item, index) => (
      <div
      key={index}
      className={`selected-option-auth ${
          index < selectedIndex ? "active" : ""
        }`}
        >
        {item}
      </div>
    ))}
            </div>


<div className="content-auth-options">
{selectedIndex === 0 ? (
  <div className="chk-usr" >
            <span style={{paddingLeft:'7px'}}> Select a username</span>
            <input type="text" name="username" onChange={(e) => checkPossibleUserName(e.target.value)}  id=""
             onClick={()=> setDisplay(true)} onBlur={()=> setDisplay(false)} autoFocus/>
            {display && defaultErrorCheckingUser()}
            <button onClick={handleUsername}>Select</button>
        </div>
      
)
: (
    selectedIndex === 1 ? (
       <>
        <div style={{fontFamily:'LEXEND',fontSize:'13px'}}>
            Choose your chats...
            </div>
            <div style={{marginLeft:'20px'}}>

    <LocalidadesContent booleanAuth={true} setSelectedIndexAuth={setSelectedIndex} data={data} setData={setData}/> 
            </div>
    <button style={{marginTop:'205px',width:'110px',height:'25px'}}  onClick={()=> handleLocalidades(data.country,data.region,data.city)}className="btn-topics">Select</button>
       </>
    ): (
        <div className="container-topics-select" >
    <div className='head-topics'>
    What are you interested in ? 
    </div>
    {sendingForm && <div className="loader-snd-image auth"><FastLoader  style={{color:'red'}}/></div>}
    <div className='content-topics'>
{["News", "Entertainment", "Sports", "Technology", "Health",
 "Lifestyle", "Politics", 
 "Finances"].map((item) => (
        <div key={item} style={{marginTop : item === 'News' && '200px'}} className={selectedTopics.includes(item) ? 'topic-item active':'topic-item'} 
        onClick={()=> handleTopics(item)}>
        {/* PODRIA ESTAR GUAPO LO DE QUE FUESE 1 ENTER 2 SPORTS */}
        {item}
        </div>
    ))}
        </div>
        <div >
        

        <button  onClick={()=> handleSubmit(user,data.country,data.region,data.city,selectedTopics)} className="btn-topics" type="submit">Continue</button>
        </div>
</div>
    )
)
//  <Localidades booleanAuth={true}/> 
}
</div>



         


      

             </div>
    )
}

export default UserSetUp;
