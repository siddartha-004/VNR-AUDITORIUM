import React from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import Admin from '../Users/Admins/Admins';
import { useState } from "react";
import Spinner from '../../Spinner/Spinner';
import Users1 from '../Users/Users1/Users';
import {useForm} from 'react-hook-form'
import Spinner1 from '../../Spinner1/Spinner1';
import SideBar from '../SideBar/SideBar'
import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import './NewUser.css';
import success from '../../../images/success.mp3'
import NavBar from '../NavBar/NavBar'
import img2 from '../../../images/2.svg'



function NewUser() {
  let {
    register,
    handleSubmit,reset,
    formState: { errors },
  } = useForm();
  const audioElement = new Audio(success);
  audioElement.style.display = 'none'; // Hide the audio element
  let [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  let [selectedFile,setSelectedFile]=useState(null)
  const onFileSelect=(e)=>{
    setSelectedFile(e.target.files[0])
   }
   let addNewUser = (newUser) => {
    setLoading(true)
    let fd=new FormData();
    

    fd.append("user",JSON.stringify(newUser))
   
    fd.append("photo",selectedFile)
   

    axios
      .post("http://localhost:4000/ConsumerHome-api/register-user", fd)
      .then((response) => {
        if (response.status === 201) {
          audioElement.play(); 
          console.log("added")
          Swal.fire({
            icon: 'success',
            title: newUser.clubname+' '+newUser.typeofuser+' registered',
            text: 'New '+newUser.typeofuser+' has been registered successfully.',
          });
          reset();
        }
        if(response.status!==201){
          console.log(response.data.message)
          setError(response.data.message)
          Swal.fire({
            icon: 'error',
            title: 'Cannot Register!Try Again',
            text:response.data.message,
          });
        }
      })
      .catch((err) => {
        if (err.response) {
          setError(err.message);
        }
        else if (err.request) {
          setError(err.message);
        }
        else {
          setError(err.message);
        }
      })
      .finally(() => {
        setLoading(false); // Hide the spinner after the request is complete
      });
     
  };

  return (
    <>
    <NavBar/>
    <Box height={40}/>
    <Box sx={{ display: 'flex' }}>
    <SideBar/>
    {loading && <Spinner1 />}
   <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
  
   <div className='contain11' >
       
        
        <div className='title'>
            <h4>Sign - In Form</h4>
        </div>
        <div className='create'>
          <div className='sign-in'>
            <h4>Create a new User</h4>
           
            <form onSubmit={handleSubmit(addNewUser)}>
            {/* username */}
            <div className="item mb-4">
              <label htmlFor="Fullname">Fullname:</label>
              <input
                type="text"
                id="clubname"
                className="form-control"
                
                {...register("clubname", { required: true })}
              />
            
            </div>
            <div className="item mb-4 ml-1">
              <label htmlFor="name">Username:</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="e.g. VNR@123" 
                {...register("username", { required: true })}
              />
            </div>
            <div className="item1 mb-4">
              <label htmlFor="type">Type of User:</label>
              
              <select
                type="text"
                id="typeofuser"
                className="form-select"
                placeholder="e.g. John"
                {...register("typeofuser", { required: true })}>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                </select>
              
            </div>
           
            <div className="item mb-4">
              <label htmlFor="name">Password:</label>
              <input
                type="password"
                placeholder="*********"
                id="password"
                className="form-control"
                {...register("password", { required: true })}
              />
            </div>
            {/* email */}
            <div className="item mb-4">
              <label htmlFor="name">PhoneNo:</label>
              <input
                type="text"
                id="phonenumber"
                className="form-control"
              
                {...register("phonenumber", { required: true,maxLength:"10",minLength:"10" })}
              />
              
              
            </div>
            
            <div className="item mb-4">
              <label htmlFor="name">Email:</label>
              <input
                type="email"
                placeholder="e.g. example@mail.com"
                id="email"
                className="form-control"
                {...register("email", { required: true })}
              />
              
             
            </div>
           


            {/* image url */}
            <div className="item mb-4">
              <label htmlFor="name">Profile Pic:</label>
              <input
                type="file"
                id="image"
                className="form-control"
                {...register("image", { required: true })}
                onInput={onFileSelect}
              />
              {/* validation errors for name */}
            
            </div>


            {/* submit button */}
            <button type="submit" className="btn1 btn-success">
              Register
            </button>
          </form>
          
          </div>
           <div className='picture'>
            <img src={img2} className='imge' alt='not available'/>
           </div>
           
           </div>
        
            
        
    </div>
    <div className='contain1' >
        <div className='Title1'>
            <h4>Registered Users in <span>Book It</span></h4>
            
        </div>
        <div className='allusers'>
          <div className='Title2'>
             <h5>Admins</h5>
             <div className='admins'>
             {loading ? <Spinner /> : <Admin />}
             </div>
          </div>
          <div className='Title2'>
            <hr/>
             <h5>Users</h5>
             {loading ? <Spinner /> : <Users1 />}
          </div>
             
             
            </div>
        
    </div>

 </Box>
    </Box>
    </>
    
  )
}

export default NewUser