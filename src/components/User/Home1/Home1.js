import React,{useState,useEffect} from 'react'
import NavBar1 from '../NavBar1/NavBar1';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SideBar1 from '../SideBar1/SideBar1';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import {CardMedia} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios'
import CardContent from '@mui/material/CardContent';
import { Stack } from '@mui/material';
import './Home1.css';
import { Calendar, theme } from 'antd';



function Home1() {
  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    height:300
  };
  let [error,setError]=useState("")
  
  let [event1,setevent1]=useState([])
  let [event2,setevent2]=useState([])
  let getTodayEvents=()=>{
    axios.get("http://localhost:4000/ConsumerHome-api/current-event")
    .then((response)=>{
       if(response.data.message==="having")
       {
       
       
         setevent1(response.data.payload)
       
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
     getTodayEvents();},1000);
     return () => clearInterval(interval);
 }, []);
 let getTomorrowsEvents=()=>{
  axios.get("http://localhost:4000/ConsumerHome-api/upcoming-event")
  .then((response)=>{
     if(response.data.message==="having")
     {
     
    
      console.log(response.data.payload)
       setevent2(response.data.payload)
     
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
   getTomorrowsEvents();},1000);
   return () => clearInterval(interval);
}, []);

  return (
    <>
         <NavBar1/>
         <Box height={40}/>
         <Box sx={{ display: 'flex' }}>
         <SideBar1/>
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <div className='contain3'>
        
        <Grid container spacing={2}>
          <Grid item xs={8}>
          <Stack spacing={2}>
          <Stack spacing={2} direction="row">
          <Card sx={{ maxWidth: 49+"%",height:160 }} className="gradientlight3" >
      
      <CardContent>
         <img src="https://cdn.dribbble.com/users/898072/screenshots/3197134/111.gif" className='gifimage'/>
      </CardContent>
      
    </Card>
    <Card sx={{ width: 49+"%",height:160 }} className="gradientlight2">
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Events
        </Typography>
       
      </CardContent>
      
    </Card>
    </Stack>
    <Stack spacing={3} direction="row">
    <Card sx={{width: 49+"%",height:160 }} className="gradient">
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Vacancies
        </Typography>
       
      </CardContent>
      
    </Card>
    <Card sx={{ width: 49+"%",height:160 }} className="gradientlight1">
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Auditoriums
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          <div className='heading'>
          Add User
          </div>
        </Typography> */}
      </CardContent>
      
    </Card>
    </Stack>
    </Stack>
          </Grid>
          <Grid item xs={4}>
          <Stack spacing={2}>
          <Card sx={{ maxWidth: 345 }}>
      
      <CardContent>
      <div style={wrapperStyle}>
      <Calendar fullscreen={false} onPanelChange={onPanelChange} />
    </div>
        
      </CardContent>
      
    </Card>
    
 
            </Stack>
          </Grid>
        </Grid>
        <Box height={40}/>
        <Grid container spacing={1}>
          <Grid item xs={8}>
          <Card sx={{ height:100+"%"}}>
      
      <CardContent>
       <h4>Events Ongoing Today Morning!</h4>
       <div className='fer'>
       
       {event1.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No Events Today ! *</p>
      )}
      
      <div className='row row-cols-2'>
      {event1.map(event1 => (
  <div >
     
   {event1.bookeddetails.who_bookedM&&    <Card className="event-card">
    <CardMedia
      component="img"
      height="200"
      image={event1.bookeddetails.who_bookedM?.image}
      alt={event1.bookeddetails.who_bookedM?.eventname}
    />
    <CardContent>
      <Typography variant="h6" component="div" color="text.primary">
        {event1.bookeddetails.who_bookedM?.eventname}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Date: {event1.bookeddetails.who_bookedM?.date}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Time: Morning
      </Typography>
      <Typography variant="body2" color="text.secondary">
          Booked By: {event1.bookeddetails.who_bookedM?.coordinatorname}
        </Typography>
        {event1.bookeddetails.who_bookedM.clubname&&
        <Typography variant="body2" color="text.secondary">
          Club name: {event1.bookeddetails.who_bookedM?.clubname}
        </Typography>}
      <Typography variant="body2" color="text.secondary">
        Phone no: {event1.bookeddetails.who_bookedM?.phonenumber}
      </Typography>
     {event1.bookeddetails.who_bookedM&& <Typography variant="body2" color="text.secondary">
        Location:{event1.bookedaudi}
      </Typography>}
      <Typography variant="body2" color="text.secondary">
        {event1.bookeddetails.who_bookedM?.description}
      </Typography>
     
        
    </CardContent>
  </Card>}
  
 
    

      
    
    
 

  </div>
 
 
    

      
    
      ))}
   
      </div>
     
     </div>
      </CardContent>
      
    </Card>
          </Grid>
          <Grid item xs={4}>
          <Card sx={{ height:100+"%"}}>
      
      <CardContent>
        <h5>Morning Events Upcoming!</h5>
        <div className='ferr'>
       
       {event2.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No Events Tomorrow! *</p>
      )}
      <div className='ferr'>
      {event2.map(event2 => (
  <div >
     
   {event2.bookeddetails.who_bookedM&&     <Card className="event-card1">
      
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary">
          {event2.bookeddetails.who_bookedM?.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {event2.bookeddetails.who_bookedM?.date}
        </Typography>
       
        <Typography variant="body2" color="text.secondary">
          Booked By: {event2.bookeddetails.who_bookedM?.coordinatorname}
        </Typography>
        {event2.bookeddetails.who_bookedM.clubname&&
        <Typography variant="body2" color="text.secondary">
          Club name: {event2.bookeddetails.who_bookedM?.clubname}
        </Typography>}
        <Typography variant="body2" color="text.secondary">
          Phone no: {event2.bookeddetails.who_bookedM?.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location:{event2.bookedaudi}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event2.bookeddetails.who_bookedM?.description}
        </Typography>
       
          
      </CardContent>
    </Card>}
  
 
    

      
    
    
 

  </div>
 
 
    

      
    
      ))}
    
      
      </div>
     </div>
      </CardContent>
      
    </Card>
          </Grid>
        </Grid>
        <Box height={40}/>
        <Grid container spacing={1}>
          <Grid item xs={8}>
          <Card sx={{ height:100+"%"}}>
      
      <CardContent>
       <h4>Events Ongoing Today Afternoon!</h4>
       <div className='fer'>
       
       {event1.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No Events Today ! *</p>
      )}
      
      <div className='row row-cols-2'>
      {event1.map(event1 => (
  <div >
     
   {event1.bookeddetails.who_bookedA&&    <Card className="event-card">
    <CardMedia
      component="img"
      height="200"
      image={event1.bookeddetails.who_bookedA?.image}
      alt={event1.bookeddetails.who_bookedA?.eventname}
    />
    <CardContent>
      <Typography variant="h6" component="div" color="text.primary">
        {event1.bookeddetails.who_bookedA?.eventname}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Date: {event1.bookeddetails.who_bookedA?.date}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Time: Afternoon
      </Typography>
     
      <Typography variant="body2" color="text.secondary">
          Booked By: {event1.bookeddetails.who_bookedA?.coordinatorname}
        </Typography>
        {event1.bookeddetails.who_bookedA.clubname&&
        <Typography variant="body2" color="text.secondary">
          Club name: {event1.bookeddetails.who_bookedA?.clubname}
        </Typography>}
      <Typography variant="body2" color="text.secondary">
        Phone no: {event1.bookeddetails.who_bookedA?.phonenumber}
      </Typography>
     {event1.bookeddetails.who_bookedA&& <Typography variant="body2" color="text.secondary">
        Location:{event1.bookedaudi}
      </Typography>}
      <Typography variant="body2" color="text.secondary">
        {event1.bookeddetails.who_bookedA?.description}
      </Typography>
     
        
    </CardContent>
  </Card>}
  
 
    

      
    
    
 

  </div>
 
 
    

      
    
      ))}
   
      </div>
     
     </div>
      </CardContent>
      
    </Card>
          </Grid>
          <Grid item xs={4}>
          <Card sx={{ height:100+"%"}}>
      
      <CardContent>
        <h5>Afternoon Events Upcoming!</h5>
        <div className='ferr'>
       
       {event2.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No Events Tomorrow! *</p>
      )}
      <div className='ferr'>
      {event2.map(event2 => (
  <div >
     
   {event2.bookeddetails.who_bookedA&&     <Card className="event-card1">
      
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary">
          {event2.bookeddetails.who_bookedA?.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {event2.bookeddetails.who_bookedA?.date}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Booked By: {event2.bookeddetails.who_bookedA?.coordinatorname}
        </Typography>
        {event2.bookeddetails.who_bookedA.clubname&&
        <Typography variant="body2" color="text.secondary">
          Club name: {event2.bookeddetails.who_bookedA?.clubname}
        </Typography>}
        <Typography variant="body2" color="text.secondary">
          Phone no: {event2.bookeddetails.who_bookedA?.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location:{event2.bookedaudi}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event2.bookeddetails.who_bookedA?.description}
        </Typography>
       
          
      </CardContent>
    </Card>}
  
 
    

      
    
    
 

  </div>
 
 
    

      
    
      ))}
    
      
      </div>
     </div>
      </CardContent>
      
    </Card>
          </Grid>
        </Grid>
        </div>
      </Box>
         </Box>
        
    </>
  )
}

export default Home1