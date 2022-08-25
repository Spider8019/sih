//import useTranslation from 'next-translate/useTranslation'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

//import Forecast from '../dialogs/Forecast'
import _ from "lodash";
// import { useSession, signIn } from "next-auth/react
import { Avatar, IconButton } from "@mui/material";
import { defaultOptions } from "../../globalsetups/defaultValues";
import { isMobile, isBrowser } from "react-device-detect";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "../../styles/pages/Home.module.css";
import { motion } from "framer-motion";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useTheme } from "next-themes";
import DarkModeTwoToneIcon from "@mui/icons-material/DarkModeTwoTone";
import Button from "./Button";

const Navbar = () => {
  // let { t } = useTranslation()
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const redirectLink = (e) => {
    setState({ ...state, top: false });
  };

  const list = () => (
    <ul
      className={`${
        router.pathname.includes("/literature") && "stickyNavbarLowerOne"
      } text-black sm:text-white bg-white dark:bg-amber-900 sm:bg-amber-500 flex flex-col sm:flex-row w-full}`}
    >
      <li
        className={router.pathname == "/" ? "sm:bg-amber-600 bg-amber-500" : ""}
      >
        <Link href="/">
          <a
            onClick={redirectLink}
            className="px-4 sm:px-2 p-2 grid items-center  border-r-2 border-white"
          >
            Home
          </a>
        </Link>
      </li>
      <li
        className={
          router.pathname == "/map" ? "sm:bg-amber-600 bg-amber-500" : ""
        }
      >
        <Link href="/map">
          <a
            onClick={redirectLink}
            className="px-4 sm:px-2 p-2 grid items-center  border-r-2 border-white"
          >
            Access GIS
          </a>
        </Link>
      </li>
      <li
        className={
          router.pathname == "/trends" ? "sm:bg-amber-600 bg-amber-500" : ""
        }
      >
        <Link href="/trends">
          <a
            onClick={redirectLink}
            className="px-4 sm:px-2 p-2 grid items-center  border-r-2 border-white"
          >
            Fishing Trends
          </a>
        </Link>
      </li>
      <li
        className={
          router.pathname.includes("/team")
            ? "sm:bg-amber-600 bg-amber-500"
            : ""
        }
      >
        <Link href="/team">
          <a
            onClick={redirectLink}
            className="px-4 sm:px-2 p-2 grid items-center  border-r-2 border-white"
          >
            Team
          </a>
        </Link>
      </li>
    </ul>
  );

  if (
    ["/auth/signin", "/login"].includes(router.pathname) ||
    router.pathname.includes("dashboard")
  )
    return null;

  if (isBrowser) {
    return (
      <div className="dark:bg-black flex flex-col  bg-amber-500 p-4 sm:p-0 sm:bg-white dark:bg-black">
        <div className="sm:px-10 sm:py-4 flex justify-between  items-center">
          <div className="flex items-center">
            <div className="w-16 h-16">
              <Image
                layout="responsive"
                height={1}
                width={1}
                objectFit="contain"
                src="/static/images/sih.png"
                alt="Without Background Logo"
              />
            </div>
            <h1 className="text-xl ml-12 sm:text-2xl sm:ml-4">
              Smart India
              <br /> Hackathon 2022
            </h1>
          </div>
          <div className="text-right items-center">
            <p className="text-sm">Indian Institute of Technology, Jammu</p>
            <p className="text-2xl italic underline">tinkerchild</p>
          </div>
        </div>
        <div className="hidden sm:block">{list()}</div>
        <style jsx>{`
          .stickyNavbarLowerOne {
            position: sticky;
            top: 0;
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export default Navbar;
