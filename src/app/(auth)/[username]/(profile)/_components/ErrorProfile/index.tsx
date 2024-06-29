import Link from "next/link";

const ErrorProfile = () => {
  return (
    <div className="mt-10 flex flex-col items-center gap-10">
      <h1 className="text-2xl font-semibold">Profile not found</h1>
      <span>
        The link you followed may be broken, or the page may have been removed.{" "}
        <Link className="text-blue-700" href="/">
          Go back
        </Link>{" "}
        to Instagram Clone.
      </span>
    </div>
  );
};

export default ErrorProfile;
