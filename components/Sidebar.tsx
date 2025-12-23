"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Chat", href: "/", icon: MessageCircle },
  { name: "Email Templates", href: "/email-templates", icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
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
                  : "text-gray-700 hover:bg-gray-100"
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
        <p className="text-xs text-gray-500">
          AI assistant - verify critical details with the Splash team
        </p>
      </div>
    </div>
  );
}
