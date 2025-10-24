import { HiGlobe} from 'react-icons/hi';
import { useNavigate } from "react-router-dom";
const ListLocalitiesSuggest = ({item,index,params,booleanForQueryContent,isMainRender,uid})=>{
    const navigate =  useNavigate(); 
    //pasar un objeto que diga si es country o no;
    //estaría bien que si fuese region o city decir de donde es por ejemplo Paris city/France;
    
    const handleClick = (uid)=>{
        fetch(`http://localhost:5000/config/search/insert/localitie/${item}`,{
         method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({uid,params})
      })
          .then(response => response.json())
          .catch(err => console.log(err))   

          navigate(`/${params}/${item}`)
      }
    

    return (
        <div key={index} className={booleanForQueryContent ? 'card-items-localites query' : "card-items-localites" } 
        style={{padding:isMainRender ? '0' : '10px' }}
        onClick={()=> handleClick(uid)}>
           <div className="card-main-content">
           {/* icon */}
         <div className={item && item.length > 12 ? 'main-card-localities-suggest formatted': "main-card-localities-suggest"} >
        {!booleanForQueryContent && <div className="icon-list-locali"><HiGlobe /></div>}
         <div className="text-list-localities">
         <h3 style={{marginLeft:'5px'}}>{item}</h3>
         </div>
         </div>
            <span>{params}</span>
           </div>
        </div>
    )
}

export default ListLocalitiesSuggest