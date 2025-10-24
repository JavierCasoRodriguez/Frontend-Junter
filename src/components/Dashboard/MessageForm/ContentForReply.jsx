const ContentForReply = ()=>{
    const booleanLocationPost = false;
    const arrForContentReply = [
        {className:'text-message',content:'el contenido del padre'}
        ,{className:'text-message',content:'el contenido del padre'}
    ]

    return(
        <div className="content-for-reply" >
            {/* Hacer dos text-message uno por parent-post y otro por el reply */}

<div className={booleanLocationPost ? "post-response-content active": "post-response-content"} 
//  onClick={onClickRes}
 >
                                         <header>
                                <div className="main-header-res">
                                         <img src="/images/usuario.png"/>
                                         <h3 className="username">{'response.username'}</h3> 
                                     </div>
                                             </header>                          
                            
                                 <div className="content-res-post-main">
                                 {/* {renderTextWithHashtags(response.content)} */}
                                 el contenido del post
                                
                                </div>
                        </div>

            <div className="container-first-render-res-post">
                {arrForContentReply[0].content}
            </div>
            

        </div>
    )
}

// Estructura normal
// content-message,text-message,div + spanes que sean;


export default ContentForReply