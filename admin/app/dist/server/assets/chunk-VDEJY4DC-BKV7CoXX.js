import { u as useOnSuccessTransition } from "./chunk-J2UYHABD-DLDVTXtS.js";
import { A as AuthUIContext } from "./chunk-EIO6LPR6-BfBdj5c5.js";
import { Loader2 } from "lucide-react";
import { useRef, useContext, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" });
}
export {
  SignOut as S
};
