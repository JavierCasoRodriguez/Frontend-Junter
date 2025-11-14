import '../../styles/auth/auth.scss'
import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {FaEyeSlash,FaEye} from 'react-icons/fa'
import Loader from '../processing/FastLoader';




export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loader,isLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}\[\]:";'<>?,./]).{8,}$/;
    return regex.test(password);
  };


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

   const handleSubmit = (e) => {
    e.preventDefault();
    isLoading(true);
    if (!validatePassword(form.password)) {
      setPasswordError("Password must be at least 8 characters, include 1 uppercase letter and 1 special character.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");   
      fetch('http://localhost:5000/auth/signin/type/register/new/user',{
          method : 'POST',
          headers: {'Content-type':'application/json'},
          body: JSON.stringify({form})
      })
      .then(response => response.json())
      .then(data => {


        const {existsAcc,boolean,uid} = data;
        if(existsAcc){
            isLoading(false);
            alert("The email you entered already exists. Please log in or use a different email address.");
            setTimeout(() => {
                navigate('/auth/login')
            }, 5000);
            
        }

        if(boolean){
        isLoading(false);
        navigate(`/auth/login/form/email/verification/code?email=${form.email}&user_id=${uid}`)
        }

      })
      .catch(err => {console.error(err),isLoading(false)})
    alert("✅ Registration completed successfully");
  };
 

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">User Registration</h2>

        <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="date" name="birthdate" placeholder="Birthdate" value={form.birthdate} onChange={handleChange} required />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="button" style={{backgroundColor:'transparent',color:'gray'}} className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEye/> : <FaEyeSlash />}
          </button>
        </div>

        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
           <button type="button" style={{backgroundColor:'transparent',color:'gray'}} className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEye/> : <FaEyeSlash />}
          </button>
        </div>

        {passwordError && <p className="password-error">{passwordError}</p>}

        <button type="submit">{loader ? <Loader style={{width:'20px',height:'20px',marginTop:0}} /> : 'Register'}</button>
        <p className="register-login">Already have an account? <a href="/auth/login">Log in</a></p>
      </form>
    </div>
  );
}
