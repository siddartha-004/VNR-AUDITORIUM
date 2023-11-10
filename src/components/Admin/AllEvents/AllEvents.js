import React,{useState,useEffect} from 'react'
import SideBar from '../SideBar/SideBar'
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import Box from '@mui/material/Box';
import NavBar from '../NavBar/NavBar';
import Spinner from '../../Spinner/Spinner';

import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios'
import './AllEvents.css'
function AllEvents() {
  let [error,setError]=useState("")
  const [loading, setLoading] = useState(false);
  
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
     .finally(() => {
      setLoading(false); // Set loading to false after fetching data
    });
  }
  useEffect(()=>{
    const delay = 3000;


    setLoading(true);
    setTimeout(() => {
     
      getEvents();
    },delay)
    
  }, []);
  return (
    <>
    <NavBar/>
    <Box height={40}/>
    <Box sx={{ display: 'flex' }}>
    <SideBar/>
   <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
    <div className='contain1'>
    {event.length == 0 && (
      <p className="goby display-5 text-danger text-center">*No Events Registered *
      </p>
    )}
   <h4>Events Registered in Morning</h4>
   
   {loading ? <Spinner /> : (

     
    
      <div className='row row-cols-3'>
       
    
   {event.map(event => (
    <div>
      
        <Card className="event-card">
      <CardMedia
        component="img"
        height="200"
        image={event.bookeddetails.who_bookedM.image}
        alt={event.bookeddetails.who_bookedM.eventname}
      />
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary">
          {event.bookeddetails.who_bookedM.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {event.bookeddetails.who_bookedM.date}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Time: Morning
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Booked By: {event.bookeddetails.who_bookedM.coordinatorname}
        </Typography>
        {event.bookeddetails.who_bookedM.clubname&&
        <Typography variant="body2" color="text.secondary">
          Club name: {event.bookeddetails.who_bookedM.clubname}
        </Typography>}
        <Typography variant="body2" color="text.secondary">
          Phone no: {event.bookeddetails.who_bookedM.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location:{event.bookedaudi}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.bookeddetails.who_bookedM.description}
        </Typography>
        
        
          
      </CardContent>
    </Card>
    </div>
  
      ))}
      </div>)}
      <hr/>
      <h4>Events Registered in Afternoon</h4>
      {loading ? <Spinner /> : (
      <div className='row row-cols-3'>
   {event.map(event => (
    <div>
      {event.bookeddetails.who_bookedA&&
        <Card className="event-card">
      <CardMedia
        component="img"
        height="200"
        image={event.bookeddetails.who_bookedA.image}
        alt={event.bookeddetails.who_bookedA.eventname}
      />
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary">
          Event Name: {event.bookeddetails.who_bookedA.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {event.bookeddetails.who_bookedA.date}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Time:Afternoon
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Booked By: {event.bookeddetails.who_bookedA.coordinatorname}
        </Typography>
        {event.bookeddetails.who_bookedA.clubname&&
        <Typography variant="body2" color="text.secondary">
          Club name: {event.bookeddetails.who_bookedA.clubname}
        </Typography>}
        <Typography variant="body2" color="text.secondary">
          Phone no: {event.bookeddetails.who_bookedA.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location:{event.bookedaudi}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.bookeddetails.who_bookedA.description}
        </Typography>
        
        
          
      </CardContent>
    </Card>
}
    </div>
      
  
      ))}
      </div>)}

   </div>
 </Box>
    </Box>
    </>
    
  )
}

export default AllEvents