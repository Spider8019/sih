import React, { useState, useRef, useEffect, useCallback } from "react";
import { loadModules } from "esri-loader";
import { gettingLatestShip } from "../globalsetups/api";
import Drawer from "../components/map/Drawer";
import { useRouter } from "next/router";
import Head from "next/head";
import Loader from "../components/global/Loader";

export default function Home({ ...props }) {
  const MapElement = useRef(null);
  const router = useRouter();

  let res;
  useEffect(() => {
    let view;
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
        res = await gettingLatestShip({});
        console.log(res);

        const webmap = new WebMap({
          basemap: "topo-vector",
        });
        var view = new MapView({
          map: webmap,
          center: [-0.001545, 51.477928],
          zoom: 3,
          container: MapElement.current,
        });

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
        res.forEach((item) => {
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
              Description: `<div><b>Country: ${item.ship.country}<br/>Timestamp: ${item.timestamp}<br/>Longitude: ${item.longitude}<br/>Latitude: ${item.latitude}</b><div style="margin-top:2rem"><a class="basicDarkButton" href="http://localhost:3000/route?mmsi=${item.ship.mmsi}">Route</a><a class="basicDarkButton" style="margin-left:1rem;" href="http://localhost:3000/routepredict?mmsi=${item.ship.mmsi}">Predict</a></div></div></div>`,
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
            <div id="loaderElement" className="loadingMap">
              <Loader />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
