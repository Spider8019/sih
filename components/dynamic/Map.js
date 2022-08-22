import React from 'react'
// import Map from "@arcgis/core/Map";
import { Map } from '@esri/react-arcgis';
import Points from "./Layers/Points"


const Esri = ({ height = "calc(100vh - 136px)", list = [] }) => {

    return (
        <div style={{ height: height, width: "100%" }}
        >   
            <Map
                mapProperties={{ basemap: "topo-vector" }}
                viewProperties={{
                    center: [-118.821527826096, 34.0139576938577],
                    zoom: 10
                }}
            >
                <Points list={list} />
            </Map>
        </div>
    )
}

export default Esri