import Head from 'next/head'
import Image from 'next/image'
import {useEffect,useState} from "react"
import {motion} from "framer-motion"
import {pageFramer} from "../globalsetups/defaultValues"

export default function Home() {

  const [aspectRatio,setAspectRatio]=useState(1);
  useEffect(()=>{
    if (typeof window !== 'undefined') {
      let availableHeight=window.innerHeight-136;
      let availableWidth=window.innerWidth;
      setAspectRatio(availableWidth/availableHeight);
    }
  },[])
  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageFramer}
      style={{position:"relative",height:"calc(100vh - 136px)",width:"100%"}}>
      <Image
        src="/static/images/cover.png"
        objectFit='contain'
        objectPosition="0 10vh"
        layout="responsive"
        height={1}
        width={aspectRatio}
        priority={true}
        alt="Home Cover Image"
      />
      <div className="absolute top-1/2 left-1/2 -translate-y-2/4 w-[50vw]">
        <p className="text-6xl">Smart India Hackathon</p>
        <p className="text-xl mt-4"> Smart India Hackathon is a nationwide initiative to provide students with a platform to solve some of the pressing problems</p>
        <button className='basicDarkButton mt-4'>Access GIS</button>
      </div>
    </motion.div>
  )
}
