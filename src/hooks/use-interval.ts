import * as React from "react";

export function useInterval(
  callback: () => void,
  delay: number | null,
  enabled = true,
) {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (delay === null || !enabled) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay, enabled]);
}
