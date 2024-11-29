import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import Papa from 'papaparse'

// Define an interface for your data structure
interface Song {
  id: number;
  cat: string;
  title: string;
  song_name: string;
  path: string;
  song_img_path: string;
  date: string; // Note: changed from release_date to match your CSV
}

export async function GET() {
    try {
        // Construct the path to the CSV file
        const filePath = path.join(process.cwd(), 'public', 'database.csv')

        // Read the CSV file
        const fileContents = fs.readFileSync(filePath, 'utf8')

        // Parse the CSV with type inference
        const { data } = Papa.parse<Song>(fileContents, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        })

        // Sort by date (descending order)
        const sortedData = (data as Song[])
            .filter((item): item is Song => !!item.date) // Type predicate to ensure non-null date
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