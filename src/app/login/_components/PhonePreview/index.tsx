import AnimatedScreenshots from "@/app/login/_components/AnimatedScreenshots";
import ImageClient from "@/components/ImageClient";

const PhonePreview = () => (
  <div className="relative h-[631px] w-[380px]">
    <ImageClient fill alt="home phones" src="/home-phones.png" />
    <div className="absolute top-[25px] ml-[112px] h-[540px] w-[248px]">
      <AnimatedScreenshots />
    </div>
  </div>
);

export default PhonePreview;
