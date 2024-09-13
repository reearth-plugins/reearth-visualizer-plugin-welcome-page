import html from "@distui/welcome/main/index.html?raw";

import { GlobalThis } from "@/shared/reearthTypes";

const dontShowThisAgainKey =
  "reearth-visualizer-plugin-welcome-page-dont-show-this-again";

const reearth = (globalThis as unknown as GlobalThis).reearth;

reearth.data.clientStorage.getAsync(dontShowThisAgainKey).then((value) => {
  if (!value) {
    reearth.modal.show(html, {
      background:
        reearth.extension.widget?.property?.appearance?.bg_color ?? "#0000",
    });
  }
});

reearth.extension.on(
  "message",
  (msg: { action: string; payload?: unknown }) => {
    if (msg.action === "getViewportSize") {
      if (reearth.extension.widget?.property?.page_setting?.length > 0) {
        reearth.modal.postMessage({
          action: "viewportSize",
          payload: {
            width: reearth.viewer.viewport.width,
            height: reearth.viewer.viewport.height,
            widgetData: reearth.extension.widget?.property,
          },
        });
      } else {
        reearth.modal.close();
      }
    } else if (msg.action === "closeModal") {
      reearth.modal.close();
    } else if (msg.action === "dontShowThisAgain") {
      // Save the state
      const dontShowThisAgain = !!msg.payload;
      reearth.data.clientStorage.setAsync(
        dontShowThisAgainKey,
        dontShowThisAgain
      );
    }
  }
);
