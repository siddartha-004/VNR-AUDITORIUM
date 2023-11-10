import React,{useState,useEffect} from 'react'
import SideBar1 from '../SideBar1/SideBar1';
import axios from 'axios';
import Box from '@mui/material/Box';
import Spinner from '../../Spinner/Spinner';
import NavBar1 from '../NavBar1/NavBar1';
import "./MyBookings.css"
function MyBookings() {
  let [error,setError]=useState("")
  const [loading, setLoading] = useState(false);
  let [vacant,setvacant]=useState([])
  let getVacancies=()=>{
     axios.get("http://localhost:4000/ConsumerHome-api/vacant-events")
     .then((response)=>{
        if(response.data.message==="available")
        {
        
          setvacant(response.data.payload)
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
      setLoading(false); // Hide the spinner after the request is complete
    });
  }
  useEffect(()=>{
   
      const delay = 3000;


      setLoading(true);
      setTimeout(() => {
       
        getVacancies();
      },delay)
  }, []);
  return (
    <>
    <NavBar1/>
    <Box height={45}/>
    <Box sx={{ display: 'flex' }}>
    <SideBar1/>
   <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
    <div className='contain4'>
   <h4>Vacant Bookings</h4>
   {loading ? <Spinner /> : (
   <div>

   {vacant.length == 0 && (
        <p className="goby display-5 text-danger text-center">*No vacancies *</p>
      )}
  
   <div className="table-container">
 
      
      <table>
        <thead>
          <tr>
            <th>Vacant Date</th>
            <th>Name</th>
            <th>Timings</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
        {vacant.map((item) => (
            <tr key={item.availablaudi}>
              <td>{item.vacantdate}</td>
              <td>{item.availableaudi}</td>
              <td>{item.time}</td>
              <td>{item.capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   </div>
   )}
   </div>
 </Box>
    </Box>
    </>
    
  )
}

export default MyBookings