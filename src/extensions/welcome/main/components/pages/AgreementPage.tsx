import { FC } from "react";
import ReactMarkdown from "react-markdown";

import "github-markdown-css/github-markdown-light.css";
import { Page } from "../Welcome";

const AgreementPage: FC<{
  page: Page;
  checked: boolean;
  onCheck: (checked: boolean) => void;
}> = ({ page, checked, onCheck }) => {
  if (page.page_type !== "agreement_page") return null;

  const { agree_content } = page;

  const handleAgreementCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onCheck(e.target.checked);
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="flex flex-col flex-grow w-full">
        {agree_content ? (
          <div className="flex-grow p-4 h-10 overflow-y-auto markdown-body">
            <ReactMarkdown>{agree_content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-grow text-xl bg-gray-200">
            データを入力してからリロードしてページを表示してください。
          </div>
        )}
      </div>
      <div className="flex items-center justify-centershrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleAgreementCheckboxChange}
          className="mr-2 cursor-pointer"
        />
        <span>同意する</span>
      </div>
    </div>
  );
};

export default AgreementPage;
