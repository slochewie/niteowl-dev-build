import { u as useOnSuccessTransition } from "./chunk-J2UYHABD-BGbih45j.mjs";
import { A as AuthUIContext } from "./chunk-EIO6LPR6-DGHjhJA7.mjs";
import { useContext, useRef, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
import { L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
  return /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" });
}
export {
  AuthCallback as A
};
