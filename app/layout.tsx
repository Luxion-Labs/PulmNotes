import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import { CustomTitleBar } from "@/app/components/CustomTitleBar";
import "./globals.scss";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pulm Notes",
  description: "A personal note taking app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-pulm-theme="light"
      data-pulm-editor-width="comfortable"
      data-pulm-font-size="default"
      className={`${dmSans.variable} ${inter.variable}`}
    >
      <body className="h-screen overflow-hidden bg-white text-gray-900 cursor-text font-sans selection:bg-blue-100 scrollbar-none">
        <div className="flex h-screen flex-col">
          <CustomTitleBar />
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
