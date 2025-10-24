import '../../styles/auth/auth.scss';
import { HiArrowRight} from'react-icons/hi'
import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {FaCheck,FaEye} from 'react-icons/fa'
function Registro() {

    const navigate = useNavigate();

    const [showPass, setShowPass] = useState(false);
    const [typePass,setTypePass] = useState('password');
    const [user,setUser] = useState('');
    const [data, setData] = useState({
        name: '',
        surname: '',
        mail: '',
        username: '',
        password: ''
      });
    const [rangeAge,setRangeAge] = useState(null);


    useEffect(()=>{
        const token = localStorage.getItem('jwtToken');
        if(token){
            navigate('/')}
    },[]);


      const handleChange = (event) => {
        const { name, value } = event.target;
        setData({
          ...data,
          [name]: value
        });


        if(name === 'username'){
         isValidUsername(value)
         .then(response => response.json())
         .catch(err => console.log(err))
         } else if(name === 'password' ){
            setShowPass(true);
         }};


         const Username = async(matchUser)=>{
            const response = await fetch('http://localhost:5000/auth/signin/check/user',{
                method:'POST',
                headers:{ 'Content-Type':'application/json'},
                body: JSON.stringify({ matchUser})
            })
    
            if(!response.ok){
                console.log('fetching error');
            }
            const result = await response.json();
                console.log(result);
            setUser(result)
            //verificar que el nombr no tenga espacios o bloquear esa tecla 
         }


         const isValidMail = mail => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(mail).toLowerCase());
        };


        const isValidPass = (password) =>{
            const containLetter = /[a-zA-Z]/.test(password); 
            const containNumber = /\d/.test(password);
            const  minLength = password.length > 8; 
            return containLetter && containNumber && minLength;
        }

       


    const handleForm = (name,surname,mail,username,pass,rangeAge,matchuser,e)=>{
        const newToken  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyZmY5Nzg5OTc1NmFmZWNmIiwiaWF0IjoxNzMzOTUwNTYxfQ.lZxkQVmiZefJg_H4HRrdr-zkiKaqC6BUZRy07BlIKSw';
        localStorage.setItem("jwtToken",newToken);
        navigate('/');
        const defaultAgeRange = rangeAge  ? rangeAge :'18-24'; 
        const data ={ name,surname,mail,username,pass,defaultAgeRange}
        if(name.length === 0 || surname.length === 0  ||  !isValidMail(mail) || username.length === 0 || !matchuser  || pass.length < 8 || !isValidPass(pass)){
            alert('err')
            e.preventDefault();
        }else {
            fetch('http://localhost:5000/auth/register/data/authentication/complete',{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({ data})
            })
            .then(response => response.json())
            .then(data => {
                if(data){
                localStorage.setItem("jwtToken", data.token);
                navigate('/auth/register/complete?status=complete&step=select-localities');
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });    
        }
           

        
    };

    
    const handleClick = (e)=>{
       const input = e.target;
       const parent = input.parentNode;
       const span = parent.children[2];
       span.style.display = 'block';  
    }

    const handleBlur = (e)=>{
        const input = e.target;
        const parent = input.parentNode;
        const span = parent.children[2];
        span.style.display = 'none';
    };

  
  
    return (
        <div className="container-register">
          <div className="navbar-registro">
      <span>Connect with entire cities, countries and regions</span>
          </div>

       <div className="content-register">
         <div className="content-section1" >
           
            {/* Nombre */}
            <div className="input-group">
                <label>Name</label>
            <input type="text" name="name" id=""  value={data.name} onChange={handleChange} onClick={(e)=> handleClick(e)}  onBlur={(e)=> handleBlur(e)}/>
           {data.name.length  === 0 ?  <span id="error">this field can not be empty </span>: <FaCheck id="check-scc-input" />}     
                  </div> 

            {/* Apellidos */}
            <div className="input-group">
                <label>Surname</label>
            <input type="text" name="surname" id=""  value={data.surname} onChange={handleChange}  onClick={(e)=> handleClick(e)}  onBlur={(e)=> handleBlur(e)}/>
            {data.surname.length === 0 ? <span id="error">this field can not be empty </span> : <FaCheck id="check-scc-input" />}

            </div>
            {/* Correo */}
            <div className="input-group">
                <label>Mail</label>
            <input type="text" name="mail" id="" value={data.mail} onChange={handleChange} onClick={(e)=> handleClick(e)}  onBlur={(e)=> handleBlur(e)}/>
            {!isValidMail(data.mail) ? <span id="error">provide a valid email</span>: <FaCheck id="check-scc-input" /> }
            </div>
            {/* edad => estrategia pedir un rango de edad, en el futuro ya pedir la fecha de nacimiento */}
            <div className="input-group">
                <label>Age Range</label>
                <select id="ageRange" name="ageRange"  onChange={(e)=> setRangeAge(e.target.value)}>
                    {['12-17','18-24','25-34','35-44','45-54','55-64','65+'].map((item,index)=>(
                        <option key={index} value={item} selected={item === '18-24'}>{item}</option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <label>Username</label>
            <input type="text" name="username" id="" value={data.username} onChange={handleChange}   onClick={(e)=> handleClick(e)}  onBlur={(e)=> handleBlur(e)}/>
            { data.username.length === 0  || !user  ?  <span id="error" >username not valid </span> : <FaCheck id="check-scc-input" />}


            </div>
            <div className="input-group">
                <label>Password</label>
            <input type={typePass} name="password" id=""  value={data.password} onChange={handleChange}  placeholder='Ex:NameSurname765'  onClick={(e)=> handleClick(e)} onBlur={(e)=> handleBlur(e)} />
            {data.password.length < 8 || !isValidPass(data.password) ? <span id="error" >invalid password</span>:<FaEye id="sh-pass-chech" onMouseEnter={()=> setTypePass('text')} onMouseOut={()=> setTimeout(()=>{setTypePass('password')},1000)}/>}
            </div>
            <button onClick={
                // (e)=> handleForm(data.name,data.surname,data.mail,data.username,data.password,rangeAge,user,e)}
                (e)=> handleForm('Javier','data.surname','javiercaso28@gmail.com','chiwiwi','Javier961#',[18-24],'user',e)}

                 className='btn-next'><HiArrowRight /></button>
          </div> 
       </div>
        </div>
    )
    }





export default Registro
