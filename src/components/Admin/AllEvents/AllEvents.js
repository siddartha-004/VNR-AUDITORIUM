import React,{useState,useEffect} from 'react'
import SideBar from '../SideBar/SideBar'
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import Box from '@mui/material/Box';
import NavBar from '../NavBar/NavBar';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios'
import './AllEvents.css'
function AllEvents() {
  let [error,setError]=useState("")
  
  let [event,setevent]=useState([])
  let getEvents=()=>{
     axios.get("http://localhost:4000/ConsumerHome-api/nonvacant-events")
     .then((response)=>{
        if(response.data.message==="booked")
        {
        
          console.log("got ah");
          setevent(response.data.payload)
          console.log(response.data.payload)
        
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
      getEvents();},1000);
      return () => clearInterval(interval);
  }, []);
  return (
    <>
    <NavBar/>
    <Box height={40}/>
    <Box sx={{ display: 'flex' }}>
    <SideBar/>
   <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
    <div className='contain1'>
   <h4>Events Registered</h4>
   {event.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No Events Registered *</p>
      )}
      <div className='row row-cols-3'>
   {event.map(event => (
    
        <Card className="event-card">
      <CardMedia
        component="img"
        height="200"
        image={event.bookeddetails.who_booked.image}
        alt={event.bookeddetails.who_booked.eventname}
      />
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary">
          {event.bookeddetails.who_booked.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {event.bookeddetails.who_booked.date}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Booked By: {event.bookeddetails.who_booked.clubname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Phone no: {event.bookeddetails.who_booked.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location:{event.bookedaudi}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.bookeddetails.who_booked.description}
        </Typography>
        
        
          
      </CardContent>
    </Card>
    
      ))}
      </div>

   </div>
 </Box>
    </Box>
    </>
    
  )
}

export default AllEvents