
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CodeXml,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageSquare,
  Plus,
  Server,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/contexts/language-context";
import { useUser } from "@/contexts/user-context";
import AnimatedBackground from "@/components/animated-background";

const getNavItems = (t: (key: string) => string, isAdmin: boolean = false) => {
  const baseItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t('nav.dashboard') },
    { href: "/dashboard/api-board", icon: MessageSquare, label: t('nav.apiBoard') },
    { href: "/dashboard/settings", icon: Settings, label: t('nav.settings') },
  ];
  
  if (isAdmin) {
    baseItems.push({
      href: "/dashboard/admin", 
      icon: Shield, 
      label: t('nav.admin') || '관리자'
    });
  }
  
  return baseItems;
};

const NavLink = ({ href, icon: Icon, label, pathname }: { href: string; icon: any; label: string; pathname: string }) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary font-korean",
      pathname === href && "bg-muted text-primary"
    )}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Link>
);


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isAdmin } = useUser();
  const navItems = getNavItems(t, isAdmin);

  const sidebarNav = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <NavLink key={item.href} {...item} pathname={pathname}/>
      ))}
    </nav>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
      <AnimatedBackground />
      <div className="hidden border-r bg-white/20 backdrop-blur-sm border-white/20 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10 md:block relative z-10">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-white/20 dark:border-white/10 px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold font-korean">
              <CodeXml className="h-6 w-6 text-primary" />
              <span className="font-korean">{t('brand')}</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            {sidebarNav}
          </div>
          <div className="px-4 py-6 border-t border-white/20 dark:border-white/10">
            <Button asChild className="w-full gap-2 h-12">
              <Link href="/dashboard/suggestions">
                <Plus className="h-4 w-4" />
                <span className="font-korean">{t('dashboard.createApi')}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col relative z-10">
        <header className="flex h-14 items-center gap-4 border-b bg-white/20 backdrop-blur-sm border-white/20 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10 px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only font-korean">{t('nav.menu.toggle')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 bg-white/20 backdrop-blur-sm border-white/20 dark:bg-white/5 dark:backdrop-blur-sm">
              <div className="flex h-14 items-center border-b border-white/20 dark:border-white/10 px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold font-korean">
                  <CodeXml className="h-6 w-6 text-primary" />
                  <span className="">{t('brand')}</span>
                </Link>
              </div>
              <div className="flex-1 py-2">
                {sidebarNav}
              </div>
              <div className="px-4 py-6 border-t border-white/20 dark:border-white/10">
                <Button asChild className="w-full gap-2 h-12">
                  <Link href="/dashboard/suggestions">
                    <Plus className="h-4 w-4" />
                    <span className="font-korean">{t('dashboard.createApi')}</span>
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person avatar" />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only font-korean">{t('user.menu.toggle')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-korean">{t('user.menu.myAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="font-korean">{t('user.menu.settings')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="font-korean">{t('user.menu.support')}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="font-korean">{t('user.menu.logout')}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-transparent overflow-auto">
          {children}
        </main>
        
        <footer className="py-6 md:py-4 px-4 relative z-10">
          <div className="flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
              <Server className="h-5 w-5 text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.4)]" />
              <p className="text-center text-xs leading-loose text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.4)] md:text-left font-korean">
                {t('footer.built')}{" "}
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4 text-white hover:text-primary transition-colors font-korean"
                >
                  {t('footer.github')}
                </a>
                {t('footer.available')}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
