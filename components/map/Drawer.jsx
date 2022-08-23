import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Button from "../global/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import countryList from "country-list";
import { Icon } from "@mui/material";
var countries = require("country-data-list").countries;

export default function TemporaryDrawer() {
  const router = useRouter();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState();
  const [country, setCountry] = useState("");
  const [selected, setSelected] = useState(0);
  const [circlelat,setCircleLat]=useState(0);
  const [circlelog,setCircleLog]=useState(0);
  const [radius,setRadius]=useState(0);


  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton onClick={toggleDrawer(anchor, true)}>
            <AccessTimeIcon />
          </IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className="select-none grid grid-cols-3">
              <button
                className="rounded font-bold p-4 m-2 shadow-lg active:bg-[#00c100]"
                onClick={() => setSelected(0)}
              >
                1
              </button>
              <button
                className="rounded font-bold p-4 m-2 shadow-lg active:bg-[#00c100]"
                onClick={() => setSelected(1)}
              >
                2
              </button>
              <button
                className="rounded font-bold p-4 m-2 shadow-lg active:bg-[#00c100]"
                onClick={() => setSelected(2)}
              >
                3
              </button>
            </div>
            <div
              className={`m-4 rounded-xl p-8 flex-col ${
                selected === 0
                  ? "bg-gray-200 shadow-xl"
                  : "opacity-[0.2] pointer-events-none"
              }`}
            >
              {/* <DateTimePicker onChange={onChange} value={value} /> */}
              <p className="text-xl mb-4 text-center">Give a Timestamp</p>
              <input
                type="date"
                className="w-full basicDarkButtonInvert mb-2"
                onChange={(e) => setDate(e.target.value)}
                value={date}
              />
              <input
                type="time"
                className="w-full basicDarkButtonInvert"
                onChange={(e) => setTime(e.target.value)}
                value={time}
              />
              <div className="mt-8 w-full">
                <button
                  className="basicDarkButton mx-auto text-black"
                  onClick={() => {
                    router.replace(
                      `/filterbytimestamp?timestamp=${
                        date + "T" + time + ":00Z"
                      }`
                    );
                  }}
                >
                  Find Location
                </button>
              </div>
              <Link href="/map">
                <a className="block mt-4 underline text-right italic text-gray-800">
                  Get latest location
                </a>
              </Link>
            </div>

            <div
              className={`m-4 rounded-xl p-8 flex-col ${
                selected === 1
                  ? "bg-gray-200 shadow-xl"
                  : "opacity-[0.2] pointer-events-none"
              }`}
            >
              <p className="text-xl mb-4 text-center">Select a Country</p>

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="basicDarkButtonInvert w-full bg-white"
              >
                {countries.all.map((item, index) => {
                  return (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <div className="mt-8 w-full">
                <button
                  className="basicDarkButton mx-auto text-black"
                  onClick={() => {
                    router.replace(`/filterbycountry?country=${country}`);
                  }}
                >
                  Filter by Country
                </button>
              </div>
            </div>

            <div
              className={`m-4 rounded-xl p-8 flex-col ${
                selected === 2
                  ? "bg-gray-200 shadow-xl"
                  : "opacity-[0.2] pointer-events-none"
              }`}
            >
              <p className="text-xl mb-4 text-center">
                Filter by location
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Latitude"
                  className="w-full basicDarkButtonInvert mb-2"
                  onChange={(e) => setCircleLat(e.target.value)}
                  value={circlelat}
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  className="w-full basicDarkButtonInvert mb-2"
                  onChange={(e) => setCircleLog(e.target.value)}
                  value={circlelog}
                />
              </div>
              <i>Enter radius = {radius} kilometers</i>
              <input
                type="range"
                min="1"
                max="1000"
                className="w-full basicDarkButtonInvert mb-2"
                onChange={(e) => setRadius(e.target.value)}
                value={radius}
              />

              <div className="mt-8 w-full">
                <button
                  className="basicDarkButton mx-auto text-black"
                  onClick={() => {
                    router.replace(
                      `/filterbylocation?longitude=${circlelog}&latitude=${circlelat}&radius=${radius}`
                    );
              
                  }}
                >
                  Find in Circle
                </button>
              </div>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

// 1) Filteing based on timestamp
// 2) filtering based on country of origin of boat
// 3) Filtering based on latitue and longitude
