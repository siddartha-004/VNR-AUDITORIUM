import React,{useEffect,useState} from 'react'
import NavBar1 from '../NavBar1/NavBar1';
import { PlusOutlined } from '@ant-design/icons';
import './BookAudi.css'
import {useNavigate} from 'react-router-dom'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import pdfFile from '../../finalMe.pdf'
import Swal from 'sweetalert2'
import {Form,Input,InputNumber,DatePicker, TimePicker,Upload} from 'antd'
import moment from 'moment'
import img2 from '../../../images/6.svg'
import {useForm} from 'react-hook-form'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SideBar1 from '../SideBar1/SideBar1';
import FormItem from 'antd/es/form/FormItem';
function BookAudi() {
  let navigate=useNavigate()
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let {
    register,
    handleSubmit,reset,
    formState: { errors },
  } = useForm();
  let [error, setError] = useState("");
  let [selectedFile,setSelectedFile]=useState(null)
  const [pdfBytes, setPdfBytes] = useState(null);
  const [newData,setnewDate] = useState(null)
  const [audiname,setaudiname]=useState("")
  useEffect(()=>{
    console.log(newData,"asdfasfas")
    console.log(audiname,"gyhyh")
    loadPdfFromFile(newData)
    if(audiname!=="")
    {
    email()
    }
  },[newData,audiname])
  // useEffect(() => {
    // Load the PDF file directly from the import
    const email=()=>{
      axios.post('http://localhost:4000/ConsumerHome-api/send-email', {
      recipient: newData.email,
      subject: 'Auditorium Booked Successfully',
      message: audiname,
      //pdf: link.href, 
    })
      .then(response => {
        console.log(response.data);
        
      })
      .catch(error => {
        console.error(error);
      
      });

    }
    const loadPdfFromFile = async (newData) => {
      try {
        const pdfData = await fetch(pdfFile).then((response) => response.arrayBuffer());

        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfData);

        // Modify the PDF as needed
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Add text to the first page with custom font size and font
        firstPage.drawText(newData.eventname, {
          x: 250,
          y: 550,
          size: 12, // Adjust the font size as needed
          color: rgb(0, 0, 0),
          font: await pdfDoc.embedFont(StandardFonts.Helvetica), // Use a standard font like Helvetica
        });
        firstPage.drawText('Sailaja', {
          x: 415,
          y: 395,
          size: 12, // Adjust the font size as needed
          color: rgb(0, 0, 0),
          font: await pdfDoc.embedFont(StandardFonts.Helvetica), // Use a standard font like Helvetica
        });
        firstPage.drawText('Sailaja', {
          x: 270,
          y: 632,
          size: 12, // Adjust the font size as needed
          color: rgb(0, 0, 0),
          font: await pdfDoc.embedFont(StandardFonts.Helvetica), 
        });
        firstPage.drawText(newData.clubname, {
          x: 213,
          y: 572,
          size: 12, // Adjust the font size as needed
          color: rgb(0, 0, 0),
          font: await pdfDoc.embedFont(StandardFonts.Helvetica), 
        });
        firstPage.drawText(newData.date, {
          x: 472,
          y: 691,
          size: 12, // Adjust the font size as needed
          color: rgb(0, 0, 0),
          font: await pdfDoc.embedFont(StandardFonts.Helvetica), 
        });
        firstPage.drawText(newData.date, {
          x: 213  ,
          y: 654,
          size: 12, // Adjust the font size as needed
          color: rgb(0, 0, 0),
          font: await pdfDoc.embedFont(StandardFonts.Helvetica), 
        });
        firstPage.drawText(newData.date, {
          x: 405,
          y: 633,
          size: 12, // Adjust the font size as needed
          color: rgb(0, 0, 0),
          font: await pdfDoc.embedFont(StandardFonts.Helvetica), 
        });
        firstPage.drawText(newData.date, {
          x: 300,
          y: 593,
          size: 12, // Adjust the font size as needed
          color: rgb(0, 0, 0),
          font: await pdfDoc.embedFont(StandardFonts.Helvetica), // Use a standard font like Helvetica
        });

        // Serialize the edited PDF to bytes
        const editedPdfBytes = await pdfDoc.save();

        // Set the edited PDF bytes
        setPdfBytes(editedPdfBytes);
      } catch (error) {
        console.error('Error loading or editing PDF:', error);
      }
    };

    // loadPdfFromFile();
  // }, [newData]);

  const handleDownloadPdf = () => {
    if (pdfBytes) {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'edited_pdf.pdf';
      link.click();
      
      
    }
  };


  const onFileSelect=(e)=>{
    setSelectedFile(e.target.files[0])
   }
   let addNewSearch = (newSearch) => {
  
     let fd=new FormData();
    

     fd.append("search",JSON.stringify(newSearch))
   
    fd.append("photo",selectedFile)
    
    axios
    .post("http://localhost:4000/ConsumerHome-api/book-audi", fd)
    .then((response) => {
      if (response.status === 201) {
        if(response.data.pay===1)
        {
          setnewDate(newSearch)
          setaudiname(response.data.message)
          console.log("added")
          Swal.fire({
            icon: 'success',
            title:'Booked Successfully',
            text:response.data.message
            // text: 'New '+newUser.typeofuser+' has been registered successfully.',
          });
          reset();
        
          handleShow();
          
        
          
        }else if(response.data.pay===2){
          Swal.fire({
            icon: 'warning',
            title: 'Cannot Book due to Unavailability',
            text:'  Available Auditoriums for next three days : '+response.data.message,
          });
          reset();
        }else{
          Swal.fire({
            icon: 'warning',
            title: 'Cannot Book due to Unavailability',
            text:response.data.message,
          });
          reset();
        }
        }
        if(response.status!=201){
          console.log(response.data.message)
          
          Swal.fire({
            icon: 'error',
            title: 'Cannnot Book.Try Again!',
            text:response.data.message,
          });
        }
      })
      .catch((err) => {
        if (err.response) {
          setError(err.message);
        }
        else if (err.request) {
          setError(err.message);
        }
        else {
          setError(err.message);
        }
      });
     
  };
  return (
    <>
         <NavBar1/>
         <Box height={40}/>
         <Box sx={{ display: 'flex' }}>
         <SideBar1/>
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <div className='contain12' >
       
        
       <div className='title1'>
           <h4>Create an Event</h4>
       </div>
       <div className='create1'>
         <div className='sign-event' >
           
          
           <form onSubmit={handleSubmit(addNewSearch)}>
           {/* username */}
           <div className="item2 mb-4">
             <label htmlFor="name">clubname:</label>
             <input
               type="text"
               id="clubname"
               className="form-control"
               placeholder="e.g. Computer Society of India" 
               {...register("clubname", { required: true })}
             />
             </div>
             <div className="item2 mb-4">
             <label htmlFor="name">event name:</label>
             <input
               type="text"
               id="clubname"
               className="form-control"
               placeholder="e.g. Computer Society of India" 
               {...register("eventname", { required: true })}
             />
           
           </div>
           {/* email */}
           <div className="item2 mb-4">
             <label htmlFor="name">PhoneNo:</label>
             <input
               type="text"
               id="phonenumber"
               className="form-control"
             
               {...register("phonenumber", { required: true,maxLength:"10",minLength:"10" })}
             />
             
             
           </div>
           
           <div className="item2 mb-4">
             <label htmlFor="name">Email:</label>
             <input
               type="email"
               placeholder="e.g. example@mail.com"
               id="email1"
               className="form-control"
               {...register("email", { required: true })}
             />
             
            
           </div>
           <div className="item2 mb-4">
             <label htmlFor="name">Poster of Event:</label>
             
             <input
               type="file"
               id="myfile"
               className="form-control"
               {...register("image", { required: true })}
               onInput={onFileSelect}
             />
             
           
           </div>
           <div className="item2 mb-4">
             <label htmlFor="name">Description:</label>
             <textarea id="description" placeholder="......" className='form-control' {...register("description",{required:true})}/>
             </div>
             
           <div className="item2 mb-4">
             <label htmlFor="name">Capacity:</label>
           <input type="number" id="Capacity"placeholder="Auditorium Capacity" className='form-control' {...register("Capacity",{required:true})}/>
            </div>

            <div className="item2 mb-4">
             <label htmlFor="name">Date of event:</label>
           <input type="date" id="date"placeholder="Booking date" className='form-control' {...register("date",{required:true})}/>
            </div>
            
            
            
           {/* submit button */}
           <button type="submit" className="btn1 btn-success">
             Book
           </button>
         </form>
         
         </div>
          <div className='picture1'>
           <img src={img2} className='imge' alt='not available'/>
          </div>
          
          </div>
       
           
       
   </div>
   <Modal show={show} onHide={handleClose} size="lg"
      aria-labelledby="contained-modal-title-vcenter" backdrop="static"
      centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Download PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {pdfBytes ? (
        <div>
          <iframe
          src={`data:application/pdf;base64,${btoa(new Uint8Array(pdfBytes).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`}
          width="100%"
          height="1000"
          title="PDF Viewer"
        >
          This browser does not support PDFs. Please download the PDF to view it.
        </iframe>
          
        </div>
      ) : (
        <div>Loading or editing the PDF...</div>
      )}

        </Modal.Body>
        <Modal.Footer>
          <Button  variant="info" onClick={()=>{handleClose()}}>
             Close
          </Button>{' '}
          <Button  variant="info" onClick={handleDownloadPdf}>
            <SaveAltIcon/>  Download
          </Button>{' '}
        
        </Modal.Footer>
      </Modal>
      </Box>
         </Box> 
       
        
    </>
  )
}

export default BookAudi