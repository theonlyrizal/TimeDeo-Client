import { motion } from "framer-motion";

export const AnimatedWallet = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      {/* Wallet Body */}
      <motion.path 
        d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" 
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1, transition: { duration: 1, ease: "easeInOut" } }
        }}
      />
      <motion.path 
        d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" 
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1, transition: { duration: 1, delay: 0.2, ease: "easeInOut" } }
        }}
      />
      
      {/* Pulsing Accent */}
      <motion.circle 
        cx="16" cy="14" r="1"
        variants={{
          hidden: { opacity: 0, scale: 0 },
          visible: { opacity: 1, scale: 1, transition: { delay: 1.2 } },
          hover: { scale: 1.5, fill: "currentColor", transition: { type: "spring" } }
        }}
      />
    </motion.svg>
  );
};