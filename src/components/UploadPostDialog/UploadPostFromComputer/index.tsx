import { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

import AddPictureSVG from "@/components/SVG/AddPictureSVG";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UploadPostFromComputer() {
  const { setValue, register } = useFormContext();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.files === null ||
      event.target.files.length === 0 ||
      event.target.files[0] === null
    )
      return;
    setValue("picture", event.target.files[0]);
  };

  return (
    <div className="flex aspect-square max-w-[755px] flex-col items-center justify-center">
      <AddPictureSVG />
      <div className="my-4 text-xl">Drag photo here</div>
      <label className={cn("cursor-pointer", buttonVariants({ size: "xs" }))}>
        Select From Computer
        <input
          type="file"
          className="sr-only"
          {...register("picture")}
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
