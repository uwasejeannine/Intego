import { useState, useEffect } from "react";

/**
 * Hook to check if the current screen size matches the given media query.
 *
 * @param query - The media query string to check against.
 * @returns A boolean indicating if the media query matches the current screen size.
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleMediaQueryChange = () => setMatches(mediaQuery.matches);

    handleMediaQueryChange();
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
