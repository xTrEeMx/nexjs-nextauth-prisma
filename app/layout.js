import { Inter } from "next/font/google";
import "./globals.css";
import {AppStateProvider} from "@/utils/core/application";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NextAuth Authentication",
  description: "NextJS Application with NextAuth and Prisma",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AppStateProvider>
          {children}
      </AppStateProvider>
      </body>
    </html>
  );
}
