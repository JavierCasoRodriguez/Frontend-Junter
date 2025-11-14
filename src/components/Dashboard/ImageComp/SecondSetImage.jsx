import FastLoader from '../../../views/processing/FastLoader';
import { useState,useEffect,useContext } from "react";
import getToken from '../../js/verifyToken';
import { useNavigate } from 'react-router-dom';
import { ContextUid } from '../../../views/SessionContext';
// import BottomNotifBar from '../BottomNotifBar';



const SecondSetImage = ()=>{
const navigate =  useNavigate();
// const token  = getToken(() => navigate('/auth/login'));
const {username} = useContext(ContextUid)

const getImage = (setSrc,setImageBlob,isLoading)=>{
        fetch('http://localhost:5000/images/get/photo/user/profile',{
      credentials:"include"
    })
     .then(response => {
        if(!response.ok){
         throw new Error('error on response processing the image')
         }else { 
            return response.blob();
        }
    })

    .then(blob => {
        if (blob) {
          setImageBlob(blob);
          // Crear una URL de objeto desde el Blob
          const imageUrl = URL.createObjectURL(blob);
          console.log(imageUrl);
          setSrc(imageUrl); // Establecer la URL como fuente de la imagen
        }
      })

      .catch(err => {
        console.error('Error fetching the image:', err);
      })
      .finally(()=>{
        isLoading(false);
      })
}

    // fetch('http://localhost:5000/images/uploads/user/profile/compression/format/handler',{

    const nodes = [1,2,3,4];
    const [src,setSrc] = useState(null);
    const [predefindedStyles,setPredefindeStyles] = useState(1);
    const [imageBlob,setImageBlob] = useState(null);
    const [loader,isLoading] = useState(true);
    const [fastVerify,setFastVerify] = useState(2);
   
    useEffect(()=>{
        getImage(setSrc,setImageBlob,isLoading);
        // const imageBase64 = localStorage.getItem('imageProfileUser');
        // if(imageBase64){
        //     setSrc(imageBase64);
        // }

    },[]);


    const defineStyles = (index)=>{
        if(index === 1){
            return 'cover'
        } else if(index === 2){
            return 'contain'
        }  else if(index === 3){
            return 'none'
        } else{
            return 'fill'
        }
    };

    
    const uploadImage = (imageBlob,predefindedStyles)=>{
        // const blob = getImageBlob(src);
        // const storageRef = ref(firestore,'profile_images')
        // uploadBytes(storageRef,blob)
        // .then((snapshot)=>{
        //     console.log('archivo subido con éxito',snapshot)
        // })
        //desde aquí se saca la url;
        // .catch((error) => {
        //     console.error('Error al subir el archivo:', error);
        //   });


    
    const formData = new FormData();
    formData.append('imagen',imageBlob);
    fetch(`http://localhost:5000/images/uploads/user/profile/compression/format/${predefindedStyles}`,{
      method : 'POST',
      headers: { 'Authorization': `Bearer ${token}`},
      body: formData,
    })
  .then(response => {
    if(!response.ok){
     throw new Error('error on response processing the image')
     }else { 
        response.blob();
    }
})
.then(data => {
    console.log('data',data);
    if(!data){
        setFastVerify(1)//ERROR
    }else{
        // console.log(data);    
        // const reader = new FileReader();
        // reader.onload = ()=>{
        //     const base64ImageProfile = reader.result;
        //     localStorage.setItem('imageProfileUser', base64ImageProfile);
        // }
        // reader.readAsDataURL(data);
        // //quedaría redirigir;
        // // navigate(`${location.pathname.split('/').slice(0,-2).join('/')}/my-photo/options`);
        setFastVerify(0)//Succesfull Response
        isLoading(true);
        setTimeout(()=>{
            isLoading(false);
            navigate(`/${username}/posts`,{ state: { refreshUser: true } });
        },2000);
        
    }
})
  .catch(err => {console.log('server internal error',err)
  })

    }


    // const getImageBlob = (base64,token,)=>{
    //     //capturar base 64
    //     const base64Content = base64.split(',')[1];

    //     //decodifica la cadena
    //     const byteArray = atob(base64Content);
    //     console.log(byteArray);
    //     //crear un array con los bytes
    //     const byteNumbers = new Array(byteArray.length);
    //         for (let i = 0; i < byteArray.length; i++) {
    //             byteNumbers[i] = byteArray.charCodeAt(i);
    //         }

    //     // Crea un objeto Uint8Array a partir del array de bytes
    //     const byteArrayUint8 = new Uint8Array(byteNumbers);
    //     const blob = new Blob([byteArrayUint8], { type: 'image/jpeg' });

    //     return blob;
    // }
    const formatStyle = defineStyles(predefindedStyles);

    return(
        <>
      { loader ? <FastLoader /> :  <div className="body-list-img">
            {/* <div className="target-settings-photo">


            </div> */}
            {fastVerify !== 2 && <div className="success-cnt-post">
            <span style={{color:fastVerify === 0 ? 'rgb(21, 198, 21)' : 'red'}}>{fastVerify === 0 ?'image uploaded successfully' :'thre has been an error uploading the image,try again later'}</span>
            </div>}
        <img src={src} className="image-user" style={{objectFit:formatStyle}}/>
        <div className="list-options-images">
        <div className="list-images-img">
        <span className="text-format-photo">Select a phormat:</span>
        </div>
        <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
        <div className="options-images-src">
        {nodes.map((index)=>(
        <> <img key={index} src={src} alt=""  className="image-user-list" 
         style={{objectFit:defineStyles(index)}}
         onClick={()=> setPredefindeStyles(index)}/> </>
    ))}
    </div>

        </div>
        </div>
        <div style={{width:'100%',textAlign:'center',position:'relative',top:'28px'}}>
        <button className="btn-submit-handle-images"onClick={()=> uploadImage(imageBlob,predefindedStyles)}>Send</button>
        </div>
             </div>}
        </>
    )
}


export default SecondSetImage;