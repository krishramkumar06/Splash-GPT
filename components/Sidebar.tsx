"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageCircle, Mail, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";

const navigation = [
  { name: "Chat", href: "/", icon: MessageCircle },
  { name: "Email Templates", href: "/email-templates", icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white dark:bg-gray-900">
      {/* Header with Logo */}
      <div className="border-b bg-yaleBlue p-6 text-white">
        <div className="mb-3 flex justify-center">
          <Image
            src="/logo.png"
            alt="SplashGPT Logo"
            width={120}
            height={120}
            className="rounded-lg"
            priority
          />
        </div>
        <h1 className="text-xl font-bold">Splash at Yale</h1>
        <p className="mt-1 text-sm text-blue-100">Admin Assistant</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-yaleBlue text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Theme</span>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-8 w-8 p-0"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          AI assistant - verify critical details with the Splash team
        </p>
      </div>
    </div>
  );
}
