// import {FormatearTexto} from './ContentMessage';
// import { renderTextWithHashtags } from "../../js/renderMessages";


function ContentLongMessage({contentLong,tittle}) {
    
    const renderTextWithHashtags = (text) => {
        // Dividir el texto en palabras
        const words = text.split(' ');
      
        // Mapear las palabras y aplicar estilos
        return words.map((word, index) => {
          // Si la palabra empieza con '#', la renderizamos en azul
          if (word.startsWith('#')) {
            return <span key={index} className="coloured-item">{word} </span>;
          } else {
            return <span key={index}>{word} </span>;
          }
        });
      };
    return (
        <div className="cnt-msg-format-Long" style={{ whiteSpace: 'pre-wrap'}}>
            <div className="titt-for-lg">
                {tittle}
            </div>
            <div className="cnt-for-lg">
            {/* {<FormatearTexto texto={content} boolean={true} />} */}
            {contentLong}
            </div>

            
        </div>
    )

}
export default ContentLongMessage
