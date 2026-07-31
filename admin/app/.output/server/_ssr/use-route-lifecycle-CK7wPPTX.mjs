import { useEffect } from "react";
function useRouteLifecycle({
  routeName,
  context,
  overrides,
  beforeRenderHook
}) {
  if (beforeRenderHook) {
    const canRender = beforeRenderHook(overrides, context);
    if (!canRender) {
      const error = new Error(`Unauthorized: Cannot render ${routeName}`);
      if (overrides.onRouteError) {
        try {
          const result = overrides.onRouteError(routeName, error, context);
          if (result instanceof Promise) {
            result.catch(() => {
            });
          }
        } catch {
        }
      }
      throw error;
    }
  }
  useEffect(() => {
    if (overrides.onRouteRender) {
      try {
        const result = overrides.onRouteRender(routeName, context);
        if (result instanceof Promise) {
          result.catch((error) => {
            if (overrides.onRouteError) {
              overrides.onRouteError(routeName, error, context);
            }
          });
        }
      } catch (error) {
        if (overrides.onRouteError) {
          overrides.onRouteError(routeName, error, context);
        }
      }
    }
  }, [routeName, overrides, context]);
}
export {
  useRouteLifecycle as u
};
