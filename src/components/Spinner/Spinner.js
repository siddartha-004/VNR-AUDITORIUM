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
import './Spinner.css'; // Import your CSS file for styling

const Spinner = () => {
  return (
    <div className='loader'>
    <HashLoader color="#66ccff" />
    </div>
  );
};

export default Spinner;






