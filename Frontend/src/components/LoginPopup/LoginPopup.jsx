import React from 'react'
import './LoginPopup.css'
import { useState } from 'react'
import { assets } from '../../assets/assets'

const LoginPopup = ({ setShowLogin }) => {

  const [currState, setcurrState] = useState('Sign-up')

  return (
    <div className='login-popup'>
      <form action="" className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">

          {currState==='Login'?<></>:<input type="text" placeholder="Your name" required />}
          
          <input type="email" placeholder="Your email" required />
          <input type="password" placeholder="Password" required />
          <button>{currState==='Sign-up'? 'Create Account':'Login'}</button>
          <div className="login-popup-condition">
            <input type="checkbox" required/>
            <p>i agree the terms of use & privacy policy</p>
        </div>
        {
          currState==='Login'?
          <p>Create new account?<span onClick={()=>setcurrState('Sign-up')}>Click here</span></p>
          :<p>Already have account?<span onClick={()=>setcurrState('Login')}>Login here</span></p>
        }
        </div>
      </form>
    </div>
  )
}

export default LoginPopup