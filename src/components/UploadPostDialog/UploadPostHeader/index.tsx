import { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadPostHeaderParams {
  currentStep: number;
  onClick: () => void;
  backButton: ReactElement;
  title: string;
  uploadStatus: boolean;
  uploadLoading: boolean;
  updateLoading: boolean;
  buttonSubmitText: string;
}

export const UploadPostHeader = ({
  uploadStatus,
  uploadLoading,
  updateLoading,
  buttonSubmitText,
  backButton,
  title,
  onClick,
  currentStep,
}: UploadPostHeaderParams) => {
  return (
    <div
      className={cn("flex text-center", {
        "justify-between": currentStep === 1,
        "justify-center": currentStep === 0,
      })}
    >
      {currentStep === 1 && (
        <button className="text-sm" type="button" onClick={onClick}>
          {backButton}
        </button>
      )}
      <h3 className="font-bold">{title}</h3>
      {currentStep === 1 && (
        <Button
          className="font-semibold"
          loading={uploadStatus || uploadLoading || updateLoading}
          type="submit"
          variant="ghost"
        >
          {buttonSubmitText}
        </Button>
      )}
    </div>
  );
};
