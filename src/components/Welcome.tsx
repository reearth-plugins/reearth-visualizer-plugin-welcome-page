import React, { useState } from "react";

import MyIcon from '@/assets/icon.svg';
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

  const handleWelcomeCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsWelcomeChecked(e.target.checked);
  };

  const handleAgreementCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <div className="flex justify-center items-center">
            <div className="w-full h-auto">
              <img src={MyIcon} alt="My Icon" className="w-full h-auto" />
            </div>
          </div>
        );
      case "agreement_page":
        return (
          <div className="flex flex-col items-center">
            <div className="w-full h-64 bg-gray-300 p-4 mb-4 rounded-md">
              <h2 className="text-center">{page.page_title}</h2>
              <p>{page.agree_content}</p>
            </div>
            <div className="flex items-center justify-center mt-4">
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
          <>
            <h2>{page.page_title}</h2>
            <p>{page.page_description}</p>
            {renderMediaContent(page)}
            <div className="flex items-center justify-center mt-4">
              <input
                type="checkbox"
                checked={isWelcomeChecked}
                onChange={handleWelcomeCheckboxChange}
                className="mr-2"
              />
              <span>Agree</span>
            </div>
          </>
        );
    }
  };

  const renderMediaContent = (page: PageConfig) => {
    if (page.media_type === "image_type" && page.media_url) {
      return <img src={page.media_url} alt="Uploaded Image" className="w-full h-auto" />;
    } else if (page.media_type === "video_type" && page.video_url) {
      return <video src={page.video_url} controls className="w-full h-auto" />;
    } else {
      return <div className="w-full h-56 bg-gray-300 flex items-center justify-center" />;
    }
  };

  return (
    <div className="absolute inset-0 p-4 bg-white rounded-lg shadow-lg flex flex-col">
      <div className="flex-grow overflow-auto">{renderContent()}</div>
      {/* Pagination Dots */}
      <div className="flex justify-center mt-4">
        {pages.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 mx-1 rounded-full ${
              index === currentPage ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
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
      </div>
    </div>
  );
};

export default Modal;
