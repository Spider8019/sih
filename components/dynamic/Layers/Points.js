import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { defaults } from "../../../globalsetups/defaultValues"

const Points = (props) => {


    console.log(props)
    const [graphic, setGraphic] = useState(null);
    useEffect(() => {

        loadModules(["esri/config",
            "esri/Map",
            "esri/views/MapView", 'esri/Graphic', 'esri/layers/GraphicsLayer', "esri/widgets/Search"]).then(([Graphic]) => {
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
                    symbol: simpleLineSymbol
                });
                props.view.graphic.add(polylineGraphic);

                setGraphic(props.list)

            }).catch((err) => console.error(err));

        return function cleanup() {
            props.view.graphics.remove(graphic);
        };
    });

    return null;

}
   

//const simpleMarkerSymbol = {
//     type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
//     url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
//     width: "30px",
//     height: "30px"
// };
// const popupTemplate = {
//     title: "{Name}",
//     content: "{Description}",
// }
// // const search = new Search({  //Add Search widget
// //     view: props.view
// // });

// props.list.forEach((item, index) => {
//     props.view.graphics.add(new Graphic({
//         geometry: { type: "point", latitude: item.latitude, longitude: item.longitude },
//         symbol: simpleMarkerSymbol,
//         attributes: { Name: `<b>${item.heading}</b>`, Description: `Location: ${item.location}<br/>Longitude: ${item.longitude}<br/>Latitude: ${item.latitude}<br/><a class="inline-block mx-0 mt-4 basicDarkButton" href="${defaults.baseUrl}tourism/${item._id}">Find More</a>` },
//         popupTemplate: popupTemplate
//     }))
// })

export default Points;