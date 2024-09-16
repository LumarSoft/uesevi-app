"use client";
import { motion } from "framer-motion";

export const FramerComponent = ({
  children,
  style,
  animationInitial,
  animationAnimate,
  animationTransition,
  animationWhileInView,
  animationViewPort,
  animationVariants,
  animationExit,
}: {
  children: React.ReactNode;
  style?: string;
  animationInitial?: Record<string, any> | string;
  animationAnimate?: Record<string, any>;
  animationTransition?: Record<string, any>;
  animationWhileInView?: Record<string, any> | string;
  animationViewPort?: Record<string, any>;
  animationVariants?: Record<string, any>;
  animationExit?: Record<string, any>;
}) => {
  return (
    <motion.div
      className={style}
      initial={animationInitial}
      animate={animationAnimate}
      transition={animationTransition}
      whileInView={animationWhileInView}
      viewport={animationViewPort}
      variants={animationVariants}
      exit={animationExit}
    >
      {children}
    </motion.div>
  );
};
