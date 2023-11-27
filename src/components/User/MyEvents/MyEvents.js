import React,{useState,useEffect,useContext} from 'react'
import StadiumIcon from '@mui/icons-material/Stadium';
import Swal from 'sweetalert2'
import SideBar1 from '../SideBar1/SideBar1';
import success from '../../../images/success.mp3'
import axios from 'axios';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import pdfFile from '../../finalMe.pdf'
import Button from 'react-bootstrap/Button'
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import Spinner from '../../Spinner/Spinner';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import NavBar1 from '../NavBar1/NavBar1';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Groups3Icon from '@mui/icons-material/Groups3';

import {useForm} from 'react-hook-form'
import './MyEvents.css'
function MyEvents() {

  let {register,handleSubmit,reset,formState:{errors},setValue,getValues}=useForm();
  const [pdfBytes, setPdfBytes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newData,setnewDate] = useState(null)


  let [Audi1,setAudi1]=useState([])
  let [error,setError]=useState("")
  const audioElement = new Audio(success);
  audioElement.style.display = 'none'; // Hide the audio element
  let deleteEvent =(Event) =>{
    console.log(Event);
   
   
    if(window.confirm(`Are you sure you want to delete? ${Event.eventname}`)){
      axios.post("http://localhost:4000/ConsumerHome-api/remove-event",Event).then((response)=>{
        audioElement.play(); 
       
       
    Swal.fire({
      icon: 'success',
      title: Event.eventname,
      text:'Deleted Successfully',
    });
    setTimeout(()=>{
      window.location.reload(true);
    },1000);
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
  const loadPdfFromFile = async (newData) => {
    try {
      const pdfData = await fetch(pdfFile).then((response) => response.arrayBuffer());

      // Load the PDF document
      const pdfDoc = await PDFDocument.load(pdfData);

      // Modify the PDF as needed
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Add text to the first page with custom font size and font
      firstPage.drawText(newData.eventname, {
        x: 250,
        y: 550,
        size: 12, // Adjust the font size as needed
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica), // Use a standard font like Helvetica
      });
      firstPage.drawText('Sailaja', {
        x: 415,
        y: 395,
        size: 12, // Adjust the font size as needed
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica), // Use a standard font like Helvetica
      });
      firstPage.drawText('Sailaja', {
        x: 270,
        y: 632,
        size: 12, // Adjust the font size as needed
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica), 
      });
      firstPage.drawText(newData.coordinatorname, {
        x: 213,
        y: 572,
        size: 12, // Adjust the font size as needed
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica), 
      });
      firstPage.drawText(newData.date, {
        x: 472,
        y: 691,
        size: 12, // Adjust the font size as needed
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica), 
      });
      firstPage.drawText(newData.date, {
        x: 213  ,
        y: 654,
        size: 12, // Adjust the font size as needed
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica), 
      });
      firstPage.drawText(newData.date, {
        x: 405,
        y: 633,
        size: 12, // Adjust the font size as needed
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica), 
      });
      firstPage.drawText(newData.date, {
        x: 300,
        y: 593,
        size: 12, // Adjust the font size as needed
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica), // Use a standard font like Helvetica
      });

      // Serialize the edited PDF to bytes
      const editedPdfBytes = await pdfDoc.save();

      // Set the edited PDF bytes
      setPdfBytes(editedPdfBytes);
      return editedPdfBytes;
    } catch (error) {
      console.error('Error loading or editing PDF:', error);
    }
  };
  const handleDownloadPdf = async(data) => {
    try{
      console.log(newData)
    setnewDate(data)
    loadPdfFromFile(data);
    setnewDate(null);
    const pdfBytes = await loadPdfFromFile(data);

    if (pdfBytes) {
      

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'edited_pdf.pdf';
      setnewDate(null)
      link.click();
      
      
    }else{
      console.error('No PDF content available for the event:', data);
      setValue(null);
    }}catch (error) {
      console.error('Error handling PDF download:', error);
      setnewDate(null);
    }
  
  };
  let getAudis1=()=>{
    let token=localStorage.getItem("token")
     axios.get("http://localhost:4000/AdminHome-api/get-myEvents",{headers:{"Authorization":"Bearer "+token}})
     .then((response)=>{
       console.log(response.data)
        if(response.data.message==="jwt expired")
        {
          Swal.fire({
            icon: 'error',
            title: response.data.message,
            text: "Relogin again",
          });
        }
        if(response.data.message==="booked"){
          const myArray = response.data.payload;
          const myArray2=[];
          const myArray3=[];
          for(const item in myArray)
          {
            console.log(myArray[item])
            if (myArray3.includes(myArray[item].eventname)) {
              console.log('Element is present');
              continue;
            } else {
              console.log('Element is not present');
              myArray3.push(myArray[item].eventname);
              myArray2.push(myArray[item]);
            }
          }
          
          setAudi1(myArray2)
      
          
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
     .finally(() => {
      setLoading(false); // Hide the spinner after the request is complete
    });
  }
  useEffect(()=>{
    
    
      getAudis1();
      
       
  }, []);

  // useEffect(()=>{
  
  //   loadPdfFromFile(newData)
   
  // },[newData])
   
  
  
    
    
  return (
    <>
    <NavBar1/>
    <Box height={45}/>
    <Box sx={{ display: 'flex' }}>
    <SideBar1/>
   <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
    <div className='contain8'>
    {Audi1.length == 0 && (
      <p className="goby display-5 text-danger text-center">*No Events Registered *
      </p>
    )}
   <h4>My events</h4>
 
      
      
      
        {loading ? <Spinner /> : (

     
    
<div className='wet'>
       
    
   {Audi1.map(event => (
    <div key={event.eventname}>
      {
      <div className='row row-cols-3'>
        <Card className="event-card">
      <CardMedia
        component="img"
        height="200"
        image={event.image}
        alt={event.eventname}
      />
      <CardContent>
      <div className='icons'><button><DeleteIcon className='icon2' onClick={()=>{deleteEvent(event)}}/></button></div>
        <Typography variant="h6" component="div" color="text.primary" style={{ fontWeight: 'bold', fontSize: 'larger' }}>
          {event.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Date:</b> {event.date}
        </Typography>
        <Typography variant="body2" color="text.secondary" >
          <b>Timings: </b>{event.eventtime}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Duration: </b>{event.time} hrs
        
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Booked By:</b>{event.coordinatorname}
        </Typography>
        {event.clubname&&
        <Typography variant="body2" color="text.secondary">
          <b>Club name: </b>{event.clubname}
        </Typography>}
        <Typography variant="body2" color="text.secondary">
          <b>Phone no: </b>{event.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Location:</b>{event.bookedaudi}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Location:</b>{event.option}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {event.description}
        </Typography>
        <div className='icons6'>
        <Button  variant="info" onClick={() => handleDownloadPdf(event)}>
            <SaveAltIcon/> Download
          </Button>{' '}
          </div>
        
        
          
      </CardContent>
    </Card></div>}
    </div>
  
      ))}
      </div>)}
      
      
   
    </div>
    </Box>
    </Box>
    </>
  )
}


export default MyEvents