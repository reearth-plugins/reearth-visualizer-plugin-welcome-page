import React, { useState } from "react";

import MyIcon from "@/assets/icon.svg";
import { Button } from "@/shared/components/ui/button";

export type PageConfig = {
  page_type: string;
  page_title: string;
  page_description?: string;
  media_type?: string;
  media_url?: string;
  video_url?: string;
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isWelcomeChecked, setIsWelcomeChecked] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

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
    if (isAgreementChecked) {
      window.parent.postMessage({ action: "closeModal" }, "*");
    }
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
          <div>
            <h2>{page.page_title}</h2>
            <p>{page.md_content}</p>
          </div>
        );
      case "tutorial_page":
        return (
          <div className="flex items-center justify-center">
            <div className="w-full h-auto">
              <img src={MyIcon} alt="My Icon" className="w-full h-auto" />
            </div>
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
            <div className="flex items-center justify-center shrink-0">
              <input
                type="checkbox"
                checked={isWelcomeChecked}
                onChange={handleWelcomeCheckboxChange}
                className="mr-2"
              />
              <span>Don't show this again.</span>
            </div>
          </div>
        );
    }
  };

  const renderMediaContent = (
    type?: string,
    imageUrl?: string,
    videoUrl?: string
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
      <div className="flex flex-grow h-0 p-4">{renderContent()}</div>

      <div className="flex items-center justify-between mt-4">
        <Button
          onClick={handlePrev}
          className={`${currentPage === 0 ? "opacity-0 pointer-events-none" : ""} min-w-40`}
        >
          Prev
        </Button>
        <div className="flex items-center justify-center">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === currentPage ? "bg-blue-500" : "bg-gray-300"
              }`}
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
            className="min-w-40"
            disabled={
              currentPageData.page_type === "agreement_page" &&
              !isAgreementChecked
            }
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </div>

      {/* <div className="flex items-center justify-between mt-4">
        {currentPage > 0 ? (
          <Button onClick={handlePrev}>Prev</Button>
        ) : (
          <div /> // Placeholder for Prev button
        )}
        {currentPage === pages.length - 1 ? (
          <Button disabled={!isAgreementChecked} onClick={handleStartToUse}>
            Start to Use
          </Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div> */}
    </div>
  );
};

export default Modal;
