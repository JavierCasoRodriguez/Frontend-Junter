import { useState,useRef} from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {HiOutlineReply} from 'react-icons/hi';
import {TiTick} from 'react-icons/ti';
import { FaChevronRight,FaChevronLeft,FaTimes } from "react-icons/fa";


const ContentImageEdit = ({isNewPost,iconClose,sendImage,indexImage,
  // defaultCover,setDefaultCover
  text,setSendImage})=>{

  const [renderEditBar,setRenderEditarBar] = useState(false);
  const [focusedImage,setFocusedImage] = useState(null);//hace referencia al index de cada imagen
  const [aspectRadio,setAspectRadio] = useState(false);
  // const [barCover,setBarCover] = useState(false);
  const isIntegerFocuImage = typeof focusedImage === 'number' && Number.isInteger(focusedImage);
  const [contentRotate,setContentRotate] = useState(false);
  const [numFunction,setNumFunction] = useState(null);
  const [selectedRatio, setSelectedRatio] = useState(null); // Guarda el índice seleccionado

 
  // const [defaultCover,setDefaultCover] = useState(null);


  console.log('sendImage',sendImage)

  const cropImage = (index,setImages) => {
    console.log(',cropImage(index,setSendImage)',index)
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const croppedImage = cropper.getCroppedCanvas().toDataURL(); // Base64
      const isIntegerFocuImage = typeof index === 'number' && Number.isInteger(index);
      //Para comprobar que el index no es null;
      const  defaultIndex = isIntegerFocuImage ?  index : 0;
      console.log('defaultIndex',defaultIndex);
      setImages((prev)=>
        {
        const updatedImage = [...prev[indexImage].image]
        if(croppedImage){
          updatedImage[defaultIndex] = croppedImage
        }  
        return{
          ...prev,
          [indexImage]:{
            ...prev[index],
            image:updatedImage
          }
        }
          // (prevImages) => {
          //   const newImages = [...prevImages]; // Copia del array
          //   if(croppedImage){
          //     console.log(' newImages[defaultIndex]',newImages[defaultIndex])
          //     console.log('croppedImage',croppedImage);
          //     newImages[defaultIndex] = croppedImage; // Reemplaza la imagen editada en la posición correspondiente
          //   }
          //   return newImages;
          // }
        }
      
    );    } //no la utilizo pero creo que la debería de usar;
  };

  const diffOnclick = [
    () => { setContentRotate(true); }, // Solo setea contentRotate a true
    () => { setAspectRadio(true); }, // Solo setea aspectRadio a true
    // () => { setBarCover(true); }, // Solo setea barCover a true
    () => { 
      setRenderEditarBar(false);
      setNumFunction(null);
    },
    () => {cropImage(focusedImage,setSendImage),setRenderEditarBar(false)}
  ];
  const outlineReply = <HiOutlineReply style={{fontSize:'17px'}} key={1} /> 
  const tickSvgForEdit = <TiTick  style={{color:'green',fontSize:'21px'}}/>;
  const arrEdit = isIntegerFocuImage ?  [outlineReply,'Edit'] : ['Edit']
  const cropperRef  = useRef(null);
  
  console.log({aspectRadio:aspectRadio,

     contentRotate:
     contentRotate})
  

     //Mucho cuidado porque 0 equivale a false;


    const handleOptions = ()=>{
        const handleClickEditOptions = {
          ratio: [
            (index) => { setNumFunction(14); setSelectedRatio(index); },
            (index) => { setNumFunction(169); setSelectedRatio(index); },
            (index) => { setNumFunction(43); setSelectedRatio(index); },
            // (index) => { setNumFunction(43); setSelectedRatio(index); }, // Aquí también el índice
            () =>{ setAspectRadio(false)},
            () => {cropImage(focusedImage,setSendImage),setAspectRadio(false)}
          ],
          // cover: [
          //   (index) => { setDefaultCover('fill'); setSelectedRatio(index); },
          //   (index) => { setDefaultCover('contain'); setSelectedRatio(index); },
          //   (index) => { setDefaultCover('scale-down'); setSelectedRatio(index); },
          //   (index) => { setDefaultCover('none'); setSelectedRatio(index); },
          //   () => {setBarCover(false),setDefaultCover(null)},
          //   ()=> {setBarCover(false)} //esto seguramente no vaya así
          // ],
          rotate: [
            (index) => { setNumFunction(90); setSelectedRatio(index); },
            (index) => { setNumFunction(180); setSelectedRatio(index); },
            (index) => { setNumFunction(270); setSelectedRatio(index); },
            (index) => { setNumFunction(360); setSelectedRatio(index); },
            () => {setContentRotate(false)},
            () => {cropImage(focusedImage,setSendImage),setContentRotate(false)}
          ]
         
        };
      
      

     if(aspectRadio    || contentRotate){
      if(aspectRadio){
        return ['1:1(square)','16:9 (horizontal)','4:3 (classic)',outlineReply,tickSvgForEdit].map((item,index)=>(
          <div
          onClick={()=> handleClickEditOptions.ratio[index](index) // Pasamos el índice aquí
          }
          key={index}
          className="options-edit-bar radio"
          style={{ fontWeight: selectedRatio === index ? '600' : 'normal' }}
        >
          {item}
        </div>
        ))
      }

      // if(barCover){
      //   return ['Fill','Contain','Scale-down','Cover',outlineReply,tickSvgForEdit].map((item,index)=>(
      //     <div
      //     onClick={
      //      ()=>  handleClickEditOptions.cover[index](index) // Pasamos el índice aquí
      //     }
      //     key={index}
      //     className="options-edit-bar cover"
      //     style={{ fontWeight: selectedRatio === index ? '600' : 'normal' }}
      //   >
      //     {item}
      //   </div>
      //   ))
      // }
      if(contentRotate){
        return ['90','180','270','360',outlineReply,tickSvgForEdit].map((item,index)=>(
          <div
          onClick={
            ()=>  handleClickEditOptions.rotate[index](index) // Pasamos el índice aquí
          }
          key={index}
          className="options-edit-bar"
          style={{ fontWeight: selectedRatio === index ? '600' : 'normal' }}
        >
          {item}
        </div>
        ))
      }
      // if(filpped){
      //   return ['flip-x','flip-y',outlineReply,tickSvgForEdit].map((item,index)=>(
      //     <div
      //     onClick={
      //      ()=> handleClickEditOptions.flipped[index](index) // Pasamos el índice aquí
      //     }
      //     key={index}
      //     className="options-edit-bar flipped"
      //     style={{ fontWeight: (flippedX && index )? '900' : 'normal' }}
      //   >
      //     {item}
      //   </div>
      //   ))
      // }
     }else{
      return   [ 'Rotate', 'Set Format',outlineReply,tickSvgForEdit].map((item, index) => (
  <div className="options-edit-bar"  key={index} onClick={()=> diffOnclick[index](index)}>{item}</div>
))}
     
}






    return(
        <div className={sendImage.length > 1 && !isIntegerFocuImage ? 'content-img-message active': "content-img-message"} style={{marginTop:text.length > 0 && '21px',marginBottom:isNewPost && '70px'}}>
          <span>{numFunction}</span>
        {/* {isNewPost && sendImage.length === 1 &&  <div className="icon-cls-images" onClick={()=> setSendImage(null)}>
           </div>} */}
      {/* {iconClose} */}
         {renderEditBar ?   <CroppedImage numFunction={numFunction} image={isIntegerFocuImage ? sendImage[focusedImage] :sendImage[0]} setImage={setSendImage} cropperRef={cropperRef} />:
         //Esto también
         <CommonBodyImage isIntegerFocuImage={isIntegerFocuImage} validationImage={sendImage.length === 1 || isIntegerFocuImage } contentImage={sendImage}  setFocusedImage={setFocusedImage} focusedImage={focusedImage}
         setSendImage={setSendImage} cropperRef={cropperRef} isNewPost={isNewPost} iconClose={iconClose} indexImage={indexImage}

         />

         }
        {/* No se puede reutilizar */}
       {(isNewPost  && sendImage.length === 1 || isIntegerFocuImage ) && (

  <div className="tools-image">
    {renderEditBar ? (
      <div className="edit-bar" >
        {handleOptions()}
      </div>
    ) : (
 <div className="main-div-edit-center">
  { arrEdit.map((item,index) => (
    <div key={index} onClick={item !== 'Edit' ? ()=> setFocusedImage(null) : () => setRenderEditarBar(true)} style={{width:'100%'}}>{item}</div>
  )) }
 </div>
    )}
  </div>
)}
       <div>
       </div>
         </div>

    )
}
const CroppedImage = ({image,cropperRef,numFunction})=>{
  
  // const [image,setImage] = useState(false);

  const rotateImage = (num) => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const currentRotation = cropper.getData().rotate || 0;
      cropper.rotate(num - currentRotation); // Establece la rotación correcta
    }
  };
  

  
  const changeAspectRatio = (ratio) => {
    if (cropperRef.current) {
      cropperRef.current.cropper.setAspectRatio(ratio);
    }
  };
  
  // Mapeo de funciones según `numFunction`
  const actions = {
    90: () => rotateImage(90),
    180: () => rotateImage(180),
    270: () => rotateImage(270),
    360: () => rotateImage(360),
    14: () => changeAspectRatio(1 / 1), // 1:1
    169: () => changeAspectRatio(16 / 9), // 16:9
    43: () => changeAspectRatio(4 / 3), // 4:3
  };
  
  // Ejecutar acción si existe
  if (actions[numFunction]) {
    actions[numFunction]();
  }
  
  return(
<>
<Cropper
            ref={cropperRef}
            src={image}
            style={{ height: '100%', width: "100%",backgroundColor: "white"}}
            //aspectRatio={} // Cambia el ratio según necesites (ej. 16/9, 4/3)

            guides={false}
          />
</>
  )
}


const CommonBodyImage = ({validationImage,contentImage,cropperRef,isNewPost,setSendImage,iconClose,setFocusedImage,focusedImage,isIntegerFocuImage,indexImage})=>{
  //Content Image => va a actuar tanto como sendImage como de contentImage
  console.log({
    isIantge :isIntegerFocuImage,
    contentImage:contentImage,
    focus: focusedImage
  })
  const controls = [
    focusedImage > 0 && { icon: <FaChevronLeft />, className: "left",action: (e)=> {e.stopPropagation();setFocusedImage(prev => prev - 1)} },
    focusedImage < contentImage.length - 1 && { icon: <FaChevronRight />, className: "right",action: (e)=> {e.stopPropagation();setFocusedImage(prev => prev + 1)} }
  ].filter(Boolean);

  const getDefaultSrc = ()=>{
      if(isIntegerFocuImage){
        return contentImage[focusedImage];
      }else{
        if(contentImage){
          return contentImage;
        }
      }
  }
  validationImage
  // console.log('validationImage',validationImage);
  return(
    ( validationImage ? 
     <>
   {isNewPost && 
   
<div className="icon-cls-images"   onClick={()=> {
setSendImage(prev =>  (
  {
    ...prev,
    [indexImage]:{
      ...prev[indexImage],
      image:[]
    }
  }
))
}}>

{iconClose}
  </div>
  }

<img 
       style={{borderRadius:'8px'}}
       // src="https://example-bucket-javier-new.s3.eu-west-3.amazonaws.com/059c2122-03d9-4166-9c99-5e5d2f17db29.jpg"
       ref={isNewPost &&  cropperRef}
       src={getDefaultSrc()}
       alt="Content"
     />

    {controls.map(({ icon, className,action }, index) => (
        <button key={index} className={`slider__button ${className}`} onClick={action}>
          {icon}
        </button>
      ))}
     </>

    : 
      (contentImage.map((item, index) => (
       <div className="content-main-image" key={index}>
         {isNewPost &&  <div className="icon-cls-images"   onClick={()=> setSendImage(
         {
          [indexImage]:{
            image:contentImage.filter((element,num) => num !== index)
          }
         }
        )}>
        
        {iconClose}
          </div>}
          <img 
           style={{borderRadius:'8px'}}
           key={index}
           src={item}
           onClick={(e)=> {e.stopPropagation();setFocusedImage(index)}}
           ref={cropperRef}
           alt="Content"
         />
         </div>
    ))
  ))
  )
}


const ContentImageNormal = ({contentImage,outlineReply})=>{
  const [focused,setFocused] = useState(null);//Sería para ampiar la imagen
  const isIntegerFocuImage = typeof focused === 'number' && Number.isInteger(focused);

  return(
    <div className="content-img-message active" >
      <CommonBodyImage contentImage={contentImage.image} validationImage={Array.isArray(contentImage) || isIntegerFocuImage } setFocusedImage={setFocused} focusedImage={focused} isIntegerFocuImage={isIntegerFocuImage}
      iconClose={outlineReply}
      />
    </div>
  )
}


const RenderDefaultContentImage = ({isNewPost,iconClose,sendImage,contentImage,indexImage,
  // defaultCover,setDefaultCover
  text,setSendImage, outlineReply})=>{
 
  return(
    <>{isNewPost ? <ContentImageEdit  isNewPost={isNewPost} iconClose={iconClose} sendImage={sendImage} indexImage={indexImage}
    // defaultCover,setDefaultCover
    text={text} setSendImage={setSendImage}/> : <ContentImageNormal outlineReply={outlineReply} contentImage={contentImage}/>}</>
  )
}





export default RenderDefaultContentImage;