import { IoSearchCircleOutline,IoCloseOutline } from "react-icons/io5";
import {useState} from 'react'
import { useNavigate } from "react-router-dom"
import TrendsContainer from '../../components/Dashboard/TrendsContainer';


import MainSearchComponent from '../../components/Dashboard/Search/MainSearch'
import PostSearch from '../../components/Dashboard/Search/PostSearch';
import { HiOutlineArrowLeft } from "react-icons/hi";
// import getToken from '../../components/js/verifyToken';
import Loader from '../processing/FastLoader';
import { IoMdGlobe } from "react-icons/io";
function Search() {

    const navigate = useNavigate();

    const [isLoading,setLoading] = useState(true);
    const [input,setInput] = useState('');
    const [data,setData] = useState([]);
    const [displayInputClose,setDisplayInputClose] = useState(false);
    const [renderContent,setRenderContent] = useState(true);
   //  const token  = getToken(() => navigate('/auth/login'));


    const handleChange = async (e)=>{
        const template = e.target.value;
            setInput(template);
            if(template.length > 0){
                setDisplayInputClose(true);
                setRenderContent(false);
            try {

                const url = `http://localhost:5000/search?q=${encodeURIComponent(input)}`
                const response = await fetch(url,{
                credentials:'include'
                });
                     if (!response.ok) {
                     throw new Error('Error al obtener los datos');
                }
                const result = await response.json();
                // const {users, localities} = result;
                // users.length === 0  && localities.length === 0  ? setData(null) : setData(result);
                console.log('result',result);
                setData(result);

              }   catch (error) {
                  console.error('Hubo un problema:', error);
                }finally{
                    setLoading(!isLoading);
                }
           } else{
            setDisplayInputClose(false);
            setRenderContent(true);
           }
    };


    const getIconMainSrch = (node)=>{
        if(node === 1){
            return <IoSearchCircleOutline className="srch-icon-search" />
        } else if(node === 2){
            return <img src="/images/defaultUserImage.jpg"></img>
        } else{
            return <IoMdGlobe className="srch-icon-localities" />
        }
    }


    const  booleanForSrch = false;//debe ser lo de que aparezca al ir bajando;


   

      // Expected output: 0, 1 or 2
      
// handleEnter o algo así 


// console.log('data',data);
    
return (
    <>
    <div className="container-prnt-srch-q">

       <div className="srch-q">
          <div className="inpgr-srchq">
             <HiOutlineArrowLeft onClick={() => navigate(-1)} className="ico-close-srch-q" />
             <input type="text" value={input} onChange={handleChange} autoFocus />
             {displayInputClose && <IoCloseOutline id="inpgr-srchq-svg-cls" onClick={() => setInput('')} />}
          </div>
 
          <div className="cnt-srchq">
             {renderContent ? (
                <>
                   <div className="main-srchq">
                      <MainSearchComponent query={input} icon={getIconMainSrch(3)} />
                   </div>
                   <TrendsContainer isWideScreen={true} />
 
         
                </>
             ) : (
                <div className="main-search" style={{ maxHeight: '75vh', border: '1px solid whitesmoke', borderRadius: '8px' }}>
                   {isLoading ? <Loader /> : <MainSearchComponent query={input} object={data} />}
                </div>
             )}
          </div>
       </div>

       <div className="srch-trends-render-posts">
                      <div className="search-posts">
                         {!booleanForSrch && renderContent &&  <PostSearch />}
                      </div>
                   </div>
    </div>
    </>
 );
 
}

export default Search

