import React, { useState, useEffect, useRef } from "react";
import { gettingPathOfAParticularShip } from "../globalsetups/api";
import { useRouter } from "next/router";
import { loadModules } from "esri-loader";
import Head from "next/head";
import Xyz from "../components/global/Xyz"

const Route = () => {
  const router = useRouter();
  const MapElement = useRef(null);
  const [latlog, setLatlog] = useState([]);
  
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
        ],
        {
          css: true,
        }
      ).then(async ([MapView, WebMap, Graphic, Point]) => {
        let res = await gettingPathOfAParticularShip({
          mmsi,
        });
  
        const webmap = new WebMap({
          basemap: "topo-vector",
        });

        if (res.length > 0) {
          setLatlog(res.map(item=>[item.longitude,item.latitude,"1"]))
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

        //polyline.addPath([polyline.getPoint(0, 0)]);
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
        <title>Route Ship GIS</title>
      </Head>
     
      <div className="flex">
        <div className="w-full">
          <div
            className="mapLayer"
            style={{ height: "calc(100vh - 136px)", width: "100vw" }}
            ref={MapElement}
          ></div>
          {console.log(latlog)}
        </div>
      </div>
     

    </div>
  );
};

export default Route;
