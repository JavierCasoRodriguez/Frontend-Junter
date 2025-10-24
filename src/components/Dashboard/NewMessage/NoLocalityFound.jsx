const NoLocalityFound = ({handleText,navigate})=>{
    return(
        <div className="alert-ft-localities">
        <span>
        It is not possible to send this post to <b>{handleText}</b>  because 
        it is not one of your <b>localities</b>, if you want  to send this post to {handleText}<b> change your localities</b>
         . <b className='redirect-localities' onClick={()=> navigate('/localities')}>Change</b>
        
        </span>
        </div>
    )
}
export default NoLocalityFound;