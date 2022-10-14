import './App.css';
import Navbar from './Componenets/Navbar'
import Profile from './Componenets/Profile';
import Signup from './Componenets/Signup';
import Login from './Componenets/Login';
import Logout from './Componenets/Logout';
import Products from './Componenets/Products';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useContext } from 'react'
import { GlobalContext } from './Componenets/Context';
import axios from 'axios';
import lodingimg from './Componenets/images/loading.gif'
// import loddingimage from './assets/loading-1.webp'
import Createproducts from './Componenets/Createproducts';



function App() {

  let { state, dispatch } = useContext(GlobalContext);


  useEffect(() => {


    const getProfile = async () => {

      try {
        let response = await axios({
          url: `${state.baseUrl}/profile`,
          method: "get",
          withCredentials: true
        })
        if (response.status === 200) {
          console.log("response: ", response.data);
          dispatch({
            type: "USER_LOGIN",
            payload: response.data
          })

        } else {
          dispatch({ type: "USER_LOGOUT" })
        }

      } catch (e) {
        console.log("Error in api", e);
        dispatch({
          type: "USER_LOGOUT"
        })
      }
    }
    getProfile();
  }, [])





  return (
    <Router>


      <Navbar />



      <Routes>

        {(state.isLogin === true) ?

          <>



            <Route path="/Profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/Createproducts" element={<Createproducts />} />
            <Route path="/" element={<Products />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
          :
          null
        }

        {(state.isLogin === false) ?

          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />

          </>
          :
          null
        }


        {(state.isLogin === null) ?

          <>
            <Route path="*" element={
              <div className='image_container234'>
                <img src={lodingimg} alt='loding_image' />
              </div>
            } />
          </>
          :
          null
        }
      </Routes>
    </Router >
  );
}

export default App;