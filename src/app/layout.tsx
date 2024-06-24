import "./globals.css";

import moment from "moment";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import Provider from "@/providers";

const inter = Inter({ subsets: ["latin"] });

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1 m",
    ss: "1 m",
    m: "1 m",
    mm: "%d m",
    h: "1 h",
    hh: "%d h",
    d: "1 d",
    dd: "%d d",
    w: "1 w",
    ww: "%d w",
    M: "1 m",
    MM: "%d m",
    y: "1 y",
    yy: "%d y",
  },
});

export const metadata: Metadata = {
  title: "Instagram clone",
  description: "Instagram clone",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            pauseOnHover
            theme="light"
          />
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
