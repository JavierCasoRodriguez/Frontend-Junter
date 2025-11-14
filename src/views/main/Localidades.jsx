import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
// import getToken from '../../../src/components/js/verifyToken';

const ErrorElement = ()=>{

    return(
        <div style={{with:'40%',height:'120px',borderRadius:'8px',border:'1px solid lightgray'}}>
            <h1 style={{color:'red'}}>Ha habido un error porfavor intetelo más tarde</h1>
        </div>
    )
}


function Localidades({booleanAuth,setSelectedIndexAuth,uidFromAuth}) {

const navigate = useNavigate();
// const token =   getToken(() => navigate('/auth/login'));
const [error,setError] = useState(false);
  const [data, setData] = useState({
        country:'',
        region:'',
        city:''
    });
 const handleClick = (country,region,city,uid)=>{
        if(booleanAuth){
            if(country.length > 0 && region.length > 0 && city.length > 0){
                setSelectedIndexAuth(2)
            }
        }
        const data ={country,region,city,uid}
        const url = 'http://localhost:5000/config/insert/localidades'
        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            credentials:'include',
            body: JSON.stringify({ data})
        })
        .then(response => response.json())
        .then(data => {
            if(data){
                console.log(data);
     
            if(data){
            booleanAuth ? setSelectedIndexAuth(2) : navigate('/',{ state: { refreshUser: true } })
            }else{
                setError(!error)
            }
        }})
        .catch(error => {
            console.error("Error:", error);
        });    
    }




//EN UN FUTURO PONER DO YOU HAVE ANY PROBLEMS AND DO YOU WANT TO SELECT ANOTHER METHOD => SEARCH 

    return (
        <>
<LocalidadesContent  token={token} navigate={navigate} booleanAuth={booleanAuth} handleClick={handleClick} error={error} setSelectedIndexAuth={setSelectedIndexAuth} uidFromAuth={uidFromAuth} data={data} setData={setData}/>
      <>

      </>
        
        </>
    )
}

const LocalidadesContent = ({booleanAuth,data,setData,handleClick,error,uidFromAuth})=>{
    
    
    const [regions,setRegions] = useState({
        booleanRegion:false,
        listOfRegions:'',
    });
    const [cities,setCities] = useState({
        booleanCity:false,
        listOfCities:''
    });


    const arrayOfCountries = {
        nameEnglish : [
           "Portugal", "Italy", "Poland","Spain", "Greece", "Belgium", "Hungary", 
           "Denmark", "Ireland", "Luxembourg", "Netherlands", "Bulgaria", 
           "Slovakia", "Estonia", "Lithuania", "Malta", "Cyprus", "Austria", 
           "Czech Republic", "Romania", "Germany", "Latvia", "Slovenia", "Finland"
       ],
        nameNative : [
           "Portugal", "Italia", "Polska", 'España',"Ελλάδα", "België", "Magyarország", 
           "Danmark", "Éire", "Lëtzebuerg", "Nederland", "България", 
           "Slovensko", "Eesti", "Lietuva", "Malta", "Κύπρος", "Österreich", 
           "Česká republika", "România", "Deutschland", "Latvija", "Slovenija", 
           "Suomi"
       ]};
   
       const arrayIndexCountries = arrayOfCountries.nameNative.map((element,index) => index)

  


   
    const handleChangeCountries = async (url,e)=>{
        const { name, value } = e.target;
        const newData = { ...data };
        newData[name] = value;
         setData(newData);
        try {
            const response = await fetch(url);
                 if (!response.ok) {
                 throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            const {booleanRegion, list} = data
            setRegions({
                booleanRegion:booleanRegion,
                listOfRegions:list,
            })
            }   catch (error) {
              console.error('Hubo un problema:', error);
            }
        }
    
    
    const handleChangeRegions = async (url,e)=>{
        const { name, value } = e.target;
        const newData = { ...data };
        newData[name] = value;
        console.log(value);
         setData(newData);
        try {
            const response = await fetch(url);
                 if (!response.ok) {
                 throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            const {booleanCity, list} = data
            setCities({
                booleanCity:booleanCity,
                listOfCities:list,
            })
            }   catch (error) {
              console.error('Hubo un problema:', error);
            }
        }
    
        const handleChangeCities  =(e)=>{
            const { name, value } = e.target;
            const newData = { ...data };
            newData[name] = value;
            console.log(value);
             setData(newData);
        }



//Mejorar esto 
const objectLocalities = {
    value :[ 'Country','Region','City'], 
    handleClick : [(e)=> handleChangeCountries(`http://localhost:5000/config/getSelectedCountry/${e.target.value}`,e),
    (e)=> handleChangeRegions(`http://localhost:5000/config/getSelectedRegion/${e.target.value}`,e),
     handleChangeCities],
     className:['country','region','city'],
     render : ['',regions.listOfRegions,cities.listOfCities],
     boolean : ['',regions.booleanRegion,cities.booleanCity]

     
}



    return(
          <div className={booleanAuth ? 'select-localidades-options auth': 'select-localidades-options'} >
            {objectLocalities.value.map((item,index) => (
            <div className="input-group" key={index}>
               <label>{item}</label> 
               <select style={{width:'100%'}} name={objectLocalities.className[index]} id=""  onChange={objectLocalities.handleClick[index]}>
                 <option value="" disabled selected></option>
                 {index  === 0  ? (
                    arrayIndexCountries.map((index)=>(
                        <> <option value={arrayOfCountries.nameEnglish[index]}>{arrayOfCountries.nameNative[index]}({arrayOfCountries.nameEnglish[index]})</option></>
                    ))
                 ): objectLocalities.boolean[index] && objectLocalities.render[index].map(element =>(
                    // Opcion 2
                    <option key={element} value={element}>{element}</option>
                 ))}
                 </select>
            </div>
        ))}

        {!booleanAuth && 
        <div>
            <button className="btn-submit localities"
             onClick={()=> handleClick(data.country,data.region,data.city,uidFromAuth)} style={{marginTop: booleanAuth ? '15px' : '35px'}}
             >Save</button>
            {error ? <ErrorElement /> : null}  
        </div>}
        </div>
    )
}


const EmailLocalidades = ()=>{
    const step = 3;
   
    const [regions,setRegions] = useState({
        booleanRegion:false,
        listOfRegions:'',
    });
    const [cities,setCities] = useState({
        booleanCity:false,
        listOfCities:''
    });


    const arrayOfCountries = {
        nameEnglish : [
           "Portugal", "Italy", "Poland","Spain", "Greece", "Belgium", "Hungary", 
           "Denmark", "Ireland", "Luxembourg", "Netherlands", "Bulgaria", 
           "Slovakia", "Estonia", "Lithuania", "Malta", "Cyprus", "Austria", 
           "Czech Republic", "Romania", "Germany", "Latvia", "Slovenia", "Finland"
       ],
        nameNative : [
           "Portugal", "Italia", "Polska", 'España',"Ελλάδα", "België", "Magyarország", 
           "Danmark", "Éire", "Lëtzebuerg", "Nederland", "България", 
           "Slovensko", "Eesti", "Lietuva", "Malta", "Κύπρος", "Österreich", 
           "Česká republika", "România", "Deutschland", "Latvija", "Slovenija", 
           "Suomi"
       ]};
   
       const arrayIndexCountries = arrayOfCountries.nameNative.map((element,index) => index)

  


   
    const handleChangeCountries = async (url,e)=>{
        const { name, value } = e.target;
        const newData = { ...data };
        newData[name] = value;
         setData(newData);
        try {
            const response = await fetch(url);
                 if (!response.ok) {
                 throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            const {booleanRegion, list} = data
            setRegions({
                booleanRegion:booleanRegion,
                listOfRegions:list,
            })
            }   catch (error) {
              console.error('Hubo un problema:', error);
            }
        }
    
    
    const handleChangeRegions = async (url,e)=>{
        const { name, value } = e.target;
        const newData = { ...data };
        newData[name] = value;
        console.log(value);
         setData(newData);
        try {
            const response = await fetch(url);
                 if (!response.ok) {
                 throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            const {booleanCity, list} = data
            setCities({
                booleanCity:booleanCity,
                listOfCities:list,
            })
            }   catch (error) {
              console.error('Hubo un problema:', error);
            }
        }
    
        const handleChangeCities  =(e)=>{
            const { name, value } = e.target;
            const newData = { ...data };
            newData[name] = value;
            console.log(value);
             setData(newData);
        }


    const objectLocalities = {
    value :[ 'Country','Region','City'], 
    handleClick : [(e)=> handleChangeCountries(`http://localhost:5000/config/getSelectedCountry/${e.target.value}`,e),
    (e)=> handleChangeRegions(`http://localhost:5000/config/getSelectedRegion/${e.target.value}`,e),
     handleChangeCities],
     className:['country','region','city'],
     render : ['',regions.listOfRegions,cities.listOfCities],
     boolean : ['',regions.booleanRegion,cities.booleanCity]

     
}
    return(
         <div className="setup-wrapper">
       
      <div className={'setup-card'}>
            {/* {sendingForm && <div ><FastLoader /></div>} */}

{/* 
        <div className="progress-header">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`}>👤</div>
          <div className={`progress-step ${step >= 2 ? "active" : ""}`}>🌍</div>
          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>🎯</div>
        </div> */}

        <h2 className="step-title">{'Change Localities'}</h2>

        <form  className="setup-form">
          {/* Step 1 */}
     

          {/* Step 2 */}

            <div className="step fade-in">
        {objectLocalities.value.map((item,index) => (
            <div className="input-group" key={index}>
               <label>{item}</label> 
               <select style={{width:'100%'}} name={objectLocalities.className[index]} id=""  onChange={objectLocalities.handleClick[index]}>
                 <option value="" disabled selected></option>
                 {index  === 0  ? (
                    arrayIndexCountries.map((index)=>(
                        <> <option value={arrayOfCountries.nameEnglish[index]}>{arrayOfCountries.nameNative[index]}({arrayOfCountries.nameEnglish[index]})</option></>
                    ))
                 ): objectLocalities.boolean[index] && objectLocalities.render[index].map(element =>(
                    // Opcion 2
                    <option key={element} value={element}>{element}</option>
                 ))}
                 </select>
            </div>
        ))}
            </div>


          {/* Step 3 */}
         
          <div className="form-navigation">
        
            {/* {step < 3 ? (
              <button type="button" className="nav-btn next" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button type="submit" className="submit-btn">
                Finish 
              </button>
            )} */}

            <button type={step  < 4 ? 'button': 'submit'} className={step < 3 ? 'nav-btn next' : 'submit-btn'} >
                {step < 3 ? 'Next →': 'Finish'}
            </button>
          </div>
        </form>
      </div>
    </div>
    )
}


export  {LocalidadesContent,Localidades,EmailLocalidades}
