import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ProfileLoading = () => {
  return (
    <div className="flex-center h-56 w-full">
      <LoadingSpinner className="size-11 text-gray-900/80" />
    </div>
  );
};

export default ProfileLoading;
