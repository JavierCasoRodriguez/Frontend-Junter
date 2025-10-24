const formatedTime = (params)=>{
 
    const date  = new Date(params);
    const today = new Date();
    const differenceDates = today - date;
    const minutes  = Math.floor(differenceDates / (1000 * 60));
    const hours  = Math.floor(differenceDates / (1000 * 60 * 60));
    const days  = Math.floor(differenceDates / (1000 * 60 * 60 * 60));
    const seconds  = Math.floor(differenceDates /1000);

    if(minutes < 1){
      return `${seconds}s`
    } else if(minutes < 60){
      return `${minutes}m`
    }
     else if(hours < 24){
    return `${hours}h`
    }
    else if(days < 5){
      const result = days == 0 ? 1 : days;
      return `${result}d` 
    }
    else{
      return  date.toISOString().split('T')[0];
    } 
    
    // return differenceDates;
    
        }

        const getDefaultPostLocality = (country,region,city,location) =>{
            if(location.pathname.startsWith('/city')){
             return '';
            } 
            const arrLocalidades = [country,region,city]
            const filteredData = arrLocalidades.filter(item => item !== null);
            if (filteredData.length > 0 && decodeURIComponent(location.pathname.split('/')[2]) === filteredData[filteredData.length - 1] ) {
                return null;
            }else if(filteredData.length > 0){
                const data = {
                    index:filteredData.length,
                    result:filteredData[filteredData.length -1]
                }
                return data
            }else{ return null;}}

            const redirectToLocality =(object,navigate)=>{
                let params;
                if(object.index === 1){
                    params = 'country'
                   }else if(object.index === 2){
                    params = 'region'
                   }else if(object.index === 3){
                    params = 'city'
                   }
                   navigate(`/${params}/${object.result}`);
            }

            const localityDef = (response)=>{
              if(response){
                const def = ['country','region','city'].map((item,index) => response.is_localidades === item && [response.country,response.region,response.city][index]);
                return def;
              }
             }


             function generarIdMessage(n) {
              const randomBytes = crypto.getRandomValues(new Uint8Array(n));
              return Array.from(randomBytes)
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('');
            }

            const  getArtificialDate = ()=>{
              const date = new Date();
              const isoDate = date.toISOString();
              return isoDate;
            }
  
        export  {formatedTime,getDefaultPostLocality,redirectToLocality,localityDef,generarIdMessage,getArtificialDate};