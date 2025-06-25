'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { uploadFile, savePaperDetails, PaperDataToSave, checkDuplicatePaper } from '@/lib/unified-services';

const branches = [
  "Computer Science Engineering (CSE)",
  "Computer Science and Information Technology (CSIT)",
  "Information Technology (IT)",
  "Electronics & Communication (EC)",
  "Electrical Engineering (EE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Chemical Engineering (CHE)",
  "Biotechnology (BT)",
  "Artificial Intelligence (AI)",
  "Data Science (DS)",
  "Cyber Security (CS)",
  "Other"
];

const semesters = [
  { value: "1", label: "1st Semester" },
  { value: "2", label: "2nd Semester" },
  { value: "3", label: "3rd Semester" },
  { value: "4", label: "4th Semester" },
  { value: "5", label: "5th Semester" },
  { value: "6", label: "6th Semester" },
  { value: "7", label: "7th Semester" },
  { value: "8", label: "8th Semester" }
];

const getAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 2; i >= 0; i--) {
    const year = currentYear - i;
    years.push(`${year}-${(year + 1).toString().slice(-2)}`);
  }
  return years;
};

const academicYears = getAcademicYears();

const paperTypes = [
  { value: "end-sem", label: "End Semester" },
  { value: "mid-semester-test 1", label: "Mid Semester Test (MST-1)" },
  { value: "mid-semester-test 2", label: "Mid Semester Test (MST-2)" },
  { value: "other", label: "Other" }
];

export default function UploadPage() {
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    semester: '',
    academicYear: '',
    branch: '',
    customBranch: '',
    paperType: '',
    customPaperType: '',
    description: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);

  // Effect to reset the form after a successful upload
  useEffect(() => {
    if (uploadStatus === 'success') {
      const timer = setTimeout(() => {
        // Reset form
        setFormData({
          subjectName: '', subjectCode: '', semester: '', academicYear: '',
          branch: '', customBranch: '', paperType: '', customPaperType: '',
          description: '', tags: ''
        });
        setSelectedFile(null);
        setUploadProgress(0);
        setUploadStatus('idle');
      }, 2000); // 2-second delay

      // Cleanup the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
      setUploadStatus('idle');
      setAnalysisMessage(null);
      
      // Auto-analyze file content
      setIsAnalyzing(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/extract-concepts', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to analyze file');
        }
        
        const data = await response.json();
        
        // Check if any meaningful data was extracted
        const hasExtractedData = Object.values(data).some(value => value !== '');
        
        if (!hasExtractedData) {
          setAnalysisMessage('Could not automatically extract details. Please fill in the form manually.');
        } else {
          setAnalysisMessage('Some details were automatically filled. Please review and complete any missing fields.');
        }
        
        // Update form fields with extracted data
        setFormData(prev => ({
          ...prev,
          subjectName: data.subjectName || prev.subjectName,
          subjectCode: data.subjectCode || prev.subjectCode,
          paperType: data.paperType || prev.paperType,
          branch: data.branch || prev.branch,
          semester: data.semester || prev.semester,
          description: data.description || prev.description,
          tags: data.tags || prev.tags
        }));
      } catch (error) {
        console.error('Error analyzing file:', error);
        setAnalysisMessage('Could not analyze the file. Please fill in the form manually.');
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      alert('Please select a valid PDF, JPG, or PNG file');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a PDF file');
      return;
    }

    const requiredFields = ['subjectName', 'subjectCode', 'semester', 'academicYear', 'branch', 'paperType'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (formData.branch === 'Other' && !formData.customBranch.trim()) {
      alert('Please enter a custom branch');
      return;
    }

    if (formData.paperType === 'other' && !formData.customPaperType.trim()) {
      alert('Please enter a custom paper type');
      return;
    }

    // Check for duplicate papers before uploading
    try {
      const isDuplicate = await checkDuplicatePaper({
        subjectCode: formData.subjectCode,
        academicYear: formData.academicYear,
        paperType: formData.paperType === 'other' ? formData.customPaperType : formData.paperType
      });

      if (isDuplicate) {
        alert(`A paper for ${formData.subjectCode} (${formData.academicYear}) with type "${formData.paperType}" already exists. Please check and try again.`);
        return;
      }
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      alert('Failed to check for duplicate papers. Please try again.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const timestamp = Date.now();
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `${formData.subjectCode}_${formData.academicYear}_${timestamp}.${fileExtension}`;
      const filePath = `papers/${fileName}`;
      
      setUploadProgress(25);
      const fileUrl = await uploadFile(selectedFile, filePath);
      
      setUploadProgress(50);
      
      const paperData: PaperDataToSave = {
        subjectName: formData.subjectName,
        subjectCode: formData.subjectCode,
        semester: formData.semester,
        academicYear: formData.academicYear,
        branch: formData.branch,
        paperType: formData.paperType,
        description: formData.description || '',
        tags: formData.tags || '',
        fileName: fileName,
        fileUrl: fileUrl,
        fileSize: selectedFile.size,
      };

      if (formData.branch === 'Other') {
        paperData.branch = formData.customBranch;
        paperData.customBranch = formData.customBranch;
      }
      if (formData.paperType === 'other') {
        paperData.paperType = formData.customPaperType;
        paperData.customPaperType = formData.customPaperType;
      }
      
      setUploadProgress(75);
      await savePaperDetails(paperData);
      
      setUploadProgress(100);
      setUploadStatus('success');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Question Paper
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Share your question papers with the community and help fellow students
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Paper Details
              </CardTitle>
              <CardDescription>
                Fill in the details below to upload your question paper
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="file-upload" className="text-base font-medium">Select PDF File *</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors relative">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF, JPG, or PNG files only, max 10MB</p>
                    </div>
                    <input 
                      id="file-upload" 
                      type="file" 
                      accept="application/pdf,image/jpeg,image/png" 
                      capture="environment"
                      onChange={handleFileSelect} 
                      className="hidden" 
                      disabled={isUploading}
                    />
                    <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('file-upload')?.click()} 
                        disabled={isUploading}
                      >
                        Choose File
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById('file-upload') as HTMLInputElement;
                          if (input) {
                            input.removeAttribute('capture');
                            input.click();
                            // Restore capture attribute after click
                            setTimeout(() => input.setAttribute('capture', 'environment'), 1000);
                          }
                        }}
                        disabled={isUploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="subjectName">Subject Name *</Label>
                      <Input 
                        id="subjectName" 
                        value={formData.subjectName} 
                        onChange={(e) => handleInputChange('subjectName', e.target.value)} 
                        placeholder="e.g., Data Structures" 
                        disabled={isAnalyzing}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subjectCode">Subject Code *</Label>
                      <Input 
                        id="subjectCode" 
                        value={formData.subjectCode} 
                        onChange={(e) => handleInputChange('subjectCode', e.target.value)} 
                        placeholder="e.g., CS-303" 
                        disabled={isAnalyzing}
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester *</Label>
                      <Select 
                        value={formData.semester} 
                        onValueChange={(value) => handleInputChange('semester', value)}
                        disabled={isAnalyzing}
                      >
                        <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                        <SelectContent>
                          {semesters.map((sem) => (
                            <SelectItem key={sem.value} value={sem.value}>{sem.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="academicYear">Academic Year *</Label>
                      <Select 
                        value={formData.academicYear} 
                        onValueChange={(value) => handleInputChange('academicYear', value)}
                        disabled={isAnalyzing}
                      >
                        <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                        <SelectContent>
                          {academicYears.map((year) => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paperType">Paper Type *</Label>
                      <Select 
                        value={formData.paperType} 
                        onValueChange={(value) => handleInputChange('paperType', value)}
                        disabled={isAnalyzing}
                      >
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          {paperTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.paperType === 'other' && (
                    <div className="space-y-2">
                      <Label htmlFor="customPaperType">Custom Paper Type *</Label>
                      <Input 
                        id="customPaperType" 
                        value={formData.customPaperType} 
                        onChange={(e) => handleInputChange('customPaperType', e.target.value)} 
                        placeholder="e.g., Unit Test, Practical, Project, etc." 
                        disabled={isAnalyzing}
                        required 
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch *</Label>
                    <Select 
                      value={formData.branch} 
                      onValueChange={(value) => handleInputChange('branch', value)}
                      disabled={isAnalyzing}
                    >
                      <SelectTrigger><SelectValue placeholder="Select your branch" /></SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.branch === 'Other' && (
                    <div className="space-y-2">
                      <Label htmlFor="customBranch">Custom Branch *</Label>
                      <Input 
                        id="customBranch" 
                        value={formData.customBranch} 
                        onChange={(e) => handleInputChange('customBranch', e.target.value)} 
                        placeholder="e.g., Biomedical Engineering, Aerospace Engineering, etc." 
                        disabled={isAnalyzing}
                        required 
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={(e) => handleInputChange('description', e.target.value)} 
                    placeholder="Provide a brief description or any relevant details..." 
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    disabled={isAnalyzing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (Optional, comma-separated)</Label>
                  <Input 
                    id="tags" 
                    value={formData.tags} 
                    onChange={(e) => handleInputChange('tags', e.target.value)} 
                    placeholder="e.g., important, numericals, theory"
                    disabled={isAnalyzing}
                  />
                </div>

                {/* Analysis Message */}
                {analysisMessage && (
                  <div className={`mt-4 p-4 rounded-lg text-sm ${
                    analysisMessage.includes('Could not') 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                  }`}>
                    <p>{analysisMessage}</p>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {uploadStatus === 'success' && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">Paper uploaded successfully! Thank you for your contribution.</AlertDescription>
                  </Alert>
                )}

                {uploadStatus === 'error' && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">An error occurred while uploading. Please try again.</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isUploading || !selectedFile}>
                  {isUploading ? `Uploading... ${uploadProgress}%` : 'Submit Paper'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}