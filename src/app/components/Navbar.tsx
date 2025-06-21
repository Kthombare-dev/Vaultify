'use client';

import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // if scroll down hide the navbar
          setIsVisible(false);
        } else {
          // if scroll up show the navbar
          setIsVisible(true);
        }
        // remember current page location to use in the next move
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <motion.nav
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 flex items-center justify-between bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md dark:bg-gray-950/80 md:px-6"
    >
      <Link className="flex items-center gap-2" href="/">
        <AnimatedLogo />
      </Link>
      <div className="hidden items-center gap-6 md:flex">
        <Link href="/" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === '/' ? "text-primary underline underline-offset-4" : "text-muted-foreground")}>Home</Link>
        <Link href="/upload" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === '/upload' ? "text-primary underline underline-offset-4" : "text-muted-foreground")}>Upload</Link>
        <Link href="/browse" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === '/browse' ? "text-primary underline underline-offset-4" : "text-muted-foreground")}>Browse Papers</Link>
      </div>

      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col items-start gap-6 p-6">
              <Link href="/" className={cn("w-full text-lg font-semibold transition-colors hover:text-primary", pathname === '/' ? "text-primary underline underline-offset-4" : "text-muted-foreground")}>Home</Link>
              <Link href="/upload" className={cn("w-full text-lg font-semibold transition-colors hover:text-primary", pathname === '/upload' ? "text-primary underline underline-offset-4" : "text-muted-foreground")}>Upload</Link>
              <Link href="/browse" className={cn("w-full text-lg font-semibold transition-colors hover:text-primary", pathname === '/browse' ? "text-primary underline underline-offset-4" : "text-muted-foreground")}>Browse Papers</Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
} 