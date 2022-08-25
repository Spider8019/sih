import React, { useState, useEffect, useRef } from "react";
import { gettingPathOfAParticularShip } from "../globalsetups/api";
import { useRouter } from "next/router";
import { loadModules } from "esri-loader";
import Head from "next/head";
import Loader from "../components/global/Loader";
import Heatmap from "../components/heatmap"
import { uploadObject } from "../globalsetups/aws";
import { read, utils, writeFileXLSX } from "xlsx";
let XLSX = require("xlsx");


const Route = () => {
    const router = useRouter();
    const MapElement = useRef(null);
    const [latlog, setLatlog] = useState([]);
    const [awsDetails, setAWSDetails] = useState("");


    useEffect(() => {
        let view;
        const { mmsi } = router.query;

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
                        "esri/views/MapView",
                        "esri/WebMap",
                        "esri/Graphic",
                        "esri/geometry/Point",
                        "esri/core/watchUtils",
                    ],
                    {
                        css: true,
                    }
                ).then(async ([Map, CSVLayer, MapView, Legend, WebMap, Graphic, Point, watchUtils]) => {
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
                    });
                    const webmap = new WebMap({
                        basemap: "topo-vector",
                        layers:[layer]
                      });

                    let res = await gettingPathOfAParticularShip({
                        mmsi,
                    });
                    if (res.length > 0) {
                        setLatlog(res)
                        var view = new MapView({
                            map: webmap,
                            center: [res[0] && res[0].longitude, res[0] && res[0].latitude],
                            // layers:[layer],
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
                        view.ui.add(
                            new Legend({
                                view:view,
                            }),
                            "bottom-left"
                        );
                        view.graphics.add(polylineGraphic);
                    }

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
                <title>Route Ship GIS</title>
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
};

export default Route;
