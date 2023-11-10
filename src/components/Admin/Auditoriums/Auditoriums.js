
import React,{useState,useEffect,useContext} from 'react'
import AllAudis from '../AllAudis/AllAudis';
import {useForm} from 'react-hook-form'
import axios from 'axios'
import Spinner1 from '../../Spinner1/Spinner1';
import Swal from 'sweetalert2';
import success from '../../../images/success.mp3'
import {Alert} from '@mui/material'
import {toast,ToastContainer} from 'react-toastify'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Spinner from '../../Spinner/Spinner';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import 'react-toastify/dist/ReactToastify.css'
import './Auditoriums.css';
import SideBar from '../SideBar/SideBar';
import Box from '@mui/material/Box';
import NavBar from '../NavBar/NavBar';
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import {Button,Dialog,DialogActions,DialogContentText,DialogTitle, Stack} from "@mui/material"

export default function Auditoriums() {
    const [open,openchange]=useState(false);
    const [loading, setLoading] = useState(false);

    let [selectedFile,setSelectedFile]=useState(null)
    const functionopenpopup=()=>{
        openchange(true);
    }
    const closepopup=()=>{
        openchange(false);
    }
 
    const navigate = useNavigate();
    const onFileSelect=(e)=>{
        setSelectedFile(e.target.files[0])
    }
    const audioElement = new Audio(success);
    audioElement.style.display = 'none'; // Hide the audio element

          
   
    let {register,handleSubmit,reset,formState:{errors}}=useForm();
    let [error,setError]=useState("")
    let [text,setText]=useState("")
    let addNewAudi=(newAudi)=>{
      setLoading(true); 
        
    let fd=new FormData();
 
    fd.append("Audi",JSON.stringify(newAudi))
   
    fd.append("photo",selectedFile)
    console.log(fd)
        axios.post("http://localhost:4000/AdminHome-api/register-audi",fd)
        
        .then((response)=>{
         
  
          if(response.status===201)
          {
            console.log("added")
            audioElement.play(); 
            Swal.fire({
              icon: 'success',
              title: 'Audi Created Successfully!',
              text: 'New Audi has been posted successfully.',
            });
            reset();
           
          }
          if(response.status!==201)
          {
            setError(response.data.message)
            Swal.fire({
              icon: 'error',
              title: 'Cannot Add Audi!Try Again',
              text:response.data.message,
            });
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
          Swal.fire({
            icon: 'warning',
            title: 'Cannot Add Audi!Try Again',
            text:err.message,
          });
        })
        .finally(() => {
          setLoading(false); // Hide the spinner after the request is complete
        });
      }
  return (
    <>
    <NavBar/>
    <Box height={40}/>
    <Box sx={{ display: 'flex' }}>
    <SideBar/>
    {loading && <Spinner1 />}
  
    <div className='addaudi'>
   <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
   <div className='contain' >
        <div className='Title'>
          <div className='Title1'>
            <h4>Create an Auditorium</h4>
        
            </div>
            <form onSubmit={handleSubmit(addNewAudi)}>
          <div className='main1'>
         <div className='fileupload'>
        <input type="file" id="image" placeholder="Auditorium Fullname" className="form-control" {...register("image", { required: true })} onInput={onFileSelect}/>
        </div>
        <input type="text" id="Name1"placeholder="Auditorium Fullname" className='form-control' {...register("Name1",{required:true})}/>
        <input type="text" id="Name2"placeholder="Auditorium Shortname" className='form-control' {...register("Name2",{required:true})}/>
        <input type="text" id="Location"placeholder="Auditorium Location" className='form-control' {...register("Location",{required:true})}/>
        <input type="number" id="Capacity"placeholder="Auditorium Capacity" className='form-control' {...register("Capacity",{required:true})}/>
        <input type="text" id="Sname"placeholder="Auditorium Supervisor Name" className='form-control' {...register("Sname",{required:true})}/>
        <input type="number" id="Phone"placeholder="Auditorium Supervisor PhoneNumber" className='form-control' {...register("Phone",{required:true})}/>
    
             
              {errors.category?.type === "required" && (
                <p className="text-danger fw-bold fs-5">
                  Priority is required
                
                </p>
              )}
           
        {errors.name?.type==="required"&&<p className='text-danger'>*Task is Required</p>}
        </div>
        <div className='btns1'>
        <Button variant="contained" className="btn1 contain9"type="submit"><AddCircleIcon/>  Add</Button>
        <Button variant="contained" className="btn contain10 " type='reset' ><ClearRoundedIcon/>  Cancel</Button> 
        </div>
        </form>
           
        </div>
    </div>
    <div className='contain1' >
        <div className='Title1'>
            <h4>Auditoriums in <span>VNR VJIET</span></h4>
           
        </div>
        <div className='allaudis'>
       <AllAudis />
                        </div>
        
    </div>
 </Box>
 </div>

    </Box>
    </>
   
  )
}

