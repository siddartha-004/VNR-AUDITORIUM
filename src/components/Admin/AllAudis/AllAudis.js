
import React,{useState,useEffect,useContext} from 'react'
import StadiumIcon from '@mui/icons-material/Stadium';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import Form from 'react-bootstrap/Form';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Groups3Icon from '@mui/icons-material/Groups3';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useForm} from 'react-hook-form'
import './AllAudis.css'
import axios from 'axios'
function AllAudis() {

  const [show, setShow] = useState(false);
  let {register,handleSubmit,reset,formState:{errors},setValue,getValues}=useForm();
  let [selectedFile,setSelectedFile]=useState(null)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [AudiToEdit,setAudiToEdit]=useState({});
  let [Audi,setAudi]=useState([])
  let [error,setError]=useState("")
  const onFileSelect=(e)=>{
    setSelectedFile(e.target.files[0])
}
  //get
  let getAudis=()=>{
    let token=localStorage.getItem("token")
     axios.get("http://localhost:4000/AdminHome-api/get-audi",{headers:{"Authorization":"Bearer "+token}})
     .then((response)=>{
    
        console.log(response.data)
          setAudi(response.data.payload)
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
      getAudis();},1000);
      return () => clearInterval(interval);
  }, []);
let EditAudi=(Name1Tobeedited)=>{
  if(window.confirm(`Are you sure you want to edit? ${Name1Tobeedited.Name1}`)){
  handleShow();
  setAudiToEdit(Name1Tobeedited);
 
 setValue("Name1",Name1Tobeedited.Name1);
 setValue("Name2",Name1Tobeedited.Name2);
 setValue("Sname",Name1Tobeedited.Sname);
 setValue("Phone",Name1Tobeedited.Phone);
 setValue("Capacity",Name1Tobeedited.Capacity);
 setValue("Location",Name1Tobeedited.Location);
 setValue("image",Name1Tobeedited.image);
  }
}
let saveAudi=()=>{
  let modifiedAudi=getValues();
  modifiedAudi.id=setAudiToEdit.id;

  axios.put(`http://localhost:4000/AdminHome-api/edit-audi/${modifiedAudi.id}`,modifiedAudi)
  .then(res=>{
    if(res.status===201)
    {
      console.log("done1");
      Swal.fire({
        icon: 'success',
        title: 'Audi Saved Successfully!',
        text: ' Audi has been changed successfully.',
      });
      handleClose();

    }
  }).catch(err=>{})
}
  let deleteAudi =(Name1) =>{
   
      if(window.confirm(`Are you sure you want to delete? ${Name1}`)){
        axios.delete(`http://localhost:4000/AdminHome-api/remove/${Name1}`).then((response)=>{
      Swal.fire({
        icon: 'success',
        title: Name1,
        text:'Deleted Successfully',
      });
    }).catch((err)=>{
      Swal.fire({
        icon: 'error',
        title: 'Cannot Delete Audi!Try Again',
        text:err.message,
      });
        });
      }else{

      }
     
    }
   
  
  
    
    
  return (
    <div>
        <div className='row row-cols-3'>
      {Audi.map((todoobj)=>{
       return ( 
        <div className='card'>
          <div className='icons'><button><EditIcon  className='icon' onClick={()=>{EditAudi(todoobj)}}/></button><button><DeleteIcon className='icon' onClick={()=>{deleteAudi(todoobj.Name1)}}/></button></div>
          <div className='hi'>
            <StadiumIcon/><h5>{todoobj.Name1}</h5>
            <LocationOnIcon/><h6>Location:</h6>
            <p> {todoobj.Location}</p>
            <Groups3Icon/><h6>Capacity:</h6>
            <p> {todoobj.Capacity}</p>
            <ManageAccountsIcon/><h6>Supervisor Details:</h6>
            <p>{todoobj.Sname},+91{todoobj.Phone}</p>
           </div>
              <div className='cover'>
                <div className='coverfront'>
                  <div>
                  <h4>{todoobj.Name2}</h4>
                   <img src={todoobj.image} width="190px" height="250px" className='imdg' alt="not available"/>
                   </div>
                </div>
                <div className='coverback'></div>
              </div>
             </div>
       )
      })}
      </div>
      <Modal show={show} onHide={handleClose} size="lg"
      aria-labelledby="contained-modal-title-vcenter" backdrop="static"
      centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Edit Auditorium</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form >
          <div className='main2'>
       
        <input type="text" id="Name1" width="200px"placeholder=" Fullname" className='form-control' {...register("Name1",{required:true})}/>
        <input type="text" id="Name2"placeholder=" Shortname" className='form-control' {...register("Name2",{required:true})}/>
        <input type="text" id="Location"placeholder="Auditorium Location" className='form-control' {...register("Location",{required:true})}/>
        <input type="number" id="Capacity"placeholder="Auditorium Capacity" className='form-control' {...register("Capacity",{required:true})}/>
        <input type="text" id="Sname"placeholder="Auditorium Supervisor Name" className='form-control' {...register("Sname",{required:true})}/>
        <input type="number" id="Phone"placeholder=" Supervisor PhoneNumber" className='form-control' {...register("Phone",{required:true})}/>

        </div>
       
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button  variant="info" onClick={()=>{handleClose()}}>
            <CancelPresentationIcon/>  Close
          </Button>{' '}
          <Button  variant="info" onClick={()=>{saveAudi()}}>
            <SaveAltIcon/>  Save
          </Button>{' '}
        
        </Modal.Footer>
      </Modal>
    </div>
  )
}


export default AllAudis