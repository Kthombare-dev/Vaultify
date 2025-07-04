'use client';

import { useState, useEffect, ReactNode, CSSProperties, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Clock, Code, Library, Calendar, FileType, Eye, Loader2, Search, X, Home, Upload, Brain, ChevronLeft, ChevronRight, School, GraduationCap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getAllPapers, PaperData } from '@/lib/unified-services';
import { formatDistanceToNow } from 'date-fns';
import { PdfViewer } from '@/components/PdfViewer';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ShineBorder from '@/components/magicui/shine-border';
import { MagicCard } from "@/components/magicui/magic-card";
import { useSearchParams } from 'next/navigation';
import { SemesterSelectDialog } from '@/components/ui/semester-select-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

interface FiltersState {
  branch: string;
  semester: string;
  academicYear: string;
  paperType: string;
  collegeName: string;
  universityName: string;
}

// Create an array of semesters from 1 to 8
const ALL_SEMESTERS = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

// --- Filter Controls ---
function FilterControls({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  papers
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filters: FiltersState;
  setFilters: (f: FiltersState | ((prev: FiltersState) => FiltersState)) => void;
  papers: PaperData[];
}) {
  // Get unique values for filters
  const branches = useMemo(() => Array.from(new Set(papers.map(p => p.branch))).sort(), [papers]);
  const academicYears = useMemo(() => Array.from(new Set(papers.map(p => p.academicYear))).sort().reverse(), [papers]);
  const paperTypes = useMemo(() => Array.from(new Set(papers.map(p => p.paperType))).sort(), [papers]);
  const colleges = useMemo(() => Array.from(new Set(papers.map(p => p.collegeName).filter(Boolean))).sort(), [papers]);
  const universities = useMemo(() => Array.from(new Set(papers.map(p => p.universityName).filter(Boolean))).sort(), [papers]);

  const handleFilterChange = (key: keyof FiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === 'all' ? '' : value }));
  };
  
  const resetFilters = () => {
    setFilters({
      branch: '',
      semester: '',
      academicYear: '',
      paperType: '',
      collegeName: '',
      universityName: ''
    });
    setSearchQuery('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8 p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-md"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Button variant="outline" onClick={resetFilters} className="whitespace-nowrap">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Select value={filters.branch || "all"} onValueChange={(value) => handleFilterChange('branch', value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.semester || "all"} onValueChange={(value) => handleFilterChange('semester', value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {Array.from({ length: 8 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>Semester {i + 1}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.academicYear || "all"} onValueChange={(value) => handleFilterChange('academicYear', value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.paperType || "all"} onValueChange={(value) => handleFilterChange('paperType', value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Paper Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {paperTypes.map((type) => (
                <SelectItem key={type} value={type}>{type.replace('-', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.collegeName || "all"} onValueChange={(value) => handleFilterChange('collegeName', value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="College" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colleges</SelectItem>
              {colleges.map((college) => (
                <SelectItem key={college} value={college}>{college}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.universityName || "all"} onValueChange={(value) => handleFilterChange('universityName', value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="University" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              {universities.map((university) => (
                <SelectItem key={university} value={university}>{university}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}

function PaperCard({ paper, onView }: { paper: PaperData, onView: (paper: PaperData) => void }) {
  const { subjectName, subjectCode, semester, academicYear, branch, paperType, fileUrl, uploadedAt, fileName: paperFileName, collegeName, universityName } = paper;
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Define border colors based on paper type
  const getBorderColors = (type: string) => {
    switch (type) {
      case 'mid-term':
        return ["#60A5FA", "#3B82F6", "#2563EB"]; // Blue shades
      case 'end-term':
        return ["#F87171", "#EF4444", "#DC2626"]; // Red shades
      case 'assignment':
        return ["#34D399", "#10B981", "#059669"]; // Green shades
      case 'notes':
        return ["#A78BFA", "#8B5CF6", "#7C3AED"]; // Purple shades
      default:
        return ["#A07CFE", "#FE8A71", "#FED7AA"]; // Default colors
    }
  };

  // Get glow color based on paper type
  const getGlowColor = (type: string) => {
    switch (type) {
      case 'mid-term':
        return 'rgba(59, 130, 246, 0.2)'; // Blue glow
      case 'end-term':
        return 'rgba(239, 68, 68, 0.2)'; // Red glow
      case 'assignment':
        return 'rgba(16, 185, 129, 0.2)'; // Green glow
      case 'notes':
        return 'rgba(139, 92, 246, 0.2)'; // Purple glow
      default:
        return 'rgba(160, 124, 254, 0.2)'; // Default glow
    }
  };

  const getUploadedTime = () => {
    if (uploadedAt && uploadedAt.seconds) {
      return formatDistanceToNow(new Date(uploadedAt.seconds * 1000), { addSuffix: true });
    }
    return 'a while ago';
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Get file extension from original fileName or from fileUrl
      const fileExtension = paperFileName 
        ? paperFileName.substring(paperFileName.lastIndexOf('.')) 
        : fileUrl.substring(fileUrl.lastIndexOf('.'));

      // Create download name with correct extension
      const downloadName = paperFileName || `${subjectName.replace(/ /g, '_')}_${subjectCode}${fileExtension}`;

      const proxyUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(downloadName)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      // Get content type from response
      const contentType = response.headers.get('content-type');
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(new Blob([blob], { type: contentType || 'application/octet-stream' }));
      
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', downloadName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(objectUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <ShineBorder 
        color={getBorderColors(paperType)}
        borderWidth={2}
        duration={isHovered ? 4 : 7}
        className={cn(
          "rounded-xl h-full transition-all duration-300",
          isHovered && "shadow-[0_0_30px] shadow-current/25"
        )}
      >
        <MagicCard>
        <Card 
          className={cn(
            "flex flex-col h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm",
            "transition-all duration-300 ease-out",
            "rounded-xl border border-slate-200/50 dark:border-slate-800/50",
            "hover:bg-white/80 dark:hover:bg-slate-900/80",
            isHovered && [
              "shadow-2xl",
              `shadow-${getGlowColor(paperType)}`,
              "transform-gpu",
              "translate-z-10"
            ]
          )}
        >
          <CardHeader className="pb-4 relative">
            <motion.div
              initial={false}
              animate={isHovered ? { scale: 1.02, y: -2 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {subjectName}
              </CardTitle>
              <CardDescription className="pt-1">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
                    "border-blue-200/50 dark:border-blue-800/50 font-semibold",
                    "transition-transform duration-300",
                    isHovered && "scale-105"
                  )}
                >
                  {subjectCode}
                </Badge>
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="flex-grow">
            <Separator className={cn(
              "mb-4 bg-slate-200/80 dark:bg-slate-700/80",
              "transition-transform duration-300",
              isHovered && "scale-x-105"
            )} />
            <motion.div 
              className="space-y-3"
              animate={isHovered ? { y: -2 } : { y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Library size={16} className="text-slate-500" />
                <span className="font-medium">{branch}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <FileType size={16} className="text-slate-500" />
                <span className="font-medium capitalize">{paperType?.replace('-', ' ')}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Code size={16} className="text-slate-500" />
                  <span className="font-medium">Sem: {semester}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Calendar size={16} className="text-slate-500" />
                  <span className="font-medium">{academicYear}</span>
                </div>
              </div>
              <Separator className="my-2 bg-slate-200/50 dark:bg-slate-700/50" />
              {(collegeName || universityName) && (
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {collegeName && (
                    <div className="flex items-center gap-3 bg-blue-50/50 dark:bg-blue-900/20 p-2 rounded-lg">
                      <School size={16} className="text-blue-500 dark:text-blue-400" />
                      <span className="font-medium truncate" title={collegeName}>{collegeName}</span>
                    </div>
                  )}
                  {universityName && (
                    <div className="flex items-center gap-3 mt-2 bg-purple-50/50 dark:bg-purple-900/20 p-2 rounded-lg">
                      <GraduationCap size={16} className="text-purple-500 dark:text-purple-400" />
                      <span className="font-medium truncate" title={universityName}>{universityName}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </CardContent>

          <CardFooter className={cn(
            "mt-auto flex justify-between items-center p-4",
            "border-t border-slate-200/50 dark:border-slate-800/50",
            "transition-all duration-300",
            isHovered && "bg-slate-50/50 dark:bg-slate-800/50 rounded-b-xl"
          )}>
            <p className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} />
              <span>{getUploadedTime()}</span>
            </p>
            <motion.div 
              className="flex items-center gap-2"
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onView(paper)}
                className={cn(
                  "transition-colors duration-300",
                  isHovered && "bg-white dark:bg-slate-800"
                )}
              >
                <Eye className="mr-2 h-4 w-4" /> View
              </Button>
              <Button 
                size="sm" 
                onClick={handleDownload} 
                disabled={isDownloading}
                className={cn(
                  "transition-all duration-300",
                  isHovered && "shadow-md"
                )}
              >
                {isDownloading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> ...</>
                ) : (
                  <><Download className="mr-2 h-4 w-4" /> Download</>
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
        </MagicCard>
      </ShineBorder>
    </motion.div>
  );
}

// Create a new component that uses useSearchParams
function BrowsePageContent() {
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FiltersState>({
    branch: '',
    semester: '',
    academicYear: '',
    paperType: '',
    collegeName: '',
    universityName: ''
  });
  const [showSemesterDialog, setShowSemesterDialog] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(0);
  const MOBILE_BREAKPOINT = 768; // md breakpoint
  const PAPERS_PER_PAGE = windowWidth < MOBILE_BREAKPOINT ? 3 : 9;

  const searchParams = useSearchParams();
  const initialPaperType = searchParams.get('type') || '';

  useEffect(() => {
    if (initialPaperType) {
      setFilters(prev => ({ ...prev, paperType: initialPaperType }));
    }
  }, [initialPaperType]);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to first page when screen size changes between mobile and desktop
  useEffect(() => {
    setCurrentPage(1);
  }, [PAPERS_PER_PAGE]);

  const fetchPapers = async () => {
    try {
      const fetchedPapers = await getAllPapers();
      setPapers(fetchedPapers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch papers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleSemesterSelect = (semester: string) => {
    setFilters(prev => ({ ...prev, semester }));
  };

  const handleViewPaper = (paper: PaperData) => {
    setSelectedPaper(paper);
  };

  const handleCloseViewer = () => {
    setSelectedPaper(null);
  };

  // Filter papers based on search query and filters
  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          paper.subjectName.toLowerCase().includes(query) ||
          paper.subjectCode.toLowerCase().includes(query) ||
          paper.branch.toLowerCase().includes(query) ||
          (paper.collegeName?.toLowerCase().includes(query) || false) ||
          (paper.universityName?.toLowerCase().includes(query) || false);
        
        if (!matchesSearch) return false;
      }

      // Apply other filters
      if (filters.branch && paper.branch !== filters.branch) return false;
      if (filters.semester && paper.semester !== filters.semester) return false;
      if (filters.academicYear && paper.academicYear !== filters.academicYear) return false;
      if (filters.paperType && paper.paperType !== filters.paperType) return false;
      if (filters.collegeName && paper.collegeName !== filters.collegeName) return false;
      if (filters.universityName && paper.universityName !== filters.universityName) return false;

      return true;
    });
  }, [papers, searchQuery, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPapers.length / PAPERS_PER_PAGE);
  const paginatedPapers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAPERS_PER_PAGE;
    return filteredPapers.slice(startIndex, startIndex + PAPERS_PER_PAGE);
  }, [filteredPapers, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const semesters = useMemo(() => {
    if (!papers.length) return [];
    return Array.from(new Set(papers.map(p => p.semester)))
      .sort((a, b) => parseInt(a) - parseInt(b));
  }, [papers]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Papers</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <Button onClick={fetchPapers}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Browse Papers</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Search and filter through our collection of papers, assignments, and study materials
          </p>
        </motion.div>

        <FilterControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          papers={papers}
        />

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {filteredPapers.length === 0 ? (
              <Alert className="my-8">
                <AlertDescription>
                  {filters.semester ? (
                    <>
                      No papers found for Semester {filters.semester}.
                      {papers.length > 0 && " Try selecting a different semester or adjusting other filters."}
                    </>
                  ) : (
                    "No papers found for the selected filters. Try adjusting your search criteria."
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 min-h-[calc(100vh-400px)]"
                >
                  {paginatedPapers.map((paper) => (
                    <PaperCard
                      key={paper.id}
                      paper={paper}
                      onView={handleViewPaper}
                    />
                  ))}
                  {/* Add empty placeholder cards if needed */}
                  {paginatedPapers.length < PAPERS_PER_PAGE && 
                    Array.from({ length: PAPERS_PER_PAGE - paginatedPapers.length }).map((_, index) => (
                      <div 
                        key={`placeholder-${index}`} 
                        className={cn(
                          "h-full rounded-xl border border-dashed border-gray-200 dark:border-gray-700",
                          windowWidth < MOBILE_BREAKPOINT ? "md:hidden" : "hidden md:block"
                        )}
                      />
                    ))
                  }
                </motion.div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4"
                    >
                      Prev
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "w-8 h-8",
                            pageNum === currentPage && "bg-black text-white dark:bg-white dark:text-black"
                          )}
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {selectedPaper && (
          <PdfViewer
            fileUrl={selectedPaper.fileUrl}
            fileName={selectedPaper.fileName || `${selectedPaper.subjectName}_${selectedPaper.subjectCode}`}
            onClose={handleCloseViewer}
          />
        )}

        <SemesterSelectDialog
          isOpen={showSemesterDialog}
          onClose={() => setShowSemesterDialog(false)}
          onSelect={handleSemesterSelect}
        />
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <BrowsePageContent />
    </Suspense>
  );
} 