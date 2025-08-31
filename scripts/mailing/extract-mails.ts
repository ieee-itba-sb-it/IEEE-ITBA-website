import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import * as fs from "node:fs";
import * as path from "node:path";

interface User {
    email: string;
    fullname?: string;
    fname?: string;
    lname?: string;
    [key: string]: any;
}

export async function extractUserEmails(): Promise<void> {
    console.log("Starting email extraction...");
    
    try {
        const firestore = getFirestore();
        const userCollection = firestore.collection("users");
        
        console.log("Fetching users from Firestore...");
        const usersSnapshot = await userCollection.get();
        
        if (usersSnapshot.empty) {
            console.log("No users found in the collection.");
            return;
        }
        
        const users: User[] = [];
        
        usersSnapshot.forEach(doc => {
            const userData = doc.data() as User;
            
            if (userData.email) {
                users.push({
                    email: userData.email,
                    fullname: userData.fullname || `${userData.fname || ''} ${userData.lname || ''}`.trim() || 'N/A',
                    id: doc.id
                });
            }
        });
        
        console.log(`Found ${users.length} users with email addresses.`);
        
        if (users.length === 0) {
            console.log("No users with email addresses found.");
            return;
        }
        
        // Generate CSV content
        const csvHeader = "Email,Full Name,Document ID\n";
        const csvRows = users.map(user => 
            `"${user.email}","${user.fullname}","${user.id}"`
        ).join("\n");
        
        const csvContent = csvHeader + csvRows;
        
        // Create output directory if it doesn't exist
        const outputDir = path.join(process.cwd(), "scripts", "mailing", "output");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const outputFilePath = path.join(outputDir, `user-emails-${timestamp}.csv`);
        
        // Write CSV file
        fs.writeFileSync(outputFilePath, csvContent, 'utf-8');
        
        console.log(`✅ Successfully exported ${users.length} user emails to: ${outputFilePath}`);
        
        // Also create a simple emails-only file
        const emailsOnlyContent = users.map(user => user.email).join("\n");
        const emailsOnlyPath = path.join(outputDir, `emails-only-${timestamp}.txt`);
        fs.writeFileSync(emailsOnlyPath, emailsOnlyContent, 'utf-8');
        
        console.log(`✅ Also created emails-only file: ${emailsOnlyPath}`);
        
    } catch (error) {
        console.error("❌ Error extracting user emails:", error);
        throw error;
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    initializeApp({
        projectId: 'ieeeitba'
    });
    
    extractUserEmails().catch(console.error);
}