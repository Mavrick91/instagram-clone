import { useEffect, useState } from "react";

function useAspectRatio(url: string): null {
  const [aspectRatio, setAspectRatio] = useState(null);

  // useEffect(() => {
  //   const img = new Image();
  //   img.onload = () => {
  //     setAspectRatio({
  //       naturalWidth: img.naturalWidth,
  //       naturalHeight: img.naturalHeight,
  //     });
  //   };
  //   img.onerror = () => {
  //     console.error(`Could not load image at ${url}`);
  //   };
  //   img.src = url;
  // }, [url]);

  return aspectRatio;
}

export default useAspectRatio;
