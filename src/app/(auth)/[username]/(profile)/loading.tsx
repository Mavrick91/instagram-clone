const SectionSkeleton = () => {
  return (
    <div className="grid w-full grid-cols-3 gap-1">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className=" relative col-span-1 aspect-square rounded bg-gray-300"
        />
      ))}
    </div>
  );
};

export default SectionSkeleton;
