import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, Home, Upload, BookOpen, Brain } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Create an array of semesters from 1 to 8
const ALL_SEMESTERS = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/browse', label: 'Browse Papers', icon: BookOpen },
  { href: '/study-assistant', label: 'AI Study Assistant', icon: Brain },
];

interface SemesterSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (semester: string) => void;
}

export function SemesterSelectDialog({
  isOpen,
  onClose,
  onSelect,
}: SemesterSelectDialogProps) {
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const handleSubmit = () => {
    if (selectedSemester) {
      onSelect(selectedSemester);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-center text-xl font-bold">Select Your Semester</DialogTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 w-full"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogHeader>
        <DialogDescription className="text-center text-sm text-gray-500">
          You must select a semester to view papers
        </DialogDescription>
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose your semester to view relevant papers
            </label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {ALL_SEMESTERS.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={!selectedSemester}>
              View Papers
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 