import { getPicturesByUser } from "@/actions/picture";
import ThumbnailGrid from "@/components/ThumbnailGrid";

const ExplorePage = async () => {
  const explorePictures = await getPicturesByUser();

  return (
    <div className="mx-auto flex max-w-lg-page flex-col">
      <div className="px-5 py-6">
        <ThumbnailGrid pictures={explorePictures} />
      </div>
    </div>
  );
};

export default ExplorePage;
