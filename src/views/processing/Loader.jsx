

function Loader() {
  const loader = {text:['.','.','.'],className:['first','second','third']}
    return (
        <div className="set-loading true">
          <ul>
            {loader.text.map((element,index)=>(
              <li key={index} id={loader.className[index]}><span>{element}</span></li>
            ))}
          </ul>
        </div>
    )
}



export default Loader;