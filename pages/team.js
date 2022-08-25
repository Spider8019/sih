import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
const Tour = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delay: 0.2,
        staggerChildren: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        delay: 0.5,
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const children = {
    hidden: {
      y: 100,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: 100,
      opacity: 0,
    },
  };
  return (
    <motion.div>
      <div className="containerglitch mt-20">
        <p className="glitch ">
          #tinkerchild
        </p>
      </div>
     {/* // <h1 className="text-8xl text-center font-bold mt-20">#tinkerchild</h1> */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="p-20 grid grid-cols-3"
      >
        {[{
            src: "bhavyta.jpeg",
            name: "Bhavyta",
            post: "Team Leader",
          },
          {
            src: "dhiraj.jpeg",
            name: "Dhiraj Pimparkar",
            post: "Lead ML Engineer",
          },
          {
            src: "parwaan.jpeg",
            name: "Parwaan Virk",
            post: "Lead Backend Developer",
          },
          {
            src: "aman.jpeg",
            name: "Aman Pratap Singh",
            post: "Lead Frontend Developer",
          },
          {
            src: "shreyas.jpeg",
            name: "Shreyas Chatterjee",
            post: "Machine Learning",
          },
          {
            src: "unnamed.png",
            name: "Mahendra Gurve",
            post: "Machine Learning",
          },
        ].map((item, index) => {
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              variants={children}
              className="flex items-center p-4 bg-[#eee] rounded-2xl m-8"
            >
              <motion.div className="teamMember">
                <Image
                  src={"/static/images/" + item.src}
                  height="100"
                  width="100"
                  className=" rounded-full overflow-hidden"
                  alt="Dheeraj Pimparkar"
                />
              </motion.div>
              <div className="ml-8">
                <p className="bold text-xl">{item.name}</p>
                <p className="italic">{item.post}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Tour;
