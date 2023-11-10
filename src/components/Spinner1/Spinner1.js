// import React from 'react';
// import CircularProgress from '@mui/material/CircularProgress';

// const Spinner = () => {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <CircularProgress color="primary" size={60} />
//     </div>
//   );
// };

// export default Spinner;
// import React from 'react';
// import './Spinner.css';

// const Spinner = () => {
//   return (
//     <div className="spinner-container">
//       <div className="spinner">
//         <div className="bounce1"></div>
//         <div className="bounce2"></div>
//         <div className="bounce3"></div>
//       </div>
//     </div>
//   );
// };

// export default Spinner;
import React from 'react';
import {HashLoader} from 'react-spinners'


const Spinner1 = () => {
  return (
    
    <div  style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      //backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999, // Adjust the z-index as needed to overlay other content
    }}>
    <HashLoader color="#66ccff" />
    </div>
  );
};

export default Spinner1;






