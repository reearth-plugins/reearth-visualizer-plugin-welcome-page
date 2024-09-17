import html from "@distui/welcome/main/index.html?raw";

import { GlobalThis } from "@/shared/reearthTypes";

const reearth = (globalThis as unknown as GlobalThis).reearth;

reearth.modal.show(html);

reearth.extension.on(
  "message",
  (msg: { action: string; payload?: unknown }) => {
    if (msg.action === "getViewportSize") {``
      reearth.modal.postMessage({
        action: "viewportSize",
        payload: {
          width: reearth.viewer.viewport.width,
          height: reearth.viewer.viewport.height,
          widgetData: reearth.extension.widget?.property,
        },
      });
    } else if (msg.action === "closeModal") {
      reearth.modal.close();
    }
  }
);
