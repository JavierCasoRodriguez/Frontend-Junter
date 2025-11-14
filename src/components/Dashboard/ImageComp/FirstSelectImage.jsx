import {useState} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import  getToken  from '../../js/verifyToken';
function FirstSelectImage(){
    const [send,SetSend] = useState(false);
    const [inputFile,setInputFile] = useState(null);
    const [failedResponse,setFailedResponse] = useState({
        boolean:false,
        message:''
    })
    const location = useLocation();
    const navigate =  useNavigate();
    // const token  = getToken(() => navigate('/auth/login'));

    const [displayError,setDisplayError] = useState(false);

    const handleChange = (e)=>{
        setInputFile(e.target.files[0]);
        SetSend(true);
        if(e.target.files[0].size > 3000000){
            setFailedResponse({
                boolean:true,
                message:'image to large, it has to be less than 3MB'

            })
           setTimeout(()=>{
            setFailedResponse({
                boolean:false,
                message:'image to large, it has to be less than 1MB'
            })
           },15000)
        }
        // if(e.target.files[0].length > 0){
        //     console.log(e.target.files[0]);
        // } 
    }
// const sendImage = (data,token)=>{
    
//     const formData = new FormData();
//     formData.append('imagen',data);
//     fetch('http://localhost:5000/images/save/profile/image',{
//       method : 'POST',
//       headers: { 'Authorization': `Bearer ${token}`},
//       body: formData,
//     })
//   .then(response => {
//     if(!response.ok){
//      throw new Error('error on response processing the image')
//      }else { 
//         response.blob();
//     }
// })
// .then(data => {
//     console.log(data);    
//     const reader = new FileReader();
//     reader.onload = ()=>{
//         const base64ImageProfile = reader.result;
//         localStorage.setItem('imageProfileUser', base64ImageProfile);
//     }
//     reader.readAsDataURL(data);
//     navigate(`${location.pathname.split('/').slice(0,-2).join('/')}/my-photo/options`);
// })
//   .catch(err => {console.log('server internal error',err)
//   })
// }


const sendImage = (data,token)=>{
    const formData = new FormData();
    formData.append('imagen',data);
    fetch('http://localhost:5000/images/save/profile/image',{
      method : 'POST',
      headers: { 'Authorization': `Bearer ${token}`},
      body: formData,
    })

      .then(response => {
    if(!response.ok){
     throw new Error('error on response processing the image')
     }else { 
      return  response.json();
    }
        })

        .then(data =>{
        console.log('datas',data);
            if(data){
                navigate(`${location.pathname.split('/').slice(0,-2).join('/')}/my-photo/options`)
            }else{
                setDisplayError(false)
                setTimeout(()=>{
                    setDisplayError(true);
                },7000);
            }
        })
}

// setTimeout(()=>{

// },5000);


    return(
        <div className="content-img-select">
            <span>Select an image(.jpeg,.png):</span> 
            <input type="file" name="" id="" onChange={handleChange} accept="image/jpeg, image/png"/>
           {send && inputFile.size < 3000000  && <button onClick={()=> sendImage(inputFile,token)}>Send</button>}
           {failedResponse.boolean && <span style={{color:'red',marginTop:'40px'}}>Failed uploading image:{failedResponse.message}</span>}
           {displayError &&  <span style={{color:'red',marginTop:'40px'}}>There has been an error on the process of  uploading the image,please try again later</span>}
        </div>
    )
}





export default FirstSelectImage;