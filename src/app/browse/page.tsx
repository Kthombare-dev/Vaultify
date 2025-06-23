'use client';

import { useState, useEffect, ReactNode, CSSProperties, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Clock, Code, Library, Calendar, FileType, Eye, Loader2, Search, X } from 'lucide-react';
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

interface FiltersState {
  branch: string;
  semester: string;
  academicYear: string;
  paperType: string;
}

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
  const branches = useMemo(() => Array.from(new Set(papers.map(p => p.branch))).sort(), [papers]);
  const semesters = useMemo(() => Array.from(new Set(papers.map(p => p.semester))).sort((a, b) => parseInt(a) - parseInt(b)), [papers]);
  const academicYears = useMemo(() => Array.from(new Set(papers.map(p => p.academicYear))).sort().reverse(), [papers]);
  const paperTypes = useMemo(() => Array.from(new Set(papers.map(p => p.paperType))).sort(), [papers]);

  const handleFilterChange = (key: keyof FiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === 'all' ? '' : value }));
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({ branch: '', semester: '', academicYear: '', paperType: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8 p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative col-span-1 md:col-span-2 lg:col-span-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search by subject name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filters.branch} onValueChange={(value) => handleFilterChange('branch', value)}>
          <SelectTrigger><SelectValue placeholder="All Branches" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.semester} onValueChange={(value) => handleFilterChange('semester', value)}>
          <SelectTrigger><SelectValue placeholder="All Semesters" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {semesters.map(s => <SelectItem key={s} value={s}>Sem: {s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.academicYear} onValueChange={(value) => handleFilterChange('academicYear', value)}>
          <SelectTrigger><SelectValue placeholder="All Years" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {academicYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.paperType} onValueChange={(value) => handleFilterChange('paperType', value)}>
          <SelectTrigger><SelectValue placeholder="All Paper Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Paper Types</SelectItem>
            {paperTypes.map(t => (
              <SelectItem key={t} value={t}>
                {t.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" onClick={resetFilters} className="flex items-center gap-2">
          <X className="h-4 w-4" /> Reset Filters
        </Button>
      </div>
    </motion.div>
  );
}

function PaperCard({ paper, onView }: { paper: PaperData, onView: (paper: PaperData) => void }) {
  const { subjectName, subjectCode, semester, academicYear, branch, paperType, fileUrl, uploadedAt, fileName: paperFileName } = paper;
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

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for viewers
  const [selectedPdf, setSelectedPdf] = useState<PaperData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // States for filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FiltersState>({
    branch: '',
    semester: '',
    academicYear: '',
    paperType: '',
  });

  // Initialize search query from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(decodeURIComponent(searchFromUrl));
    }
  }, [searchParams]);

  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const searchMatch = searchQuery.toLowerCase()
        ? paper.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          paper.subjectCode.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const branchMatch = filters.branch ? paper.branch === filters.branch : true;
      const semesterMatch = filters.semester ? paper.semester === filters.semester : true;
      const yearMatch = filters.academicYear ? paper.academicYear === filters.academicYear : true;
      const typeMatch = filters.paperType ? paper.paperType === filters.paperType : true;

      return searchMatch && branchMatch && semesterMatch && yearMatch && typeMatch;
    });
  }, [papers, searchQuery, filters]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const papersData = await getAllPapers();
        setPapers(papersData);
      } catch (err) {
        setError('Failed to fetch papers. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const handleViewPaper = (paper: PaperData) => {
    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(paper.fileName || '');
    if (isImage) {
      setSelectedImage(paper.fileUrl);
    } else {
      setSelectedPdf(paper);
    }
  };

  const handleCloseViewer = () => {
    setSelectedPdf(null);
    setSelectedImage(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Browse Question Papers
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Explore the collection of papers uploaded by the community.
            </p>
          </motion.div>

          {!loading && !error && (
            <FilterControls 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
              papers={papers}
            />
          )}

          {loading && (
            <div className="text-center">
              <p>Loading papers...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {filteredPapers.map((paper, i) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <PaperCard paper={paper} onView={() => handleViewPaper(paper)} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && filteredPapers.length === 0 && (
            <div className="text-center text-gray-500 mt-16">
              <p className="text-lg font-semibold">No papers found</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {selectedPdf && (
        <PdfViewer 
          fileUrl={selectedPdf.fileUrl}
          fileName={selectedPdf.fileName || 'paper'}
          onClose={handleCloseViewer} 
        />
      )}
      
      {selectedImage && (
        <Lightbox
          open={!!selectedImage}
          close={handleCloseViewer}
          slides={[{ src: selectedImage }]}
        />
      )}
    </>
  );
} 