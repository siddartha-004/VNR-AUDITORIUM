

import React,{useState,useEffect,useContext} from 'react'
import img5 from '../../../../images/5.jpg';
import Swal from 'sweetalert2'
import success from '../../../../images/success.mp3'
import Groups2Icon from '@mui/icons-material/Groups2';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';

 import Modal from 'react-bootstrap/Modal';
 import Button from 'react-bootstrap/Button'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

 import SaveAltIcon from '@mui/icons-material/SaveAlt';
 import EditIcon from '@mui/icons-material/Edit';
 import DeleteIcon from '@mui/icons-material/Delete';
import {useForm} from 'react-hook-form'
import './Users1.css'
import axios from 'axios'
function Users1() {

  const [show, setShow] = useState(false);
  let {register,handleSubmit,reset,formState:{errors},setValue,getValues}=useForm();
   let [selectedFile,setSelectedFile]=useState(null)
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
   const audioElement = new Audio(success);
   audioElement.style.display = 'none'; // Hide the audio element
  let [UserToEdit,setUserToEdit]=useState({});
  let [user1,setuser1]=useState([])
  let [error,setError]=useState("")
   const onFileSelect=(e)=>{
    setSelectedFile(e.target.files[0])
 }
  //get
  let getUsers1=()=>{
     axios.get("http://localhost:4000/ConsumerHome-api/get-user")
     .then((response)=>{
    
        
          setuser1(response.data.payload)
          console.log(user1)
          console.log("done");
          
      
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
      getUsers1();},1000);
      return () => clearInterval(interval);
  }, []);

let EditUser=(Name1Tobeedited)=>{
    if(window.confirm(`Are you sure you want to edit? ${Name1Tobeedited.coordinatorname}`)){
    handleShow();
    setUserToEdit(Name1Tobeedited);
   
   setValue("coordinatorname",Name1Tobeedited.coordinatorname);
   setValue("username",Name1Tobeedited.username);

   setValue("phonenumber",Name1Tobeedited.phonenumber);
   setValue("email",Name1Tobeedited.email);
   setValue("image",Name1Tobeedited.image);
   setValue("maxcount",Name1Tobeedited.maxcount)
 
    }
  }
  let saveUser=()=>{
    let modifiedUser=getValues();
    console.log(UserToEdit)
    modifiedUser.id=setUserToEdit.id;
    console.log(modifiedUser)
    axios.put(`http://localhost:4000/ConsumerHome-api/edit-user/${modifiedUser.id}`,modifiedUser)
    .then(res=>{
      if(res.status===201)
      {
        console.log("done1");
        audioElement.play(); 
        Swal.fire({
          icon: 'success',
          title: 'User Saved Successfully!',
          text: ' User has been changed successfully.',
        });
        handleClose();
  
      }
    }).catch(err=>{})
  }
let deleteUser =(Name1) =>{
   
    if(window.confirm(`Are you sure you want to delete? ${Name1}`)){
      axios.delete(`http://localhost:4000/ConsumerHome-api/remove/${Name1}`).then((response)=>{
        audioElement.play(); 
    Swal.fire({
      icon: 'success',
      title: Name1,
      text:'Deleted Successfully',
    });
  }).catch((err)=>{
    Swal.fire({
      icon: 'error',
      title: 'Cannot Delete User!Try Again',
      text:err.message,
    });
      });
    }else{

    }
   
  }
  
  
    
    
  return (
    <div>
        <div className='row row-cols-3'>
      {user1.map((userobj)=>{
       return ( 
        <div className='cardu'>
            
              <div className='card-image'>
                <img src={img5} alt=""/>
             </div>
             <div className='profile-image'>
                 <img src={userobj.image} alt=""/>
                 
             </div>
            <div className='card-content'>
            <div className='icons1'><button><EditIcon  className='icon1' onClick={()=>{EditUser(userobj)}}/></button><button><DeleteIcon className='icon1' onClick={()=>{deleteUser(userobj.coordinatorname)}}/></button></div>
                 <h5 className='mb-2'><span><Groups2Icon/></span>   Club Coordinator name: <h6> {userobj.coordinatorname}</h6></h5>
                 <h5 className='mb-2'><span><ContactPageIcon/></span>  User name: <h6> {userobj.username}</h6></h5>
                <h5 className='mb-2'><span> <PhoneInTalkIcon/></span>   PhoneNumber: <h6> {userobj.phonenumber}</h6></h5>
                 <h5 className='mb-2'><span><AttachEmailIcon/></span>   Email Id: <h6> {userobj.email}</h6></h5>
                 <h5 className='mb-2'><span><AttachEmailIcon/></span>   Max Count: <h6> {userobj.maxcount}</h6></h5>
                 
             </div>
             <div className='icons1'>

             </div> 
         </div>
       
       )
      })}
      </div>
       <Modal show={show} onHide={handleClose} size="lg"
      aria-labelledby="contained-modal-title-vcenter" backdrop="static"
      centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form >
          <div className='main2'>
       
        <input type="text" id="username" width="200px"placeholder=" Coordinatorname" className='form-control' {...register("coordinatorname",{required:true})}/>
        <input type="text" id="username"placeholder=" Username" className='form-control' {...register("username",{required:true})}/>
        <input type="text" id="password"placeholder="Password" className='form-control' {...register("password",{required:true})}/>
        <input type="number" id="phonenumber"placeholder="Phonenumber" className='form-control' {...register("phonenumber",{required:true})}/>
        <input
                type="email"
                placeholder="e.g. example@mail.com"
                id="email"
                className="form-control"
                {...register("email", { required: true })}
              />
               <input type="number" id="maxcount"placeholder="maxcount" className='form-control' {...register("maxcount",{required:true})}/>
     
        </div>
       
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button  variant="info" onClick={()=>{handleClose()}}>
            <CancelPresentationIcon/>  Close
          </Button>{' '}
          <Button  variant="info" onClick={()=>{saveUser()}}>
            <SaveAltIcon/>  Save
          </Button>{' '}
        
        </Modal.Footer>
      </Modal> 
      
    </div>
  )
}


export default Users1