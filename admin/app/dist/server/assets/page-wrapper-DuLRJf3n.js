import { jsx } from "react/jsx-runtime";
import { l as usePluginOverrides, P as PageWrapper$1 } from "./router-DU5jczZR.js";
function PageWrapper({
  children,
  className,
  testId
}) {
  const { showAttribution } = usePluginOverrides("cms", {
    showAttribution: true
  });
  return /* @__PURE__ */ jsx(
    PageWrapper$1,
    {
      className,
      testId,
      showAttribution,
      children
    }
  );
}
export {
  PageWrapper as P
};
