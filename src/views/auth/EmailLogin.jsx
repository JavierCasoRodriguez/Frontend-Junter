import { useState,useEffect } from 'react';
import { useNavigate,useLocation, useSearchParams } from 'react-router-dom';
// import { verifyToken } from '../../../../server-messages/auth/authProcess';
export default function EmailLogin({ onSendEmail }) {
  const navigate = useNavigate()
  const location  =  useLocation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [interfaz, setInterfaz] = useState(true);
  const [otp, setOtp] = useState('');
  const [searchParams] = useSearchParams();
 
useEffect(() => {
  if (location.pathname.split('/')[5] === 'verification') {
    setInterfaz(false);
    setOtp("");  // reset OTP cuando entras a verificación
  } else {
    setInterfaz(true);
    setEmail(""); // reset email cuando vuelves
  }
}, [location.pathname]);

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


const commonFetchOtp = async (url,body) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // { boolean, token }
};


const handleFormSubmit = async (e) => {
  e.preventDefault(); // SIEMPRE, al inicio
  setLoading(true);
  setMessage('');

  try {
 
      const email = searchParams.get("email");
      const userId = searchParams.get("user_id");

      if (!otp) throw new Error("OTP is required");

      const body = { email, userId, otp };
      const { boolean,auth,message } = await commonFetchOtp(
        'http://localhost:5000/auth/signin/verify-otp',
        body
      );

      if (boolean) {
        if(auth === 'complete'){
          alert('El proceso ha finalizado')
          setTimeout(() => {
            navigate('/')
          }, 3000);
         }else{
          localStorage.setItem("junter_email_prov", email);
          navigate('/onboarding/username');
           }
       } else{
        alert(message)
       }
      
    
  } catch (err) {
    setMessage(err.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};




  return (
    <div style={styles.container}>
      {/* <span>{location.pathname.split('/')[5]}</span> */}
      <h2 style={styles.header}>{!interfaz ? 'Enter  Email Verification Code' : 'Continue with your email'}</h2>
      <form  onSubmit={handleFormSubmit} style={styles.form}>
        <input
          type={interfaz ? "email" :  'text'} //Más limpio con 2 inputs pero así también queda bien
          // placeholder={interfaz ? "@example.com": ''}
          style={styles.input}
          value={interfaz  ? email : otp}
          required
          onChange={(e) => {interfaz ? setEmail(e.target.value): setOtp(e.target.value)}}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-enviar-main"
          // onClick={handleFormSubmit}
        
          style={loading ? styles.buttonDisabled : styles.button}
        >
          {!interfaz  ?  'Check code' : loading ? 'Sending...' : 'Send code'}
        </button >
        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

// Estilos en línea
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: ' 20px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    border: '1px solid #f0f0f0',
  },
  header: {
    fontSize: '21px',
    // fontWeight: '600',
    // color: '#333',
    textAlign: 'center',
    marginBottom: '30px',
    fontFamily:'Lexend',
    fontWeight:'200',
    color:'orange'


  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.3s',
  },

  button: {
    width:'100%',
    height:'30px',
    fontSize:'14px'
  },
//   button: {
//     padding: '12px',
//     fontSize: '16px',
//     backgroundColor: '#FF6F00', // Naranja brillante
//     color: '#fff',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     transition: 'background-color 0.3s, transform 0.3s',
//     boxShadow: '0 4px 6px rgba(255, 111, 0, 0.3)',
//   },
//   buttonDisabled: {
//     padding: '12px',
//     fontSize: '16px',
//     backgroundColor: '#FF6F00',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'not-allowed',
//     opacity: 0.6,
//   },
  buttonHover: {
    backgroundColor: '#FF8C00', // Cambia a un naranja más brillante cuando se pasa el ratón
    transform: 'scale(1.05)', // Animación de escala
  },
  message: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#888',
    marginTop: '10px',
  },
};

// Añadir efecto hover al botón en una clase adicional
// const buttonStyle = {
//   ...styles.button,
//   ':hover': styles.buttonHover, // Cambiar el color de fondo y hacer la animación de escala
// };
