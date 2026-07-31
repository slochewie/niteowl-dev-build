import "react/jsx-runtime";
import { useContext, useId, useRef, useEffect, createContext } from "react";
const PageAIAPIContext = createContext(null);
createContext(0);
function useRegisterPageAIContext(config) {
  const ctx = useContext(PageAIAPIContext);
  const id = useId();
  const configRef = useRef(config);
  configRef.current = config;
  useEffect(() => {
    if (!ctx || !configRef.current) return;
    ctx.register(id, {
      get routeName() {
        return configRef.current?.routeName ?? "";
      },
      get pageDescription() {
        return configRef.current?.pageDescription ?? "";
      },
      get suggestions() {
        return configRef.current?.suggestions;
      },
      get clientTools() {
        return configRef.current?.clientTools;
      }
    });
    return () => {
      ctx.unregister(id);
    };
  }, [
    ctx,
    id,
    config === null,
    config?.routeName,
    config?.pageDescription,
    JSON.stringify(config?.suggestions)
  ]);
}
export {
  useRegisterPageAIContext as u
};
