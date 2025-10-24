import {useEffect,useState} from 'react';
import { useLocation,useNavigate } from "react-router-dom"
// useLocation
function FilterNews() {
    const navigate = useNavigate();
    const location = useLocation();
    const updatedDates = ['today', '7 days','30 days'];
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    // const boolean = false;
    useEffect(()=>{
    const locaSearch = location.search.split('=')[1];
    if(locaSearch === 'day'){
        setSelectedCheckbox(0);
    }else if(locaSearch === 'month'){
        setSelectedCheckbox(2);
    }else if(locaSearch === 'week'){
        setSelectedCheckbox(1);
    }
    },[]);
  //URL Provisional;
    const handleClick = (index)=>{
        setSelectedCheckbox(index)
        if(index === 0){
            navigate(`${location.pathname}?timestamp=day`)
            // navigate('/news/current?timestamp=day')
        }else if(index === 1){
            // navigate('/news/current?timestamp=week')
            navigate(`${location.pathname}?timestamp=week`)


        }else{
            // navigate('/news/current?timestamp=month')
            navigate(`${location.pathname}?timestamp=month`)

        }

    }
    return (
        <div className="container-aside-filter-date-news">
            <label>Filter by</label>
            {updatedDates.map((item,index)=>(
            <div key={index} className="content-filter-dates-aside-news">
                  <div className="custom-checkbox-container" onClick={()=>handleClick(index)}>
                  <div className={`custom-checkbox ${selectedCheckbox ? 'checked' : ''}`}>
         {/* <span className="checkmark">✔</span> */}
         {selectedCheckbox === index && <span className="checkmark">⨉</span>}
      </div>
       <span className="checkbox-label"></span>
    </div>
                <span>{item}</span>
            </div>
            ))}
        </div>
         )
       }

export default FilterNews
