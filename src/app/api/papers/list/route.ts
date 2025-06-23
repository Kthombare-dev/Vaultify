import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/lib/firebase-admin";

interface Paper {
  title: string;
  subjectName: string;
  subjectCode: string;
  paperType: string;
  uploadedAt: Date;
  fileUrl: string;
  semester: string;
  academicYear: string;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("Starting papers list API request");
  
  try {
    // Initialize Firebase Admin
    console.log("Initializing Firebase Admin...");
    initAdmin();
    const db = getFirestore();
    console.log("Fetching papers from Firestore...");
    
    try {
      // Using type assertion to bypass the TypeScript error
      // This is safe because we know these methods exist in the runtime
      const snapshot = await (db.collection('papers') as any).get();
      
      if (!snapshot?.docs?.length) {
        console.log("No papers found");
        return NextResponse.json({
          papers: [],
          message: "No papers found"
        });
      }
      
      console.log(`Found ${snapshot.docs.length} papers`);
      const papers = snapshot.docs.map((doc: any) => {
        const data = doc.data() as Paper;
        return {
          id: doc.id,
          ...data,
          // Ensure all required fields are present
          title: data.title || data.subjectName, // Fallback to subjectName if title is missing
          subjectName: data.subjectName || '',
          subjectCode: data.subjectCode || '',
          paperType: data.paperType || '',
          semester: data.semester || '',
          academicYear: data.academicYear || '',
          uploadedAt: data.uploadedAt || null,
          fileUrl: data.fileUrl || ''
        };
      });

      console.log("Successfully processed papers data");
      return NextResponse.json({
        papers,
        message: "Papers fetched successfully"
      });
    } catch (error) {
      throw error;
    }
  } catch (error: any) {
    console.error("Error in papers list API:", error);
    console.error("Error stack:", error.stack);
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch papers",
        details: error.stack,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 