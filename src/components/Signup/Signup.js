import React from 'react'

function Signup() {
  return (
    <div>
       <section className='signup'>
        <div className='container mt-5'>
            <div className='signup-content'>
                <div className='signup-form'>
                    <h2 className='form-title'>Sign up</h2>
                    <form className='register-form' id="register-form">
                        <div className='form-group'>
                            <label htmlFor="name">
                                <i class="zmdi zmdi-account material-icons-name"></i>
                            </label>
                            <input type='text' name="name" id="name" autoComplete="off" placeholder='Club Name'/>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="email">
                                <i class="zmdi zmdi-email material-icons-name"></i>
                            </label>
                            <input type='email' name="email" id="email" autoComplete="off" placeholder='Club Email id'/>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="phone">
                                <i class="zmdi zmdi-phone-in-talk material-icons-name"></i>
                            </label>
                            <input type='number' name="phone" id="phone" autoComplete="phone" placeholder='Club Head Phone number'/>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="name">
                                <i class="zmdi zmdi-account material-icons-name"></i>
                            </label>
                            <input type='text' name="name" id="name" autoComplete="off" placeholder='Club Name'/>
                        </div>

                    </form>
                </div>
            </div>
        </div>
       </section>
    </div>
  )
}

export default Signup