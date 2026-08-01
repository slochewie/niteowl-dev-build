import { u as useOnSuccessTransition } from "./chunk-J2UYHABD-DLDVTXtS.js";
import { A as AuthUIContext } from "./chunk-EIO6LPR6-BfBdj5c5.js";
import { Loader2 } from "lucide-react";
import { useContext, useRef, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
function AuthCallback({ redirectTo }) {
  const {
    hooks: { useIsRestoring },
    persistClient
  } = useContext(AuthUIContext);
  const isRestoring = useIsRestoring == null ? void 0 : useIsRestoring();
  const isRedirecting = useRef(false);
  const { onSuccess } = useOnSuccessTransition({ redirectTo });
  useEffect(() => {
    if (isRedirecting.current) return;
    if (!persistClient) {
      isRedirecting.current = true;
      onSuccess();
      return;
    }
    if (isRestoring) return;
    isRedirecting.current = true;
    onSuccess();
  }, [isRestoring, persistClient, onSuccess]);
  return /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" });
}
export {
  AuthCallback as A
};
