import { useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const BottomNotifBar = ({
    displayOptionsRepost,
    successfullOption,
    navigate,
    trashIcon,
    username,
    outlineBookmark,
    outlineReply,
    long,
    id
    ,outlineChat,
    redirectToCitation,
    outlineRepost,
    iteractionsFromDb,
    fiUserCheck,addDefaultIteraction,
    shortPost,booleanForProfile,notInterestedIn,CgSmileSad,
    isFastPost
    ,isProfileOptions

})=>{

  const defOutlineReply = (shortPost === 1 || shortPost === 2) ? <IoIosCheckmarkCircleOutline  style={{color:'gray;',position:'relative',left:'-3px',top:'5px',fontSize:'22px'}}/> : outlineReply
  const [hoverStateRepost,setHoverStateRepost] = useState(false);
  const [hoverStateQuote,setHoverStateQuote] = useState(false);
  const redirectTo = (e)=>{
    e.stopPropagation();
    if(shortPost){
      navigate(`/${username}/posts`);
    }else{
      if(long){
        navigate(`/post/format/long/${id}`);
      }else{
        navigate(`/post/${id}`);
      }}}

      const renderDefaultText = (index)=>{
        if(index === 0){
          return 'Reply successfully executed'
        }else if(index === 1){
          return 'Post uploaded succesfully'
        }else if(index === 2){
          return 'Your state has been updated succesfully. Congrats!'
        }else if(index === 3){
          return 'Bio update: Complete'
        } else if(index === 4){
          return 'You will send this post as a top new!'
        }else if(index === 5){
          return 'Ok,you are not interested in this type of content!'
        } else if(index === 6){
          return 'Post succesfully deleted '
        }
      }

    return(
        <>
           {(displayOptionsRepost || successfullOption === 1 || successfullOption === 0 || successfullOption === 2  ) && (
                  <>
                  <div className={
                       successfullOption === 1 || successfullOption === 0 || successfullOption === 2
                         ? 'container-reposts-options scc-options'
                         : displayOptionsRepost
                         ? 'container-reposts-options'
                         : 'container-reposts-options hidden'
                     }
                   >
                     {successfullOption === 1 || successfullOption === 0  || successfullOption === 2 ? (
                       <div
                         onClick={() =>
                           successfullOption
                             ? navigate(`/profile/users/${username}/type/posts`)
                             :(
                              booleanForProfile ?  navigate(`/search`) :
                              navigate(`/${username}/saved/posts`)
                             )
                         }
                       >
                         {successfullOption === 0 ? (
                           <>
                              {outlineBookmark}
                             <span>{booleanForProfile ? 'This page does not exists try something differnt' : 'Post successfully added to bookmarks!'}</span>
                             {booleanForProfile && <span  className="search-bottom-more" >Search</span>}
                           </>
                         ) : (
                           successfullOption === 2 ? (<>
                            <div style={{textDecoration:'none'}}>
                               {/* <HiOutlineReply /> */}
                               {notInterestedIn ? CgSmileSad :  defOutlineReply}
                               {shortPost === 6 && trashIcon}
                               {/* <span>{`${shortPost ? 'Post': 'Reply'} succesfully ${shortPost ? 'uploaded': 'executed'}`} </span> */}
                               <span > {renderDefaultText(shortPost)}</span>
                               {shortPost == 1 && !isFastPost &&  <span style={{color:'#1877F2'}} className="see-more-rep" onClick={redirectTo}>see more</span>}
                                </div>
                           </>) : 
                           <>
                             {/* <FiUserCheck className="foll-add-main active" /> */}
                             {fiUserCheck}
                             <span style={{ position: 'relative', left: '6px',color:'black',fontFamily:'lexend',fontStyle:'normal'}}>{
                               `You started following ${username}`
                             }</span>
                           </>
                         )}
                       </div>
                     ) : (
                       <>
                         <div
                           onClick={ isProfileOptions ? ()=> navigate(`/${username}/saved/posts`): addDefaultIteraction}
                           onMouseEnter={()=> setHoverStateRepost(true)}
                           onMouseLeave={()=> setHoverStateRepost(false)}
>
                           {/* <AiOutlineRetweet /> */}
                           {isProfileOptions ?  '' : outlineRepost}
                           <span 

                           style={{color:hoverStateRepost && 'white'}}
                           >
                         {isProfileOptions ? 
                         ' Top News posts'
                         :    (!iteractionsFromDb.some(
                               (item) => item.origen === 'repost' && id === item.id_message
                             )
                               ? `Repost ${username}`
                               : `Quit repost on ${username}`)}
                            
                           </span>
                         </div>
       
                         <div
                           style={{ borderTop: '1px solid whitesmoke' }}
                           onClick={ isProfileOptions  ? ()=> navigate(`/${username}/added/posts/topnews`) : redirectToCitation}
                           onMouseEnter={()=> setHoverStateQuote(true)}
                           onMouseLeave={()=> setHoverStateQuote(false)}
                         >
                           {/* <HiOutlineChat /> */}
                           {isProfileOptions ? outlineBookmark :  outlineChat}
                           <span
                           style={{color:hoverStateQuote && 'white'}}>{isProfileOptions ? 'Saved Posts' : 'Quote/Citation'}</span>
                         </div>
                       </>
                     )}
                 </div>
            <div />
            </>
                   )}
       
        </>
    )
}

export default BottomNotifBar;