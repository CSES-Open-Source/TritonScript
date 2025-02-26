import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const BASE_URL = 'https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudent.htm';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'course_data');
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());


async function scrapeTerms() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

        const terms = await page.evaluate(() => {
            const select = document.querySelector('#selectedTerm');
            return Array.from(select?.options || []).map(option => ({
                value: option.value.trim(),
                text: option.textContent.trim()
            })).filter(term => term.value && term.text);
        });
        console.log("terms called")
        return terms;
    } catch (error) {
        console.error("Error scraping terms:", error);
        return [];
    } finally {
        await browser.close();
    }
}

//click on "by code(s)" and put into text box the course code, search, and get profs
async function scrapeInstructors(term, course) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const instructors = [];

    try{
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        await page.select('#selectedTerm',term); 
        console.log("test term");

        await page.waitForSelector('a[href="#tabs-crs"]', { visible: true });
        await page.click('a[href="#tabs-crs"]'); 
        console.log("tabs worked")
       
        await page.waitForSelector('#courses', { visible: true }); 
        await page.type('#courses', course); 
        console.log("type worked");

        await Promise.all([
            page.click("#socFacSubmit"), 
            page.waitForNavigation({ waitUntil: "domcontentloaded" }) 
        ]);
        console.log("submit successful");

        const extractedInstructors = await page.evaluate(async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const rows = document.querySelectorAll('.sectxt');  
            const instructors = Array.from(rows)
                .map(row => row.children[9]?.innerText.trim())
                .filter(instructor => instructor);
        
            return [...new Set(instructors)];
        });

        console.log("Instructors found:", extractedInstructors);
        instructors.push(...extractedInstructors);
    }
    catch(error){
        console.log("Error finding instructors");
    }
    return instructors;
}

app.get('/terms', async (req, res) => {
    try {
        const terms = await scrapeTerms();
        res.json({ terms });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch terms' });
    }
});

app.get('/courses', (req, res) => {
    try {
        const files = fs.readdirSync(DATA_DIR);
        const courses = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(DATA_DIR, file);
                const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                return content.code;
            })
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Error reading JSON files', details: error.message });
    }
});

app.get('/instructors', async (req, res) => {
    try {
        const { term, course } = req.query;
        if (!term || !course) return res.status(400).json({ error: "Missing term or course parameter" });

        const instructors = await scrapeInstructors(term, course);
        res.json({ instructors });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch instructors' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
