import React from 'react'
import SideBar from '../SideBar/SideBar'
import Box from '@mui/material/Box';
import NavBar from '../NavBar/NavBar';
function Bookings() {
  return (
    <>
    <NavBar/>
    <Box height={40}/>
    <Box sx={{ display: 'flex' }}>
    <SideBar/>
   <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
    <div className='contain1'>
   <h3>Bookings</h3>
   </div>
 </Box>
    </Box>
    </>
    
  )
}

export default Bookings