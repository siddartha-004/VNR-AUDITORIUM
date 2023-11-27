import React from 'react'
import Signup from './components/Signup/Signup'
import Login from './components/login/Login'
import Home from './components/Admin/Home/Home'
import Auditoriums from './components/Admin/Auditoriums/Auditoriums'
import MainHome from './components/MainHome/MainHome'
import PrioirityBook from './components/Admin/PriorityBook/PriorityBook'
import AudiSchema from './components/User/AudiSchema/AudiSchema'
import AllAudis1 from './components/User/AllAudis1/AllAudis1'
import AllEvents1 from './components/User/AllEvents1/AllEvents1'
import MyEvents from './components/User/MyEvents/MyEvents'
import MyBookings from './components/User/MyBookings/MyBookings'
import List from './components/Admin/List/List'
import BookAudi from './components/User/BookAudi/BookAudi'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import NewUser from './components/Admin/NewUser/NewUser'
import Home1 from './components/User/Home1/Home1'
import Single from './components/Admin/Single/Single'
import AllEvents from './components/Admin/AllEvents/AllEvents'

import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Bookings from './components/Admin/Bookings/Bookings'

function App() {
  return (
    <div className='App'>
        <BrowserRouter>
        <Routes>
         <Route path='/'>
            <Route index element={<Login/>}/>
            <Route path="*" element={<div>Page not found</div>}></Route>
           <Route path="login">
            <Route index element={<Login/>}/>
            </Route>
       
           
            <Route path="UserHome">
               <Route index element={<Home1/>}/>
               <Route path="auditoriums" element={<AllAudis1/>}/>
               <Route path="BookAudi" element={<BookAudi/>}/>
               <Route path="AllEvents" element={<AllEvents1/>}/>
               <Route path="vacantBookings" element={<MyBookings/>}/>
               <Route path="myEvents" element={<MyEvents/>}/>

            </Route>
            
            <Route path="AdminHome">
                <Route index element={<Home/>}/>
                <Route path="auditoriums" element={<Auditoriums/>}/>
                <Route path="bookpriorly" element={<PrioirityBook/>}/>
                <Route path="AllEvents" element={<AllEvents/>}/>
                <Route path="vacantBookings" element={<Bookings/>}/>
                <Route path="users">
                <Route index element={<List/>}/>
                <Route path=":userId" element={<Single/>}/>
                <Route path="new" element={<NewUser/>}/>
            </Route>
           
            
            </Route>   
         </Route> 
        
        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App