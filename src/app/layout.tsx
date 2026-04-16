import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { OnboardingGuard } from "@/components/OnboardingGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriBot Elite - Your AI Farming Partner",
  description: "Advanced AI assistance for the modern farmer. Get real-time insights, disease diagnosis, and market intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0a140a]">
        <UserProvider>
          <OnboardingGuard>
            <main className="mobile-container w-full overflow-x-hidden">
              {children}
            </main>
          </OnboardingGuard>
        </UserProvider>
      </body>
    </html>
  );
}
