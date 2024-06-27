import "@//lib/websocketServer";

import { ServerLayoutProps } from "@/types/global";

import SidebarConversation from "./_components/SidebarConversation";

const InboxLayout = ({ children }: ServerLayoutProps) => {
  return (
    <div className="flex h-full">
      <div className="h-full w-[398px] shrink-0 border-r border-ig-separator bg-ig-primary-background pt-9">
        <SidebarConversation />
      </div>
      {children}
    </div>
  );
};

export default InboxLayout;
