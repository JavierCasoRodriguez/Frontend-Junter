

import Picker from '@emoji-mart/react';
import { MdInsertEmoticon } from 'react-icons/md';

function PickleEmticon({ setPickeVisible, isPickleVisible,pickleSize,parmasForStyles,paramsForEmoticonStyles}) {
  const getClassName = (params)=>{
if(params === 0){
 return 'pickle-icon'
}else if (params === 1){
return 'pickle-icon ft-post'
} else if(params === 2){
  return 'pickle-icon response'
}
else if(params === 3){
return 'pickle-icon replying-card'
}else {
  return 'pickle-icon'
}}

const getEmoticonClassName = (params)=>{
  if(params === 0){
    return ['emoticon-sh', 'emoticon-sh active']
  }else if(params === 1){
    return ['emoticon-sh ft-post','emoticon-sh ft-post active']
  }else if(params === 2){
    return ['emoticon-sh post','emoticon-sh post active']
  }else{
    return ['emoticon-sh', 'emoticon-sh active']
  }
}

const getDefaultClassName = getClassName(parmasForStyles)
const getDefaEmoticonClassName = getEmoticonClassName(paramsForEmoticonStyles)

  
  return (
    <div
      className={isPickleVisible ? getDefaEmoticonClassName[1]: getDefaEmoticonClassName[0]}
      onClick={() => setPickeVisible(!isPickleVisible)}
    //  style={{
    //         // backgroundColor: isPickleVisible ? '#f0f0f0' : 'transparent', // Indicador visual al estar activo

    //  }}
      role="button" // Mejor accesibilidad como botón
      aria-label="Toggle emoji picker"
      title="Seleccionar emoticono"
    >
      {/* Ícono de emoji */}
      <MdInsertEmoticon className={isPickleVisible ? 'pickle-icon active': getDefaultClassName}
        size={pickleSize} // Tamaño del ícono
        // color={isPickleVisible ? '#007BFF' : '#666'} // Color dinámico
      />
    </div>
  );
}


const ContentPickleEmoticon = ({isPickleVisible,setCurrentEmoji,setInput,paramsForStyle,isThread,currentThread})=>{
  const getClassName = (params)=>{
    if(params  === 0){
      return 'pickle-container short'
    }else if(params  === 1){
      return 'pickle-container long'
    } else if(params  === 2){
      return 'pickle-container replying-card'
    } else if(params  === 3){
      return 'pickle-container post'
    }  else if(params  === 4){
      return 'pickle-container ft-post'
    }else{
        return 'pickle-container short'
    }
  }  
  return(
        <>
        {isPickleVisible && <div  className={getClassName(paramsForStyle)}>
        <Picker  onEmojiSelect={(e)=>{
                setCurrentEmoji(e.native);
              if(isThread && currentThread !== 100){
                setInput((prev) =>{
                  console.log('va por aquí')
                  return {
                    ...prev,
                    [currentThread]: prev[currentThread] + e.native,
                };
                })
                }else{
                  setInput((prev) => prev + e.native);

                }
        }} />
            </div>}
        </>
    )
}

export {PickleEmticon,ContentPickleEmoticon};
