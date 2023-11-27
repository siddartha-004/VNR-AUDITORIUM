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
          console.log(myArray2)
          setevent(myArray2)
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
    <div className='contain8'>
    {event.length == 0 && (
      <p className="goby display-5 text-danger text-center">*No Events Registered *
      </p>
    )}
   <h4>Events Registered in Morning</h4>
   
   {loading ? <Spinner /> : (

     
    
<div className='wet'>
       
    
   {event.map(event => (
    <div key={event.eventname}>
      {event.option==="Morning"?
      <div className='row row-cols-3'>
        <Card className="event-card">
      <CardMedia
        component="img"
        height="200"
        image={event.image}
        alt={event.eventname}
      />
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary" style={{ fontWeight: 'bold', fontSize: 'larger' }}>
          {event.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Date:</b> {event.date}
        </Typography>
        {event.eventtime&&
        <Typography variant="body2" color="text.secondary" >
          <b>Timings: </b>{event.eventtime}
        </Typography>
}
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
          {event.description}
        </Typography>
        
        
          
      </CardContent>
    </Card></div>:null}
    </div>
  
      ))}
       
      </div>)}
      <hr/>
      <h4>Events Registered in Afternoon</h4>
      {loading ? <Spinner /> : (

     
    
<div className='wet'>
       
    
       {event.map(event => (
        <div key={event.eventname}>
          {event.option==="Afternoon"?
          <div className='row row-cols-3'>
            <Card className="event-card">
          <CardMedia
            component="img"
            height="200"
            image={event.image}
            alt={event.eventname}
          />
          <CardContent>
            <Typography variant="h6" component="div" color="text.primary" style={{ fontWeight: 'bold', fontSize: 'larger' }}>
              {event.eventname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Date: </b>{event.date}
            </Typography>
           {event.eventtime&& <Typography variant="body2" color="text.secondary">
              <b>Timings: </b>{event.eventtime}
            </Typography>}

            <Typography variant="body2" color="text.secondary">
              <b>Duration: </b>{event.time} hrs
            
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Booked By: </b>{event.coordinatorname}
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
              {event.description}
            </Typography>
            
            
              
          </CardContent>
        </Card></div>:null}
        </div>
      
          ))}
          </div>)}
<hr/>
      <h4>Events Registered For Full Day</h4>
      {loading ? <Spinner /> : (

     
    
<div className='wet'>
 

{event.map(event => (
<div key={event.eventname}>
{event.option==="Full"?
<div className='row row-cols-3'>
  <Card className="event-card">
<CardMedia
  component="img"
  height="200"
  image={event.image}
  alt={event.eventname}
/>
<CardContent>
  <Typography variant="h6" component="div" color="text.primary" style={{ fontWeight: 'bold', fontSize: 'larger' }}>
    {event.eventname}
  </Typography>
  <Typography variant="body2" color="text.secondary">
    <b>Date:</b> {event.date}
  </Typography>
  {event.eventtime&&
  <Typography variant="body2" color="text.secondary">
    <b>Timings: </b>{event.eventtime}
  </Typography>
}
  <Typography variant="body2" color="text.secondary">
    <b>Duration: </b>{event.time} hrs
  
  </Typography>
  <Typography variant="body2" color="text.secondary">
    <b>Booked By: </b>{event.coordinatorname}
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
    {event.description}
  </Typography>
  
  
    
</CardContent>
</Card></div>:null}
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