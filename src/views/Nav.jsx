import { HiOutlineArrowLeft } from "react-icons/hi"
import {useNavigate,useLocation} from 'react-router-dom';
function NavOfQueryOption({query}) {
    const navigate = useNavigate();
    const location = useLocation();
    const defQuery = location.search.split('&')[0].split('=')[1];
    const decodedQuerySearch = decodeURIComponent(defQuery);
    const decodedQuery = decodeURIComponent(query);
    const typeOfQuery = location.search.split('tag_list')[1];

    const removeStoragePost = ()=>{
        localStorage.removeItem('data');
        navigate(-1);
    }

    return (
        <div className="query-post-response"  >
        <HiOutlineArrowLeft  onClick={() => location.pathname === '/post' ? removeStoragePost() : navigate(-1)}/>
        <h4 style={{color:typeOfQuery && 'rgb(0, 153, 255)'}}>{location.pathname === '/search/posts' ? (
        typeOfQuery ? `#${decodedQuerySearch}` : decodedQuery 
        ): decodedQuery }</h4>

        {/* <h4>{query}</h4> */}
    </div>
    )
}

export default NavOfQueryOption
