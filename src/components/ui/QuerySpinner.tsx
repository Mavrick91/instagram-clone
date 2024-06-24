import { LoaderSizeProps } from "react-spinners/helpers/props";
import PuffLoader from "react-spinners/PuffLoader";

const QuerySpinner = (props: LoaderSizeProps) => {
  return (
    <div className="flex w-full justify-center">
      <PuffLoader {...props} />
    </div>
  );
};

export default QuerySpinner;
