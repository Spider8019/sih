import React, { useState, useRef, useEffect } from "react";
import { loadModules } from "esri-loader";
import { gettingShipByLocation } from "../globalsetups/api";
import Drawer from "../components/map/Drawer";
import { useRouter } from "next/router";
import Head from "next/head";
import Loader from "../components/global/Loader";
import Circle from "@arcgis/core/geometry/Circle";

export default function Home({ ...props }) {
  const MapElement = useRef(null);
  const router = useRouter();
  let res;

  useEffect(() => {
    const { longitude, latitude, radius } = router.query;
    let view;

    if (router.isReady) {
      (async () => {
        loadModules(
          [
            "esri/views/MapView",
            "esri/WebMap",
            "esri/Graphic",
            "esri/geometry/Point",
            "esri/core/watchUtils",
          ],
          {
            css: true,
          }
        ).then(async ([MapView, WebMap, Graphic, Point, watchUtils]) => {
          console.log(longitude, latitude, radius);
          res = await gettingShipByLocation({
            longitude_cn: longitude,
            latitude_cn: latitude,
            radius,
          });
          console.log("Adfasdfasdfadsfa");
          console.log(res);
          const webmap = new WebMap({
            basemap: "topo-vector",
          });
          var view = new MapView({
            map: webmap,
            center: [res.result[0].latitude, res.result[0].longitude],
            zoom: 5 ,
            container: MapElement.current,
          });

          const circleGeometry = new Circle({
            center: [res.latitude, res.longitude],
            geodesic: true,
            numberOfPoints: 100,
            radius: 2 * res.radius,
            radiusUnit: "kilometers",
          });
          view.graphics.add(
            new Graphic({
              geometry: circleGeometry,
              symbol: {
                type: "simple-fill",
                color: [252, 136, 3, 0.2],
                outline: {
                  width: 3,
                  color: "orange",
                },
              },
            })
          );
          let symbol = {
            type: "simple-marker",
            style: "circle",
            color: "orange",
            size: "18px",
            outline: {
              color: [150, 200, 255],
              width: 5,
            },
          };
          let popupTemplate = {
            title: "{Name}",
            content: "{Description}",
          };
          res.result.forEach((item) => {
            var point_symbol = new Point({
              longitude: item.longitude,
              latitude: item.latitude,
              spatialReference: { wkid: 3857 },
            });
            var graphic_symbol = new Graphic({
              geometry: point_symbol,
              symbol,
              attributes: {
                Name: `<b>MMSI ${item.ship.mmsi}</b>`,
                Description: `<div><b>Country: ${item.country}<b>Timestamp: ${item.timestamp}<br/>Longitude: ${item.longitude}<br/>Latitude: ${item.latitude}</b><div style="margin-top:2rem"><a class="basicDarkButton" href="http://localhost:3000/route?mmsi=${item.ship.mmsi}">Route</a><a class="basicDarkButton" style="margin-left:1rem;" href="/route/${item.ship.mmsi}">Predict</a></div></div></div>`,
              },
              popupTemplate,
            });
            view.graphics.add(graphic_symbol);
          });
          watchUtils.whenTrue(view, "updating", function (evt) {
            if (document.getElementById("loaderElement"))
              document.getElementById("loaderElement").style.display = "block";
          });

          // Hide the loading indicator when the view stops updating
          watchUtils.whenFalse(view, "updating", function (evt) {
            if (document.getElementById("loaderElement"))
              document.getElementById("loaderElement").style.display = "none";
          });
        });

        // }
      })();
    }

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
        <title>Ship by Region - SIH</title>
      </Head>
      <div className="flex relative">
        <div className="absolute bottom-4 left-4 bg-white rounded-2xl p-2 shadow-2xl z-30">
          <Drawer />
        </div>
        <div className="w-full">
          <div
            className="mapLayer"
            style={{ height: "calc(100vh - 136px)", width: "100vw" }}
            ref={MapElement}
          >
            <div id="loaderElement" className="loadingMap">
              <Loader text="Obtaining data that will be placed into GIS" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
