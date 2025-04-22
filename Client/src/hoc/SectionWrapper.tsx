<<<<<<< Updated upstream
import React, { Component } from 'react'
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { staggerContainer } from '../utils/motion';

const SectionWrapper = (Component,idName)=> function HOC(){
    return(
        <motion.section variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{once:true,amount:0.25}}
                        className={`${styles.padding} max-w-7xl mx-auto relative z-0`}>
            <span className='hash-span' id={idName}>
              &nbsp;
            </span>
            <Component/>
        </motion.section>
    )

} 

export default SectionWrapper
=======
import React from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "../util/motion.ts";

const SectionWrapper = <P extends object>(
    Component: React.ComponentType<P>,

) => {
    const HOC: React.FC<P> = (props) => (
        <motion.section
            variants={staggerContainer(0.25, 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className={`className="pt-0 sm:pb-16 pb-10 px-6 sm:px-16 max-w-7xl mx-auto relative z-0
"
`}
        >

            <Component {...props} />
        </motion.section>
    );

    return HOC;
};

export default SectionWrapper;
>>>>>>> Stashed changes
