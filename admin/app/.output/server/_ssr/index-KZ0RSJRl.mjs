import * as React from "react";
var useLayoutEffect2 = globalThis?.document ? React.useLayoutEffect : () => {
};
function useCallbackRef(callback) {
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  });
  return React.useMemo(() => (...args) => callbackRef.current?.(...args), []);
}
export {
  useCallbackRef as a,
  useLayoutEffect2 as u
};
