import React from 'react'
import SideBar from '../SideBar/SideBar'
import Box from '@mui/material/Box';
import NavBar from '../NavBar/NavBar';
function AllEvents() {
  return (
    <>
    <NavBar/>
    <Box height={40}/>
    <Box sx={{ display: 'flex' }}>
    <SideBar/>
   <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
   <h1>Events</h1>
 </Box>
    </Box>
    </>
    
  )
}

export default AllEvents