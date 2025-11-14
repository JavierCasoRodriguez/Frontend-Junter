import { Link } from "react-router-dom"
import ContentImage from './ContentImage';
// import { useLocation,useNavigate } from "react-router-dom"
function ContentMessage({text,lg,id,response,onClick,onClickRes,renderTextWithHashtags,definedUserStyles,navigate,location,localityDef,responseImage,iconClose,sendImage,setSendImage,indexImage,
  formatImage,setFormattedImage,defaultCover,setDefaultCover,contentImage,outlineReply,searchParams
}) {
  // const navigate = useNavigate();
  // const location = useLocation();
  // console.log(response,'response');
   const booleanLocationPost = location.pathname.startsWith('/post') ? true :false;
  const isNewPost = location.pathname.startsWith('/new/post/format')
  const defaultWorldColideSrch = searchParams.get("q"); // Obtiene el valor de 'q'
  return (
   
 <div className={response ? "content-message active" : "content-message"} >
<div className="text-message" style={{ whiteSpace: 'pre-wrap' ,wordBreak:'break-word'}}>

{ response ? (
  <>
    <div
      className={
        booleanLocationPost
          ? "container-first-render-res-post active"
          : "container-first-render-res-post"
      }
      onClick={onClick}
    >
      {/* Este es el response de ariba  */}
           <RenderComonContent response={response} renderTextWithHashtags={renderTextWithHashtags(text,defaultWorldColideSrch, navigate)} contentImage={contentImage} lg={lg} validationImage={isNewPost ? sendImage :contentImage } isNewPost={isNewPost} id={id} isResponse={false} 
           outlineReply={outlineReply} 

           />


    </div>

    <div
      className={
        booleanLocationPost &&
        !location.pathname.startsWith("/posts/engagements")
          ? "post-response-content active"
          : "post-response-content"
      }
      onClick={onClickRes}
    >
      <header>
        <div className="main-header-res">
          {responseImage}
          <h3 className="username" style={{ left: definedUserStyles }}>
            {response.username}
          </h3>
        </div>
        <div className="options-header-post">
          <span
            className="reply-option response"
            onClick={() =>
              response.objectReply && navigate(`/post/${response.objectReply.idPost}`)
            }
          >
            {response.objectReply &&
              `replying to ${response.objectReply.username}, `}
          </span>
        </div>

        {/* Locality */}
        <div className="localities-render-type response">
          {response.country && (
            <label
              onClick={() => navigate(`${response.is_localidades}/${localityDef}`)}
            >
              {localityDef}
            </label>
          )}
        </div>
      </header>

      <div className="content-res-post-main">
        {/* ESTE ES EL RESPONSE DE ABAJO */}
      <RenderComonContent response={response} renderTextWithHashtags={renderTextWithHashtags(response.content,defaultWorldColideSrch, navigate)} contentImage={response.content_images} 
             validationImage={response.exist_image } isNewPost={isNewPost} id={response.id_message} isResponse={true}
             outlineReply={outlineReply} indexImage={indexImage} 
             
/>

      </div>
    </div>
  </>
) : (
  <div onClick={onClick} className="content-new-short-post">
    {booleanLocationPost ? (
      <>
      {/* {renderTextWithHashtags(text,defaultWorldColideSrch, navigate)} */}
      <RenderComonContent response={response} renderTextWithHashtags={renderTextWithHashtags(text,defaultWorldColideSrch, navigate)} contentImage={contentImage} lg={lg} 
       validationImage={isNewPost ? sendImage :contentImage } isNewPost={isNewPost} id={id}
       formatImage={formatImage} setFormattedImage={setFormattedImage} defaultCover={defaultCover} setDefaultCover={setDefaultCover}
       iconClose={iconClose} setSendImage={setSendImage} sendImage={sendImage} text={text}
       outlineReply={outlineReply} indexImage={indexImage}
       />
      </>
      
    ) : (
      // Este es el general que eno es el mismo que el response de arriba;
      <div>
       <RenderComonContent response={response} renderTextWithHashtags={renderTextWithHashtags(text,defaultWorldColideSrch, navigate)} contentImage={contentImage} lg={lg} 
       validationImage={isNewPost ? sendImage :contentImage } isNewPost={isNewPost} id={id}
       formatImage={formatImage} setFormattedImage={setFormattedImage} defaultCover={defaultCover} setDefaultCover={setDefaultCover}
       iconClose={iconClose} setSendImage={setSendImage} sendImage={sendImage} text={text}
       outlineReply={outlineReply} indexImage={indexImage}
       />

      </div>
    )}
  </div>
)}
      </div>
    </div>
  );
}


const RenderComonContent = ({
  response,renderTextWithHashtags,contentImage,lg,validationImage,isNewPost,id,isResponse,
  formatImage,setFormattedImage,defaultCover,setDefaultCover,iconClose,setSendImage,sendImage,text,outlineReply,indexImage
})=>{
  const longLink = <Link to={location.pathname !=='/new/post/format/long' && `/post/format/long/${id}`} id="lnk-lG-path">Read more</Link>

  return(
  <>
  {renderTextWithHashtags}
  <div style={{marginTop:'11px'}}></div>
        {lg && longLink}
        {/* la validacion cambia entre la iamgen normal y response  */}
        {validationImage && 
        <ContentImage isNewPost={isNewPost} contentImage={isResponse ? response.content_images : contentImage} 
        formatImage={formatImage} setFormattedImage={setFormattedImage} defaultCover={defaultCover} setDefaultCover={setDefaultCover}
        iconClose={iconClose} setSendImage={setSendImage}
        sendImage={sendImage} text={text} outlineReply={outlineReply} indexImage={indexImage}
        />           }
  </>
  )
}


export  default ContentMessage;
