import { motion } from "framer-motion";

export const DoodleArrow = () => {
  return (
    <div className="pointer-events-none absolute -right-16 top-10 hidden lg:block opacity-60">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Hand-drawn looping path */}
        <motion.path
          d="M 10 10 C 40 -10, 90 20, 80 60 C 70 100, 30 90, 40 50 C 45 30, 80 40, 100 90"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1, transition: { duration: 1.2, ease: "easeInOut" } }
          }}
        />
        {/* Arrow head */}
        <motion.path
          d="M 85 85 L 100 90 L 98 75"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1, transition: { delay: 1, duration: 0.3 } }
          }}
        />
      </motion.svg>
    </div>
  );
};