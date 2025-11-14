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
// function UserSetUp() {

//     const [selectedIndex,setSelectedIndex] = useState(0);

//     const navigate = useNavigate();
//     const [user, setUser] = useState('');
//     const [email,setEmail] = useState(null);
//     const [result,setResult] = useState(false);
//     const [display,setDisplay] = useState(false);
//     const [selectedTopics,setSelectedTopics] = useState([]);
//     const [sendingForm,isSendingForm] = useState(false);
//     const [data, setData] = useState({
//             country:'',
//             region:'',
//             city:''
//     });

  
    
    

  
//     const handleUsername = async ()=>{
//     //   e.preventDefault();
//         if(!result && user.length > 4){
//         setSelectedIndex(1);
//       }
     
//         }

// const handleLocalidades = (country,region,city)=>{
//     if(country.length > 0 && region.length > 0 && city.length > 0){
//         setSelectedIndex(2);
//     }
// }

// const handleTopics = (item)=>{
//   setSelectedTopics((prev)=> 
// prev.includes(item) ? 
//   prev.filter(c => c !== item):
//    [...prev,item]
//   )}

// const handleSubmit = async(username,country,region,city,topics)=>{
    
//     console.log({
//         username:username,
//         email:email,
//         country:country,
//         region:region,
//         city:city
        
//     })
//     if(username.length > 0 && email.length > 0 && country.length > 0 && region.length > 0 && city.length > 0){
//             isSendingForm(true)//Efecto de que se envia;
//             //Antes =>/select/user/complete
//             const url = 'http://localhost:5000/auth/signin/onboarding/check-in/new-user';
//             const response  = await fetch(url,{
//                 method:'POST',
//                 headers:{
//                     'Content-Type': 'application/json'
//                 },
//                 body:JSON.stringify({ username,email,topics,country,region,city})
//              })
//             if(!response.ok){
//                     setSelectedIndex(0);
//                     isSendingForm(false);
//                     alert(`Error login.`);             
//             }else{
//                 const result = await response.json();
//                 const { boolean,error} = result
//                 if(boolean){
//                      navigate('/')
//                 } else{
//                     setSelectedIndex(0);
//                     isSendingForm(false);
//                     alert(`Error login. ${error}`);
//                 } 
//             }}
// }



// const icons = [
//     selectedIndex !== 0 ? <PiUserCircleCheckFill key={2} /> : <PiUserCircle key={2} />,
//     <HiGlobe key={1} />,
//     <HiOutlineClipboardList key={0} />,
//   ];
//     return (
//         <div className={sendingForm ? 'container-chck-user active':"container-chck-user"}>

//             {/* 1 3 PASOS AUTORIZACION  */}
//             {/* User,localidades,topics */}
//             <div className='navbar-dir-options'>
//             {icons.map((item, index) => (
//       <div
//       key={index}
//       className={`selected-option-auth ${
//           index < selectedIndex ? "active" : ""
//         }`}
//         >
//         {item}
//       </div>
//     ))}
//             </div>


// <div className="content-auth-options">
// {selectedIndex === 0 ? (
//   <div className="chk-usr" >
//             <span style={{paddingLeft:'7px'}} > Select a username</span>
//             <input type="text" name="username" onChange={(e) => checkPossibleUserName(e.target.value)}  id=""
//              onClick={()=> setDisplay(true)} onBlur={()=> setDisplay(false)} autoFocus/>
//             {display && defaultErrorCheckingUser()}
//             <button onClick={handleUsername}>Select</button>
//         </div>
      
// )
// : (
//     selectedIndex === 1 ? (
//        <>
//         <div style={{fontFamily:'LEXEND',fontSize:'13px'}}>
//             Choose your chats...
//             </div>
//             <div style={{marginLeft:'20px'}}>

//     <LocalidadesContent booleanAuth={true} setSelectedIndexAuth={setSelectedIndex} data={data} setData={setData}/> 
//             </div>
//     <button style={{marginTop:'205px',width:'110px',height:'25px'}}  onClick={()=> handleLocalidades(data.country,data.region,data.city)}className="btn-topics">Select</button>
//        </>
//     ): (
//         <div className="container-topics-select" >
//     <div className='head-topics'>
//     What are you interested in ? 
//     </div>
//     {sendingForm && <div className="loader-snd-image auth"><FastLoader  style={{color:'red'}}/></div>}
//     <div className='content-topics'>
// {["News", "Entertainment", "Sports", "Technology", "Health",
//  "Lifestyle", "Politics", 
//  "Finances"].map((item) => (
//         <div key={item} style={{marginTop : item === 'News' && '200px'}} className={selectedTopics.includes(item) ? 'topic-item active':'topic-item'} 
//         onClick={()=> handleTopics(item)}>
//         {/* PODRIA ESTAR GUAPO LO DE QUE FUESE 1 ENTER 2 SPORTS */}
//         {item}
//         </div>
//     ))}
//         </div>
//         <div >
        

//         <button  onClick={()=> handleSubmit(user,data.country,data.region,data.city,selectedTopics)} className="btn-topics" type="submit">Continue</button>
//         </div>
// </div>
//     )
// )
// //  <Localidades booleanAuth={true}/> 
// }
// </div>



         


      

//              </div>
//     )

export default function UserSetup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    username: "",
    country: "",
    region: "",
    city: "",
    topics: [],
  });
  const [email,setEmail] = useState(null);
  const [result,setResult] = useState(false);
  const [sendingForm,isSendingForm] = useState(false)
  const navigate = useNavigate();




    useEffect(()=>{  
  fetch('http://localhost:5000/auth/signin/requirement/verify/route',{
      credentials:"include"
    })
  .then(response => {
      if(!response.ok){
        console.error('Error on response');
      }
      return response.json()
    })
  .then(data =>{
    const {exists} = data;
    if(exists){
      alert('You already login')
      navigate('/')
    }
    })
    .catch(err => console.error(err))
},[])

    useEffect(()=>{
            // const token  = localStorage.getItem('jwtToken');
            const mail =  localStorage.getItem('junter_email_prov') ;
            //SE PODRIÍA REDIRIGIR DIRECTAMENTE SIN ALERT;
           if(!mail){
                alert('No email or authentication method provided');
                navigate('/auth/login');
            } else if(mail?.length > 0){
                setEmail(mail);
                //Ruta correcta
            }

            
           
        },[])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInterestToggle = (topic) => {
    setForm((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((i) => i !== topic)
        : [...prev.topics, topic],
    }));
  };



  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Profile setup completed:", form);
      if(form.username.length > 0 && email.length > 0 && form.country.length > 0 && form.region.length > 0 && form.city.length > 0){
            isSendingForm(true)//Efecto de que se envia;
            //Antes =>/select/user/complete
            const url = 'http://localhost:5000/auth/signin/onboarding/check-in/new-user';
            const response  = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({form,email})
             })
            if(!response.ok){
                    setSelectedIndex(0);
                    isSendingForm(false);
                    alert(`Error login.`);             
            }else{
                const result = await response.json();
                const { boolean,error} = result
                if(boolean){
                     navigate('/')
                } else{
                    setSelectedIndex(0);
                    isSendingForm(false);
                    alert(`Error login. ${error}`);
                } 
                
                // console.log(result);
                // result ? navigate('/auth/register/complete?status=complete&step=select-localities'):alert('error');
            }}
  };


  const defaultErrorCheckingUser = ()=>{
    if(form.username.length < 4){
        return <SetUserError />
    }else{
        return result ?  <SetUserError  />: <SetUserSuccess  />
    }
}


  const stepTitle = {
    1: ``,
    2: `Select your localities for the chat `,
    3: `Select your interests`,
    4: `Select yout interests`
  };



       const checkPossibleUserName = async  (e)=>{
    // const localSearch = location.search.split('=')[1];
    // const url = `http://localhost:5000/messages/render/junts/posts/news/${localSearch}`;
    try {
        setForm({ ...form, [e.target.name]: e.target.value });
        if(e.target.value?.length > 0){
      const response = await fetch(`http://localhost:5000/auth/signin/check/username/${e.target.value}`);
          if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        setResult(data)
      }
      }   catch (error) {
        console.error('server internal error:', error);
      }
    }
  return (
    <div className="setup-wrapper">
       
      <div className={sendingForm ? "setup-card active": 'setup-card'}>
            {sendingForm && <div ><FastLoader /></div>}

{/* 
        <div className="progress-header">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`}>👤</div>
          <div className={`progress-step ${step >= 2 ? "active" : ""}`}>🌍</div>
          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>🎯</div>
        </div> */}

        <h2 className="step-title">{stepTitle[step]}</h2>

        <form onSubmit={handleSubmit} className="setup-form">
          {/* Step 1 */}
           {step === 1 && (
  <div className="step fade-in">
    <h2>Welcome to The Junter</h2>
    <input
      type="text"
      name="username"
      placeholder="Choose your username"
      value={form.username}
    //   onChange={handleChange}
      onChange={checkPossibleUserName}
      maxLength={20}
            required
    />
   {form.username.length > 1 && <div style={{position:'relative',top:'-35px',left:'-15px'
    }}>{defaultErrorCheckingUser()}</div> }
  </div>
)}

          {/* Step 2 */}
          {step === 2 && (
            <div className="step fade-in">
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="region"
                placeholder="Region"
                value={form.region}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City or Area"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Step 3 */}
          {(step === 3 || step === 4) && (
              <div className="step fade-in" >
               
              <div className="interests-grid">
                {["News", "Entertainment", "Sports", "Technology", "Health",
                  "Lifestyle", "Politics", 
                  "Finances"].map(
                  (topic) => (
                    <button
                      type="button"
                      key={topic}
                      onClick={() => handleInterestToggle(topic)}
                      className={`interest-btn ${
                        form.topics.includes(topic) ? "selected" : ""
                      }`}
                    >
                      {topic}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          <div className="form-navigation">
            {step > 1 && (
              <button type="button" className="nav-btn back" onClick={handlePrev}>
                ← Back
              </button>
            )}

            <button type={step  < 4 ? 'button': 'submit'} className={step < 3 ? 'nav-btn next' : 'submit-btn'} onClick={handleNext} >
                {step < 3 ? 'Next →': 'Finish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
