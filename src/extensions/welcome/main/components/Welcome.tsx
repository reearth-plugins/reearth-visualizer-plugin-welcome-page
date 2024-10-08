import React, { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import "github-markdown-css/github-markdown-light.css";

import LeftArrowIcon from "@/assets/leftArrow.svg";
import RightArrowIcon from "@/assets/rightArrow.svg";
import TutorialImage from "@/assets/tutorial_img.svg";
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

export async function generateContentId(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

const Modal: React.FC<{ data: WidgetData }> = ({ data }) => {
  const pages = useMemo(() => data.page_setting ?? [], [data.page_setting]);
  const primaryColor = data.appearance?.primary_color ?? "#0085BE";
  const [currentPage, setCurrentPage] = useState(0);
  const [isWelcomeChecked, setIsWelcomeChecked] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [contentHash, setContentHash] = useState<string | null>(null);

  useEffect(() => {
    const agreementContent = pages.find(
      (page) => page.page_type === "agreement_page"
    )?.agree_content;
    if (agreementContent) {
      generateContentId(agreementContent).then((hash) => {
        setContentHash(hash);
        postMsg("checkAgreementVersion", hash);
      });
    }
  }, [pages]);

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
    // Pass the hash along with the "Don't show this again" state
    postMsg("dontShowThisAgain", {
      hash: contentHash,
      dontShow: isWelcomeChecked,
    });
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
          <div className="markdown-body flex-grow p-4 overflow-y-auto">
            <ReactMarkdown
              rehypePlugins={[
                [
                  rehypeExternalLinks,
                  { target: "_blank", rel: "noopener noreferrer" },
                ],
              ]}
            >
              {page.md_content}
            </ReactMarkdown>
          </div>
        );
      case "tutorial_page":
        return (
          <div className="relative flex justify-center flex-grow w-full">
            {page.tutorial_page_image_url ? (
              <img
                src={page.tutorial_page_image_url}
                alt="Tutorial Image"
                className="w-full object-cover"
              />
            ) : (
              <div>
                <img
                  src={TutorialImage}
                  alt="default_tutorial_image"
                  className="w-full"
                />
              </div>
            )}
          </div>
        );
      case "agreement_page":
        return (
          <div className="flex flex-col w-full">
            {page.agree_content ? (
              <div className="markdown-body flex-grow p-4 overflow-y-auto">
                <ReactMarkdown>{page.agree_content}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-grow text-xl bg-gray-200">
                データを入力してからリロードしてページを表示してください。
              </div>
            )}
          </div>
        );
      case "welcome_page":
      default:
        return (
          <div className="flex flex-col w-full h-auto bg-gray-50">
            <div className="flex flex-col gap-2 p-4 ">
              <h1 className="text-2xl shrink-0">{page.page_title}</h1>
              <p className="overflow-hidden shrink-0 whitespace-nowrap text-ellipsis">
                {page.page_description}
              </p>
            </div>
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
    videoUrl?: string
  ) => {
    if (type === "image_type" && imageUrl) {
      return <img src={imageUrl} className="w-full object-cover" />;
    } else if (type === "video_type" && videoUrl) {
      return <video src={videoUrl} controls className="w-full object-cover" />;
    } else {
      return <div className="absolute w-full h-full" />;
    }
  };
  return (
    <div className="absolute flex flex-col w-full h-full p-4 rounded-lg">
      <div className="flex flex-grow h-0 p-4 justify-center">
        {renderContent()}
      </div>
      <div>
        {currentPage === 0 ? (
          <div className="flex items-center justify-center shrink-0 mt-4">
            <input
              type="checkbox"
              checked={isWelcomeChecked}
              onChange={handleWelcomeCheckboxChange}
              className="mr-2"
            />
            <span>次回から表示しない</span>
          </div>
        ) : (
          currentPageData.page_type === "agreement_page" && (
            <div className="flex items-center justify-center shrink-0 mt-4">
              <input
                type="checkbox"
                checked={isAgreementChecked}
                onChange={handleAgreementCheckboxChange}
                className="mr-2"
              />
              <span>同意する</span>
            </div>
          )
        )}
      </div>
      <div className="flex items-center justify-between mt-4 px-4">
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
              currentPageData.page_type === "agreement_page" &&
              !isAgreementChecked
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
