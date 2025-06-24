'use client';

import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Home, Upload, BookOpen, Brain } from 'lucide-react';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/browse', label: 'Browse Papers', icon: BookOpen },
  { href: '/study-assistant', label: 'AI Study Assistant', icon: Brain },
];

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  // Reset loading state when pathname changes
  useEffect(() => {
    setIsLoading(false);
    setIsOpen(false);
  }, [pathname]);

  const handleNavigation = (href: string) => {
    // Always close the sidebar on mobile when any navigation item is clicked
    setIsOpen(false);
    
    // Only trigger loading and navigation if going to a different page
    if (href !== pathname) {
      setIsLoading(true);
      router.push(href);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <motion.nav
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 flex items-center justify-between bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md dark:bg-gray-950/80 md:px-6"
      >
        <Link className="flex items-center gap-2" href="/">
          <AnimatedLogo />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 md:flex">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary underline underline-offset-4"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              className="md:hidden relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full border-l-0 p-0 sm:max-w-sm">
            <div className="flex h-full flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <SheetHeader className="border-b px-6 py-4">
                <SheetTitle className="text-lg">Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col space-y-2 p-6">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                          isActive
                            ? "bg-primary/10 text-primary dark:bg-primary/20"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5",
                          isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
                        )} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="border-t p-6">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  © {new Date().getFullYear()} Vaultify. All rights reserved.
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </motion.nav>
    </>
  );
} 