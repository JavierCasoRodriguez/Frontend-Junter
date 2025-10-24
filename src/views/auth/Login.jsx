import '../../styles/auth/auth.scss';
import { getAuth, signInWithPopup, GoogleAuthProvider,FacebookAuthProvider } from 'firebase/auth';
import firebaseApp from '../../firebase';
import {  useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useEffect } from 'react';
// import { FiUser } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
// import { FaOutlineEnvelope } from 'react-icons/fa';





function Login() {


    // const providers = {
    //     apple: "https://appleid.apple.com/auth/authorize",
    //     facebook: "https://www.facebook.com/v17.0/dialog/oauth",
    //     microsoft: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    //   };
      
    //   const CLIENT_IDS = {
    //     apple: "TU_CLIENT_ID_APPLE",
    //     facebook: "TU_CLIENT_ID_FACEBOOK",
    //     microsoft: "TU_CLIENT_ID_MICROSOFT",
    //   };


    const auth = getAuth(firebaseApp);
    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider()
    const navigate = useNavigate();
    
    const insertDataWithProviderAuth = async (uid,displayName,providerId,email)=>{
        const url = 'http://localhost:5000/auth/signin/provider/external/applications';
        const response  = await fetch(url,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ uid,displayName,providerId,email })
        })
        if(!response.ok){
            throw new Error('Bad authentication');
        }
        const result = await response.json();
        return result;

    }

    const handleFacebookLogin = async () => {
    try {
        alert('Empezamos el login con Facebook')
      const data = await signInWithPopup(auth, facebookProvider);
      console.log('ffsfs',data.user);
       insertDataWithProviderAuth(data.user.uid,data.user.displayName,data.user.providerData[0].providerId,data.user.email)
    } catch (error) {
      console.error(error);
    }
  };

    useEffect(()=>{
        const token = localStorage.getItem('jwtToken');
        const boolean = false;
        if(token && boolean){
            navigate('/')}
    },[])
    
    const signInWithGoogle =  () => {
      signInWithPopup(auth, googleProvider)
        .then((data) => {
         //  console.log(data)
         //  Autenticación exitosa, puedes acceder a result.user para obtener información del usuario
         insertDataWithProviderAuth(data.user.uid,data.user.displayName,data.user.providerData[0].providerId,data.user.email)
          .then((result)=>{
            const {auth,boolean,token} = result;
            if(auth === 'register'){
                if(boolean === true){
                     localStorage.setItem("jwtToken",token);
                     navigate('/googleAuth/providerID=true/junter&step=select-username')
                 } else{ alert('error')}
            }else if(auth === 'login' && boolean === true){
                console.log('me debería de tirar por aquí para el register con google');
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



export default Login
