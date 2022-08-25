import React, { useState, useRef, useEffect, useCallback } from "react";
import { loadModules } from "esri-loader";
import { gettingLatestShip } from "../globalsetups/api";
import Drawer from "../components/map/Drawer";
import { useRouter } from "next/router";
import Head from "next/head";
import Loader from "../components/global/Loader";
import Heatmap from "../components/heatmap"
import esriConfig from "@arcgis/core/config";

export default function Home({ ...props }) {
  const MapElement = useRef(null);
  const router = useRouter();

  let res;
  useEffect(() => {
    let view;
    (async () => {
      loadModules(
        ["esri/config",
          "esri/views/MapView",
          "esri/WebMap",
          "esri/Graphic",
          "esri/geometry/Point",
          "esri/core/watchUtils",
        ],
        {
          css: true,
        }
      ).then(async ([esriConfig,MapView, WebMap, Graphic, Point, watchUtils]) => {
        esriConfig.apiKey = "AAPK389b4ad7e0a84099a61965ae0b29053aC4qbMFfECsOFO_Bd5fivHgb-dEM5ymAAV2YB-fDnpzqXQxdnV-2yU5ENDW59ewwF";
        res = await gettingLatestShip({});
        console.log(res);

        const webmap = new WebMap({
          //basemap: "satellite"
          // https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
          basemap: "topo-vector",
        });
        var view = new MapView({
          map: webmap,
          center: [-0.001545, 51.477928],
          zoom: 3,
          container: MapElement.current,
        });

        let popupTemplate = {
          title: "{Name}",
          content: "{Description}",
        };
        res.ais_data.forEach((item) => {
          var point_symbol = new Point({
            longitude: item.longitude,
            latitude: item.latitude,
            spatialReference: { wkid: 3857 },
          });
          let temp=res.fishing_type_data.filter(x=>{return (x.ship===item.ship.mmsi)});
          console.log(temp)
          var graphic_symbol = new Graphic({
            geometry: point_symbol,
            symbol: {
              type: "simple-marker",
              style: "circle",
              color: temp.length>0?(temp[0].fishing_type==="trollers"?"purple":"green"):"orange",
              // t
              size: "28px",
              outline: {
                color: "white",
                width: 1,
              },
            },
            attributes: {
              Name: `<b>MMSI ${item.ship.mmsi}</b>`,
              Description: `<div><b>Country: ${item.ship.country}<br/>Timestamp: ${item.timestamp}<br/>Longitude: ${item.longitude}<br/>Latitude: ${item.latitude}</b><div style="margin-top:2rem"><a class="basicDarkButton" href="http://localhost:3000/route?mmsi=${item.ship.mmsi}">Route</a><a class="basicDarkButton" style="margin-left:1rem;" href="http://localhost:3000/routepredict?mmsi=${item.ship.mmsi}">Predict</a><a class="basicDarkButton" style="margin-left:1rem;" href="http://localhost:3000/fishingTrendsOfIndi?mmsi=${item.ship.mmsi}">Fishing Trends</a></div></div></div>`,
            },
            popupTemplate,
          });
          view.graphics.add(graphic_symbol);
        });
        // watchUtils.whenTrue(view, "updating", function (evt) {
        //   if (document.getElementById("loaderElement"))
        //     document.getElementById("loaderElement").style.display = "block";
        // });

        // // Hide the loading indicator when the view stops updating
        // watchUtils.whenFalse(view, "updating", function (evt) {
        //   if (document.getElementById("loaderElement"))
        //     document.getElementById("loaderElement").style.display = "none";
        // });
      });
    })();

    return () => {
      if (!!view) {
        view.destroy();
        view = null;
      }
    };
  }, [router.query]);

  return (
    <div>
      <Head>
        <title>Access GIS</title>
      </Head>
      <div className="flex relative">
        <div className="absolute bottom-4 left-4 bg-white rounded-2xl p-2 shadow-2xl z-30">
          <Drawer />
        </div>
        <div className="w-full">
          <div
            className="mapLayer relative"
            style={{ height: "calc(100vh - 136px)", width: "100vw" }}
            ref={MapElement}
          >
            {/* <div id="loaderElement" className="loadingMap">
              <Loader />
            </div> */}
          </div>
        </div>
      </div>
     
    </div>
  );
}

