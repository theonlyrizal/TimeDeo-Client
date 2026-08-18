import { motion } from "framer-motion";

export const AnimatedScale = () => {
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
      {/* Base and Pole */}
      <motion.path d="M7 21h10" />
      <motion.path d="M12 3v18" />
      <motion.path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
      
      {/* Left Pan */}
      <motion.path
        d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"
        variants={{
          hidden: { y: -5, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.5, delay: 0.2 } },
          hover: { y: [0, 2, -2, 0], transition: { duration: 0.6 } }
        }}
      />
      
      {/* Right Pan */}
      <motion.path
        d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"
        variants={{
          hidden: { y: 5, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.5, delay: 0.2 } },
          hover: { y: [0, -2, 2, 0], transition: { duration: 0.6 } }
        }}
      />
    </motion.svg>
  );
};