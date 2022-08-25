import React, { useState, useRef, useEffect } from "react";
import { loadModules } from "esri-loader";
import {
  gettingLatestShip,
  gettingShipLocationAtInstanceOfTime,
} from "../globalsetups/api";
import Drawer from "../components/map/Drawer";
import { useRouter } from "next/router";
import Head from "next/head";
import Loader from "../components/global/Loader";
import { read, utils, writeFileXLSX } from "xlsx";
let XLSX = require("xlsx");
import { uploadObject } from "../globalsetups/aws";
import { nanoid } from "nanoid";
import _ from "lodash";

export default function Home({ ...props }) {
  const MapElement = useRef(null);
  const [awsDetails, setAWSDetails] = useState("");

  const router = useRouter();

  const generateXLS = () => {};
  useEffect(() => {
    let view;
    // generateXLS();
    // async () => {
    //   await generateXLS();
    // };
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

    const ws = utils.json_to_sheet([
      { mag: 5.1, latitude: 0, longitude: 42 },
      { mag: 0.1, latitude: 0.3, longitude: 43 },
      { mag: 1.3, latitude: 0.3, longitude: 44 },
      { mag: 1, latitude: 0.3, longitude: 45 },
      { mag: 1, latitude: 0.3, longitude: 46 },
    ]);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "csv", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });

    uploadObject({ file: data }, async (err, data) => {
      console.log(err, data, "amanpratapsingh");
      setAWSDetails(data.Location);
      (async () => {
        loadModules(
          [
            "esri/Map",
            "esri/layers/CSVLayer",
            "esri/views/MapView",
            "esri/widgets/Legend",
          ],
          {
            css: true,
          }
        ).then(async ([Map, CSVLayer, MapView, Legend]) => {
          const url = data.Location;

          const template = {
            title: "title",
            content: "Magnitude",
          };

          const renderer = {
            type: "heatmap",
            colorStops: [
              { color: "rgba(63, 40, 102, 0)", ratio: 0 },
              { color: "#472b77", ratio: 0.083 },
              { color: "#4e2d87", ratio: 0.166 },
              { color: "#563098", ratio: 0.249 },
              { color: "#5d32a8", ratio: 0.332 },
              { color: "#6735be", ratio: 0.415 },
              { color: "#7139d4", ratio: 0.498 },
              { color: "#7b3ce9", ratio: 0.581 },
              { color: "#853fff", ratio: 0.664 },
              { color: "#a46fbf", ratio: 0.747 },
              { color: "#c29f80", ratio: 0.83 },
              { color: "#e0cf40", ratio: 0.913 },
              { color: "#ffff00", ratio: 1 },
            ],
            maxDensity: 0.01,
            minDensity: 0,
          };

          const layer = new CSVLayer({
            url: url,
            title: "Magnitude 2.5+ earthquakes from the last week",
            copyright: "USGS Earthquakes",
            popupTemplate: template,
            renderer: renderer,
            labelsVisible: false,
            // labelingInfo: [
            //   {
            //     symbol: {
            //       type: "text", // autocasts as new TextSymbol()
            //       color: "white",
            //       font: {
            //         family: "Noto Sans",
            //         size: 8,
            //       },
            //       haloColor: "#472b77",
            //       haloSize: 0.75,
            //     },
            //     // labelPlacement: "center-center",
            //     // labelExpressionInfo: {
            //     //   expression: "Text('aman', '#.0')",
            //     // },
            //     // where: "mag > 5",
            //   },
            // ],
          });

          const map = new Map({
            basemap: "gray-vector",
            layers: [layer],
          });

          const view = new MapView({
            container: MapElement.current,
            center: [-138, 30],
            zoom: 2,
            map: map,
          });

          view.ui.add(
            new Legend({
              view: view,
            }),
            "bottom-left"
          );
        });
      })();
    });

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
            className="mapLayer"
            style={{ height: "calc(100vh - 136px)", width: "100vw" }}
            ref={MapElement}
          ></div>
        </div>
      </div>
    </div>
  );
}
