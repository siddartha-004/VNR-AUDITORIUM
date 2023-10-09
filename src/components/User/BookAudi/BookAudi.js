import React,{useEffect,useState} from 'react'
import NavBar1 from '../NavBar1/NavBar1';
import { PlusOutlined } from '@ant-design/icons';
import './BookAudi.css'
import {Form,Input,InputNumber,DatePicker, TimePicker,Upload} from 'antd'
import moment from 'moment'
import img2 from '../../../images/6.svg'
import {useForm} from 'react-hook-form'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SideBar1 from '../SideBar1/SideBar1';
import FormItem from 'antd/es/form/FormItem';
function BookAudi() {
  let {
    register,
    handleSubmit,reset,
    formState: { errors },
  } = useForm();
  let [error, setError] = useState("");
  let [selectedFile,setSelectedFile]=useState(null)
  const onFileSelect=(e)=>{
    setSelectedFile(e.target.files[0])
   }
  return (
    <>
         <NavBar1/>
         <Box height={40}/>
         <Box sx={{ display: 'flex' }}>
         <SideBar1/>
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <div className='contain12' >
       
        
       <div className='title1'>
           <h4>Create an Event</h4>
       </div>
       <div className='create1'>
         <div className='sign-event' >
           
          
           <form >
           {/* username */}
           <div className="item2 mb-4">
             <label htmlFor="name">clubname:</label>
             <input
               type="text"
               id="clubname"
               className="form-control"
               placeholder="e.g. Computer Society of India" 
               {...register("clubname", { required: true })}
             />
           
           </div>
           {/* email */}
           <div className="item2 mb-4">
             <label htmlFor="name">PhoneNo:</label>
             <input
               type="text"
               id="phonenumber"
               className="form-control"
             
               {...register("phonenumber", { required: true,maxLength:"10",minLength:"10" })}
             />
             
             
           </div>
           
           <div className="item2 mb-4">
             <label htmlFor="name">Email:</label>
             <input
               type="email"
               placeholder="e.g. example@mail.com"
               id="email1"
               className="form-control"
               {...register("email", { required: true })}
             />
             
            
           </div>
           <div className="item2 mb-4">
             <label htmlFor="name">Poster of Event:</label>
             
             <input
               type="file"
               id="myfile"
               className="form-control"
               {...register("image", { required: true })}
               onInput={onFileSelect}
             />
             
           
           </div>
           <div className="item2 mb-4">
             <label htmlFor="name">Description:</label>
             <textarea id="description" placeholder="......" className='form-control' {...register("description",{required:true})}/>
             </div>
             <form>
           <div className="item2 mb-4">
             <label htmlFor="name">Capacity:</label>
           <input type="number" id="Capacity"placeholder="Auditorium Capacity" className='form-control' {...register("Capacity",{required:true})}/>
            </div>

            <div className="item2 mb-4">
             <label htmlFor="name">Date of event:</label>
           <input type="date" id="date"placeholder="Booking date" className='form-control' {...register("date",{required:true})}/>
            </div>
            </form>
            <button type="submit" className="btn1 btn-success">
             Search
           </button>
            
           {/* submit button */}
           <button type="submit" className="btn1 btn-success">
             Register
           </button>
         </form>
         
         </div>
          <div className='picture1'>
           <img src={img2} className='imge' alt='not available'/>
          </div>
          
          </div>
       
           
       
   </div>
      </Box>
         </Box> 
       
        
    </>
  )
}

export default BookAudi