import { useQuery } from "@tanstack/react-query";
import { UseFormSetValue } from "react-hook-form";

import { getMockedUser } from "@/actions/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  setValue: UseFormSetValue<{ email: string; password: string }>;
};

export default function MockedForm({ setValue }: Props) {
  const {
    data: mockedUser,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["mockedUser"],
    queryFn: () => getMockedUser(),
  });

  const handleOnChange = (email: string) => {
    setValue("email", email);
    setValue("password", "test");
  };

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Select onValueChange={handleOnChange}>
      <SelectTrigger className="h-12 w-full">
        <SelectValue placeholder="Choose an user" />
      </SelectTrigger>
      <SelectContent>
        {isPending ? (
          <SelectItem value="Loading...">Loading...</SelectItem>
        ) : (
          mockedUser.map((user) => (
            <SelectItem key={user.id} value={user.email}>
              {user.email}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
