import useMediaQuery from "@/hooks/useMediaQuery";

const useStepper = () => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const orientation = isSmallScreen ? "vertical" : "horizontal";

  return { orientation };
};

export { useStepper };
