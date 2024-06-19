const ProfileSkeleton = () => {
  return (
    <div className="mx-auto flex max-w-lg-page animate-pulse flex-col p-4">
      <div className="px-5 pt-9">
        {/* User Profile Skeleton */}
        <div className="mb-11">
          <div className="flex">
            <div className="mx-auto flex w-64 shrink-0 justify-center">
              <div className="size-36 rounded-full bg-gray-300"></div>
            </div>
            <section className="ml-12 grow">
              <div className="flex h-10 items-center">
                <div className="h-6 w-32 rounded bg-gray-300"></div>
                <div className="ml-5 flex items-center space-x-2">
                  <div className="h-6 w-20 rounded bg-gray-300"></div>
                </div>
              </div>
              <div className="my-3 flex space-x-8 text-primary-text">
                <div className="h-4 w-16 rounded bg-gray-300"></div>
                <div className="h-4 w-16 rounded bg-gray-300"></div>
                <div className="h-4 w-16 rounded bg-gray-300"></div>
              </div>
              <div className="text-sm text-primary-text">
                <div className="h-4 w-48 rounded bg-gray-300"></div>
                <div className="mt-2 h-4 w-full rounded bg-gray-300"></div>
              </div>
            </section>
          </div>
        </div>

        <div className="grid w-full grid-cols-3 gap-1">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className=" relative col-span-1 aspect-square rounded bg-gray-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
