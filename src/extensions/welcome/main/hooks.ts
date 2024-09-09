import { useLayoutEffect, useState } from "react";

import { postMsg } from "@/shared/utils";

import { WidgetData } from "./components/Welcome";

export default () => {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<WidgetData>();

  useLayoutEffect(() => {
    window.onmessage = (e) => {
      if (e.data.action === "viewportSize") {
        const { width, height, widgetData } = e.data.payload;
        // console.log(width, height, widgetData);
        const panelWidth = width / 2;
        const panelHeight = height / 2;
        const htmlElement = document.documentElement;
        htmlElement.style.width = `${panelWidth}px`;
        htmlElement.style.height = `${panelHeight}px`;

        const bodyElement = document.body;
        bodyElement.style.width = `${panelWidth}px`;
        bodyElement.style.height = `${panelHeight}px`;
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
