import React, { useContext } from 'react'
import './LoginPopup.css'
import { useState } from 'react'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const LoginPopup = ({ setShowLogin }) => {

  const {url,setToken}=useContext(StoreContext)
  const [currState, setcurrState] = useState('Sign-up')
  const [data, setdata] = useState({
    name:"",
    email:"",
    password:""
  })

  const onChangeHandler=(event)=>{
    const name =event.target.name;
    const value=event.target.value;
    setdata(data=>({...data,[name]:value}))
  }

  const onLogin = async(event)=>{
    event.preventDefault();
    let newUrl=url
    if (currState==='Login') {
      newUrl+='/api/user/login'
    }
    else{
      newUrl+='/api/user/register'
    }

    const response=await axios.post(newUrl,data)

    if(response.data.success){
      setToken(response.data.token)
      localStorage.setItem("token",response.data.token)
      setShowLogin(false)
    }
    else{
      alert(response.data.message)
    }

  }

 

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} action="" className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">

          {currState==='Login'?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required />}
          
          <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder="Your email" required />
          <input type="password" name='password' onChange={onChangeHandler} value={data.password} placeholder="Password" required />
          <button type='submit'>{currState==='Sign-up'? 'Create Account':'Login'}</button>
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