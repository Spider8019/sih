import React, { useEffect, useState } from "react";
import Heatmap from "../components/heatmap";
import { useRouter } from "next/router";
import { gettingFishingTrendsOfIndividual } from "../globalsetups/api";
import Head from "next/head";
import _ from "lodash";
import Loader from "../components/global/Loader";

const TrendsResult = () => {
  const router = useRouter();
  const [list, setList] = useState([]);

  useEffect(() => {
    const { mmsi } = router.query;

    gettingFishingTrendsOfIndividual({
      mmsi,
    }).then((res) => setList([...res]));
  }, [router.query]);

  if (_.isEmpty(list))
    return (
      <div className="absolute top-[136px] left-2/4 w-full -translate-x-2/4">
        <Loader
          text={`Getting heatmap data for a ship using MMSI ${router.query.mmsi}`}
        />
      </div>
    );
  return (
    <>
      <Head>
        <title>Fishing Trend for Particular Ship - #tinkerchild</title>
      </Head>
      <div className="w-full">
        <Heatmap
          arrayList={list.map((item) => {
            return { latitude: item.latitude, longitude: item.longitude };
          })}
          centerLatitude={list[0].latitude}
          centerLongitude={list[0].longitude}
          defaultZoom={7}
        />
      </div>
    </>
  );
};

export default TrendsResult;
