import "./globals.css";
import type { Metadata } from "next";
import { KoHo, Inder } from "next/font/google";
import { GlobalProvider } from "./context";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const koHo = KoHo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${koHo.className} `}>
        <GlobalProvider>{children}</GlobalProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
