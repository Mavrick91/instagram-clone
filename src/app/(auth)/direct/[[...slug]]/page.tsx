import UpdateNote from "@/app/(auth)/direct/_components/UpdateNote";
import { ServerCatchAllPageProps } from "@/types/global";

import ConversationThread from "./_components/ConversationThread";

const ThreadPage = ({ params }: ServerCatchAllPageProps<"slug">) => {
  const isThoughtPage = params.slug?.[0] ? params.slug[0] === "thought" : false;

  if (isThoughtPage) {
    return <UpdateNote />;
  }

  const selectedThreadId = params.slug?.[1];
  if (!selectedThreadId) return null;

  return (
    <ConversationThread selectedThreadId={parseInt(selectedThreadId, 10)} />
  );
};

export default ThreadPage;
