import '../../styles/auth/auth.scss';
import { getAuth, signInWithPopup, GoogleAuthProvider,FacebookAuthProvider } from 'firebase/auth';
import firebaseApp from '../../firebase';
import {  useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useEffect,useState } from 'react';
// import { FiUser } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
// import { FaOutlineEnvelope } from 'react-icons/fa';
import Loader from '../processing/FastLoader';



function Login() {

    // ANTIGUO FORMULARIO;
//     <form id="froms" action="http://localhost:5000/auth/signin/complete" method="POST">
//     <h3>LogIn</h3>
//     <div className="options-input">
//         <div className="input-group">
//             <HiUser id="icon-login" />
//             <input type="text" name="username" id="username" />

//         </div>
//         <div className="input-group">


//             <HiKey id="icon-login" />
//             <input type="password" name="password" id="password" />
//             {/* habria que añadirle el ojo para mostrar la contraseña */}
//         </div>
//     </div>
//     <button  type="submit" className='btn-login'><IoIosLogIn /></button>
// {/* <hr /> */}
// </form>
// FcGoogle } from "react-icons/fc";
// import { FaFacebook

const objectRender = {
    icons:[<FcGoogle  key={0}/>,< FaFacebook key={1} color="blue"/>,
        <MdOutlineEmail  color='black' key={3}/>],
    values:['Google','Facebook','your email'],
    handleClick:[()=> signInWithGoogle(),() => handleFacebookLogin(),()=> navigate('/auth/login/form/email')]
}

    return (
        <div className="container-login">
                 <form id="froms" action="http://localhost:5000/auth/signin/complete" method="POST">
            {/* <h3>LogIn</h3> */}
            <h3>Connect with  cities,regions and countries</h3>
            </form>
            {objectRender.values.map((item,index) => (
                <>
           
            <div className="more-options-platform" onClick={objectRender.handleClick[index]}
            style={{marginTop:index === 0 ? '20px' : '27px'}}>
            {/* onClick={signInWithGoogle} */}
            <div className="option-box">
            {objectRender.icons[index]}
                </div>
            <div className="content-log-in">
            Continue with {item}
               
                </div>

                
               
            </div>
           </>

            ))}
            {/* <span className='register-login'>JUNTER
             </span> */}
           

        </div>
    )
}








  function LoginInterface() {
    

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider()
const navigate = useNavigate();
const [email,setEmail] = useState('');
const [password,setPassword] = useState('');
const [loader,isLoading] = useState(false);
const [error,isError] = useState(false);
const [incorrectUser,setIncorrectUser] = useState(false);
const [incorrectPass,setIncorrectPass] = useState(false);
const [incorrectOAuth,setIncorrectOAuth] = useState(false);


const loginButtons = {
    logo : [<FcGoogle  size={18}/>, <FaFacebook  size={18} color={'#1877F2'} />],
    content:['Continue with Google', 'Continue with Facebook','Create an account'],
    handleClick:[()=> signInWithGoogle(),() => handleFacebookLogin(), ()=> navigate('/auth/register/new/user')]
}

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
      // alert('You already login')
      navigate('/')
    }
    })
    .catch(err => console.error(err))
},[])
    
    const insertDataWithProviderAuth = async (displayName,providerId,email,sourceProvided)=>{
        const url = 'http://localhost:5000/auth/signin/provider/external/applications';
       try {
         const response  = await fetch(url,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ displayName,providerId,email,sourceProvided })
        })
        if(!response.ok){
            throw new Error('Bad authentication');
        }
        const result = await response.json();
        const {boolean,auth} = result;
        console.log('resultado',result)
        if(boolean){
          if(auth === 'complete'){
            navigate('/')
          }else if(auth === 'register'){
          localStorage.setItem("junter_email_prov", email);
          navigate('/onboarding/username');
          }
        }
       } catch (error) {
         alert(error)
        console.log('Error autenticating',error)
       }

    }

    const handleFacebookLogin = async () => {
    try {
        alert('Empezamos el login con Facebook')
      const data = await signInWithPopup(auth, facebookProvider);
      console.log('ffsfs',data.user);
       insertDataWithProviderAuth(data.user.uid,data.user.displayName,data.user.providerData[0].providerId,data.user.email,2)
    } catch (error) {
      console.error(error);
    }
  };


    
    const signInWithGoogle =  () => {
      signInWithPopup(auth, googleProvider)
        .then((data) => {
         //  Autenticación exitosa, puedes acceder a result.user para obtener información del usuario
          insertDataWithProviderAuth(data.user.displayName,data.user.uid,data.user.email,1)
          .then((result)=>{
            const {auth,boolean,token} = result;
            if(auth === 'register'){
                if(boolean === true){
                    //  localStorage.setItem("jwtToken",token);
                     navigate('/onboarding/username')
                 } else{ alert('error')}
            }else if(auth === 'login' && boolean === true){
                console.log('RUTA DE USUARIO YA CREADO');
                console.log(auth,boolean,token)
                localStorage.setItem("jwtToken",token);
                navigate('/');
            } 
          })
        })
        .catch((error) => {
            alert('err',error)
          console.log('error processing the information', error)
        });

    };



    const continueWithEmail = (email,password,e)=>{
        e.preventDefault();
        isLoading(true);
  
  fetch('http://localhost:5000/auth/signin/format/mail/compact/code',{
          method : 'POST',
          headers: {'Content-type':'application/json'},
          credentials:'include',
          body: JSON.stringify({ email,password })
      })
      .then(response => response.json())
      .then(data => {
        if(data.boolean){
            isLoading(false);
            // navigate(`/auth/login/form/email/verification/code?email=${data.email}&user_id=${data.uid}`)
            navigate('/')
            alert('Habría que ir al dashboard')
        }else{
          setIncorrectUser(data.nonExistsAccount);
          setIncorrectPass(data.incorrectPassword);
          setIncorrectOAuth(data.OAuthAccount);
          isError(true)
          isLoading(false);
          setTimeout(() => {
            isError(false);
          }, 5000);

        }
      })
      .catch(err => console.error(err))

        
    }

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1 className="header-title">Connect with countries, regions and cities</h1>
          {/* <p className="subtitle">Sign in or register with your email, Google, or Facebook</p> */}
        </header>

        <form  aria-label="Email verification form" onSubmit={(e)=> continueWithEmail(email,password,e)}>
          {/* <label className="label" htmlFor="email">Email address</label> */}
          <input id="email" onChange={(e)=> setEmail(e.target.value)} name="email" type="email" placeholder="you@example.com" tabIndex={0} required/>
          <input id="password" onChange={(e)=> setPassword(e.target.value)} name="password" type="password" placeholder={'password...'}tabIndex={0} required/>

            
          <div style={{marginTop:'5px'}}>
            <button type="submit" className="primaryButton" >{loader ? <Loader style={{width:'20px',height:'20px',marginTop:0}} /> : 'Continue with  Email'}</button>
          </div>
        </form>

        <div className="divider-login" aria-hidden>
          <span className="dividerLine" />
          <span className="dividerText">or</span>
          <span className="dividerLine" />
        </div>

        <div className="socials">
      

        {loginButtons.content.map((item,index) => (
   <button type="button" aria-label={item} className="socialButton" onClick={loginButtons.handleClick[index]}>
            {loginButtons.logo[index]}
            <span className="socialText">{item}</span>
          </button>
        ))}
        </div>

        <footer className="footer">
          <p className="footerText">By signing in you agree to our <a href="#" className="link">Terms</a> and <a href="#" className="link">Privacy Policy</a>.</p>
        </footer>
         {error && <span style={{color:'red',position:'relative',top:'20px'}}>
          {incorrectOAuth ? 'Last time you logged with Google/Facebook please try loggin with Google/Facebook': 
          `Error trying to verify,${incorrectUser  && 'the account does not exists'} ${incorrectPass && 'incorrect password'} please try again later`
          }
          
          </span>}
       
      </div>
    </div>
  );
}




export default LoginInterface;