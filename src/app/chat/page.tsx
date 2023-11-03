import { ChatProvider } from "@/app/chat/contexts/ChatContext";

import { Header } from "@/app/chat/components/Header";
import { MessagesList } from "@/app/chat/components/Messages";
import { Footer } from "@/app/chat/components/Footer";

const ChatPage = () => {
  return (
    <ChatProvider>
      <main className="pt-6 pl-6 pr-6">
        <Header />
        <MessagesList />
        <Footer />
      </main>
    </ChatProvider>
  );
};

export default ChatPage;
