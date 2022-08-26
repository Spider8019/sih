import React, { useState, useEffect, useRef } from "react";
import {
  gettingPredictedRoute,
  gettingPathOfAParticularShip,
} from "../globalsetups/api";
import { useRouter } from "next/router";
import { loadModules } from "esri-loader";
import Head from "next/head";
import Loader from "../components/global/Loader";

const Route = () => {
  const router = useRouter();
  const MapElement = useRef(null);
  const [latlog, setLatlog] = useState([]);
  const [loading, isLoading] = useState(true);
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
        let result = await gettingPredictedRoute({
          mmsi,
        });

        let res = await gettingPathOfAParticularShip({
          mmsi,
        });

        console.log(res, "adasdfasdfasdfasdfasdfasdfasdfa");
        const webmap = new WebMap({
          basemap: "satellite",
        });

        if (res.length > 0) {
          setLatlog(res.map((item) => [item.longitude, item.latitude, "1"]));
          var view = new MapView({
            map: webmap,
            center: [res[0] && res[0].longitude, res[0] && res[0].latitude],
            zoom: 10,
            container: MapElement.current,
          });
          const polyline = {
            type: "polyline",
            paths: [
              res
                .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
                .slice(0, res.length - 10)
                .map((item) => [item.longitude, item.latitude]),
            ],
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
          const predictedLine= {
            type: "polyline",
            paths: [
              res
                .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
                .slice( res.length - 10,res.length)
                .map((item) => [item.longitude, item.latitude]),
            ],
          };
          const polylinePredictedGraphic=new Graphic({
            geometry:predictedLine,
            symbold:{
              type: "simple-line",
              color: [226, 119, 40], // Orange
              width: 5
           }
          })
          view.graphics.add(polylinePredictedGraphic);
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
          res
            .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
            .slice(res.length - 10, res.length - 1)
            .forEach((item) => {
              var point_symbol = new Point({
                longitude: item.longitude,
                latitude: item.latitude,
                spatialReference: { wkid: 3857 },
              });
              var graphic_symbol = new Graphic({
                geometry: point_symbol,
                symbol,
                attributes: {
                  Name: `<b>MMSI ${item.timestamp}</b>`,
                  Description: `<div><b>Longitude: ${item.longitude}<br/>Latitude: ${item.latitude}`,
                },
                popupTemplate,
              });
              view.graphics.add(graphic_symbol);
            });
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
        <title>Route Predict Ship GIS</title>
      </Head>

      <div className="flex">
        <div className="w-full">
          <div
            className="mapLayer relative"
            style={{ height: "calc(100vh - 136px)", width: "100vw" }}
            ref={MapElement}
          >
            <div id="loaderElement" className="loadingMap">
              <Loader text="Future 5 hour path prediction and GIS mapping. It may take several moments.." />
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default Route;
