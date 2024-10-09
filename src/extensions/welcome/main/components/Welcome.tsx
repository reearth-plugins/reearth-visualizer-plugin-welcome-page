import React, { useEffect, useState, useMemo } from "react";

import LeftArrowIcon from "@/assets/leftArrow.svg";
import RightArrowIcon from "@/assets/rightArrow.svg";
import { Button } from "@/shared/components/ui/button";
import { hexToHSL, postMsg } from "@/shared/utils";

import AgreementPage from "./pages/AgreementPage";
import MarkdownPage from "./pages/MarkdownPage";
import TutorialPage from "./pages/TutorialPage";
import WelcomePage from "./pages/WelcomePage";

export type WidgetData = {
  page_setting: Page[];
  appearance: {
    primary_color?: string;
    bg_color?: string;
  };
};

export type Page = { id: string } & (
  | {
      page_type: "welcome_page" | undefined;
      page_title?: string;
      page_description?: string;
      media_type?: string;
      media_url?: string;
      video_url?: string;
      thumbnail_video_url?: string;
    }
  | {
      page_type: "tutorial_page";
      tutorial_page_image_url?: string;
    }
  | {
      page_type: "md_page";
      md_content?: string;
    }
  | {
      page_type: "agreement_page";
      agree_content?: string;
    }
);

const Modal: React.FC<{ data: WidgetData }> = ({ data }) => {
  const pages = useMemo(() => data.page_setting ?? [], [data.page_setting]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = useMemo(
    () => pages[currentPageIndex],
    [pages, currentPageIndex]
  );

  const [dontShowThisAgain, setDontShowThisAgain] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] =
    useState<Record<string, { checked: boolean }>>();
  useEffect(() => {
    setIsAgreementChecked(
      pages
        .filter((page) => page.page_type === "agreement_page")
        .reduce((acc, page) => ({ ...acc, [page.id]: { checked: false } }), {})
    );
  }, [pages]);

  const primaryColor = data.appearance?.primary_color ?? "#0085BE";
  useEffect(() => {
    if (primaryColor) {
      const hslColor = hexToHSL(primaryColor);
      if (hslColor) {
        document.documentElement.style.setProperty("--primary", hslColor);
      }
    }
  }, [primaryColor]);

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleWelcomeCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDontShowThisAgain(e.target.checked);
  };

  const handleAgreementCheckboxChange = (id: string, checked: boolean) => {
    setIsAgreementChecked((prev) => ({
      ...prev,
      [id]: { checked },
    }));
  };

  const handleStartToUse = () => {
    postMsg("closeModal", {
      dontShowThisAgain,
    });
  };

  return (
    <div className="absolute flex flex-col w-full h-full gap-4 p-4 rounded-lg">
      <div className="flex justify-center flex-grow h-0 pt-4 pl-4 pr-4">
        {(currentPage.page_type === "welcome_page" ||
          currentPage.page_type === undefined) && (
          <WelcomePage page={currentPage} />
        )}
        {currentPage.page_type === "tutorial_page" && (
          <TutorialPage page={currentPage} />
        )}
        {currentPage.page_type === "md_page" && (
          <MarkdownPage page={currentPage} />
        )}
        {currentPage.page_type === "agreement_page" && (
          <AgreementPage
            page={currentPage}
            checked={!!isAgreementChecked?.[currentPage.id]?.checked}
            onCheck={(checked) =>
              handleAgreementCheckboxChange(currentPage.id, checked)
            }
          />
        )}
        {(!pages || pages.length === 0) && <p>No content available</p>}
      </div>

      {currentPageIndex === 0 && (
        <div className="flex items-center justify-center shrink-0">
          <input
            type="checkbox"
            checked={dontShowThisAgain}
            onChange={handleWelcomeCheckboxChange}
            className="mr-2 cursor-pointer"
          />
          <span>次回から表示しない</span>
        </div>
      )}

      <div className="flex items-center justify-between px-4">
        <Button
          onClick={handlePrev}
          className={`${currentPageIndex === 0 ? "opacity-0 pointer-events-none" : ""} min-w-40 flex justify-center items-center gap-2`}
        >
          <img src={LeftArrowIcon} alt="Left Arrow" className="h-4" />
          Prev
        </Button>
        <div className="flex items-center justify-center">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 mx-1 rounded-full`}
              style={{
                backgroundColor:
                  index === currentPageIndex ? primaryColor : "#ccc",
              }}
            />
          ))}
        </div>

        {currentPageIndex === pages.length - 1 ? (
          <Button
            className="min-w-40"
            disabled={
              currentPage.page_type === "agreement_page" &&
              !isAgreementChecked?.[currentPage.id]?.checked
            }
            onClick={handleStartToUse}
          >
            Start to Use
          </Button>
        ) : (
          <Button
            className="flex items-center justify-center gap-2 min-w-40"
            onClick={handleNext}
            disabled={
              currentPage.page_type === "agreement_page" &&
              !isAgreementChecked?.[currentPage.id]?.checked
            }
          >
            Next
            <img src={RightArrowIcon} alt="Right Arrow" className="h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Modal;
