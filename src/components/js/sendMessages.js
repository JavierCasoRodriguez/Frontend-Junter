//importar varias funciones que se usan tanto en el long  como short message

const fetchUserData  = (setData,localities,loader)=>{
     fetch('http://localhost:5000/messages/posts/get/user/data',{
         headers:{
             'Content-type':'application/json'
         },
         credentials:'include'
     })
     .then(response => response.json())
      .then(result =>{
        //  const {data,uid} = result;
         const {username,state,country,region,city,img} = result[0];
         console.log(result[0],'ggg');
         setData({
            username:username,
            state:state,
            img:img,
            // uid:uid,
         });
         if(localities){
           localities([country,region,city,'JUNTER'])
         }
     })
     .catch(error => {
         console.error("Error:", error);
     })
     .finally(()=>{
      loader(false);
     });    
}


const handleChangeTextLocalities = (index,length,country,region,city,navigate)=>{
    if(index === 0){
      navigate(`/new/post/format/${length}/${country}`);
    } else if(index === 1){
      navigate(`/new/post/format/${length}/${country}/${region}`);
    } else if(index === 2){
      navigate(`/new/post/format/${length}/${country}/${region}/${city}`);
    }  else{
      navigate(`/new/post/format/${length}`)
    }
  }

  const handleDecodedTextUri = ()=>{
    const path = location.pathname.split('/').splice(-1).join();
    const decodedPath = decodeURIComponent(path);
    return decodedPath;
  };


  async function insertRelevantWords(text,idPost,lang) {
    try {
      const response = await fetch('http://localhost:8000/relevant/words/toolkit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text:text,
          id_post:idPost,
          lang:lang
        })
      });
  
      if (!response.ok) {
        throw new Error(`Error al insertar: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log('Inserción exitosa:', result);
      return result;
    } catch (error) {
      console.error('Error en insertRelevantWords:', error);
    }
  }
  


  const activateInput = (fileInputRef) => {
    fileInputRef.current.click(); // Activa el input oculto al hacer clic en el div
  }
  const handleImageUpload = (setImage,image,selectedIndex) => (event) => {
    //El short post va sin  imagen principale => los 2 primeros null,null
    console.log(image)
    console.log('indice',selectedIndex);
    console.log(image ? 'es verdadero' : 'es falso')
    const file = event.target.files[0];
    // console.log('file',file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
       if(image){
        if(image.image.length > 0){
          console.log('tira este de aqui si no me equivoco');
          setImage((prev)=> (
            {
              ...prev,
            [selectedIndex] : {
              image: [...image.image, reader.result]
            }
          }
          ))
        }else{
          setImage( //se sobrescribe directamente
            {
             [selectedIndex]:{
               image:[reader.result]
             }
            }
             )
        }
       }else{
        console.log('tirará por aquí');
        setImage((prev)=> (
          {
            ...prev,
          [selectedIndex] : {
            image: [ reader.result]
          }
        }
        ))
      }};
      reader.readAsDataURL(file);
    }
  };

  
   


  const getActualPathForLocalities = (path,boolean)=>{
    const defaultPath = ['/new/post/format/long','/new/post/format/short','/'];
    console.log(path,'path');
    if(defaultPath.includes(path)){
      return [];
    } else{
      if(boolean){
        const arrLocalities = path.split('/');
        const result  = arrLocalities.map(item => decodeURIComponent(item));
        result.splice(0,2)
        return result;
      }else{
        const localities = path.split('/format')[1];
        const arrLocalities = localities.split('/');

         const result  = arrLocalities.map(item => decodeURIComponent(item));
        result.splice(0,2)
        return result;
      }
  
    }
  }

  const removeHashes = (text) => {
    return text.replace(/#(\w+)/g, '$1');
  };
  const handleChangeInputTag = (target,setDisplayContent,setInputHash,setData,setLoading)=>{
    if(target.value.length > 0){
      setInputHash(target.value);
      // setCopiaInputHash(target.value)
      setDisplayContent(true);
      const text = removeHashes(target.value);
      

        fetch(`http://localhost:5000/trends/fetching/tags/search?q=${text}`)//RUTA QUE HARÍA REFERNCIA A UN SEARCH => SIN ALGORITMO
        .then(response => {
           if(!response.ok){
            console.error('error')
            }
            return response.json()
          })
        .then(data => {
          console.log(data);
          setData(data)
        })
        .catch(err => console.error(err))
        .finally(()=> setLoading(false))

      }else{
        setDisplayContent(false);
      }
      }


      // function extractHashtags(text) {
      //   // Expresión regular para encontrar palabras que comienzan con #
      //   const regex = /#\w+/g;
      //   // Aplicar la expresión regular para encontrar todas las coincidencias
      //   const hashtags = text.match(regex);
      //   // Retornar un array con los hashtags encontrados o un array vacío si no hay coincidencias
      //   return hashtags || [];
      // }
      

      const sendTag = (inputTag,setDisplayListTag,setInputHash,setDisplayContentTag,arrTagsTemplate,setArrTagsTemplate)=>{

        // sendTag(inputHash,setDisplayListHashtagg,setDefInputHash,setTag,arrTagsTemplate,setArrTagsTemplate)}>Send tag</div>

        // const listTags = extractHashtags(inputTag);
        // console.log('list tags',listTags);
        // if(listTags.length > 0){
            // los datos que se van a ver debajo del post #locura #berlin
    //  setInputHash(listTags.join(' '));
     //para que se vean la lista de tags
     setDisplayListTag(true);
     //para que se deje de ver los tags
     setDisplayContentTag(null)
     setArrTagsTemplate([])
        // }
        setInputHash(arrTagsTemplate.join(' '));
        setDisplayListTag(true);
      }
 

//   const sendTag = (inputTag,setDisplayListTag,setInputHash,setDisplayContentTag,arrTagsTemplate,setArrTagsTemplate,setCopiaInputHash)=>{
//     console.log({
//       inputTag :inputTag,
//       // setDisplayListTag:setDisplayListTag
//       arrTagsTemplate:arrTagsTemplate
//     })
//     const arrayIndex =  inputTag.split(' ')
//    const data = [];
//      for(let i = 0; i < arrayIndex.length; i++) {
//        if(arrayIndex[i].startsWith('#')){
//         //  data.push(arrayIndex[i])
//         data.push(arrayIndex[i]);
//        }
//    }
//    console.log('arrTagsTemplate',arrTagsTemplate);
//    if(arrTagsTemplate.length > 0){
//     arrTagsTemplate.forEach(item =>{ data.push(item)})
//    }
//    //verifica que el código es mayor que 0 par enviarlo
//    if(data.length > 0){
//      //quitar los duplicados,los que sean solo '#' y los que sean solo ''(vacios);
  
//      const specialCharacters = ['#', '@', '$', '%', '&', '*', '!', '?', '+', '=', '<', '>', '^', '~', '/', '\\', '|', '{', '}', '[', ']', '(', ')', ':', ';', '.', ',', '"', '\''];
//     const dataWithoutDuplicates =  data.filter((item,index)=> {
//       if(data.indexOf(item) === index && item.length > 0 && !specialCharacters.includes(item)){
//         return item;
//       }
//      });

//      //los datos que se van a ver debajo del post #locura #berlin
//      setInputHash(dataWithoutDuplicates.join(' '));
//      //para que se vean la lista de tags
//      setDisplayListTag(true);
//      //para que se deje de ver los tags
//      setDisplayContentTag(null)
//      setArrTagsTemplate([])
//      setCopiaInputHash('')
//    }

//  }

 const removeParentHashtagg = (setDisplayListHashtagg,setInputTagDef)=>{
  setDisplayListHashtagg ? setDisplayListHashtagg(false) : null;
  setInputTagDef('');
}



// const fetchTrendsTags = async (text)=>{
//   try {
//   const response = await fetch(`http://localhost:5000/trends/fetching/tags/search?q=${text}`);
//        if (!response.ok) {
//        throw new Error('Error al obtener los datos');
//   }
//   const data = await response.json();
//     return data;
//   }   catch (error) {
//     console.error('Server Internal Error', error);
//   }
// }
// const [thread,setThread] = useState(false);
const newThread = (setThread,setCounterThread,counterThread)=>{
  setThread(true);
  if(counterThread.length === 0){
    setCounterThread([1]);
  }else if(counterThread.length > 20){
    'HOLA'//ENVIAR UN MENSAJE DE QUE ES DEMASIADO LARGO;
  }
  else{
    setCounterThread((prevArray) => [...prevArray, prevArray[prevArray.length -1 ] + 1]);

  }

}

const deleteItemThread = (setInput,setCounterThread,index)=>{
  console.log({
    index:index,
    indexTr:index !== 0 ? true : false
  })
if(index !== 1){
  setInput((prev) =>{
    const newObje = {...prev};
    delete newObje[index];
    return newObje;
   })
   setCounterThread((prevArr)=> prevArr.slice(0,-1));
 
}
}



          // (e)=> sendThread(input,inputThread,uid,location.pathname,defInputHash.split(' '),false,setInput,setDisplayListHashtagg,setDefInputHash,setResult,setDisplaySuccess,setInputThread,setCounterThread,null,e): 

const sendThread = async (inputThread,uid,path,tags,isFastPost,setDisplayListHashtagg,setDefInputHash,setResult,
  setDisplaySuccess,setInputThread,setCounterThread,
  //A partir de aqui =>INTERFAZ(FAST)
  setItem,username,userImage,time
  ,e)=>{


  const localities = getActualPathForLocalities(path,true);
  
  //MAL => renderiza el inputThread con un item vacio nose porque;
  const keys = Object.keys(inputThread);
  const contentThread = keys
  .map(item => inputThread[item]?.trim())         // Limpia espacios
  .filter(text => text && text.length > 0);       // Filtra vacíos
  
  // contentThread.unshift(inputValue);
  
  console.log({
    inputThread : inputThread,
    content:contentThread
  })
  //console.log(contentThread,uid,localities,tags);
  contentThread.forEach(item =>{
  if(item.length === 0){
    e.preventDefault();
    //agregar el porque no se envia el thread;
  }
})

console.log(contentThread,uid,localities,tags,isFastPost);
try {
  const response = await fetch('http://localhost:5000/messages/send/thread', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ contentThread,uid,localities,tags,boolean:isFastPost}) 
    // body: JSON.stringify({ data }) 
  });
  if (!response.ok) {
    throw new Error('Error al enviar los datos');
  }else{
    const data = await response.json();
    const {firstIdPost,boolean} = data;
    if(!isFastPost && boolean){ //sería lo relativo para el short message y acierto;
      console.log('tiro por 1')
      // setInput('');
      setInputThread({
        1:''
      })
      setCounterThread(['']);
      setDisplayListHashtagg(false);
      setDefInputHash('');//antes lo había puesto asi setDefInputHash([]);
      setResult(true);
      setDisplaySuccess(true);

    }else if(!isFastPost && !boolean){
      setResult(0) 
      setCounterThread([]);
    } else if(isFastPost && boolean){
      // setMargBott('80px')
      console.log('tiro por 3')
      setCounterThread([]);
      setInputThread({1:''})
      setResult(1);//haría referencia a setAlert;
    setTimeout(() => {
      setResult(null);
    },2000)


  setItem(prevPosts => {
              const newPost = {
                key: firstIdPost,
                id_message:firstIdPost, // Asegurar que ID está presente
                username:username,
                img:userImage,
                content: contentThread[0],
                likes: 0,
                tn: 0,
                repost: 0,
                replies: 0,
                country:localities[0],
                region:localities[1],
                city:localities[2],
                long: false,
                userid: uid,
                time,
                thread: false
              };

              console.log("Nuevo post a insertar:", newPost);
              return [newPost, ...prevPosts];
            });


    
    }

    

  }
} catch (error) {
    // setDisplay(false);
    console.error('Error:', error);
} 
}

// const sendMessage = async (text,username,state,uid,tags,event) => {
//   const localities = getActualPathForLocalities(location.pathname);
//     const data ={text,username,state,uid,localities,tags};
//     if(text.length === 0){
//         event.preventDefault();//esto no lo puede leer;
//     }
//     try {
//       const response = await fetch('http://localhost:5000/messages/send/post/short', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({ data }) 
//       });
//       if (!response.ok) {
//         throw new Error('Error al enviar los datos');
//       }else{
//         const data = await response.json();
//         // data ? setResult(!result): result;
        
//         if(data === 0){
//           setResult(!result)
//         } else if(data ===1){
//           setInput('');
//           setDisplayListHashtagg(false);
//           setDefInputHash([]);
//         }
        

//       }
//     } catch (error) {
//         setDisplay(false);
//         console.error('Error:', error);
//     } 
//   };



export  {fetchUserData,handleDecodedTextUri,handleChangeTextLocalities,getActualPathForLocalities,handleChangeInputTag,sendTag,removeParentHashtagg,newThread,deleteItemThread,sendThread,handleImageUpload,activateInput,insertRelevantWords};