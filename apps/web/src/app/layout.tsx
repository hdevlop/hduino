import type { Metadata } from "next";
import { Oxanium, Fira_Code } from "next/font/google";
import { AppProvider } from "@/providers/AppProvider";
import "./globals.css";

// Initialize Blockly blocks and generators
import "@/lib/blockly/init";

const oxanium = Oxanium({
  variable: "--font-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hduino - Visual Arduino Programming",
  description: "A visual block-based programming environment for Arduino. Build, program, and upload your Arduino projects with ease.",
  keywords: ["arduino", "blockly", "visual programming", "embedded systems", "electronics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${oxanium.variable} ${firaCode.variable} font-sans antialiased m-0 p-0`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
