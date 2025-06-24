'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Code, Calendar, Upload, FileText, Home, BookOpen, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Inter, Outfit } from 'next/font/google';
import Link from 'next/link';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

const outfit = Outfit({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

// Add Progress Steps Component
function ProgressSteps({ currentStep }: { currentStep: 1 | 2 }) {
  return (
    <div className="flex justify-between items-center w-full max-w-xl mx-auto mb-8 relative">
      {/* Connecting Line */}
      <div className="absolute top-[22px] left-[15%] right-[15%] h-[2px] bg-gray-200">
        <div 
          className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-500 ease-in-out"
          style={{ width: currentStep === 2 ? '100%' : '0%' }}
        />
      </div>

      {/* Step 1 - Choose Paper */}
      <div className="flex flex-col items-center z-10">
        <div className={`rounded-full bg-white dark:bg-gray-800 p-4 ${
          currentStep === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
        }`}>
          <BookOpen className="h-6 w-6" />
        </div>
        <span className="mt-2 text-xs font-medium uppercase">Choose Paper</span>
      </div>

      {/* Step 2 - AI Chat */}
      <div className="flex flex-col items-center z-10">
        <div className={`rounded-full bg-white dark:bg-gray-800 p-4 ${
          currentStep === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
        }`}>
          <Brain className="h-6 w-6" />
        </div>
        <span className="mt-2 text-xs font-medium uppercase">AI Chat</span>
      </div>
    </div>
  );
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface PaperData {
  id: string;
  subjectName: string;
  subjectCode: string;
  paperType: string;
  semester: string;
  academicYear: string;
  fileUrl: string;
}

export default function StudyAssistant() {
  const router = useRouter();
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPapers, setSelectedPapers] = useState<PaperData[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Welcome to AI Study Assistant! How would you like to proceed?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPapers, setShowPapers] = useState(false);
  const [showSemesterSelect, setShowSemesterSelect] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isStudySessionStarted, setIsStudySessionStarted] = useState(false);

  // Handle window resize
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

  // Fetch papers on component mount
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch('/api/papers/list');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch papers');
        }
        const data = await response.json();
        const papersArray = data.papers || [];
        setPapers(Array.isArray(papersArray) ? papersArray : []);
      } catch (error) {
        console.error('Error fetching papers:', error);
        setError('Failed to load papers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Handle loading state for navigation
  useEffect(() => {
    return () => {
      setIsPageLoading(false);
    };
  }, []);

  // Group papers by subject using useMemo
  const papersBySubject = useMemo(() => {
    const filteredPapers = selectedSemester 
      ? papers.filter(paper => paper.semester === selectedSemester)
      : papers;

    return filteredPapers.reduce((acc: { [key: string]: PaperData[] }, paper) => {
      if (!paper?.subjectName) return acc;
      if (!acc[paper.subjectName]) {
        acc[paper.subjectName] = [];
      }
      acc[paper.subjectName].push(paper);
      return acc;
    }, {});
  }, [papers, selectedSemester]);

  // Get all semesters 1-8
  const ALL_SEMESTERS = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => String(i + 1));
  }, []);

  // Check if semester has papers
  const hasPapersForSemester = (semester: string) => {
    return papers.some(paper => paper.semester === semester);
  };

  const handleSemesterSelect = (semester: string) => {
    // Only proceed if the semester has papers
    if (!hasPapersForSemester(semester)) {
      return;
    }
    setIsPageLoading(true);
    setSelectedSemester(semester);
    setShowSemesterSelect(false);
    setShowPapers(true);
    setIsPageLoading(false);
  };

  const handleInitialChoice = (choice: 'upload' | 'existing') => {
    if (choice === 'upload') {
      setIsPageLoading(true);
      router.push('/upload');
    } else {
      setShowSemesterSelect(true);
    }
  };

  // Render semester selection screen
  const renderSemesterSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center mt-8"
    >
      <h2 className={`text-2xl font-semibold mb-6 ${outfit.className}`}>Select Your Semester</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl w-full">
        {ALL_SEMESTERS.map((semester) => {
          const hasPapers = hasPapersForSemester(semester);
          return (
            <motion.div
              key={semester}
              className={`p-4 text-center rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 border ${
                hasPapers 
                  ? 'hover:shadow-xl hover:scale-105 cursor-pointer border-gray-100 dark:border-gray-700' 
                  : 'opacity-70 cursor-not-allowed border-gray-200 dark:border-gray-600'
              }`}
              whileHover={hasPapers ? { scale: 1.05 } : undefined}
              whileTap={hasPapers ? { scale: 0.95 } : undefined}
              onClick={hasPapers ? () => handleSemesterSelect(semester) : undefined}
            >
              <span className={`text-lg font-medium ${outfit.className}`}>
                Semester {semester}
              </span>
              {!hasPapers && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  No papers available
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const handlePaperSelect = (paper: PaperData) => {
    setSelectedPapers(prev => {
      const isAlreadySelected = prev.some(p => p.id === paper.id);
      if (isAlreadySelected) {
        return prev.filter(p => p.id !== paper.id);
      } else {
        return [...prev, paper];
      }
    });
  };

  const startStudySession = async () => {
    if (selectedPapers.length === 0) return;

    setIsPageLoading(true);
    setIsProcessing(true);
    setIsStudySessionStarted(true);

    const papersList = selectedPapers.map(p => `${p.subjectName} - ${p.paperType}`).join(', ');
    setMessages(prev => [...prev, {
      role: 'user',
      content: `I'd like to study these papers: ${papersList}`
    }]);
    
    try {
      const response = await fetch("/api/study-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "select_papers",
          papers: selectedPapers.map(paper => ({
            paperId: paper.id,
            fileUrl: paper.fileUrl
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process papers');
      }

      const data = await response.json();
      if (data.initialInsights) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.initialInsights
        }]);
        // Add suggested actions
        setMessages(prev => [...prev, {
          role: 'system',
          content: 'To help you better understand these materials, you can:\n\n1. Ask questions about specific concepts from any of the papers\n\n2. Request comparisons between different papers\n\n3. Get a comprehensive summary of all materials\n\n4. Focus on particular topics across all papers\n\nHow would you like to proceed?'
        }]);
      }
    } catch (error) {
      console.error("Error processing papers:", error);
      setError('Failed to process papers. Please try again.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing the papers. Please try again.'
      }]);
      setIsStudySessionStarted(false);
    } finally {
      setIsProcessing(false);
      setIsPageLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!inputMessage.trim() || !selectedPapers.length) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/study-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ask_question",
          papers: selectedPapers.map(paper => ({
            paperId: paper.id,
            fileUrl: paper.fileUrl
          })),
          question: userMessage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get answer');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer
      }]);
    } catch (error) {
      console.error("Error getting answer:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your question. Please try again.'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isPageLoading} />
      <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 ${inter.className}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-3 ${outfit.className}`}>
              AI Study Assistant
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your personal AI tutor to help you understand your study materials
            </p>
          </motion.div>

          {showPapers && (
            <ProgressSteps currentStep={isStudySessionStarted ? 2 : 1} />
          )}

          {!showSemesterSelect && !showPapers ? (
            // Initial Options Screen
            <div className="flex-1 flex items-center justify-center mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-4xl w-full">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => handleInitialChoice('upload')}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border border-gray-100 dark:border-gray-700"
                >
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-10 group-hover:opacity-20 transition-opacity" />
                  <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 opacity-10 group-hover:opacity-20 transition-opacity" />
                  
                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-4">
                      <Upload className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 className={`mb-3 text-2xl font-semibold text-gray-900 dark:text-white ${outfit.className}`}>Upload New Paper</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Upload a new document or image for AI analysis and assistance
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  onClick={() => handleInitialChoice('existing')}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border border-gray-100 dark:border-gray-700"
                >
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 opacity-10 group-hover:opacity-20 transition-opacity" />
                  <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-gradient-to-tr from-emerald-400 to-green-500 opacity-10 group-hover:opacity-20 transition-opacity" />
                  
                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-6 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 p-4">
                      <FileText className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <h3 className={`mb-3 text-2xl font-semibold text-gray-900 dark:text-white ${outfit.className}`}>Choose Existing Paper</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Select from your previously uploaded papers to continue studying
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : showSemesterSelect ? (
            // Semester Selection Screen
            renderSemesterSelection()
          ) : (
            // Main Interface with Chat and Papers
            <div className="flex flex-col items-center justify-center gap-4 lg:gap-6">
              {/* Papers Selection Panel */}
              {(!isStudySessionStarted || windowWidth >= 1024) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`mx-auto max-w-2xl w-full ${
                    isStudySessionStarted ? 'lg:flex-[0.4] hidden lg:block' : 'flex-1'
                  } bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 lg:order-2 flex flex-col`}
                  style={{ height: '600px' }}
                >
                  {/* Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h2 className={`font-semibold text-xl ${outfit.className}`}>
                          Semester {selectedSemester} Papers
                        </h2>
                        {selectedPapers.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {selectedPapers.length} selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 space-y-4">
                      {loading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                      ) : error ? (
                        <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                          {error}
                        </div>
                      ) : (
                        Object.entries(papersBySubject).map(([subject, subjectPapers]) => (
                          <div key={subject} className="relative">
                            <h3 className={`text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 ${outfit.className} sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-2 z-10`}>
                              {subject}
                            </h3>
                            <div className="space-y-3">
                              {subjectPapers.map((paper) => {
                                const isSelected = selectedPapers.some(p => p.id === paper.id);
                                return (
                                  <div
                                    key={paper.id}
                                    onClick={() => handlePaperSelect(paper)}
                                    className={`cursor-pointer transition-all hover:shadow-md rounded-xl border p-4 ${
                                      isSelected
                                        ? "border-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                                        : "border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-900/10"
                                    }`}
                                  >
                                    <Badge 
                                      variant="outline" 
                                      className={`w-fit ${
                                        isSelected
                                          ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                                          : ''
                                      }`}
                                    >
                                      {paper.paperType}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                      <Code className="h-3.5 w-3.5" />
                                      {paper.subjectCode}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {paper.academicYear}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Fixed Footer */}
                  {selectedPapers.length > 0 && (
                    <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedPapers([])}
                        >
                          Clear Selection
                        </Button>
                        <Button
                          onClick={startStudySession}
                          disabled={isProcessing}
                          className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                          Start Studying {selectedPapers.length} Papers
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Main Chat Area */}
              {isStudySessionStarted && (
                <div className="w-full lg:w-[60%] flex flex-col gap-4 lg:gap-6 lg:order-1">
                  {/* Messages */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 min-h-[calc(100vh-400px)] sm:min-h-[calc(100vh-300px)] max-h-[calc(100vh-300px)] overflow-y-auto">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`mb-4 ${
                          message.role === 'assistant' 
                            ? 'bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4' 
                            : message.role === 'system'
                            ? 'bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 text-center'
                            : 'bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 ml-auto max-w-[80%]'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </motion.div>
                    ))}
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Question Input */}
                  <div className="flex gap-3 sticky bottom-0 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                    <Textarea
                      placeholder="Ask a question about any of the selected papers..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1 rounded-xl resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={handleAskQuestion}
                      disabled={isProcessing || !inputMessage.trim()}
                      className="self-end rounded-xl px-6"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {showPapers && papers.length === 0 && selectedSemester && (
            <div className="text-center p-8">
              <p className="text-gray-600 dark:text-gray-300">
                No papers available for Semester {selectedSemester}. Please select a different semester.
              </p>
              <Button 
                onClick={() => setShowSemesterSelect(true)} 
                className="mt-4"
              >
                Choose Different Semester
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 