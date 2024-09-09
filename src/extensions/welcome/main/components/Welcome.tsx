import React, { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";

export type PageConfig = {
  page_type: string;
  page_title: string;
  page_description?: string;
  media_type?: string;
  media_url?: string;
  md_content?: string;
  agree_content?: string;
};

const Modal: React.FC<{ data: PageConfig[] }> = ({ data }) => {
  console.log("data received", data);
  const [currentPage, setCurrentPage] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const handleNext = () => {
    if (currentPage < data.length - 1) {
      console.log("current",currentPage);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleStartToUse = () => {
    if (isChecked) {
      window.parent.postMessage({ action: "closeModal" }, "*");
    }
  };

  const renderContent = () => {

      if (!Array.isArray(data) || data.length === 0) {
      return <p>No content available</p>;
    }
    const page = data[currentPage];
    console.log("page",page);

    if (!page) return <p>Loading...</p>;

    switch (page.page_type) {
      case "welcome_page":
        return (
          <>
            <h2>{page.page_title}</h2>
            <p>{page.page_description}</p>
            {page.media_type === "image_type" && page.media_url ? (
              <img src={page.media_url} alt="Media Content" />
            ) : null}
            {page.media_type === "video_type" && page.media_url ? (
              <video src={page.media_url} controls />
            ) : null}
          </>
        );
      case "md_page":
        return (
          <div>
            <h2>{page.page_title}</h2>
            <p>{page.md_content}</p>
          </div>
        );
      case "agreement_page":
        return (
          <div>
            <h2>{page.page_title}</h2>
            <p>{page.agree_content}</p>
          </div>
        );
      default:
        return <p>Unknown Page Type</p>;
    }
  };

  return (
    <div className="absolute inset-0 bg-white p-4 rounded-lg shadow-lg">
      {renderContent()}
      <div className="flex justify-between mt-4">
        <Button disabled={currentPage === 0} onClick={handlePrev}>
          Prev
        </Button>
        {currentPage === data.length - 1 ? (
          <>
            <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
              Agree
            </Checkbox>
            <Button disabled={!isChecked} onClick={handleStartToUse}>
              Start to Use
            </Button>
          </>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  );
};

export default Modal;
