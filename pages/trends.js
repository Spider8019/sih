import React, { useState } from 'react'
import { motion } from "framer-motion"
import Button from '../components/global/Button'
import { xEntry, xPositiveEntry, opacityEntry } from '../globalsetups/defaultValues'
import { notifywarn } from '../components/global/Snacks'
import { useRouter } from 'next/router'

const Trends = () => {

    const [startDate, setStartDate] = useState(Date.now)
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState(Date.now)
    const [endTime, setEndTime] = useState("")
    const [selectedFilter, setSelectedFilters] = useState([])
    const router = useRouter();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            transition: {
                delay: 0.5,
                staggerChildren: 0.1
            }
        }
    }

// routepred/fishing_trends_all/

// fish_type: "trollers"
// start_ts:
// end_ts:
    const item = {
        hidden: {
            opacity: 0
        },
        show: {
            opacity: 1
        },
        exit: {
            opacity: 0
        }
    }

    const submitForFishTrends = () => {
        if (!startDate || !startTime || !endDate || !endTime) {
            notifywarn("details are missing")
            return
        }
        router.replace(`/trendsresult?start_ts=${startDate}T${startTime}Z&end_ts=${endDate}T${endTime}&fish_type=trollers`)
    }
    return (
        <div className="grid place-items-center h-[calc(100vh - 136px)]"
            style={{ height: "calc(100vh - 136px" }}>

            <motion.div
                initial="initial"
                animate="animate"
                exit="initial"
                variants={opacityEntry}
                className="bg-gray-200 rounded p-4 shadow-xl w-3/4 grid grid-cols-2 gap-8">
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="initial"

                    variants={xEntry}
                    className="">
                    <p className="text-3xl font-bold mb-4 italic text-gray-800">Timestamps</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input type="date"
                            className="basicDarkButtonInvert"
                            placeholder="Start Date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                        <input className="basicDarkButtonInvert" type="time"
                            placeholder="Start Time"
                            value={startTime}
                            onChange={e => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input className="basicDarkButtonInvert" type="date"
                            placeholder="End Date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                        <input className="basicDarkButtonInvert" type="time"
                            placeholder="End Time"
                            value={endTime}
                            onChange={e => setEndTime(e.target.value)}
                        />
                    </div>
                </motion.div>
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="initial"
                    variants={xPositiveEntry}
                    style={{ borderLeft: "1px solid var(--base-color)" }}
                    className="pl-2 flex flex-col justify-between "
                >
                    <div>
                        {['Troller', 'Pole and Line'].map((item, index) => {
                            return (
                                <div key={index}
                                    className="flex"
                                >
                                    <input type="checkbox"
                                        key={index}
                                        value={item}
                                        onChange={e => {
                                            if (selectedFilter.length == 0) {
                                                setSelectedFilters([e.target.value]);
                                                return;
                                            }
                                            if (e.target.checked)
                                                setSelectedFilters([...selectedFilter, e.target.value])
                                            else
                                                setSelectedFilters(selectedFilter.splice(index, 1))

                                        }}
                                    />
                                    <p className="ml-2 italic">{item}</p>
                                </div>
                            )
                        })
                        }
                    </div>
                    <motion.button
                        className="basicDarkButton w-full"
                        onClick={submitForFishTrends}
                        variants={container}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                    >
                        {
                            "Get Fishing Zones".split("").map((alpha, index) => {
                                return (
                                    <motion.span
                                        key={index}
                                        variants={item}
                                    >
                                        {alpha}
                                    </motion.span>
                                )
                            })
                        }
                    </motion.button>

                </motion.div>
            </motion.div>
        </div>
    )
}

export default Trends