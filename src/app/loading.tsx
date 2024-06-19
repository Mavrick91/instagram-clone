const AuthSkeleton = () => {
  return (
    <div className="space-y-4 py-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="mx-auto max-w-lg animate-pulse space-y-4 rounded bg-white"
        >
          <div className="flex items-center space-x-4">
            <div className="size-10 rounded-full bg-gray-300"></div>
            <div className="h-4 w-1/4 bg-gray-300"></div>
          </div>

          <div className="size-[512px] bg-gray-300"></div>

          <div className="flex space-x-4">
            <div className="size-6 rounded-full bg-gray-300"></div>
            <div className="size-6 rounded-full bg-gray-300"></div>
            <div className="size-6 rounded-full bg-gray-300"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-300"></div>
            <div className="h-4 w-1/2 bg-gray-300"></div>
          </div>

          <hr className="mt-4 h-px w-full" />
        </div>
      ))}
    </div>
  );
};

export default AuthSkeleton;
