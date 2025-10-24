const SmallLoader = ({style,boolean})=>{
    return (
      <div className={boolean ? 'loader-small lg' :"loader-small"} style={style}></div>
    )
  }

  export default SmallLoader;