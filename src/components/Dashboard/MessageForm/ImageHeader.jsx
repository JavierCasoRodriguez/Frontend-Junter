const ImageHeader = ({image,booleanNotifBouble})=>{

    const getDefaultObjectFit = ()=>{
        if(image.style === 1){
            return 'cover'
        } else if(image.style === 2){
            return 'contain'
        }  else if(image.style === 3){
            return 'none'
        } else{
            return 'fill'
        }
    }
    return(
        <>
                    <img src={image.index === 2 && image.name && image.index === 2 ? `https://${image.bucket}.s3.eu-west-3.amazonaws.com/${image.name}`: `/images/defaultUserImage.jpg`}  alt=""  
    style={{objectFit: image.index === 2 && getDefaultObjectFit(),
    width:'25px',height:'25px',borderRadius:'50%',position:booleanNotifBouble && 'relative',left:booleanNotifBouble && '-9px',top:booleanNotifBouble && '-4px'}} className={image.index === 2  ?  'prf-img formatted' : 'prf-img ' }/>
        </>
    )
}
export default ImageHeader;