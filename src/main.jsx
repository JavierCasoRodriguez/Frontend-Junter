import React from "react";
import ReactDom from "react-dom/client";
import App from "./App";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import ContainerMessages from "./views/main/ContainerMessage";
import Search from "./views/main/Search";
import TrendsGeneral from './components/Dashboard/Search/TrendsGeneral';
import {Profile,SettingsProfile,MainInfoProfile} from "./views/main/Profile";
import {Notifications,CardReplyNotification,LikeNotification} from "./views/main/Notifications";
import {RootNewsComponent,FriendsRoot,DefaultMainComponent} from './components/Dashboard/ContainerComponentes';
import About from "./views/main/AboutUs";
import DefaultProfilePosts from './components/Dashboard/UserPostsInteractions'
import {Localidades,EmailLocalidades} from "./views/main/Localidades";
import RedirectToMain  from  './components/Dashboard/RedirectToUserLocality';
import ShortMessage from './components/Dashboard/NewMessage/ShortMessage';
import MessageReply from './components/Dashboard/MessageForm/MessageReply';
import MessagesQuote from './components/Dashboard/MessageForm/MessagesQuote';
import LongMessage from './components/Dashboard/NewMessage/LongMessage';
import QueryContent from './components/Dashboard/Search/QueryContent';
import Followers from './components/Dashboard/Followers';
import NewTypesPost from "./views/main/NewTypesPost";
import Login from './views/auth/Login';
import ExampleTwo from './views/auth/Example';
import Register from './views/auth/Registro';
// import Example from './components/Dashboard/ExampleCom';
import Image from "./components/Dashboard/ImageComp/Image";
import FirstSelectImage from "./components/Dashboard/ImageComp/FirstSelectImage";
import SecondSetImage from "./components/Dashboard/ImageComp/SecondSetImage";
import Response from "./components/Dashboard/Response/Response";
import LongPostResponse from "./components/Dashboard/Response/LongPostResponse";
import {PostEngagements,Quotes,Reposts} from "./components/Dashboard/Response/PostEngagements";
import UserSetUp from './views/auth/UserSetUp';
import EmailLogin from './views/auth/EmailLogin';

import './styles/App.scss';





const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
     
      {
        path:'',
        element:<ContainerMessages />,
        children:[
          {
            path:'',
            element:<DefaultMainComponent />
          },{
            path:'/news/current',
            element:<RootNewsComponent />
          }
          // {
          //   path:'/news/current?timestamp=week',
          //   element:<NewsWeekComponent />
          // }
          // ,{
          //   path:'/news/current?timestamp=month',
          //   element:<NewsMonthComponent />
          // },{
          //   path:'/news/current?timestamp=day',
          //   element:<NewsDayComponent />
          // }
          ,{
            path:'/friends/status',
            element:<FriendsRoot />
          },{
            path:'/country',
            element:<RedirectToMain /> 
          },  {
            path:'/country/:country',
            element:<DefaultMainComponent /> 
          },
          { //News(country)
            path:'/country/:country/news/current',
            element:<RootNewsComponent />
          },
          {
            path:'/region/:region',
            element:<DefaultMainComponent />
          },{
            path:'/region',
            element:<RedirectToMain /> 
          },
          { // news(region)
            path:'/region/:region/news/current',
            element:<RootNewsComponent />
          },
          {
            path:'/city/:city',
            element:<DefaultMainComponent />
          },
          {
            path:'/city',
            element:<RedirectToMain /> 
          },
         
          {
            path:'/new/types/post',
            element:<NewTypesPost />
          },
          {
            path:'/new/post/format/short',
            element:<ShortMessage />
          },{
            path:'/new/post/format/short/:country',
            element:<ShortMessage />
          },
          {
            path:'/new/post/format/short/:country/:region',
            element:<ShortMessage />
          },
          {
            path:'/new/post/format/short/:country/:region/:city',
            element:<ShortMessage />
          },{
            path:'/new/post/format/long',
            element:<LongMessage />
          },{
            path:'/new/post/format/long/:country',
            element:<LongMessage />
          },
          {
            path:'/new/post/format/long/:country/:region',
            element:<LongMessage />
          },
          {
            path:'/new/post/format/long/:country/:region/:city',
            element:<LongMessage />
          },
          {            path:'/city/:city/news/current',
            element:<RootNewsComponent />
          }, {
            path:'/post/:id',
            element:<Response />
          },{
            path:'/post/format/long/:id',
            element:<LongPostResponse />
          }
          ,{
            path:'/post/format/reply/:id',
            element:<MessageReply />
          },{
            path:'/post/format/repost/quote/:id/:params/:location',
            element:<MessagesQuote />
          },{
            path:'/post/format/repost/quote/:id',
            element:<MessagesQuote />
          }, {
            path:'/example/posts',
            element:<ExampleTwo />
          },{
              path:'/search',
              element:<Search />
            },{
              path:'/search/posts',
              element:<QueryContent />
            },
            {
              path:'/search/trends',
              element:<TrendsGeneral />,
            },


            { path:'/:username',
              element:<Profile />,
              children:[
                {
                  path:'',
                  element:<MainInfoProfile />
                },
                {
                  path:'settings',
                  element:<SettingsProfile />
                },{
                  path:'likes',
                  element:<DefaultProfilePosts index={2} />
                },{
                  path:'posts',
                  element:<DefaultProfilePosts index={1} />
                }
              ]
            },{
              path:'/profile/users/:username/type',
              element:<Profile />,
              children:[
              {
                  path:'posts',
                  element:<DefaultProfilePosts />
                },{
                  path:'main',
                  element:<MainInfoProfile />
                }
              ]
            },{
              path:'/:username/followers',
              element:<Followers />
            },{
              path:'/:username/following',
              element:<Followers />
            },{
              path:'/:username/saved/posts',
              element:<DefaultProfilePosts/>
            },{
              path:'/:username/added/posts/topnews',
              element:<DefaultProfilePosts  />
            },{
              path:'/profile/users',
              element:<Profile />
            },
            {
              path:'/profile/users/:location/following',
              element:<Followers />
      
            },{
              path:'/profile/users/:location/followers',
              element:<Followers />
            },{
              path:'/profile/:username/settings/img',
              element:<Image/>,
              children:[
                {
                  path:'select/photo',
                  element:<FirstSelectImage/>
                },{
                  path:'my-photo/options',
                  element:<SecondSetImage />
                } ,
              ]
              
            },
            {
              path:'/notifications',
              element:<Notifications />,
              children:[
                {
              path:'main',
              element:<LikeNotification />
                },{
                path:'text',
                element:<CardReplyNotification />
                }
              ]},      
            
            {
              path:'/about-us',
              element:<About />},{

              path:'/localities',
              element:<Localidades />
            },
            {
            path:'/posts/engagements',
            element:<PostEngagements />,
            children:[
              {
                path:'reposts/:id',
                element: <Reposts />
              },{
                  path:'quotes/:id',
                  element:<Quotes />
              }
            ]
          },{

          }

        ]
      },

      // {
      //   path:'/news/current',
      //   element:<ContainerMessages />
      // },
      // },{
      //   path:':country',
      //   element:<ContainerMessages />
      // },{
      //   path:':country/:region',
      //   element:<ContainerMessages />
      // },{
      //   path:':country/:region/:city',
      //   element:<ContainerMessages />
      // },{
      //   path:'/friends/:country/:region/:city',
      //   element:<ContainerMessages />
      // },{
      //   path:'/news/:country/:region/:city',
      //   element:<ContainerMessages />
      // },
      //NuevAS RUTAS PAIS REGION CIUDADA
      //FRIENDS PARA TI Y TOP NEWS
    
      // {
      //   path:'/friends/status',
      //   element:<ContainerMessages />
      // },
   
 
      
     {
      path:'/localities/select/user',
      element:<Localidades />
    }
      , {
        path: "/auth",
        children: [
          {
            path: "login",
            element: <Login />,
          },
        {
          path:'register/new/user',
          element:<Register />
        },
       
          {
            path: "register/complete",
            element: <Localidades />,
          }
        ],
      },
        // Rutas adicionales
  {
    path: "/auth/login/default",
    element: <Localidades />,
  },
  {
    path:'/accc',
    element:<ExampleTwo />
  }
  
    ],
  
  
},
    
    // Rutas de autenticación (independientes del contexto)


  // Google Auth
  // {
  //   path: "/googleAuth/providerID=true/junter&step=select-username",
  //   element: <UserSetUp />,
  // },
  {
    path: "/onboarding/username",
    element: <UserSetUp />,
  },
  // {
  //   path: "/auth/login/form/email",
  //   element: <EmailLogin />,
  // },
  {
    path: "/auth/login/form/email/verification/code",
    element: <EmailLogin />,
  },


 
 
]);

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    </React.StrictMode>,
)
