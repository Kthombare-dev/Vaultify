import { NextResponse } from "next/server";
import { getFirestore, DocumentData } from "firebase-admin/firestore";
import { initializeFirebaseAdmin } from "@/lib/firebase-admin";

interface Paper extends DocumentData {
  title: string;
  subjectName: string;
  subjectCode: string;
  paperType: string;
  uploadedAt: Date;
  fileUrl: string;
  semester: string;
  academicYear: string;
}

export async function GET() {
  console.log("Starting papers list API request");
  
  try {
    // Initialize Firebase Admin
    console.log("Initializing Firebase Admin...");
    initializeFirebaseAdmin();
    
    console.log("Getting Firestore instance...");
    const db = getFirestore();
    
    console.log("Fetching papers from Firestore...");
    const papersRef = db.collection("papers");
    const papersSnapshot = await papersRef.get();
    
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