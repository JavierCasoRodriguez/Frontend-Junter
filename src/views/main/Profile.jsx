import { useState,useEffect,useContext } from "react"
import { HiGlobe,HiDotsVertical,HiLogout, HiOutlineBookmark } from "react-icons/hi";
import {useLocation,useNavigate,Outlet,Link} from 'react-router-dom';
import Seguir from "../../components/Dashboard/Seguir";
// import getToken from '../../components/js/verifyToken';
import NavbarOptionsProfile from '../../components/Dashboard/NavbarOptionsProfile';
// import OptionMessage from "../../components/Dashboard/MessageForm/MsgOptions";
import { ContextUid } from "../SessionContext";
import Loader from '../../views/processing/Loader';
import BottomNotifBar from '../../components/Dashboard/BottomNotifBar'; 
import { IoIosCheckmarkCircleOutline } from "react-icons/io";



        const renderAboutUser = async (path,username,setUser,setObjectUser,boolean,setDefaultState) => {
            // 'http://localhost:5000/Profile/render/user/info', http://localhost:5000/Profile/render/user/${username}/extra/info/staus?token=no

                const url =`http://localhost:5000/Profile/render/user/info/${username}`
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        console.error('response incorrect');
                        return;
                    }  
                    const responseData = await response.json();
                    console.log('responseData',responseData);
                    const {name,surname,mail,username,country,region,city,state} = responseData[0];
                    if(boolean){
                        setUser(responseData);
                    }
                    setObjectUser({
                        name:{name:'Name',render:name},
                        surname:{name:'Surname',render:surname},
                        mail:{name:'Mail',render:mail},
                        username:{name:'Username',render:username},
                        localities:{name:'Localities',render:[ `${country},`,`${region},`,city]},

                    });
                    if(state){
                        setDefaultState(state)
                    }
                }catch(e){ 
                    console.log(e)
                }}
              

    const getUserInfoMain = async (path,username,setMainInfoUser,navigate,location,uid,setSeguidores,setSeguidos,setDisplayBottomBar)=>{
        //username,estado,seguidores
        // let url;
        // if(!path){
        //      url = 'http://localhost:5000/Profile/render/user/main/info';
        // } else{
        //      url = `http://localhost:5000/Profile/render/main/${username}/extra/status?token=no`;
        // }

        // console.log(url);
        
        const url = `http://localhost:5000/Profile/user/main/info/${username}`;

      
            try {
            const response = await fetch(url,{
                credentials:'include'
            });
                 if (!response.ok) {
                 throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            console.log('estos son los datos',data);

            if(data.message === 'This user does not exist'){
                setMainInfoUser(null);
                setDisplayBottomBar(true);
                
            }

            if(location.pathname.startsWith('/profile')){
                
                console.log('',data[0].userData.uid)
                console.log(username);
                if(data[0].userData.uid === uid){
                    navigate(`/${username}/posts`);
                }
            }
           
            if(location.pathname.split('/').length < 3){
                if(data[0].userData.uid !== uid){
                   navigate(`/`);
               }
            }
                //estaría mal hecha la verficación porque habría que hacerla por el userid => por ahora sirve
                //se podría quitar tambien algunas de redireccionar en messages pero no hace falta;
                console.log('primeros tipos de datos',data);
                setSeguidores(data[0].seguidores);
                setSeguidos(data[0].seguidos)
                setMainInfoUser(data[0].userData);
            }   catch (error) {
              console.error('Hubo un problema:', error);
            }
            
        

    }

               //esta funcion se repetiría pero por ahora nada;



    const getUsernameFromPath = (location)=>{
        if(location.pathname.includes('/profile/users')){
            return decodeURIComponent(location.pathname.split('/')[3]);
        } else {
           return  decodeURIComponent(location.pathname.split('/')[1]);
        }
    }
          


    const addCountFromFollowers = (setSeguidores,seguidores,follow,setFollow)=>{
        // const newNumFollowers = numFollowers +1 
       if(!follow){
        
        // console.log(newNumFollowers);
        console.log('numero de seguidores',seguidores)
        const newNum = Number(seguidores) + 1;
        setSeguidores(newNum);
        setFollow(true);
        console.log(follow);
       }else{
        console.log('numero de seguidores',seguidores)

        const newNum = Number(seguidores) - 1
        setSeguidores(newNum);
        setFollow(false);
        console.log(follow);
       }
    }


function Profile() {
    
    const location = useLocation();
    const navigate = useNavigate(); 
    // const token  = getToken(() => navigate('/auth/login'));

    // const [isLoading,setLoading] = useState(true);
    const [booleanImg,setBooleanImg] = useState(false);
    // const [user,setUser] = useState(null);
    const [mainInfoUser,setMainInfoUser] = useState([]);
    const [optionsMessage,setOptionsMessage] = useState(false);
    // const [counterFollowers,setCounterFollowers] = useState(null);
    const [follow,setFollow] = useState(false);
    const usernameExtra =  getUsernameFromPath(location);
    const renderDiffPath = location.pathname.includes('type') ? true : false
    const [seguidos,setSeguidos] = useState(0);
    const [seguidores,setSeguidores] = useState(0)
    const [displayBottomBar,setDisplayBottomBar] = useState(false);
    const objectUid = useContext(ContextUid);

    const uid = objectUid.uid;
   
    useEffect(() => {
        getUserInfoMain(renderDiffPath,usernameExtra,setMainInfoUser,navigate,location,uid,setSeguidores,setSeguidos,setDisplayBottomBar);
        // no es necesario cargar tanta información de primera mano
    }, [location.pathname]); 

// console.log('nombre',location.pathname.split('/')[3]);
// 1 => location.pathname.split('/')[1]
    return (

    <>
        <>
        {
    (!mainInfoUser || mainInfoUser.length === 0) ?
    !displayBottomBar && <Loader /> :(
<>
<div className="user-profile" >
<div className="nav-profile"  >
    <div className="main-profile"  >
    {!location.pathname.includes('type') ? 

    // Se propone una división donde si no hay imagen se retorna la imagen del userProfile => realmente no haría falta enviarla desde 
    <img src={mainInfoUser.image.index !== 1 ? `https://${mainInfoUser.image.bucket}.s3.eu-west-3.amazonaws.com/${mainInfoUser.image.name}`: `/images/defaultUserImage.jpg`}  alt=""  
    className={location.pathname === '/profile' ? 'image-user-profile': 'image-user-profile active'}
    style={{objectFit:mainInfoUser.image.index !== 1  && `${mainInfoUser.image.style}` }}
    onMouseEnter={()=> {
        setTimeout(()=>{ setBooleanImg(true) },700)
    }}
    onMouseLeave={()=> setBooleanImg(false)}
    onClick={()=> navigate(`/profile/${mainInfoUser.username}/settings/img/select/photo`)}/>
:<img src={mainInfoUser.image.index !== 1 ? `https://${mainInfoUser.image.bucket}.s3.eu-west-3.amazonaws.com/${mainInfoUser.image.name}`: `/images/defaultUserImage.jpg`}  alt=""  
 className="image-user-profile" /> 
}
    <div className="username-profile">
        {!location.pathname.includes('type') ? mainInfoUser.username: usernameExtra}
    </div>
    {booleanImg && <span className="mouseover-change-img">change image</span>}
    </div>

    {/* Seguidores /Seguidos */}
    <div className="social-profile">
        {['followers','following'].map((item,index)=>(
            <div className={item} key={index} onClick={!location.pathname.includes('type') ? ()=> navigate(`/profile/${item}`) : ()=>navigate(`/profile/users/${mainInfoUser.username}/${item}`)}>
                <h4>{item}</h4>
                <span>{index === 0 ? seguidores : seguidos}</span>                            
            </div>
        ))}
        </div>
      

    {!location.pathname.includes('type')?  
    <>
    <HiDotsVertical  className={optionsMessage ? 'dot-vet-profile active':"dot-vet-profile"}  onClick={()=> setOptionsMessage(!optionsMessage)} />


     {/* <OptionMessage param={optionsMessage}  render={100} onClick={()=> navigate(`/${usernameExtra}/saved/posts`)} getNews={()=> navigate(`/${usernameExtra}/added/posts/topnews`)}/> */}
    </>
    :
     <Seguir booleanProfile={true} username={location.pathname.includes('/profile/users') ? location.pathname.split('/')[3] : location.pathname.split('/')[1]} handleCLick={()=> addCountFromFollowers(setSeguidores,seguidores,follow,setFollow)} setFollowFromProfile={setFollow} /> 
}
    </div>
    {/* BODY */}
    <div className="body-profile">
    <NavbarOptionsProfile isProfile={!location.pathname.includes('type') ? true : false} username={usernameExtra} />
    <Outlet/>
    </div>
    </div> 



</>
  )}
 </>
<>
{displayBottomBar && <BottomNotifBar   successfullOption={0}
navigate={navigate}  booleanForProfile={true}/>}
{optionsMessage && <BottomNotifBar displayOptionsRepost={true}   successfullOption={3}
navigate={navigate}   isProfileOptions={true} outlineBookmark={<HiOutlineBookmark />} username={usernameExtra}/>} 
</>
</>

         )
}


const MainInfoProfile = ()=>{
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [mainUser,setMainUser] = useState([]);
    const location = useLocation();
    const usernameExtra =  getUsernameFromPath(location);
    const renderDiffPath = location.pathname.includes('type') ? true : false

    useEffect(()=>{
        renderAboutUser(renderDiffPath,usernameExtra,setUser,setMainUser,true)},
         []);
   
const onRedirect = (index,params)=>{
    if(index === 0){
        navigate(`/country/${params}`);
    } else if(index === 1){
        navigate(`/region/${params}`);
    } else{
        navigate(`/city/${params}`)
    }
}

    return (
             <>
                {/* 1 USUARIO */}
                <div className="content-body-profile"  >
            {user && 
            <>
            {(user[0].description !== '' && user[0].description) && (
                <ul className="about-me" style={{marginBottom:user[0].state === '' && '30px'}}>
                    <li>
                    {user[0].description.split('\n').map((line, index) => (
                   <>
                   {index > 0 && <br /> } 
                   {/* {index > 0 && <br /> } */}
                   <span>{line}</span>
                 </>
                    ))}
                    </li>
                </ul>
                )}
            
               {(!location.pathname.includes('type') && user[0].state !== '' )? <div className="about-render-state" style={{borderTop:user[0].description === '' ? '1px solid transparent' : '1px solid whitesmoke'}}>
              <span>State:</span>
                 <p>{ user[0].state}</p>
                 {!location.pathname.includes('type') && <Link to={`/${user[0].username}/settings`}>{!user[0].state ? 'No state added, upload a new state!' : 'Change your state' }</Link>}
          </div> : ''}
            </>
                }
                 <ul className="localidades-profile">
                     <span>
                         <HiGlobe style={{fontSize:'18px',position:'relative',top:'4px',left:'-2px',color:'rgba(0, 0, 0, 0.764)'}}/>
                         country,region,city
                         {mainUser.localities && (
                            ['Country','Region','City'].map((item,index)=>(

                                    <>
                                    <li key={index}>
                                    <h4>{item}:</h4>  
                                    <span onClick={()=> onRedirect(index,mainUser.localities.render[index].replace(/,/g, ''))}>{ mainUser.localities.render[index].replace(/,/g, '')}</span>
                                    </li>
                                    </>
                            ))
                         )}
                     </span>
                 </ul>
                 </div>
             </>
    )
}


                  




const SettingsProfile = ()=>{

    const location = useLocation();
    const navigate = useNavigate();
    const objectUid = useContext(ContextUid);
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [varState,setVarState] = useState(false);
    const [varDescripc,setVarDescripc] = useState(false);
    const [booleanResultState, setBooleanResultState] = useState(false);
    const [booleanResultDescription,setBooleanResultDescription] = useState(false);
    let setUser;
    const [mainUser,setMainUser] = useState({});
    const [defaultState,setDefaultState] = useState(null);
    const [displayLogOut,setDisplayLogOut] = useState(false);
    const usernameExtra =  getUsernameFromPath(location);
    const renderDiffPath = location.pathname.includes('type') ? true : false
    const [loaderLogOut,isLoadingLogOut] = useState(0);



    useEffect(()=>{
     renderAboutUser(renderDiffPath,usernameExtra,setUser,setMainUser,false,setDefaultState)
    },[]);
    console.log({
        renderDiffPath:renderDiffPath,
        usernameExtra:usernameExtra,
    })

    const onChangeState = (text)=>{
        setState(text);
        if(text.length > 0){
            setVarState(true);
        } else{
            setVarState(false);
        }  
   };
   const onChangeDescription = (text)=>{
    setDescription(text);
    if(text.length > 0){setVarDescripc(true)}
    else{setVarDescripc(false)}
};

    const handleSubmitInput = (url,text,setText,setBoolean,event)=>{  
        if(text.length === 0){
            event.preventDefault();//esto no lo puede leer;
        } 
        const uid =  objectUid.uid;
        fetch(url,{
            method : 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify({ uid,text})
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Error on response');
            }
            return response.json();
        })  
        .then(data =>{
            setBoolean(data);
            setTimeout(()=>{
                setBoolean(false);
            },2000)
            setText('');
        })
       
        .catch(err => console.error(err))
        
    };

    const deleteState = ()=>{
        // Estoy copiando y pegando código se podría optimizar
        const uid =  objectUid.uid;
        fetch(`http://localhost:5000/Config/delete/user/state`,{
            method : 'POST',
            headers: {'Content-type':'application/json'},
            //Con saber el country(islOcalidades === country) ya es parámetro de localidades
            //También se deben de poder borrar comentarios;
            body: JSON.stringify({ uid})
        })
        .then(response => response.json())
        .then(data =>{
            if(data === 1){ 
                setBooleanResultState(true)
                setTimeout(()=>{
                    setDefaultState(null);
                },1500)
                setTimeout(()=>{
                    setBooleanResultState(false);
                },3000)
            }else{
                console.log('error updating state,user have no state')
            }
            
        })
        .catch(err => console.error(err))
    }

    const handleLogOut = ()=>{
        isLoadingLogOut(1)
        fetch('http://localhost:5000/Config/log/out',{
            credentials:'include',
            method:'POST'
        })
        .then(response => response.json())
        .then(data => {
            const {boolean,message} = data;
         if(boolean){
            navigate('/auth/login')
         }else{
            const alert = message ? message : 'Error loggin out'
            alert(alert)
         }
        })

        .finally(() =>{
            isLoadingLogOut(2);
        })

    }

    return (
        <>
        <div className="settings-profile" >
            {Object.keys(mainUser).length > 0 && <div className="setting-about-me" >
                    {Object.keys(mainUser).map((key)=>(
                       <div className="container-sett-grp-opt" key={key}>
                       <h4>{mainUser[key].name}:</h4>
                       <span>{mainUser[key].render}</span>
                   </div>
                    ))}
            </div>}
            <div className="setting-state" style={{height:defaultState ? '110px' : '50px'}}>
            {defaultState && 
                <>
                <label>State</label>
                    <div className="content-state"><span style={{marginLeft:'4px'}}><b>{defaultState}</b></span><div className="sbm-state-prf"><button className="btn-sbm-state trash" onClick={deleteState}>Delete</button></div></div>
                </>
                    }
                <label>Change State</label>
                <div className="input-group-state">
                <input type="text" onChange={(e)=> onChangeState(e.target.value)} maxLength={30}/>
                { varState && <span className='coal-count-state'>{state.length}/30</span>}
                <div className="sbm-state-prf">
                <button className="btn-sbm-state" onClick={()=>(handleSubmitInput('http://localhost:5000/config/set/userprofile/state',state,setState,setBooleanResultState))} >Change State</button>
                </div>
                </div>
                {booleanResultState && 
                        <BottomNotifBar   successfullOption={2}
                        shortPost={2}
                        outlineReply={ <IoIosCheckmarkCircleOutline  style={{color:'gray;',position:'relative',left:'-3px',top:'5px',fontSize:'22px'}} />}/>
                
                }

                {loaderLogOut === 1 &&  <Loader />}

            </div>
            <div className="setting-description"  style={{marginTop:defaultState ? '82px': '72px'}}>
                <label>Description</label>
                <textarea name="" id="" cols="20" rows="10" maxLength={100} onChange={(e)=> onChangeDescription(e.target.value)}></textarea>
                <div className="sett-descr-tools">
               { varDescripc && <span className="coal-count-description">{description.length}/200</span>}
                {booleanResultDescription &&                        
                 <BottomNotifBar   successfullOption={2}
                        shortPost={3}
                        outlineReply={ <IoIosCheckmarkCircleOutline  style={{color:'gray;',position:'relative',left:'-3px',top:'5px',fontSize:'22px'}} />}/>}
                </div>
                <button  onClick={()=>(handleSubmitInput('http://localhost:5000/config/set/userprofile/description',description,setDescription,setBooleanResultDescription))}>Update</button>

            </div>
            <div className="sett-log-out" onClick={()=> setDisplayLogOut(true)}>
            <HiLogout />
           <span>Log Out</span>
                </div>
                
            {/* <Link to={'/auth/login'} id="chan-loc-prof">- Change country, region ,city...</Link> */}
            {displayLogOut && <div className="log-out-alert-message">
                    <h3>Are you sure you want to close this session?</h3>
                    <div className='container-options-boolean-logout'>
                     <span style={{backgroundColor:'lightgray',color:'white'}} onClick={handleLogOut}>Yes</span>
                     <span onClick={()=> setDisplayLogOut(false)}>No</span>
                    </div>
                    </div>}
        </div>
        </>
    )
}

export {Profile,SettingsProfile,MainInfoProfile}

