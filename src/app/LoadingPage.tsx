"use client";

import { motion } from "framer-motion";

export const LoadingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.2, 
        staggerChildren: 0.1 
      }
    }
  };

  const dotVariants = {
    hidden: { 
      y: -20, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex items-center space-x-3"
      >
        {[1, 2, 3, 4].map((dot) => (
          <motion.div
            key={dot}
            variants={dotVariants}
            className="w-4 h-4 rounded-full bg-yellow-500"
          />
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: 0.5,
            type: "spring",
            stiffness: 100 
          }
        }}
        className="absolute bottom-1/4 text-yellow-500 text-xl font-bold tracking-widest"
      >
        CARGANDO
      </motion.div>
    </div>
  );
};