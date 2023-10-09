import React,{useEffect, useState}from 'react'
import './Login.css'
import axios from 'axios'
import {message} from 'antd'
import {BiSolidLockAlt} from 'react-icons/bi'
import {FaUserAlt} from 'react-icons/fa'
import img1 from '../../images/1.svg'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'


function Login() {
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  let [currentUser,setCurrentUser]=useState({});
    let [error,setError]=useState("");
    let [userLoginStatus,setUserLoginStatus]=useState(false)
   

    //userlogin
    const loginUser=(userCredObj)=>{
        axios.post('http://localhost:4000/ConsumerHome-api/login-user',userCredObj)
        .then(response=>{
            if(response.data.message==="success"){
                //update current User state
                setCurrentUser({...response.data.user})
                //update user login status
                setUserLoginStatus(true)
                //update error status
                setError("")
                //store jwt token in local or session storage
                localStorage.setItem("token",response.data.token)
                
            }else{
                setError(response.data.message)
            }
        })
        .catch(err=>{

        })
    }

    
    //userlogout
    const logoutUser=()=>{
        //clear local or session storage
        localStorage.clear();
         //update user login status
         setUserLoginStatus(false)

    }
  const handleUserLogin=(userCredObj)=>{
    loginUser(userCredObj)
   }
   useEffect(()=>{
    if(userLoginStatus==true){
      if(currentUser.typeofuser==="Admin"){
       
        navigate("/AdminHome");
      }
      else{
       
      navigate("/UserHome");
      }
    }
   },[userLoginStatus])
  return (

      
        <div class="container">
        
      <div class="forms-container">
   
        <div class="signin-signup">
        {error.length !== 0 && (
        <p className="goby display-5 text-danger text-center">* {error} *</p>
      )}
           <form  class="sign-in-form" onSubmit={handleSubmit(handleUserLogin)}>
             <h2 class="title">Sign in</h2>
               <div class="input-field">
               <div className='i'><BiSolidLockAlt/></div>
              <input type="text" placeholder="Username" id="username"
                className="form-control" {...register("username", { required: true })} />
                
             </div>
            <div class="input-field">
             <div className='i'><FaUserAlt/></div>
               <input type="password" placeholder="Password" id="password"
                className="form-control" {...register("password", { required: true })} />
                
            </div>
             <input type="submit" value="Login" class="btn solid" />
            <p class="forgot-text">Forgot Password ?</p>
            
           </form>
       
        </div>
       </div>

       <div class="panels-container1">
         <div class="panel1 left-panel1">
           <div class="content1">
             <h3>New here ?</h3>
             <p>
               Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
            ex ratione. Aliquid!
            </p>
             <button class="btn1 transparent" id="sign-up-btn">
              Sign up
             </button>
          </div>
          <img src={img1} class="image" alt="" />
        </div>
       
      </div>
    </div>
    
    
  )
}

export default Login