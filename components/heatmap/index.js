import React, { useState, useRef, useEffect } from "react";
import { loadModules } from "esri-loader";
import {
  gettingLatestShip,
  gettingShipLocationAtInstanceOfTime,
} from "../../globalsetups/api";
import Drawer from "../map/Drawer";
import { useRouter } from "next/router";
import Head from "next/head";
import Loader from "../global/Loader";
import { read, utils, writeFileXLSX } from "xlsx";
let XLSX = require("xlsx");
import { uploadObject } from "../../globalsetups/aws";
import { nanoid } from "nanoid";
import _ from "lodash";

export default function Home({arrayList }) {
  const MapElement = useRef(null);
  const [awsDetails, setAWSDetails] = useState("");

  const router = useRouter();
  useEffect(() => {
    let view;
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    //   course: 109.5
    //   distance_from_port: 27657.955078125
    //   distance_from_shore: 0
    //   id: 634386
    //   latitude: 22.4643707275
    //   longitude: 120.4365768433
    //   predicted: false
    //   ship: {mmsi: 44081436890597, country: ''}
    //   speed: 2.7000000476999997
    //   timestamp: "2016-10-08T07:37:48"
    const ws = utils.json_to_sheet(
      arrayList.map(item=>{return {mag:1,latitude:item.latitude,longitude:item.longitude}})
    );
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
            title: "Course",
            content: "Id ",
          };

          const renderer = {
            type: "heatmap",
            colorStops: [
                { color: "rgba(63, 40, 102, 0)", ratio: 0 },
              { color: "#61fa02", ratio: 0.083 },
              { color: "#8ffc00", ratio: 0.166 },
              { color: "#c2fc03", ratio: 0.249 },
              { color: "#c4ff03", ratio: 0.332 },
              { color: "#f4fc03", ratio: 0.430 },
              { color: "#ffd903", ratio: 0.510 },
              { color: "#fca903", ratio: 0.570 },
              { color: "#ff8400", ratio: 0.664 },
              { color: "#fa5902", ratio: 0.747 },
              { color: "#fc3903", ratio: 0.83 },
              { color: "#fc2403", ratio: 0.913 },
              { color: "#ff0000", ratio: 1 },
            ],
            maxDensity: 0.1,
            minDensity: 0,
          };

          const layer = new CSVLayer({
            url: url,
            title: "Fishing Heatmap",
            copyright: "Fishing Trends",
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
            basemap: "topo-vector",
            layers: [layer],
          });

          const view = new MapView({
            container: MapElement.current,
            center: [-138, 30],
            zoom: 5,
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
  }, [router.query,arrayList]);

  return (
    <div>
      <div className="flex relative">
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
