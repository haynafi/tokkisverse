import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import Papa from 'papaparse'

export async function GET() {
    try {
        // Construct the path to the CSV file
        const filePath = path.join(process.cwd(), 'public', 'database.csv')

        // Read the CSV file
        const fileContents = fs.readFileSync(filePath, 'utf8')

        // Parse the CSV
        const parsedData = Papa.parse(fileContents, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        }).data

        // Sort by release date (assuming release_date is in a parseable format)
        const sortedData = parsedData
            .filter(item => item.date) // Remove entries without a date
            .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);

                // Handle potential invalid dates
                if (isNaN(dateA.getTime())) return 1;
                if (isNaN(dateB.getTime())) return -1;

                return dateB.getTime() - dateA.getTime();
            });

        return NextResponse.json(sortedData)
    } catch (error) {
        console.error('CSV reading error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}