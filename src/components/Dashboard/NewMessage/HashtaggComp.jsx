import { useState } from 'react';
import {handleChangeInputTag,sendTag,removeParentHashtagg} from '../../js/sendMessages.js';
import { HiOutlineX } from 'react-icons/hi';
import SmallLoader from '../../../views/processing/FastLoader.jsx';

function HashtaggComp({tag,setDisplayListHashtagg,setTag,setDefInputHash,booleanStyles}) {
    const [displayContentHashtagg,setDisplayContentHashtagg] = useState(false);
    const [inputHash,setInputHash] = useState('');
    // const [copyInput,setCopiaInputHash] = useState(null);
    //se hace una copia porque al enviar los tags
    //a => el remove no funciona bien para el span
    // b => si vuelve a formatear los tags el texto sigue clavado;
    const [isLoading,setLoading] = useState(true)
    const [data,setData] = useState([]);    
    const [showTemplate,setShowedTemplate] = useState(false);
    const [arrTagsTemplate,setArrTagsTemplate] = useState([]);

    const handleTemplate = (text)=>{
      if(!arrTagsTemplate.includes(text) && text.length > 0){
          setShowedTemplate(true);
          setArrTagsTemplate([...arrTagsTemplate,text]);
      } 
    };

    const deleteTemplate = (indexToRemove)=>{
        const newItems = arrTagsTemplate.filter((_,index)=> index !== indexToRemove);
        setArrTagsTemplate(newItems)
    }



    
    return (
        <>
        {tag && 
            <div className={booleanStyles === 'short' ? "tag-sh-body" : "tag-lg-body"}>
              <div className="input-group-tags">
                <textarea type="text" name="" id=""  style={{color: 'black'}}
                onChange={(e)=> handleChangeInputTag(e.target,setDisplayContentHashtagg,setInputHash,setData,setLoading)} 
                placeholder="#footbal,#politics..." 
                // placeholder='tags will now be updated to the first post, not to all the thread'
                />
                
             
                {/* {displayContentHashtagg && ( <div  className={location.pathname.includes('long') ? "txt-input-tags" :"txt-input-tags short"}><span>{formattedTags(copyInput)}</span></div>)} */}
                      {/* <HiPaperAirplane onClick={()=> sendTag(inputHash,setDisplayListHashtagg,setDefInputHash,setTag,arrTagsTemplate,setArrTagsTemplate,setCopiaInputHash)} />  */}
                      <div  className="btn-send-tag" onClick={()=> sendTag(inputHash,setDisplayListHashtagg,setDefInputHash,setTag,arrTagsTemplate,setArrTagsTemplate)}>Send tag</div>
                      {showTemplate &&(
            arrTagsTemplate.length > 0 &&(
                <div className='container-arr-tags-template'  >
                    {arrTagsTemplate.map((item,index)=>(
                          <div key={index} className="clicked-tem-tags">
                         <span className={location.pathname.includes('long') && 'txt-clicked-formatted'}>{item}</span>
                           <HiOutlineX id="x-span-tem" onClick={()=> deleteTemplate(index)}/>
                      </div>
                    ))}
                </div>
            )
           )}
           </div>
                {displayContentHashtagg && <ul className="content-options-query-hashtagg">
                    {
                        isLoading ? (
                            <SmallLoader style={{ border:'3px solid rgb(0, 153, 255)'}} />
                        ) : (
                            (!data || data.length === 0) ? (
                                <><span></span></>
                            ):   (data.map((element,index) => (
                                    <li key={index} onClick={()=> handleTemplate(element.tags)}><h4>{element.tags}</h4><span className={booleanStyles !== 'short' &&  "tag-count-lg"}> {element.count}</span></li>
                                ))
                            )
                        )
                    }
                </ul>}
              </div>}
              </>
        
    )
}


const ListHashtagg = ({defInputHash,displayListHashtagg,setDefInputHash,setDisplayListHashtagg,booleanTag})=>{
console.log('displayListHashtagg',displayListHashtagg);
console.log('defInputHash',defInputHash)
    return (
        <>
        {displayListHashtagg && <div className={booleanTag ? "list-hashtagg-true lg": "list-hashtagg-true"} >
            <span >{defInputHash}</span>
            {/* a una mala para cambiar el color podría bucle de spanes y concatenar con el index  */}
              <HiOutlineX className="cls-ic-hashtagg" onClick={()=> removeParentHashtagg(setDisplayListHashtagg,setDefInputHash)}/>
            </div>}
        </>
    )
}

export { HashtaggComp,ListHashtagg}
