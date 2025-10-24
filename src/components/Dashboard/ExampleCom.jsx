// import ContentMessage from '../Dashboard/MessageForm/ContentMessage';
// const ExampleComponent = ()=>{
//     const arr= [
//         'HOALALALALA',
//         'la verdad es que el musculo isquitibial es uno de los mejores para entrenar y luego en un un futuro tendría que repararse para ver si Bale podría jugar pero puede ser que aun así no juegue',
//         'El decrecimiento de la natalidad en Castilla y león está tocando unos límites nunca antes vistos,dicho por nuestro presidente  #locura de comercio',
//         'KOKOKOKOKOK  #templete #ciendecien #once',
//         'newReply to Spain',
//         'Post for Italy => render in Trento,Trentino-Alto-Adigio and Italy of course',
//         'Este segundo post va dirigido para nanogrifo 12:48',
//         'Ahora la vida es así #locura  #mio #cuando #pedrito #locura',
//         'esto es pasión .... #enpasionados #luchando #siempre #pedrito #enpasionadosundefined',
//         'a osea que si acabas con algo se mete como undefined #loquesea #undefined #locura #enpasionadosundefined #loqueseaundefined',
//         'Pues de locos beba',
//         'ahoraa??'
import { useState } from "react";
import {HiOutlineReply,HiOutlineHeart,HiOutlineEye,HiDotsVertical,HiOutlineBookmark} from 'react-icons/hi';



const ExampleCOm = ()=>{
    // useEffect( ()=>{

    //   setText(text);
    //   isLoading(true);
    // //   fetchingData().then(data =>{
    // //     console.log('esta es la imagen',data);
    // //   })
    // },[])
    

    const [text,setText] = useState('');
    const renderTextWithHashtags = (text) => {
        // Dividir el texto en palabras
        const words = text.split(' ');
        // const reversedArr = words.reverse();
        console.log(words,'words')
        // Mapear las palabras y aplicar estilos
        return words.map((word, index) => {
          if (word.startsWith('#')) {
            return (
              <span
                key={index}
                className="coloured-item"
                // onClick={(event) => onRedirectTo(word,navigate, event)}
                style={{ color: '#1877F2', cursor: 'pointer'}} // Aplicar estilos directamente
              >
                {word}{' '}
              </span >
            );
          } else {
            return <span key={index} style={{color:'#000',fontFamily:'Verdana, Geneva, Tahoma, sans-serif' ,fontSize:'13px'}}>{word} </span>;
          }
        });
      }; 
    return(
<>
;


<div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
  {/* Reply */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      transition: "background 0.3s",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => (e.target.style.background = "#E0E0E0")}
    onMouseLeave={(e) => (e.target.style.background = "transparent")}
  >
    <HiOutlineReply size={24} color="inherit" />
  </div>

  {/* Repost */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      transition: "background 0.3s",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => (e.target.style.background = "#E0E0E0")}
    onMouseLeave={(e) => (e.target.style.background = "transparent")}
  >
    <HiDotsVertical size={24} color="inherit" />
  </div>

  {/* Like */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      transition: "background 0.3s",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => (e.target.style.background = "#E0E0E0")}
    onMouseLeave={(e) => (e.target.style.background = "transparent")}
  >
    <HiOutlineHeart size={24} color="inherit" />
  </div>

  {/* TN */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      transition: "background 0.3s",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => (e.target.style.background = "#E0E0E0")}
    onMouseLeave={(e) => (e.target.style.background = "transparent")}
  >
    <HiOutlineBookmark size={24} color="inherit" />
  </div>

  {/* Views (Impresiones) */}
  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
    <span style={{ fontSize: "16px", fontWeight: "bold", color: "inherit" }}>1.2K</span>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        transition: "background 0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.target.style.background = "#E0E0E0")}
      onMouseLeave={(e) => (e.target.style.background = "transparent")}
    >
      <HiOutlineEye size={24} color="inherit" />
    </div>
  </div>
</div>;



<div className="content-new-short-post " style={{backgroundColor:'red',}}>
{/* <ContentMessage  text={'El seundo dia fue le mejor para ir por ahi'}  renderTextWithHashtags={renderTextWithHashtags}/> */}
        </div>
        <textarea value={text} onChange={(e)=> setText(e.target.value)} style={{width:'300px',height:'70px',position:'relative',top:'70px',backgroundColor:'transparent',color:'transparent',border:' 1px solid transparent'}}/>
         <div className="content-new-short-post " style={{width:'300px',height:'70px',border:'1px solid whitesmoke'}}>
         {/* <ContentMessage  text={'El seundo dia fue le mejor para ir por ahi'}  renderTextWithHashtags={renderTextWithHashtags}/> */}
          {renderTextWithHashtags(text)}
        
        <img style={{width:'25px',height:'25px'}} src="https://example-bucket-javier-new.s3.eu-west-3.amazonaws.com/profilleImage.jpg">
        </img>
                         </div>
</>
    )

}


export default ExampleCOm;