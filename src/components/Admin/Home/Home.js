import React from 'react'
import NavBar from '../NavBar/NavBar'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SideBar from '../SideBar/SideBar'
function Home() {
  return (
    <>
         <NavBar/>
         <Box height={40}/>
         <Box sx={{ display: 'flex' }}>
         <SideBar/>
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <h1>Hello</h1>
      </Box>
         </Box>
        
    </>
  )
}

export default Home