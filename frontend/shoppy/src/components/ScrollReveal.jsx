import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const ScrollReveal = ({ children, delay = 0.2, direction = "up" }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });

    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
            x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                delay,
            },
        },
    };

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
        else {
            controls.start("hidden"); 
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
