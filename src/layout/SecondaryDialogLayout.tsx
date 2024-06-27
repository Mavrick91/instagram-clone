import { Fragment, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";

type SecondaryDialogLayoutProps = {
  title?: string;
  description?: string;
  contents: ReactNode[];
  closeModal: () => void;
};

const SecondaryDialogLayout = ({
  title,
  description,
  contents,
  closeModal,
}: SecondaryDialogLayoutProps) => {
  return (
    <div className="w-screen max-w-[400px] text-center">
      {(title || description) && (
        <>
          <div className="flex flex-col items-center p-8 pb-4">
            {title && <span className="text-center text-xl">{title}</span>}
            {description && (
              <span className="mt-1 text-center text-sm text-ig-secondary-text">
                {description}
              </span>
            )}
          </div>
          <Separator elevated />
        </>
      )}
      {contents.map((content, index) => (
        <Fragment key={index}>
          {content}
          {index < contents.length - 1 && <Separator elevated />}
        </Fragment>
      ))}
      <Separator elevated />
      <Button className="py-3" text="sm" variant="ghost" onClick={closeModal}>
        Cancel
      </Button>
    </div>
  );
};

export default SecondaryDialogLayout;
