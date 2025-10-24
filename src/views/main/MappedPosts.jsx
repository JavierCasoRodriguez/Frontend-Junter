import Message  from '../../components/Dashboard/MessageForm/Message';

const MappedPosts = ({item,iteractions,listFollowing,iteractionsEnd,filed,location})=>{
    const params = location.pathname.split('/')[2];
    const localitie = location.pathname.split('/')[1];
   
    // const arr = [20,30,50,6,7,8,98,12,34];
    // console.log(item);
    return(
      <>      
      {item && 
     (
      item === 'not matched' ? (
        <div className="not-matched-cont-components-posts">
          <span><b>{params}</b> is not a vaild <b style={{marginRight:'2px'}}>{localitie}</b>,or it has not been included yet on our database, please try something different.</span>
          </div>
            ) : (
            item.map((item)=>(
              <>
              <Message
                       
                       key={item.id_message}
                       id={item.id_message}
                       userid={item.userid}
                       username={item.username}
                       image={item.img}
                       date={item.date}
                       likes={item.likes}
                       tn={item.tn}
                       replies={item.replies}
                       repost={item.repost}
                       long={item.long}
                       text={item.content}
                       response={item.response}
                       contentImage={item.content_images}
                       country={item.country}
                       region={item.region}
                       city={item.city}
                       isLocalities={item.is_localidades}
                       isCitation={item.is_citation}
                       isComment={item.is_comment}
                       objectReply={item.objectReply}
                       iteractions={iteractions}
                       listFollowing={listFollowing}
                       filedPosts={filed}
                       iteractionsEnd={iteractionsEnd}
                       thread={item.thread}
                       renderOptions={0}           
                       />
                          </>
        
            )
          )
        ))}
      </>
    )
  }

  export default MappedPosts;