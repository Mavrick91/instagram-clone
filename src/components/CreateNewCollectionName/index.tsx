import { CreateCollectionStep } from "../CreateCollectionStep";

type Props = {
  onClickNext: () => void;
  labelSubmit: string;
};

const CreateNewCollectionName = ({ onClickNext, labelSubmit }: Props) => (
  <CreateCollectionStep onClickNext={onClickNext} labelSubmit={labelSubmit} />
);

export default CreateNewCollectionName;
