import html from "@distui/welcome/main/index.html?raw";
import md5 from "md5";

import { GlobalThis } from "@/shared/reearthTypes";

type Page = WelcomePage | TutorialPage | MarkdownPage | AgreementPage;

type WelcomePage = {
  id: string;
  page_type: "welcome_page" | undefined;
  page_title?: string;
  page_description?: string;
  media_type?: string;
  media_url?: string;
  video_url?: string;
  thumbnail_video_url?: string;
};

type TutorialPage = {
  id: string;
  page_type: "tutorial_page";
  tutorial_page_image_url?: string;
};

type MarkdownPage = {
  id: string;
  page_type: "md_page";
  md_content?: string;
};

type AgreementPage = {
  id: string;
  page_type: "agreement_page";
  agree_content?: string;
};

type Msg =
  | { action: "getViewportSize" }
  | {
      action: "closeModal";
      payload: {
        dontShowThisAgain: boolean;
      };
    };

const DONT_SHOW_THIS_AGAIN_STORAGE_PREFIX =
  "reearth-visualizer-plugin-welcome-page-dont-show-this-again";

const reearth = (globalThis as unknown as GlobalThis).reearth;

// Check Dont Show This Again base on agreement content
const agreementContentMd5s =
  reearth.extension.widget?.property?.page_setting
    ?.filter((page: Page) => page.page_type === "agreement_page")
    ?.map((page: AgreementPage) => md5(page.agree_content ?? "")) ?? [];

const dontShowThisAgainKey = `${DONT_SHOW_THIS_AGAIN_STORAGE_PREFIX}-${agreementContentMd5s.join("-")}`;

reearth.data.clientStorage
  .getAsync(dontShowThisAgainKey)
  .then((value: string) => {
    if (!value) {
      reearth.modal.show(html, {
        background:
          reearth.extension.widget?.property?.appearance?.bg_color ?? "#0000",
      });
    }
  });

reearth.extension.on("message", (msg: Msg) => {
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
    if (msg.payload.dontShowThisAgain) {
      reearth.data.clientStorage.setAsync(dontShowThisAgainKey, true);
    }
    reearth.modal.close();
  }
});
