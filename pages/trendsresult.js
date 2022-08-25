import React,{useEffect,useState} from 'react'
import Heatmap from "../components/heatmap"
import { useRouter } from 'next/router'
import { gettingFishingTrends } from '../globalsetups/api'

const TrendsResult = () => {
const router=useRouter();

useEffect(()=>{
    // const 
  (async()=>{

    const res=gettingFishingTrends();
  })
},[router.query])
  return (
    <div>
        TrendsResult
        
    </div>
  )
}

export default TrendsResult