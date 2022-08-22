// import NavBar from '@/components/NavBar'
// import axios from 'axios';

import { useRef, useEffect } from 'react';
import { loadModules } from 'esri-loader';

export default function Home({ ...props }) {
    const MapElement = useRef(null)

    useEffect(() => {
        let view;

        loadModules([
            "esri/views/MapView",
            "esri/WebMap",
            "esri/Graphic",
            "esri/geometry/Point"
        ], {
            css: true
        }).then(([MapView, WebMap, Graphic, Point]) => {


            const webmap = new WebMap({
                basemap: 'topo-vector'
            })
            var view = new MapView({
                map: webmap,
                center: [-118.821527826096, 34.0139576938577],
                zoom: 12,
                container: MapElement.current
            })

            // for(var i=0, i_length=props.data.length; i<i_length; i++){


            var point_symbol = new Point({
                longitude: -6.357768833333333,
                latitude: 53.415487166666665,
                spatialReference: { wkid: 3857 }
            });

            var graphic_symbol = new Graphic({
                geometry: point_symbol,
                symbol: {
                    type: "simple-marker",
                    style: "circle",
                    color: "orange",
                    size: "18px",
                    outline: {
                        color: [150, 200, 255],
                        width: 5
                    }
                }
            });

            const polyline = {
                type: "polyline",
                paths: [
                    [-118.821527826096, 34.0139576938577], //Longitude, latitude
                    [-118.814893761649, 34.0080602407843], //Longitude, latitude
                    [-118.808878330345, 34.0016642996246]  //Longitude, latitude
                ]
            };
            const simpleLineSymbol = {
                type: "simple-line",
                color: [226, 119, 40], // Orange
                width: 2
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
                            color: [0, 0, 0, 255]
                          },
                          {
                            // arrow symbol
                            type: "CIMVectorMarker",
                            enable: true,
                            size: 5,
                            markerPlacement: {
                              type: "CIMMarkerPlacementAlongLineSameSize", // places same size markers along the line
                              endings: "WithMarkers",
                              placementTemplate: [19.5], // determines space between each arrow
                              angleToLine: true // symbol will maintain its angle to the line when map is rotated
                            },
                            frame: {
                              xmin: -5,
                              ymin: -5,
                              xmax: 5,
                              ymax: 5
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
                                      [-8, -5.47]
                                    ]
                                  ]
                                },
                                symbol: {
                                  // black fill for the arrow symbol
                                  type: "CIMPolygonSymbol",
                                  symbolLayers: [
                                    {
                                      type: "CIMSolidFill",
                                      enable: true,
                                      color: [0, 0, 0, 255]
                                    }
                                  ]
                                }
                              }
                            ]
                          }
                        ]
                      }
                    }
                  }
            });
            // polyline.addPath([polyline.getPoint(0,0)]);
            view.graphics.add(polylineGraphic)

            view.graphics.add(graphic_symbol);

            // }
        })

        return () => {
            if (!!view) {
                view.destroy()
                view = null
            }
        }
    })

//     First point of the first path:
// polyline.getPoint(0,0)


// Last point of the first path: 
// var lastIdx = polyline.paths[0].length - 1;
// var lastPnt = polyline.getPoint(0, lastIdx)
    return (

            <div className="app-wrapper" style={{height:"calc(100vh - 136px)"}} >
                <div className="app-content">
                    <div className="container no-padding">
                        <div className="row gy-4">
                            <div className="col-12 col-lg-8">
                                <div style={{ height: 850, width: 1100 }} ref={MapElement}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

