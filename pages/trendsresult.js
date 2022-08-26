import React, { useEffect, useState } from "react";
import Heatmap from "../components/heatmap";
import { useRouter } from "next/router";
import { gettingFishingTrends } from "../globalsetups/api";
import Head from "next/head";
import _ from "lodash";
import Loader from "../components/global/Loader";

const TrendsResult = () => {
  const router = useRouter();
  const [list, setList] = useState([]);

  useEffect(() => {
    const { start_ts, end_ts, fish_type } = router.query;
    if (router.isReady) {
      gettingFishingTrends({
        end_ts,
        start_ts,
        fish_type,
      }).then((res) => {
        setList(res);
      });
    }
  }, [router.query]);

  if (_.isEmpty(list))
    return (
      <div className="absolute top-[136px] left-2/4 w-full -translate-x-2/4">
        <Loader
          text={`Obtaining ${router.query.fish_type} information from all ships`}
        />
      </div>
    );

  return (
    <>
      <Head>
        <title>Trends Result - tinkerchild</title>
      </Head>
      <div className="w-full">
        <Heatmap
          arrayList={list.map((item) => {
            return { longitude: item.longitude, latitude: item.latitude };
          })}
          centerLatitude={-138}
          centerLongitude={30}
          defaultZoom={4}
        />
      </div>
    </>
  );
};

export default TrendsResult;
