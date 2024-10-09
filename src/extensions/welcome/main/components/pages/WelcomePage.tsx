import { FC } from "react";

import { Page } from "../Welcome";

const WelcomePage: FC<{
  page: Page;
}> = ({ page }) => {
  if (page.page_type !== "welcome_page" && page.page_type !== undefined)
    return null;

  const {
    page_title,
    page_description,
    media_type,
    media_url,
    video_url,
    thumbnail_video_url,
  } = page;

  return (
    <div className="flex flex-col w-full h-auto bg-gray-50">
      <div className="flex flex-col gap-2 p-4 ">
        <h1 className="text-2xl shrink-0">{page_title}</h1>
        <p className="overflow-hidden shrink-0 whitespace-nowrap text-ellipsis">
          {page_description}
        </p>
      </div>
      <div className="relative flex justify-center flex-grow w-full h-0">
        {media_type === "image_type" && media_url ? (
          <img src={media_url} className="object-cover w-full" />
        ) : media_type === "video_type" && video_url ? (
          <video
            src={video_url}
            poster={thumbnail_video_url}
            className="object-cover w-full"
          />
        ) : (
          <div className="absolute w-full h-full" />
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
