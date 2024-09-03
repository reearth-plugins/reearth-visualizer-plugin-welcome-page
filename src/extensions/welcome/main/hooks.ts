import { useLayoutEffect, useState } from "react";

import { postMsg } from "@/shared/utils";

export default () => {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    window.onmessage = (e) => {
      if (e.data.action === "viewportSize") {
        const { width, height } = e.data.payload;
        const panelWidth = width / 2;
        const panelHeight = height / 2;
        const htmlElement = document.documentElement;
        htmlElement.style.width = `${panelWidth}px`;
        htmlElement.style.height = `${panelHeight}px`;

        const bodyElement = document.body;
        bodyElement.style.width = `${panelWidth}px`;
        bodyElement.style.height = `${panelHeight}px`;
        setReady(true);
      }
    };
  }, []);

  useLayoutEffect(() => {
    postMsg("getViewportSize");
  }, []);

  return {
    ready,
  };
};
