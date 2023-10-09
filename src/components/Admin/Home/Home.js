import React from 'react'
import NavBar from '../NavBar/NavBar'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SideBar from '../SideBar/SideBar'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Stack } from '@mui/material';
import './Home.css';
import { Calendar, theme } from 'antd';



function Home() {
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

  return (
    <>
         <NavBar/>
         <Box height={40}/>
         <Box sx={{ display: 'flex' }}>
         <SideBar/>
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
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
         Events
         
        </Typography>
      </CardContent>
      
    </Card>
    </Stack>
    <Stack spacing={3} direction="row">
    <Card sx={{width: 49+"%",height:160 }} className="gradient">
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bookings
        </Typography>
      </CardContent>
      
    </Card>
    <Card sx={{ width: 49+"%",height:160 }} className="gradientlight1">
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <div className='heading'>
          Add User
          </div>
        </Typography>
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
        <Box height={20}/>
        <Grid container spacing={2}>
          <Grid item xs={8}>
          <Card sx={{ height:80+"vh"}}>
      
      <CardContent>
       <h4>Auditorium Supervisor's details</h4>
       <div className='row row-cols-3'>
       <Card sx={{ maxWidth: 49+"%",height:130 }} className="gradientlight4" >
      
      <CardContent>
         <img src="https://cdn.dribbble.com/users/898072/screenshots/3197134/111.gif" className='gifimage'/>
      </CardContent>
      
    </Card>
  
     </div>
      </CardContent>
      
    </Card>
          </Grid>
          <Grid item xs={4}>
          <Card sx={{ height:80+"vh"}}>
      
      <CardContent>
        <h5>Event Upcoming!</h5>
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

export default Home