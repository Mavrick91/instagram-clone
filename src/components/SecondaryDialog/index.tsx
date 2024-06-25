import { cloneElement, Fragment, ReactElement } from "react";

import { useModal } from "@/providers/ModalProvider";

import Separator from "../ui/separator";

export type SecondaryDialogProps = {
  title?: string;
  description?: string;
  contents: ReactElement[];
};

const SecondaryDialog = ({
  title,
  description,
  contents,
}: SecondaryDialogProps) => {
  const { closeModal } = useModal();

  const enhanceOnClick = (child: ReactElement) => {
    return cloneElement(child, {
      onClick: (e: MouseEvent) => {
        // Call the original onClick if it exists
        if (child.props.onClick) {
          child.props.onClick(e);
        }
        closeModal();
      },
    });
  };

  return (
    <div className="w-screen max-w-[400px] text-center">
      {(title || description) && (
        <div className="flex flex-col items-center p-8 pb-4">
          {title && <span className="text-center text-xl">{title}</span>}
          {description && (
            <span className="mt-1 text-center text-sm text-secondary">
              {description}
            </span>
          )}
        </div>
      )}
      <Separator />
      {contents.map((content, index) => {
        return (
          <Fragment key={index}>
            {enhanceOnClick(content)}
            <Separator />
          </Fragment>
        );
      })}
      <button
        type="button"
        className="w-full py-3 text-sm"
        onClick={closeModal}
      >
        Cancel
      </button>
    </div>
  );
};

export default SecondaryDialog;
