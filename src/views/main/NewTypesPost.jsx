import {  useNavigate } from "react-router-dom";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { MdPostAdd } from "react-icons/md";
function NewTypesPost() {
    const navigate = useNavigate();
    const contentShort = `Express yourself fast and with multiple tools. You can send images,preview your post,search for tags`
    const contentLong = `Another form of posting, this one  new orientated.Here you put a tittle and content, only the tittle is rendered at first`
    return (
      <div className="new-format-types-post">
        {['Short Post', 'Long Post'].map((item, index) => (
          <div className="types-post" key={index} onClick={item === 'Short Post' ? ()=> navigate('/new/post/format/short'): ()=> navigate('/new/post/format/long')}>
            
           <div className="header-nav">
          {item === 'Short Post' ? <HiOutlinePencilAlt /> : <MdPostAdd />}
           <h4>{item}</h4>
           </div>
            <p>{item === 'Short Post' ? contentShort : contentLong}</p>
          </div>
        ))}
      </div>
    );
  }
  
  export default NewTypesPost;
  