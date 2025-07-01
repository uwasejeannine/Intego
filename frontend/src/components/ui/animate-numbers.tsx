import React from "react";
import { useSpring, animated } from "react-spring";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  className,
}) => {
  // React Spring animation config
  const props = useSpring({
    from: { number: value / 2 },
    to: { number: value },
    delay: 200,
    config: { duration: 1200 },
  });

  const isInteger = Number.isInteger(value);

  return (
    <animated.div className={cn("default-class", className)}>
      {props.number.to((n) => (isInteger ? n.toFixed(0) : n.toFixed(2)))}
    </animated.div>
  );
};
export default AnimatedNumber;
