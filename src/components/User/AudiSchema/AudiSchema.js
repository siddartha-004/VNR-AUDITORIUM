import React from 'react'
import NavBar1 from '../NavBar1/NavBar1';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SideBar1 from '../SideBar1/SideBar1';
import AllAudis1 from '../AllAudis1/AllAudis1';
function AudiSchema() {
  return (
    <>
         <NavBar1/>
         <Box height={40}/>
         <Box sx={{ display: 'flex' }}>
         <SideBar1/>
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <div className='contain1' >
        <div className='Title1'>
            <h4>Auditoriums in <span>VNR VJIET</span></h4>
           
        </div>
        <div className='allaudis'>
             
            
        <AllAudis1/>
            </div>
        
    </div>
      </Box>
         </Box> 
       
        
    </>
  )
}

export default AudiSchema