import React from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { useState } from 'react'
import { pageFramer } from '../../globalsetups/defaultValues'
import { useRouter } from 'next/router'
import Link from "next/Link"
const Button = ({string,url}) => {

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

    return (
        // <div>
            <Link href={url}>
                <motion.a
                    className="basicDarkButton cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    variants={container}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                >
                    {
                        string.split("").map((alpha, index) => {
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
                </motion.a>
            </Link>
        )
}

export default Button