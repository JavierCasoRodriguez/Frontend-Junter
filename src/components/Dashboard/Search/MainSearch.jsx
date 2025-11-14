import { useNavigate } from "react-router-dom"
import { ContextUid } from "../../../views/SessionContext";
// import getToken from '../../js/verifyToken';
import {useContext,useEffect,useState} from 'react';
// import { HiOutlineX } from "react-icons/hi";
import { IoCloseOutline, IoSearchCircleOutline } from "react-icons/io5";
import { IoMdGlobe } from "react-icons/io";
import { FaHashtag } from "react-icons/fa6";



const MainSearchComponent = ({query,object})=>{
//el type en la base de datos no haría falta;

   
    const [data,setData] =  useState([]);
    // const [queryResults,setQueryResults ] =  useState([]);
    const Contextuid = useContext(ContextUid);
    const uid = Contextuid.uid;

    const navigate =  useNavigate();
    const handleClick  = async (text,type)=>{ //quito indexRedirect
        //ADD history search
        const url = 'http://localhost:5000/search/add/more/history/node';
        const data = {uid,text,type};
        fetch(url,{
            method : 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify({data})
        })
        .then(response => {
            if(!response.ok){
                throw new Error('incorrect response')
            }
            response.json();
            
        })
        .catch(err => console.error(err))
        
console.log('uid,text,type',uid,text,type);

    if(text.startsWith('#')){ //es necesario hacer verificación par el mainQuery
    onRedirect('tag',text);
    }else{
    onRedirect(type,text);
    }}

    // console.log(object);

    const onRedirect = (params,query)=>{
        console.log({
            params:params,
        
        })

        if(params === 'tag'){
            const defQuery = query.replace(/^#/, "");           
            navigate(`/search/posts?q=${defQuery}&tag_list=true`);
        }
        else if(params === 'user'){
            navigate(`/profile/users/${query}/type/posts`)
        }else if(params === 'query'){
            navigate(`/search/posts?q=${query}`)
        }else if(params === 'city'){
        navigate(`/city/${query}`)
        }else if(params === 'region'){
            navigate(`/region/${query}`)
        } else if(params === 'country'){
            navigate(`/country/${query}`)
        } 
    }

    useEffect(()=>{
        const getHistory = async  ()=>{

            // const token  = getToken(() => navigate('/auth/login'));
            const url = 'http://localhost:5000/search/get/history/node';
            try {
            const response = await fetch(url,{
                credentials:"include"
                });
                 if (!response.ok) {
                 throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            console.log(data);
           data ? setData(data) : setData([])
            }   catch (error) {
              console.error('Hubo un problema:', error);
            }
        }
        getHistory()

    },[]);

//  const showData = query.length > 0 ? setDisplay(false) : setDisplay(false);

    const deleteHistoryNode = (e)=>{

        const icon = e.target;
        const template = icon.closest(".main-generalCom-q-srchq");
        const text =  template.querySelector('#query-text').innerHTML;
        template.remove();

    
        const data = {uid,text};
        const url = 'http://localhost:5000/search/delete/history/node';
        fetch(url,{
            method : 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify({ data })
        })
        .then(response => response.json())
        .catch(err => console.error(err))
    }


    const getIconQuerySrch  = (params)=>{
  
        if(params === 'country' || params === 'region' || params === 'city' || params === 'localidades'){
            return <IoMdGlobe />
        } else if(params === 'user'){
            return  <img src="./images/defaultUserImage.jpg" alt="" className="image-user-profile" />
        }else if(params === 'query'){
            return <IoSearchCircleOutline />
        } else if(params === 'tag'){
            //opcion a
            // return  ''
            //opcion b
            return <FaHashtag  style={{fontSize:'15px',marginLeft:'5px',marginTop:'5px',color:'rgb(0, 153, 255)'}} />
        }
    }
  


    return(
        <>
        {/* esto es lo que busca el usuario => lo que va escribiendo  */}
        {/* es query 4 porque es normal y type query de inserción */}
         {(query.length > 0 || query ) && (<li className="main-generalCom-q-srchq" onClick={()=> handleClick(query,'query',4)} >
          <div className="main-generalCom-content-srch" >
            <div className="icon-srch-diverse-query">
            <IoSearchCircleOutline />
             </div>
            <h4 id="query-text active">{query}</h4>
            </div>
            </li>
         )}
        
        {/* Cambiar element.icon que viene de otro query */}
            {object && (
             object.map((item,index )=>(
                <li key={index} className="main-generalCom-q-srchq"  >
                <div className="main-generalCom-content-srch" onClick={()=> handleClick(item.query,item.source)}>
                    {/* <span style={{color:'green'}}>{item.icon}</span> */}
                <div className="icon-srch-diverse-query">
                 {getIconQuerySrch(item.source)} 
                </div>
                <h4 id="query-text active" 
                style={{color:item.query.startsWith('#') && 'rgb(0, 153, 255)'}}
                >
                    {item.query}</h4>
                {/* <span>{item.index}</span> */}
                </div>
                </li>
            ))
        )} 
        {(data.length > 0 || data)&&
        <>
        {query.length === 0 ? (
            data.map((element,index) =>(
                <li className="main-generalCom-q-srchq" key={index}  >
                <div className="main-generalCom-content-srch"   onClick={()=> handleClick(element.query,element.type)}>
                <div className="icon-srch-diverse-query" >
                {getIconQuerySrch(element.type)} 
                
                </div>
                <h4 id="query-text" 
                style={{color:element.query.startsWith('#') && 'rgb(0, 153, 255)'}}
                 >{element.query}</h4>
                </div>
                  <div className="container-icon-main-search"  onClick={deleteHistoryNode}>
                <IoCloseOutline className="main-generalCom-q-srchq-ico-close" />
                  </div>
            </li>))
        ):''}
        </>
       
        
        }
        </>
    )
}

export default MainSearchComponent;