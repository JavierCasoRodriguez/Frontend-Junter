import { useState,useRef,useContext,useEffect } from "react";

import {ContextUid} from '../SessionContext';
import { MdInfoOutline } from "react-icons/md";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';


const AboutUs = () => {
  const scrollRef = useRef();
  const [activeIndex, setActiveIndex] = useState(null);
  const [question,setQuestion] = useState(null);
  const [result,setResult] = useState(false);
  const [longTest,setLongText] = useState(false);
  const uid = useContext(ContextUid);
  const data = {
    tittle:['What is Junter?','How does it work?','So what are the advantages?',
        'Where do I need to send a post?','Can I send posts to localities where I am not in?','Why does some post have localities at their top left and other not?',
    'What does TN means?','What is the maximun length of a post?','Why i cant find the city/region/country I want','What is a long post?','Is this a final version?','Can I send private messages to some friends?','Is it possible to post a video?','Do you have a mobile app?'],
    content:[`Junter es un chat en base a una localización que también incluye un chat genérico con todos los posts más destacados.Lo bueno de todo esto es que la propia persona es quien puede elegir que tipo de información o noticias quiere ver de manera directa.La estructura que tiene está constituida para 
      que en un futuro vaya teniendo nuevas funcionalidades siempte con la idea de que el usuario escoja aquello que le interese, por lo que a pesar de que ahora mismo solo tenga un chat el objetivo final es que se convierta en una aplicación con varias funcionalidades.
      Actualmente no es una aplicación que esté al 100% se puede apreciar en ciertos aspectos que le queda mucho camino el objetivo es ir creando una base y añadirle mejoras poco a poco  
      

      `,
    `
    The main app works in a decentralized way in term of functions even all the system has been developed as a centralized system, it means that posts are agrupated through cities,countries and regions.
      La estructura es sencilla y funciona de forma piramidal donde el chat de Junter agrupa todos los posts y en su caso el chat de España agrupará todos los posts de España, el de Andalucía(región de Esapaña) todos los de Andaucía y así sucesivamente.
      De esta manera la información se separa creando un abanico de opciones y es el usuario quien decide a donde conectarse.
    `,
  `The main advantage is that the user is able to decide where does he want to send posts besides having  a central chat(Junter) for everything, but if this is not enough i can tell you more:
  1- Many options to watch whats going on in different parts of the world at the same time, some app that only works with one big chat would make it difficult to show you information about France,Spain and Greece at similar time they would need realy good algorithms for that.
  2- More orienteted news app with the TN button
  3- Possibility to post different kind of post with the structure of long post or a normal/short post`
  
,'Actually you can send it whatever you want(all goes to the same chat at  the end ) but in case of confussion or doubt the best option is Junter because it works as a global chat',
'No.You just need to change your localities to the one you want to send  and then you will be able to',
'If you are in a chat for example Junter and you see some posts without a region, country.... it is because it would not make sense to put at the top right Junter to all Junter posts some happens with localities, so the post without anything at top right have been sent to the chat you are in not an inferior one',
'Top News, is a way to make some posts more visible to be a new not only be recomended by likes and reply.At the end of the day and week we put some TN list with the posts with more TN',
'250.In case you need more you can send a long post',
'Now most of the localities included are in Europe, in the next weeks we will start including all over the world',
'Is a way you can send a post its structured with a tittle that tells what is going to be talked and the content of it, it is mostly orientated to periodistas people that are interested in giving strong and argumentated opinions about something.One of the main goals is that you to create a social media of news but in both the classic(newspapers,magazines...) and modern style(social media on these days)',
'No.We are going to bring updates to the app, we can call this a gentle introduction for what is going to be Junter in the future.The main goal is to bring new things that are completely oposite to the chat to create a super big app ',
'No. We will include it in the next weeks',
'No. Videos are highly demanding in terms of memory so in this first part of the app we want to make sure that the most basic things work properly',
'Right now,only webpage.We are checking how everything is working and then we will upload the app'],
    //onClick;
}

const socialNetworks = {
  icon: [<FaFacebookF key={1} className="socialIcon" />, <FaTwitter  key={2} className="socialIcon" />, <FaInstagram key={3} className="socialIcon" />,<FaLinkedinIn key={4} className="socialIcon" />],
  ref:["https://facebook.com","https://twitter.com","https://instagram.com","https://linkedin.com"],

}


useEffect(() => {
  const saved = sessionStorage.getItem(`scroll-about`);
  console.log({
    saved:saved,
    scrollRef:scrollRef.current
  })
  if (saved ) {
    scrollRef.current.scrollTop = saved;
  }
}, []);

// Guardar scroll
useEffect(() => {
  const container = scrollRef.current;
  if (!container) return;

  const saveScroll = () => {
    sessionStorage.setItem(`scroll-about`, container.scrollTop);
  };

  container.addEventListener('scroll', saveScroll);

  return () => {
    saveScroll();
    container.removeEventListener('scroll', saveScroll);
  };
}, []);




  const toggleIndex = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  async function handleClick(text,id) {
    try {


      if(text.length > 300){
        setLongText(true)
        setTimeout(()=>{
          setLongText(false)
        },6000)

      } 
      else if(text.length > 0){
        const response = await fetch('http://localhost:5000/config/send/anonymus/question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text:text,
            id:id,
            // id_post:idPost,
            // lang:lang
          })
        });
    
        if (!response.ok) {
          throw new Error(`Error al insertar: ${response.statusText}`);
        }
    
        const result = await response.json();
        console.log('Inserción exitosa:', result);
        setResult(result);
        setQuestion('')
        setTimeout(()=>{
          setResult(false)
        },6000)
      } 
    } catch (error) {
      console.error('Error en insertRelevantWords:', error);
    }
  }

return (
  <section className={'aboutUs'} ref={scrollRef}>
    <div className={'title'}>
      <MdInfoOutline />
      About us
      </div>
    <div className={'faqList'}>
      {data.tittle.map((faq, index) => (
        <div key={index} className={`faqItem ${activeIndex === index ? 'open' : ''}`}>
          <button
            className={'question'}
            onClick={() => toggleIndex(index)}
          >
            {faq}
            <span className={'icon'}>
              {activeIndex === index ? '−' : '+'}
            </span>
          </button>
          {activeIndex === index && (
            <div className={'answer'}>
              {data.content[index]}
            </div>
          )}
        </div>
      ))}
    </div>
   {/* Redes Sociales */}
   <div className={'socialLinks'}>
    {socialNetworks.icon.map((item,index) => (
    <>
      <a href={socialNetworks.ref[index]} target="_blank" rel="noopener noreferrer">
       {item}
      </a>
    </>
    ))}


    </div>
    <div className={'contactForm'}>
      <div className={'formField'}>
        <input
          type="text"
          placeholder="Do you have any questions?"
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <button onClick={()=> handleClick(question,uid.uid)}>Send</button>
      {/* Formulario de Pregunta Especial en inglés */}
    </div>
      <div style={{width:'100%',height:'20px',textAlign:'center',marginTop:'20px',fontFamily:''}}>
        {result && 'Thanks for giving your opinion/submiting your question, we try to keep improving!'}
        {longTest && 'Your text is too long try something smaller (300 words)'}
        </div>
    

  </section>
);
};

export default AboutUs;


