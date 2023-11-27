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
  
  let [eventM1,seteventM1]=useState([])
  let [eventA1,seteventA1]=useState([])
  let [eventF1,seteventF1]=useState([])
  let [eventM2,seteventM2]=useState([])
  let [eventA2,seteventA2]=useState([])
  let [eventF2,seteventF2]=useState([])
  let getTodayEvents=()=>{
    axios.get("http://localhost:4000/ConsumerHome-api/current-event")
    .then((response)=>{
       if(response.data.message==="having")
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
        const myArray4=[];
        for(const item in myArray2)
        {
          if(myArray2[item].option==="Morning")
          {
             myArray4.push(myArray2[item]);
          }
        }
        const myArray5=[];
        for(const item in myArray2)
        {
          if(myArray2[item].option==="Afternoon")
          {
             myArray5.push(myArray2[item]);
          }
        }
        const myArray6=[];
        for(const item in myArray2)
        {
          if(myArray2[item].option==="Full")
          {
             myArray6.push(myArray2[item]);
          }
        }
       console.log(myArray4,"4")
       console.log(myArray5,"5");
       console.log(myArray6,"6");
        seteventM1(myArray4)
        seteventA1(myArray5)
        seteventF1(myArray6)
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
     getTodayEvents();},1000);
     return () => clearInterval(interval);
 }, []);
 let getTomorrowsEvents=()=>{
  axios.get("http://localhost:4000/ConsumerHome-api/upcoming-event")
  .then((response)=>{
    if(response.data.message==="having")
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
     const myArray4=[];
     for(const item in myArray2)
     {
       if(myArray2[item].option==="Morning")
       {
          myArray4.push(myArray2[item]);
       }
     }
     const myArray5=[];
     for(const item in myArray2)
     {
       if(myArray2[item].option==="Afternoon")
       {
          myArray5.push(myArray2[item]);
       }
     }
     const myArray6=[];
     for(const item in myArray2)
     {
       if(myArray2[item].option==="Full")
       {
          myArray6.push(myArray2[item]);
       }
     }
    console.log(myArray4,"41")
    console.log(myArray5,"51");
    console.log(myArray6,"61");
     seteventM2(myArray4)
     seteventA2(myArray5)
     seteventF2(myArray6)
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
        {/* <Typography variant="body2" color="text.secondary">
         Events
         
        </Typography> */}
      </CardContent>
      
    </Card>
    </Stack>
    <Stack spacing={3} direction="row">
    <Card sx={{width: 49+"%",height:160 }} className="gradient">
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Bookings
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Bookings
        </Typography> */}
      </CardContent>
      
    </Card>
    <Card sx={{ width: 49+"%",height:160 }} className="gradientlight1">
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Add User
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
       <div className='wet'>
       
       {eventM1.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No Events Today ! *</p>
      )}
      
      <div className='row row-cols-2'>
     {eventM1.map(eventM1 => (
    <div key={eventM1.eventname}>
      {eventM1.option==="Morning"?
     
        <Card className="event-card2">
      <CardMedia
        component="img"
        height="200"
        image={eventM1.image}
        alt={eventM1.eventname}
      />
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary" style={{ fontWeight: 'bold', fontSize: 'larger' }}>
          {eventM1.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Date:</b> {eventM1.date}
        </Typography>
        <Typography variant="body2" color="text.secondary" >
          <b>Timings: </b>{eventM1.eventtime}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Duration: </b>{eventM1.time} hrs
        
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Booked By:</b>{eventM1.coordinatorname}
        </Typography>
        {eventM1.clubname&&
        <Typography variant="body2" color="text.secondary">
          <b>Club name: </b>{eventM1.clubname}
        </Typography>}
        <Typography variant="body2" color="text.secondary">
          <b>Phone no: </b>{eventM1.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Location:</b>{eventM1.bookedaudi}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {eventM1.description}
        </Typography>
        
        
          
      </CardContent>
    </Card>:null}
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
       
       {eventM2.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No Events Tomorrow! *</p>
      )}
      <div className='ferr'>
      {eventM2.map(eventM2 => (
  <div >
     
   {eventM2.option==="Morning"&&     <Card className="event-card1">
      
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary">
          {eventM2.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Date:</b> {eventM2.date}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Timings:</b> {eventM2.eventtime}
        </Typography>
      

        <Typography variant="body2" color="text.secondary">
          <b>Booked By:</b> {eventM2.coordinatorname}
        </Typography>
        {eventM2.clubname&&
        <Typography variant="body2" color="text.secondary">
          <b>Club name: </b>{eventM2.clubname}
        </Typography>}
       
        <Typography variant="body2" color="text.secondary">
          <b>Phone no: </b>{eventM2.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Location:</b>{eventM2.bookedaudi}
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
       <div className='wet1'>
       
       {eventA1.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No Events Today ! *</p>
      )}
      
      <div className='row row-cols-2'>
     {eventA1.map(eventA1 => (
    <div key={eventA1.eventname}>
      {eventA1.option==="Afternoon"&&
     
        <Card className="event-card2">
      <CardMedia
        component="img"
        height="200"
        image={eventA1.image}
        alt={eventA1.eventname}
      />
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary" style={{ fontWeight: 'bold', fontSize: 'larger' }}>
          {eventA1.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Date:</b> {eventA1.date}
        </Typography>
        <Typography variant="body2" color="text.secondary" >
          <b>Timings: </b>{eventA1.eventtime}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Duration: </b>{eventA1.time} hrs
        
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Booked By:</b>{eventA1.coordinatorname}
        </Typography>
        {eventA1.clubname&&
        <Typography variant="body2" color="text.secondary">
          <b>Club name: </b>{eventA1.clubname}
        </Typography>}
        <Typography variant="body2" color="text.secondary">
          <b>Phone no: </b>{eventA1.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Location:</b>{eventA1.bookedaudi}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {eventA1.description}
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
      {eventA2.map(eventA2 => (
  <div >
     
   {eventA2.option==="Afternoon"&&     <Card className="event-card1">
      
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary">
          {eventA2.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Date:</b> {eventA2.date}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Timings:</b> {eventA2.eventtime}
        </Typography>
      

        <Typography variant="body2" color="text.secondary">
          <b>Booked By:</b> {eventA2.coordinatorname}
        </Typography>
        {eventA2.clubname&&
        <Typography variant="body2" color="text.secondary">
          <b>Club name: </b>{eventA2.clubname}
        </Typography>}
       
        <Typography variant="body2" color="text.secondary">
          <b>Phone no: </b>{eventA2.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Location:</b>{eventA2.bookedaudi}
        </Typography>
      
       
          
      </CardContent>
    </Card>}
  
 
    

      
    
    
 

  </div>
 
 
    

      
    
      ))}
    
      
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
       <h4>Events Ongoing Today Full</h4>
       <div className='wet1'>
       
       {eventF1.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No Events Today ! *</p>
      )}
      
      <div className='row row-cols-2'>
     {eventF1.map(eventF1 => (
    <div key={eventF1.eventname}>
      {eventF1.option==="Full"&&
     
        <Card className="event-card2">
      <CardMedia
        component="img"
        height="200"
        image={eventF1.image}
        alt={eventF1.eventname}
      />
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary" style={{ fontWeight: 'bold', fontSize: 'larger' }}>
          {eventF1.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Date:</b> {eventF1.date}
        </Typography>
        <Typography variant="body2" color="text.secondary" >
          <b>Timings: </b>{eventF1.eventtime}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Duration: </b>{eventF1.time} hrs
        
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Booked By:</b>{eventF1.coordinatorname}
        </Typography>
        {eventF1.clubname&&
        <Typography variant="body2" color="text.secondary">
          <b>Club name: </b>{eventF1.clubname}
        </Typography>}
        <Typography variant="body2" color="text.secondary">
          <b>Phone no: </b>{eventF1.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Location:</b>{eventF1.bookedaudi}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {eventF1.description}
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
        <h5>Events Upcoming tomorrow Full!</h5>
        <div className='ferr'>
       
       {eventF2.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No Events Tomorrow! *</p>
      )}
      <div className='ferr'>
      {eventF2.map(eventF2 => (
  <div >
     
   {eventF2.option==="Full"&&     <Card className="event-card1">
      
      <CardContent>
        <Typography variant="h6" component="div" color="text.primary">
          {eventF2.eventname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Date:</b> {eventF2.date}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Timings:</b> {eventF2.eventtime}
        </Typography>
      

        <Typography variant="body2" color="text.secondary">
          <b>Booked By:</b> {eventF2.coordinatorname}
        </Typography>
        {eventF2.clubname&&
        <Typography variant="body2" color="text.secondary">
          <b>Club name: </b>{eventF2.clubname}
        </Typography>}
       
        <Typography variant="body2" color="text.secondary">
          <b>Phone no: </b>{eventF2.phonenumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Location:</b>{eventF2.bookedaudi}
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