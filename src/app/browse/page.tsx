'use client';

import { useState, useEffect, ReactNode, CSSProperties, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Clock, Code, Library, Calendar, FileType, Eye, Loader2, Search, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getAllPapers, PaperData } from '@/lib/firebase-services';
import { formatDistanceToNow } from 'date-fns';
import { PdfViewer } from '@/components/PdfViewer';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// --- ShineBorder Component ---
interface ShineBorderProps {
  children: ReactNode;
  className?: string;
  color?: string[];
  borderWidth?: number;
  duration?: number;
}

const ShineBorder = ({
  children,
  className,
  color = ["#A07CFE", "#FE8A71", "#FED7AA"],
  borderWidth = 1,
  duration = 7,
}: ShineBorderProps) => {
  return (
    <div
      style={
        {
          "--shine-color": color.join(","),
          "--shine-border-width": `${borderWidth}px`,
          "--shine-duration": `${duration}s`,
        } as CSSProperties
      }
      className={cn(
        "relative w-full rounded-lg",
        "before:content-[''] before:w-[calc(100%_+_var(--shine-border-width))] before:h-[calc(100%_+_var(--shine-border-width))] before:p-[--shine-border-width] before:absolute before:-top-[--shine-border-width] before:-left-[--shine-border-width] before:z-[-1]",
        "before:rounded-[inherit] before:bg-[conic-gradient(from_var(--shining-angle),var(--shine-color)_0%,var(--shine-color)_10%,transparent_20%,transparent_80%,var(--shine-color)_90%)]",
        "before:animate-[shine_var(--shine-duration)_linear_infinite]",
        className
      )}
    >
      {children}
    </div>
  );
};
// --- End ShineBorder Component ---

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
  filters: any;
  setFilters: (f: any) => void;
  papers: PaperData[];
}) {
  const branches = useMemo(() => [...new Set(papers.map(p => p.branch))].sort(), [papers]);
  const semesters = useMemo(() => [...new Set(papers.map(p => p.semester))].sort((a, b) => parseInt(a) - parseInt(b)), [papers]);
  const academicYears = useMemo(() => [...new Set(papers.map(p => p.academicYear))].sort().reverse(), [papers]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value === 'all' ? '' : value }));
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({ branch: '', semester: '', academicYear: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8 p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative col-span-1 md:col-span-2 lg:col-span-4">
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

  const getUploadedTime = () => {
    if (uploadedAt && uploadedAt.seconds) {
      return formatDistanceToNow(new Date(uploadedAt.seconds * 1000), { addSuffix: true });
    }
    return 'a while ago';
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const fileName = paperFileName || `${subjectName.replace(/ /g, '_')}_${subjectCode}.pdf`;
      const proxyUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', fileName);
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
    <ShineBorder className="rounded-xl h-full" borderWidth={1} duration={12}>
      <Card className="flex flex-col h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-lg transition-shadow duration-300 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">{subjectName}</CardTitle>
          <CardDescription className="pt-1">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50 font-semibold">{subjectCode}</Badge>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow">
           <Separator className="mb-4 bg-slate-200/80 dark:bg-slate-700/80" />
           <div className="space-y-3">
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
          </div>
        </CardContent>

        <CardFooter className="mt-auto flex justify-between items-center p-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <p className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} />
            <span>{getUploadedTime()}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onView(paper)}>
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
            <Button size="sm" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> ...</>
              ) : (
                <><Download className="mr-2 h-4 w-4" /> Download</>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </ShineBorder>
  );
}

export default function BrowsePage() {
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for viewers
  const [selectedPdf, setSelectedPdf] = useState<PaperData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // States for filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    branch: '',
    semester: '',
    academicYear: '',
  });

  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const searchMatch = searchQuery.toLowerCase()
        ? paper.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          paper.subjectCode.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const branchMatch = filters.branch ? paper.branch === filters.branch : true;
      const semesterMatch = filters.semester ? paper.semester === filters.semester : true;
      const yearMatch = filters.academicYear ? paper.academicYear === filters.academicYear : true;

      return searchMatch && branchMatch && semesterMatch && yearMatch;
    });
  }, [papers, searchQuery, filters]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const fetchedPapers = await getAllPapers();
        setPapers(fetchedPapers);
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
            <p className="text-gray-600 dark:text-gray-300">
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