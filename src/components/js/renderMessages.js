const filterDataByFrame = (rows, setMainRenderItem, setSecond,setSmallRender,setThird,boolean) => {
    const posts = Object.keys(rows);
    const numberPosts = posts.length;
    console.log(numberPosts,'number of Posts');
    //Se peta en el setTimeStorage(poner un boleano o algo) por ahora quitarlo;
   

      if(numberPosts < 50){
        setMainRenderItem(rows);
        //si tiene menos de 50 como el caso de una ciudad pequeña, no se mete nada más
        console.log('smrender es true');
        if(boolean){
            setSmallRender(true);
        }
      }else{
        //lo tienes que dividir en 3 tercios
        console.log('donde se peta');
        const firstAmount = Math.floor(numberPosts / 3);
        const secondAmount = Math.floor((numberPosts - firstAmount) / 2);
        
        // Divide los posts en tres tercios
        const firstThird = posts.slice(0, firstAmount);
        const secondThird = posts.slice(firstAmount, firstAmount + secondAmount);
        const thirdThird = posts.slice(firstAmount + secondAmount); 

          setMainRenderItem(getPostsByFrame(rows, firstThird));
          setSecond(getPostsByFrame(rows, secondThird));
          setThird(getPostsByFrame(rows, thirdThird));
      }
  };

  const getPostsByFrame = (rows,arr)=>{
   return  arr.map(element => rows[element]);

  }

  const fetchingData = async  (url,token
    // ,isLoading
  )=>{
    // const localSearch = location.search.split('=')[1];
    // const url = `http://localhost:5000/messages/render/junts/posts/news/${localSearch}`;
    
    try {
      const response = await fetch(url,{
        headers: { 'Authorization': `Bearer ${token}`},
      });
          if (!response.ok) {
          throw new Error('Error al obtener los datos');
      }
        const data = await response.json();
        return data;
      }   catch (error) {
        console.error('server internal error:', error);
      }
      finally{ //en teoría con ReactQuery puedo eliminar este parámetro
        // isLoading(false);
      }
    }


      //REFERENCIA => AQUELLOS CASOS DONDE SALE EL LOADING PARA ABAJO;
      const getMorePosts = (setItem,secondItemShoMore,thirdPosts,counterForRender,setCounterForRender,setSecondIsLoading,url,token,isLoading)=>{
        // setActiveFastLoader(true);
        // setDisplayMore(false);
        setSecondIsLoading(false);
        setCounterForRender(counterForRender +1);
        if(counterForRender === 1){
          const firstRenderPosts = secondItemShoMore.slice(0, Math.round(secondItemShoMore.length / 2));
          setSecondIsLoading(true);
          setTimeout(() => {
            setItem((prevItems) => [ ...prevItems,...firstRenderPosts]);
          }, 1200);
          // return <MappedPosts item={firstRenderPosts} backgroundColor='red' iteractions={userIteractions} listFollowing={listFollowing} />;
        }else if(counterForRender === 2){
          setSecondIsLoading(true);
          setTimeout(() => {
            setItem((prevItems) => [ ...prevItems,...thirdPosts]);
          }, 1000);
          //Por ahora sto funciona pero habría que camiar el enfoque;
          // return <MappedPosts item={secondItemShoMore} backgroundColor='violet' iteractions={userIteractions} listFollowing={listFollowing}/>;
        } else{
         fetchingData(url,token,isLoading)
         //aqui el Loader es real;
          // .then(data =>{
          //   if(data.index === 1){
          //     navigate(`/chat/external/${params}/${defaultLocality}`)
          //   } else if(data.index === 0){
          //     setItem('not matched');
          //   } else{
          //     // if(boolean){ sería la va
          //     // La función de llamar a más posts pero no funciona; 
          //   }
          // });
        }
    }


    // const renderTextWithHashtags = (text) => {
    //   // Dividir el texto en palabras
    //   const words = text.split(' ');
    
    //   // Mapear las palabras y aplicar estilos
    //   return words.map((word, index) => {
    //     // Si la palabra empieza con '#', la renderizamos en azul
    //     if (word.startsWith('#')) {
    //       return <span key={index} className="coloured-item">{word} </span>;
    //     } else {
    //       return <span key={index}>{word} </span>;
    //     }
    //   });
    // };

export {filterDataByFrame,fetchingData,getMorePosts};
