import { useContext } from "react";
import { IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ContextUid } from "../../../views/SessionContext";

const SearchAside = ()=>{

    const navigate = useNavigate();
    // const location = useLocation();
    const uid = useContext(ContextUid);



    const handleKeyDown = (e)=>{    
    if(e.key === 'Enter' && e.target.value.length > 0){
     const text = e.target.value;
     if(e.target.value.startsWith('#')){
        const defQuery = e.target.value.replace(/^#/, "");           
        navigate(`/search/posts?q=${defQuery}&tag_list=true`);
    }else{
        navigate(`/search/posts?q=${e.target.value}`)

    }
    //  navigate(`/profile/users/${text}/type/posts`)
     const data = {uid: uid.uid, text:text}

   fetch('http://localhost:5000/search//addHistoryNode',{
       method : 'POST',
       headers: {'Content-type':'application/json'},
       body: JSON.stringify({ data })
   })
   .then(response => response.json())
   .then(data => console.log(data))
   .catch(err => console.error(err))
    }
    } 
    return(
        <>
         <div className="srch-aside-right-query-fast">
        <IoMdSearch style={{color:'white'}}/>
        <input type="text" name="" id=""   onKeyDown={handleKeyDown} placeholder="searching..."/>
        </div>
        </>
           
    )
};



export default SearchAside