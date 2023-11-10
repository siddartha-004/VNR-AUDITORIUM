import React,{useState,useEffect,useContext} from 'react'
import img4 from '../../../../images/4.jpg'
import Groups2Icon from '@mui/icons-material/Groups2';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import success from '../../../../images/success.mp3'
// import StadiumIcon from '@mui/icons-material/Stadium';
 import Swal from 'sweetalert2';
 import Modal from 'react-bootstrap/Modal';
 import Button from 'react-bootstrap/Button'
 import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
// import Form from 'react-bootstrap/Form';

// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import Groups3Icon from '@mui/icons-material/Groups3';
 import SaveAltIcon from '@mui/icons-material/SaveAlt';
 import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
import {useForm} from 'react-hook-form'
import './Admin.css'
import axios from 'axios'
function Admin() {

  const [show, setShow] = useState(false);
  let {register,handleSubmit,reset,formState:{errors},setValue,getValues}=useForm();
  const audioElement = new Audio(success);
  audioElement.style.display = 'none'; // Hide the audio element
  let [user,setuser]=useState([])
  let [error,setError]=useState("")
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 let [AdminToEdit,setAdminToEdit]=useState({});

  let EditAdmin=(Name1Tobeedited)=>{
    if(window.confirm(`Are you sure you want to edit? ${Name1Tobeedited.clubname}`)){
    handleShow();
    setAdminToEdit(Name1Tobeedited);
   
   setValue("clubname",Name1Tobeedited.clubname);
   setValue("username",Name1Tobeedited.username);

   setValue("phonenumber",Name1Tobeedited.phonenumber);
   setValue("email",Name1Tobeedited.email);
   setValue("image",Name1Tobeedited.image);
 
    }
  }
  let saveAdmin=()=>{
    let modifiedAdmin=getValues();

    modifiedAdmin.id=setAdminToEdit.id;
   
    axios.put(`http://localhost:4000/ConsumerHome-api/edit-admin/${modifiedAdmin.id}`,modifiedAdmin)
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
  let getUsers=()=>{
     axios.get("http://localhost:4000/ConsumerHome-api/get-admin")
     .then((response)=>{
    
        console.log(response.data.payload)
          setuser(response.data.payload)
          console.log(user)
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
      getUsers();},1000);
      return () => clearInterval(interval);
  }, []);

  
  
    
    
  return (
    <div>
        <div className='row row-cols-3'>
      {user.map((userobj)=>{
       return ( 
        <div className='cardu'>
            
              <div className='card-image'>
                <img src={img4} alt=""/>
             </div>
             <div className='profile-image'>
                 <img src={userobj.image} alt=""/>
                 
             </div>
            <div className='card-content'>
            <div className='icons1'><button><EditIcon  className='icon1' onClick={()=>{EditAdmin(userobj)}}/></button></div>
                 <h5 className='mb-2'><span><Groups2Icon/></span>   Admin name: <h6> {userobj.clubname}</h6></h5>
                 <h5 className='mb-2'><span><ContactPageIcon/></span>  User name: <h6> {userobj.username}</h6></h5>
                <h5 className='mb-2'><span> <PhoneInTalkIcon/></span>   PhoneNumber: <h6> {userobj.phonenumber}</h6></h5>
                 <h5 className='mb-2'><span><AttachEmailIcon/></span>   Email Id: <h6> {userobj.email}</h6></h5>
                 
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
          <Modal.Title id="contained-modal-title-vcenter">Edit Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form >
          <div className='main2'>
       
        <input type="text" id="clubname" width="200px"placeholder=" Clubname" className='form-control' {...register("clubname",{required:true})}/>
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
     
        </div>
       
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button  variant="info" onClick={()=>{handleClose()}}>
            <CancelPresentationIcon/>  Close
          </Button>{' '}
          <Button  variant="info" onClick={()=>{saveAdmin()}}>
            <SaveAltIcon/>  Save
          </Button>{' '}
        
        </Modal.Footer>
      </Modal> 
      
    </div>
  )
}


export default Admin