import { NextResponse } from "next/server";
import { Firestore } from "firebase-admin/firestore";
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
    // Initialize Firebase Admin and get Firestore instance
    console.log("Initializing Firebase Admin...");
    const db = initAdmin() as Firestore;
    
    console.log("Fetching papers from Firestore...");
    const papersSnapshot = await db.collection("papers").get();
    
    if (!papersSnapshot.docs) {
      console.log("No papers found");
      return NextResponse.json({
        papers: [],
        message: "No papers found"
      });
    }
    
    console.log(`Found ${papersSnapshot.docs.length} papers`);
    const papers = papersSnapshot.docs.map(doc => {
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