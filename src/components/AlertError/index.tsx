import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  error: string;
  className?: string;
};

const ErrorAlert = ({ error, className }: Props) => {
  return (
    <Alert variant="destructive" className={className}>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
