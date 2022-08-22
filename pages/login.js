import React,{useState} from 'react';
import styles from "../styles/pages/Login.module.css"
import Image from "next/image"
import Head from 'next/head';
import AbcIcon from '@mui/icons-material/Abc';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import _ from "lodash"
import {getCsrfToken, signIn } from "next-auth/react"
import {BrowserView} from "react-device-detect"
import Link from "next/link"
import { useRouter } from "next/router";
import {motion,AnimatePresence} from "framer-motion"

export default function Login (){

  const { error } = useRouter().query;
  const [passwordShow,setPasswordShow]=useState(false)
  const [formData,setFormData]=useState({email:"",password:""})

  const handleTogglePasswordVisibility = (e) =>{
     e.preventDefault()
     setPasswordShow(!passwordShow)
  }

  const handleLogin=async(e)=>{
      e.preventDefault()
      signIn("credentials", { email:formData.email,password:formData.password })
  }

  const errors = {
    Signin: "Try signing with a different account.",
    OAuthSignin: "Try signing with a different account.",
    OAuthCallback: "Try signing with a different account.",
    OAuthCreateAccount: "Try signing with a different account.",
    EmailCreateAccount: "Try signing with a different account.",
    Callback: "Try signing with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email address.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
  };
  const SignInError = ({ error }) => {
    const errorMessage = error && (errors[error] ?? errors.default);
    return <div className='text-xs mt-4 text-red-600'>{errorMessage}</div>;
  };

  return <div className={styles.loginContainer}>
      <Head>
        <title>Login Page </title>
        <meta name="description" content="Login Page" />
        <link rel="icon" href="/static/withOutBgLogo.png" />
      </Head>
      {/* Signin functionality */}
      <div className={` rounded-xl ${styles.loginMain} grid grid-cols-1 sm:grid-cols-2 `}>
        <div className='grid place-items-center'>
           <div className=" sm:w-2/3">
             <center>
                <Image
                    layout="intrinsic"
                    height={100}
                    width={100}
                    src="/static/images/sih.png"
                    alt="Without Background Logo"
                />
                <p className="text-4xl">Ikshvaku</p>
                <span className="text-1xl block">Ayodhya</span>
                      {/* Error message */}
                {error && <AnimatePresence><SignInError error={error} /></AnimatePresence>}
                <form 
                  onSubmit={handleLogin}
                  className="mt-4">
                    <input 
                      className="standardInput bg-gray-50"
                      style={{width:"calc(100% - 1rem)"}}
                      type="email"
                      placeholder='Enter your mail'
                      value={formData.email}
                      onChange={e=>setFormData({...formData,email:e.target.value})}
                      />
                    <div className='relative'>
                      <input 
                        className='standardInput bg-gray-50'
                        style={{width:"calc(100% - 1rem)"}}
                        type={passwordShow ? "text" : "password"}
                        placeholder='Password'
                        value={formData.password}
                        onChange={e=>setFormData({...formData,password:e.target.value})}  
                        />
                      <button 
                        style={{height:"calc(100% - 1rem)"}}
                        className='absolute top-0 right-0 px-2 mt-2 mb-2 mr-2'
                        onClick={handleTogglePasswordVisibility}>
                          {passwordShow ? <MoreHorizIcon/> : <AbcIcon/>}
                      </button>
                    </div>
                    <button className="block basicDarkButton m-2 mt-8 p-2 py-2"
                      style={{width:"calc(100% - 1rem)"}}
                    >
                      Login   
                    </button>
                </form>
                {/* <div className='relative h-px w-1/2 bg-slate-300 mt-8'>
                    <p className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2 text-xs'>or</p>
                </div> */}
                <span className="text-xs mt-12 block text-slate-500">Trouble in logging?</span>
                <Link href="/forgotpassword">
                  <a className="text-xs text-amber-500 ml-2" >
                    Forgot Password
                  </a>
                </Link>
                {/* <div className={`${styles.providerLoginsContainer} mt-4`}>
                    { !_.isNull(Object.values(providers)) && Object.values(providers).map((provider) => (
                      provider.id!=='credentials' 
                      &&
                      <div key={provider.name}>
                          <IconButton onClick={() => signIn(provider.id)}>
                              <GitHubIcon/>
                          </IconButton>
                      </div>
                    ))}
                </div> */}
             </center>
           </div>
        </div>

        <div className={`rounded-xl relative`}>
          <BrowserView>
              <div  
                className='rounded-xl absolute w-full bottom-0 right-0' 
                style={{height:"100%"}}
                >
                <Image
                  className='rounded-xl'
                  layout="fill"
                  objectFit='contain'
                  objectPosition="bottom right"
                  src="/static/images/sih.png"
                  alt="Image Ramayan Login"
                />      
              </div>    
          </BrowserView>
        </div>
      </div>
  </div>;
};


