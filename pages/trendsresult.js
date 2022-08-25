import React, { useEffect, useState } from "react";
import Heatmap from "../components/heatmap";
import { useRouter } from "next/router";
import { gettingFishingTrends } from "../globalsetups/api";

const TrendsResult = () => {
  const router = useRouter();
  const [list,setList]=useState([])

  useEffect(() => {
    // const
    const { start_ts, end_ts, fish_type } = router.query;
    console.log("fuudd");
    (async () => {
console.log(router.query)
      const res =await gettingFishingTrends({
        end_ts,
        start_ts,
        fish_type,
      });
      setList(res)
    console.log(res);
  })();

  }, [router.query]);

  return <div>
    <Heatmap arrayList={list.map(item=>{return {longitude:item.longitude,latitude:item.latitude}})}/>
  </div>;
};

export default TrendsResult;
