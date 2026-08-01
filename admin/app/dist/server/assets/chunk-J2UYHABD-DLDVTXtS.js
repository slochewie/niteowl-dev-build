import { A as AuthUIContext } from "./chunk-EIO6LPR6-BfBdj5c5.js";
import { j as getSearchParam } from "./chunk-KS7QMNEN-DP7ssmzE.js";
import { useContext, useState, useCallback } from "react";
function useOnSuccessTransition({
  redirectTo: redirectToProp
}) {
  const { redirectTo: contextRedirectTo } = useContext(AuthUIContext);
  const [isPending, setIsPending] = useState(false);
  const {
    navigate,
    hooks: { useSession },
    onSessionChange
  } = useContext(AuthUIContext);
  const { refetch: refetchSession } = useSession();
  const onSuccess = useCallback(async () => {
    setIsPending(true);
    await (refetchSession == null ? void 0 : refetchSession());
    if (onSessionChange) await onSessionChange();
    setIsPending(false);
    const redirectTo = redirectToProp || getSearchParam("redirectTo") || contextRedirectTo;
    navigate(redirectTo);
  }, [
    refetchSession,
    onSessionChange,
    navigate,
    redirectToProp,
    contextRedirectTo
  ]);
  return { onSuccess, isPending };
}
export {
  useOnSuccessTransition as u
};
