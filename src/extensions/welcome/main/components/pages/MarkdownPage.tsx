import { FC } from "react";
import ReactMarkdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";

import "github-markdown-css/github-markdown-light.css";
import { Page } from "../Welcome";

const MarkdownPage: FC<{
  page: Page;
}> = ({ page }) => {
  if (page.page_type !== "md_page") return null;

  const { md_content } = page;

  return (
    <div className="flex-grow p-4 overflow-y-auto markdown-body">
      <ReactMarkdown
        rehypePlugins={[
          [
            rehypeExternalLinks,
            { target: "_blank", rel: "noopener noreferrer" },
          ],
        ]}
      >
        {md_content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPage;
