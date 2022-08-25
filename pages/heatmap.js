import React, { useState, useRef, useEffect } from "react";
import { loadModules } from "esri-loader";
import {
  gettingLatestShip,
  gettingShipLocationAtInstanceOfTime,
  gettingPathOfAParticularShip
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

  useEffect(() => {
    let view;


    const { mmsi } = router.query;

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
        let res = await gettingPathOfAParticularShip({
          mmsi,
        });
        console.log(res)
        // setLatlog(res)

        const webmap = new WebMap({
          basemap: "topo-vector",
        });

        console.log(res)
        if (res.length > 0) {
          setLatlog(res)
          var view = new MapView({
            map: webmap,
            center: [res[0] && res[0].longitude, res[0] && res[0].latitude],
            zoom: 10,
            container: MapElement.current,
          });
          const polyline = {
            type: "polyline",
            paths: [res.map((item) => [item.longitude, item.latitude])],
          };
          const polylineGraphic = new Graphic({
            geometry: polyline,
            symbol: {
              type: "cim", // autocasts as CIMSymbol
              data: {
                type: "CIMSymbolReference",
                symbol: {
                  type: "CIMLineSymbol",
                  symbolLayers: [
                    {
                      // black 1px line symbol
                      type: "CIMSolidStroke",
                      enable: true,
                      width: 1,
                      color: [245, 158, 11, 255],
                    },
                    {
                      // arrow symbol
                      type: "CIMVectorMarker",
                      enable: true,
                      size: 6,
                      markerPlacement: {
                        type: "CIMMarkerPlacementAlongLineSameSize", // places same size markers along the line
                        endings: "WithMarkers",
                        placementTemplate: [19.5], // determines space between each arrow
                        angleToLine: true, // symbol will maintain its angle to the line when map is rotated
                      },
                      frame: {
                        xmin: -5,
                        ymin: -5,
                        xmax: 5,
                        ymax: 5,
                      },
                      markerGraphics: [
                        {
                          type: "CIMMarkerGraphic",
                          geometry: {
                            rings: [
                              [
                                [-8, -5.47],
                                [-8, 5.6],
                                [1.96, -0.03],
                                [-8, -5.47],
                              ],
                            ],
                          },
                          symbol: {
                            type: "CIMPolygonSymbol",
                            symbolLayers: [
                              {
                                type: "CIMSolidFill",
                                enable: true,
                                color: [0, 10, 0, 255],
                              },
                            ],
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            },
          });
          view.graphics.add(polylineGraphic);
        }

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
      <div className="flex">
        <div className="w-full">
          <div
            className="mapLayer"
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
