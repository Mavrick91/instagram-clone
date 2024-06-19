interface PluralizeProps {
  count: number;
  singular: string;
  bold?: boolean;
}

export const Pluralize: React.FC<PluralizeProps> = ({
  count,
  singular,
  bold,
}) => {
  return (
    <>
      {bold ? <b>{count}</b> : count} {count <= 1 ? singular : `${singular}s`}
    </>
  );
};
