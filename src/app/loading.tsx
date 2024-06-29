import LoadingSpinner from "@/components/ui/LoadingSpinner";

const AuthSkeleton = () => {
  return (
    <div className="flex-center size-full">
      <LoadingSpinner className="size-11 text-gray-900/80" />
    </div>
  );
};

export default AuthSkeleton;
