import { useContext } from "react"
import { ContextUid } from "../../../views/SessionContext"
import { useNavigate } from "react-router-dom";


function Trends({ name,number}) {

    const navigate =  useNavigate();
    const objectUid =  useContext(ContextUid);
    const uid = objectUid.uid;


    const handleClick = (name)=>{
        
      if(name.startsWith('#')){
        const defName = name.replace(/^#/, "");   
        navigate(`/search/posts?q=${defName}&tag_list=true`)
      }else{
        navigate(`/search/posts?q=${name}`);
      }

        const data = {uid,name};
        fetch('http://localhost:5000/trends/add/history/user/trend/format?event=click',{
            method : 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify({ data })
        })
        .then(response => response.json())
        .catch(err => console.error(err))

    }
    
    const formatNumber = (num) => {
        if (num >= 1000) {
          if (num % 1000 === 0) {
            return (num / 1000) + 'K';
          } else {
            return (num / 1000).toFixed(1) + 'K';
          }
        }
        return num;
      };

    return (
        <>
        <li className="trednmain-optsrcq"  onClick={()=> handleClick(name)} >
            <span className={location.pathname.startsWith('/search') ? 'index-trends': "iterative-index-position"}></span>
            <div className="cnt-trend">
             <h3>{name}</h3>
             <span className="count-trends">{formatNumber(number)}</span>
            </div>
        </li>
    
        </>
    )
}








export default Trends
