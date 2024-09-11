import { useLayoutEffect, useState } from "react";

import { postMsg } from "@/shared/utils";

import { WidgetData } from "./components/Welcome";

export default () => {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<WidgetData>();

  useLayoutEffect(() => {
    window.onmessage = (e) => {
      if (e.data.action === "viewportSize") {
        const { widgetData } = e.data.payload;
        setReady(true);
        setData(widgetData);
      }
    };
  }, []);

  useLayoutEffect(() => {
    postMsg("getViewportSize");
  }, []);

  return {
    ready,
    data,
  };
};
