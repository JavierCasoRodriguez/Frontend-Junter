import  { useState,useEffect } from "react";
import Navbar from '../../../views/Nav';
import FastLoader from '../../../views/processing/FastLoader';
import {fetchingData} from '../../js/renderMessages';
import { useQuery } from '@tanstack/react-query'



export default function TrendsPage() {
  
  // const [loader,setLoading] = useState(true);
  const [loaderContent,setLoadingContent] = useState(true);
  // const [selectedCountry,setSelectedCountry] = useState('');
  // const [defaultCountry,setDefaultCountry] = useState('');
  const [item,setItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Trending in Junter');
  
   const { data,isLoading } = useQuery({
    queryKey: ['mainTrendsSrch', 'http://localhost:5000/trends/user/localities/general'],
    queryFn: () => fetchingData('http://localhost:5000/trends/user/localities/general'),
    staleTime: 1000 * 60 * 5,
    // enabled: !!token // Evita que corra si no hay token
  });


const selectedCountry = data ? data.selected : '';
const defaultCountry = data ?  data.ip : '';  
  
  
  
  const prefix = 'Trending in';
  let categories = ["For You", 
    `${prefix} Junter`,
    "Top News",
    // `${prefix} Sports`,
    // `${prefix} Politics`,
    // `${prefix} Entertainment`,
    `${prefix} ${defaultCountry}`,
    `${prefix} ${selectedCountry}`,
    //  `${prefix} Health`,
    //  `${prefix} Finances`,
    //  `${prefix} Technology`,
    //  `${prefix} Lifestyle`,
      'Long Posts', '# Tags'];
  //El orden  probablemente haya que cambiarlo;
  if (defaultCountry === selectedCountry) {
    categories = categories.filter((item, index) => 
      item !== `Trending in ${selectedCountry}` || index === categories.indexOf(`Trending in ${selectedCountry}`)
    );
  }



  const getDefaultUrl = (selectedOption) => {
    const staticUrls = {
      'For You': 'http://localhost:5000/trends/main/suggest',
      'Trending in Junter': 'http://localhost:5000/trends/all/posts',
      'Top News': 'http://localhost:5000/trends/based/news',
      'Long Posts': 'http://localhost:5000/trends/all/posts?filter=long',
      '# Tags': 'http://localhost:5000/trends/search/tags'
    };
  
    if (staticUrls[selectedOption]) {
      return staticUrls[selectedOption];
    }
  
    if (selectedOption === `Trending in ${selectedCountry}`) {
      return `http://localhost:5000/trends/locality/${selectedCountry}`;
    }
  
    if (selectedOption === `Trending in ${defaultCountry}`) {
      return `http://localhost:5000/trends/locality/${defaultCountry}`;
    }
  
    // Fallback
    return 'http://localhost:5000/trends/user/localities/general';
  };
  


 

useEffect(() => {
  const url = getDefaultUrl(selectedCategory);

  console.log('URL generada:', url);
  console.log(selectedCategory);
  setLoadingContent(true);
  setItem([]);
  fetchingData(url).then(data => {
    
    console.log('Data recibida:', data);
    if (data) {
      setItem(data);
      setLoadingContent(false);
    }
  });
}, [selectedCategory]);


  return (
    <div  className="cont-trends-page-general"
    // style={{ padding: '5px', width: '100%',margin: '0 auto',posiiton:'relative'}}
    >
     <Navbar  query={'Trending'}/>
{!isLoading &&  (
     <div className="labels-trends-gen" style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        height: '50px',
        alignItems: 'center'
      }}>
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: selectedCategory === cat ? '2px solid gray' : '1px solid #ccc',
              backgroundColor: '#fff',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              color: cat === '# Tags' && '#1877F2',
              boxShadow: selectedCategory === cat ? '0 2px 6px rgba(30, 58, 138, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
          >
            {cat}
          </button>
        ))}
      </div>
)   }

<div  className="cnt-general-trends">
    {loaderContent ? 
    <FastLoader />
    : item &&  item.map((item, index) => (
      <div className="item-trending" key={index}>
      <div className={`item-name ${(selectedCategory === '# Tags' || item.word.startsWith('#')) ? 'selected' : ''}`}>
        {item.word}
      </div>
      <div className="item-description">
        Mentions: <strong>{item.count}</strong>
      </div>
      <div className="item-category">
        {/* Category: {item.category} */}
      </div>
    </div>
    ))}
  </div>
    </div>
  );
}


