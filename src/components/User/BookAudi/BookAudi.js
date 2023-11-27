import React,{useEffect,useState} from 'react'
import NavBar1 from '../NavBar1/NavBar1';
import { PlusOutlined } from '@ant-design/icons';
import './BookAudi.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import success from '../../../images/success.mp3'
import wrong from '../../../images/wrong.mp3'
import notavailable from '../../../images/notavailable.mp3'
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
import Spinner1 from '../../Spinner1/Spinner1';
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
  const audioElement = new Audio(success);
  audioElement.style.display = 'none'; // Hide the audio element
  const audioElement1 = new Audio(wrong);
  audioElement1.style.display = 'none';
  const audioElement2 = new Audio(notavailable);
  audioElement2.style.display = 'none';
  let {
    register,
    handleSubmit,reset,
    formState: { errors },
  } = useForm();
  let [error, setError] = useState("");
  let [selectedFile,setSelectedFile]=useState(null)
  const [pdfBytes, setPdfBytes] = useState(null);
  const [newData,setnewDate] = useState(null)
  
  const [loading, setLoading] = useState(false);
  const [audiname,setaudiname]=useState("")
  useEffect(()=>{
  
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
        firstPage.drawText(newData.coordinatorname, {
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
  const [sliderValue, setSliderValue] = useState(1);

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };
  const railStyle = {
    backgroundColor: 'lightgray',
  };

  const trackStyle = {
    backgroundColor: 'darkgreen',
  };

  const handleStyle = {
    backgroundColor: 'blue',
    border: '2px solid blue',
  };
  const onFileSelect=(e)=>{
    setSelectedFile(e.target.files[0])
   }
   let addNewSearch = (newSearch) => {
    setLoading(true);
  
     let fd=new FormData();
    

     fd.append("search",JSON.stringify(newSearch))
   
    fd.append("photo",selectedFile)
    fd.append("sliderValue",sliderValue)
    
    axios
    .post("http://localhost:4000/ConsumerHome-api/book-audi", fd)
    .then((response) => {
      if (response.status === 201) 
      {
        console.log(response.data)
        if(response.data.pay===1)
        {
          setnewDate(newSearch)
          setaudiname(response.data.message)
          audioElement.play(); 
          console.log("added")
          Swal.fire({
            icon: 'success',
            title:'Booked Successfully',
            text:response.data.message
            // text: 'New '+newUser.typeofuser+' has been registered successfully.',
          });
          // reset();
        
          handleShow();
          
        
          
        }
        else 
        {
          console.log(response.data)
          audioElement1.play(); 
        Swal.fire({
          title: "There are no availability according to given requirements",
          text: "Do you want to enter into waiting list?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, proceed!",
        }).then((result) => {
          if (result.isConfirmed) {
            // User clicked "Yes, proceed!"
            
            
            setLoading(true);
            axios.post("http://localhost:4000/ConsumerHome-api/waiting-list",fd)
            .then((response) => {
              let v=response.data.message;
              setLoading(false);
              audioElement2.play(); 
              Swal.fire("Action performed!", `You are added to waiting list. Your token number is ${v}`, "success");
            })

            // Perform your action here
          } else if(response.data.pay===2){
            // User clicked "Cancel" or closed the prompt
            
            const dataArray = response.data.message // Replace with your actual data
         
          
          
          if (dataArray.length > 0)
           {
            let rowData = '';
          
            // Create rows with data
            dataArray.forEach((item) => {
              rowData += `<tr><td>${item}</td></tr>`;
            });
          
            // Create a table structure
            const tableHtml = `
            <h4>Available Auditoriums for next three days</h4>
              <table>
                <tbody>
                  ${rowData}
                </tbody>
              </table>
            `;
            Swal.fire({
              icon: 'warning',
              text:'Available Audis for next 3 days:',
              title: 'Cannot Book due to Unavailibility',
              html: tableHtml,
              customClass: {
                htmlContainer: 'custom-swal-container', // Apply CSS for custom styling
                container: 'swal-alert', 
                backdrop: 'custom-swal-backdrop',
              },
            });
        }
          }
          else{
            audioElement1.play()
            Swal.fire({
              icon: 'info',
              title:'Booking failed',
              text:response.data.message
              // text: 'New '+newUser.typeofuser+' has been registered successfully.',
            });
          }
        });
        
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
      })
      .finally(() => {
        setLoading(false); // Hide the spinner after the request is complete
      });
     
     
  };
  return (
    <>
         <NavBar1/>
         <Box height={40}/>
         <Box sx={{ display: 'flex' }}>
         <SideBar1/>
         {loading && <Spinner1 />}
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
             <label htmlFor="name">* Coordinator name:</label>
             <input
               type="text"
               id="clubname"
               
               className="form-control"
              
               {...register("coordinatorname", { required: true })}
             />
             </div>
           <div className="item2 mb-4">
             <label htmlFor="name">clubname:</label>
             <input
               type="text"
               id="clubname"
               className="form-control"
              
               {...register("clubname")}
             />
             </div>
             <div className="item2 mb-4">
             <label htmlFor="name">* event name:</label>
             <input
               type="text"
               id="clubname"
               className="form-control"
               
               {...register("eventname", { required: true })}
             />
           
           </div>
           {/* email */}
           <div className="item2 mb-4">
             <label htmlFor="name">* PhoneNo:</label>
             <input
               type="text"
               id="phonenumber"
               className="form-control"
             
               {...register("phonenumber", { required: true,maxLength:"10",minLength:"10" })}
             />
             
             
           </div>
           
           <div className="item2 mb-4">
             <label htmlFor="name">* Email:</label>
             <input
               type="email"
               placeholder="e.g. example@mail.com"
               id="email1"
               className="form-control"
               {...register("email", { required: true })}
             />
             
            
           </div>
           <div className="item2 mb-4">
             <label htmlFor="name">* Poster of Event:</label>
             
             <input
               type="file"
               id="myfile"
               className="form-control"
               {...register("image", { required: true })}
               onInput={onFileSelect}
             />
             
           
           </div>
           <div className="item2 mb-4">
             <label htmlFor="name">* Description:</label>
             <textarea id="description" placeholder="......" className='form-control' {...register("description",{required:true})}/>
             </div>
             
           <div className="item2 mb-4">
             <label htmlFor="name">* Capacity:</label>
           <input type="number" id="Capacity"placeholder="Auditorium Capacity" className='form-control' {...register("Capacity",{required:true})}/>
            </div>

            <div className="item2 mb-4">
             <label htmlFor="name">* Date of event:</label>
           <input type="date" id="date"placeholder="Booking date" className='form-control' {...register("date",{required:true})}/>
            </div>
            {/* <div className="item2 mb-4">
              <label htmlFor="name">* Number of hours required:</label>
              
              <select
                type="text"
                id="hours"
                className="form-select"
          
                {...register("hours", { required: true })}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="6">6</option>
                </select>
              
            </div> */}
             {/* <label>
        <input type="radio" name="checkboxes" value="1" {...register("time")} />
        1 hr
      </label>
      <br />
      <label>
        <input type="radio" name="checkboxes" value="2" {...register("time")}/>
        2 hr
      </label>
      <br />
      <label>
        <input type="radio" name="checkboxes" value="3"  {...register("time")}/>
        3 hr
      </label>
      <br />
      <label>
        <input type="radio" name="checkboxes" value="6"  {...register("time")}/>
        6 hr
      </label>
      <br /> */}
      <div className=" itemr mb-4">
             <label htmlFor="name1">* Number of hours required:</label>
             <div  className="slider">
      
     
    
             <Slider
        min={1}
        max={6}
        step={5}
        value={sliderValue}
        onChange={handleSliderChange}
        marks={{
          1: '1',
          2: '2',
          3: '3',
          6: '6',
        }}
        railStyle={railStyle}
        trackStyle={trackStyle}
        handleStyle={handleStyle}
      />
             </div>
             <div className='val'>
             <h5>  ( {sliderValue} )</h5>
             </div>
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