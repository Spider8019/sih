import React,{useState} from 'react'
import dynamic from 'next/dynamic'
import { pageFramer } from "../globalsetups/defaultValues"
import { motion } from "framer-motion"



const MapDynamicComponent = dynamic(
  () => import('../components/dynamic/Map'),
  { ssr: false }
)

const About = () => {
  const [coordinatesList,setCoordinatesList]=useState([{ longitude: "82.19463631064608", latitude: "26.79579352561889", location: "delhi ", heading: "heading", _id: "1213124" }])
  return (
    <motion.div initial="initial"
      animate="animate"
      exit="exit"
      variants={pageFramer} >
      <button onClick={()=>setCoordinatesList([{ longitude: parseInt(coordinatesList[0].longitude)+1, latitude: parseInt(coordinatesList[0].latitude)+1, location: "delhi ", heading: "heading", _id: "1213124" },...coordinatesList])}>
        asdf
      </button>

      <div className="h-2/4">
        <MapDynamicComponent list={coordinatesList} />
      </div>
      
    </motion.div>
  )
}

// export async function getServerSideProps(context) {
//   const coordinatesList = [{ longitude: "82.19463631064608", latitude: "26.79579352561889", location: "delhi ", heading: "heading", _id: "1213124" }]
//   return {
//     props: { coordinatesList }, // will be passed to the page component as props
//   }
// }


export default About