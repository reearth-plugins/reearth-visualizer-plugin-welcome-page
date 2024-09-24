import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import 'github-markdown-css';

import LeftArrowIcon from "@/assets/leftArrow.svg";
import RightArrowIcon from "@/assets/rightArrow.svg";
import { Button } from "@/shared/components/ui/button";
import { hexToHSL, postMsg } from "@/shared/utils";

export type PageConfig = {
  page_type: string;
  page_title: string;
  page_description?: string;
  media_type?: string;
  media_url?: string;
  video_url?: string;
  tutorial_page_image_url?: string;
  md_content?: string;
  agree_content?: string;
};

export type WidgetData = {
  page_setting: PageConfig[];
  appearance: {
    primary_color?: string;
    bg_color?: string;
  };
};

const Modal: React.FC<{ data: WidgetData }> = ({ data }) => {
  const pages = data.page_setting ?? [];
  const primaryColor = data.appearance?.primary_color ?? "#0085BE";
  const [currentPage, setCurrentPage] = useState(0);
  const [isWelcomeChecked, setIsWelcomeChecked] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  useEffect(() => {
    if (primaryColor) {
      const hslColor = hexToHSL(primaryColor);
      if (hslColor) {
        document.documentElement.style.setProperty("--primary", hslColor);
      }
    }
  }, [primaryColor]);

  const currentPageData = pages[currentPage];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleWelcomeCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsWelcomeChecked(e.target.checked);
  };

  const handleAgreementCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsAgreementChecked(e.target.checked);
  };

  const handleStartToUse = () => {
    postMsg("dontShowThisAgain", isWelcomeChecked);
    window.parent.postMessage({ action: "closeModal" }, "*");
  };

const renderContent = () => {
  if (!Array.isArray(pages) || pages.length === 0) {
    return <p>No content available</p>;
  }
  const page = pages[currentPage];
  if (!page) return <p>Loading...</p>;

    switch (page.page_type) {
      case "md_page":
        return (
          <div className="markdown-body w-full h-full overflow-y-auto"
            >
            <ReactMarkdown>{page.md_content}</ReactMarkdown>
          </div>
        );
      case "tutorial_page":
        return (
            <div className="relative flex flex-grow justify-center w-full my-4">
              {page.tutorial_page_image_url ? (
                <img
                  src={page.tutorial_page_image_url}
                  alt="Tutorial Image"
                  className="relative w-full h-full"
                />
                  ):(
                    <div className="absolute w-full h-full bg-gray-100" />
                    )}
            </div>
        );
      case "agreement_page":
        return (
          <div className="flex flex-col w-full gap-2">
            {page.agree_content ? (
              <div className="flex-grow p-4 overflow-y-auto bg-gray-300">
                {page.agree_content}
              </div>
            ) : (
              <div className="flex items-center justify-center flex-grow p-4 text-xl bg-gray-300">
                データを入力してからリロードしてページを表示してください。
              </div>
            )}

            <div className="flex items-center justify-center shrink-0">
              <input
                type="checkbox"
                checked={isAgreementChecked}
                onChange={handleAgreementCheckboxChange}
                className="mr-2"
              />
              <span>Agree</span>
            </div>
          </div>
        );
      case "welcome_page":
      default:
        return (
          <div className="flex flex-col w-full gap-2">
            <div className="text-2xl shrink-0">{page.page_title}</div>
            <p className="overflow-hidden shrink-0 whitespace-nowrap text-ellipsis">
              {page.page_description}
            </p>
            <div className="relative flex justify-center flex-grow w-full h-0">
              {renderMediaContent(
                page.media_type,
                page.media_url,
                page.video_url
              )}
            </div>
          </div>
        );
    }
  };

  const renderMediaContent = (
    type?: string,
    imageUrl?: string,
    videoUrl?: string,
  ) => {
    if (type === "image_type" && imageUrl) {
      return <img src={imageUrl} className="w-auto h-full" />;
    } else if (type === "video_type" && videoUrl) {
      return <video src={videoUrl} controls className="w-auto h-full" />;
    } else {
      return <div className="absolute w-full h-full bg-gray-300" />;
    }
  };
  return (
    <div className="absolute flex flex-col w-full h-full p-4 rounded-lg">
      <div className="absolute top-4 right-4">
      <button
        onClick={() => window.parent.postMessage({ action: "closeModal" }, "*")}
        className="text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
    </div>
      <div className="flex flex-grow h-0 p-4">{renderContent()}</div>

      {currentPage === 0 && (
    <div className="flex items-center justify-center shrink-0">
      <input
        type="checkbox"
        checked={isWelcomeChecked}
        onChange={handleWelcomeCheckboxChange}
        className="mr-2"
      />
      <span>Don't show this again.</span>
    </div>
  )}

      <div className="flex items-center justify-between mt-4">
        <Button
          onClick={handlePrev}
          className={`${currentPage === 0 ? "opacity-0 pointer-events-none" : ""} min-w-40 flex justify-center items-center gap-2`}
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
                backgroundColor: index === currentPage ? primaryColor : "#ccc",
              }}
            />
          ))}
        </div>

        {currentPage === pages.length - 1 ? (
          <Button
            className="min-w-40"
            disabled={
              currentPageData.page_type === "agreement_page" &&
              !isAgreementChecked
            }
            onClick={handleStartToUse}
          >
            Start to Use
          </Button>
        ) : (
          <Button
            className="min-w-40 flex justify-center items-center gap-2"
            onClick={handleNext}
            disabled={
    currentPageData.page_type === "agreement_page" && !isAgreementChecked
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
