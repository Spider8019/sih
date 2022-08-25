import React, { useEffect, useState } from "react";
import Heatmap from "../components/heatmap";
import { useRouter } from "next/router";
import { gettingFishingTrendsOfIndividual } from "../globalsetups/api";

const TrendsResult = () => {
  const router = useRouter();
  const [list, setList] = useState([]);

  useEffect(() => {
    // const
    const { mmsi } = router.query;
    console.log("fuudd");
    (async () => {
      console.log(router.query);
      const res = await gettingFishingTrendsOfIndividual({
        mmsi,
      });
      console.log(res);
      setList([...res]);
    })();
  }, [router.query]);

  return (
    <div className="w-full">
      <Heatmap
        arrayList={
          list &&
          list.map((item) => {
            return { latitude: item.latitude, longitude: item.longitude };
          })
        }
      />
    </div>
  );
};

export default TrendsResult;
