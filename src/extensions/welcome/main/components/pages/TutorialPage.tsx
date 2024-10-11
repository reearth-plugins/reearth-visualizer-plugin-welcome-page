import { FC } from "react";

import TutorialImage from "@/assets/tutorial_img.svg";

import { Page } from "../Welcome";

const TutorialPage: FC<{
  page: Page;
}> = ({ page }) => {
  if (page.page_type !== "tutorial_page") return null;

  const { tutorial_page_image_url } = page;

  return (
    <div className="relative flex justify-center flex-grow w-full">
      {tutorial_page_image_url ? (
        <img
          src={tutorial_page_image_url}
          alt="Tutorial Image"
          className="object-cover w-full"
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
};

export default TutorialPage;
