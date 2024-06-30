import { useQuery } from "@tanstack/react-query";

import { getMockedUser } from "@/actions/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  handleChangeEmail: (email: string) => void;
};

const LoginForm = ({ handleChangeEmail }: Props) => {
  const {
    data: mockedUser,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["mockedUser"],
    queryFn: () => getMockedUser(),
  });

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Select onValueChange={handleChangeEmail}>
      <SelectTrigger className="h-12 w-full">
        <SelectValue placeholder="Choose an user" />
      </SelectTrigger>
      <SelectContent>
        {isPending ? (
          <SelectItem value="Loading...">Loading...</SelectItem>
        ) : (
          mockedUser.map((user) => {
            return (
              <SelectItem key={user.id} value={user.email}>
                {user.email}
              </SelectItem>
            );
          })
        )}
      </SelectContent>
    </Select>
  );
};

export default LoginForm;
