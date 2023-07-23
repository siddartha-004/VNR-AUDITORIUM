import React from 'react'
import NavBar1 from '../NavBar1/NavBar1';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SideBar1 from '../SideBar1/SideBar1';
function AllEvents1() {
  return (
    <>
         <NavBar1/>
         <Box height={40}/>
         <Box sx={{ display: 'flex' }}>
         <SideBar1/>
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <h1>All Events from userside</h1>
      </Box>
         </Box> 
       
        
    </>
  )
}

export default AllEvents1