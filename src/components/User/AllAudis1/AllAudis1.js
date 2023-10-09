import React,{useState,useEffect,useContext} from 'react'
import StadiumIcon from '@mui/icons-material/Stadium';
import Swal from 'sweetalert2'

import LocationOnIcon from '@mui/icons-material/LocationOn';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Groups3Icon from '@mui/icons-material/Groups3';

import {useForm} from 'react-hook-form'
import './AllAudis1.css'
import axios from 'axios'
function AllAudis1() {

  let {register,handleSubmit,reset,formState:{errors},setValue,getValues}=useForm();
 


  let [Audi1,setAudi1]=useState([])
  let [error,setError]=useState("")


  let getAudis1=()=>{
    let token=localStorage.getItem("token")
     axios.get("http://localhost:4000/AdminHome-api/get-audi",{headers:{"Authorization":"Bearer "+token}})
     .then((response)=>{
       console.log(response.data)
        if(response.data.message==="Unauthorized request")
        {
          Swal.fire({
            icon: 'error',
            title: response.data.message,
            text: "Relogin again",
          });
        }
        else{
          setAudi1(response.data.payload)
          
          console.log("done");
        }
          
      
     })
     .catch((err)=>{
      if(err.response){
          setError(err.message);
        }
        else if(err.request)
        {
          setError(err.message)
        }
        else{
          setError(err.message)
        }
     }
     )
  }
  useEffect(()=>{
    const interval = setInterval(() => {
      getAudis1();},1000);
      return () => clearInterval(interval);
  }, []);



   
  
  
    
    
  return (
    <div>
      {Audi1.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No audis *</p>
      )}
      
        <div className='row row-cols-3'>
      {Audi1.map((todoobj)=>{
       return ( 
        <div className='card1'>
          
          <div className='hi1'>
            <StadiumIcon/><h5>{todoobj.Name1}</h5>
            <LocationOnIcon/><h6>Location:</h6>
            <p> {todoobj.Location}</p>
            <Groups3Icon/><h6>Capacity:</h6>
            <p> {todoobj.Capacity}</p>
            <ManageAccountsIcon/><h6>Supervisor Details:</h6>
            <p>{todoobj.Sname},+91{todoobj.Phone}</p>
           </div>
              <div className='cover1'>
                <div className='coverfront1'>
                  <div>
                  <h4>{todoobj.Name2}</h4>
                   <img src={todoobj.image} width="190px" height="250px" className='imdg' alt="not available"/>
                   </div>
                </div>
                <div className='coverback1'></div>
              </div>
             </div>
       )
      })}
      </div>
      
    </div>
  )
}


export default AllAudis1