
import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/contexts/theme-context"
import { LanguageProvider } from "@/contexts/language-context"
import { UserProvider } from "@/contexts/user-context"
import './globals.css';

export const metadata: Metadata = {
  title: 'API 브릿지',
  description: 'Firebase Studio에서 생성됨',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Comfortaa:wght@400;500;600;700&family=Chiron+GoRound+TC:wght@300&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground antialiased font-semibold">
        <LanguageProvider>
          <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
            <UserProvider>
              {children}
              <Toaster />
            </UserProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
