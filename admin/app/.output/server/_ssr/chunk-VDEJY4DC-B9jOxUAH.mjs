import { u as useOnSuccessTransition } from "./chunk-J2UYHABD-BGbih45j.mjs";
import { A as AuthUIContext } from "./chunk-EIO6LPR6-DGHjhJA7.mjs";
import { useRef, useContext, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
import { L as LoaderCircle } from "../_libs/lucide-react.mjs";
function SignOut({ redirectTo }) {
  const signingOut = useRef(false);
  const { authClient, basePath, viewPaths } = useContext(AuthUIContext);
  const { onSuccess } = useOnSuccessTransition({
    redirectTo: redirectTo || `${basePath}/${viewPaths.SIGN_IN}`
  });
  useEffect(() => {
    if (signingOut.current) return;
    signingOut.current = true;
    authClient.signOut().finally(onSuccess);
  }, [authClient, onSuccess]);
  return /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" });
}
export {
  SignOut as S
};
