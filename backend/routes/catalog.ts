import { Router, Request, Response } from "express";

const router = Router();

// Recent UCSD quarters (newest first)
const TERMS: { value: string; text: string }[] = [
  { value: "SP25", text: "Spring 2025" },
  { value: "WI25", text: "Winter 2025" },
  { value: "FA24", text: "Fall 2024" },
  { value: "SS224", text: "Summer Session II 2024" },
  { value: "SS124", text: "Summer Session I 2024" },
  { value: "SP24", text: "Spring 2024" },
  { value: "WI24", text: "Winter 2024" },
  { value: "FA23", text: "Fall 2023" },
  { value: "SP23", text: "Spring 2023" },
  { value: "WI23", text: "Winter 2023" },
  { value: "FA22", text: "Fall 2022" },
];

// Common UCSD courses across departments
const COURSES: string[] = [
  // CSE
  "CSE 3", "CSE 5A", "CSE 6R", "CSE 8A", "CSE 8B", "CSE 11", "CSE 12",
  "CSE 15L", "CSE 20", "CSE 21", "CSE 30", "CSE 100", "CSE 101", "CSE 105",
  "CSE 106", "CSE 107", "CSE 110", "CSE 120", "CSE 121", "CSE 123",
  "CSE 124", "CSE 125", "CSE 127", "CSE 130", "CSE 131", "CSE 134A",
  "CSE 134B", "CSE 135", "CSE 136", "CSE 140", "CSE 140L", "CSE 141",
  "CSE 141L", "CSE 142", "CSE 143", "CSE 145", "CSE 148", "CSE 150A",
  "CSE 150B", "CSE 151A", "CSE 151B", "CSE 152A", "CSE 152B", "CSE 158",
  "CSE 160", "CSE 165", "CSE 166", "CSE 167", "CSE 168", "CSE 169",
  "CSE 170", "CSE 175", "CSE 176", "CSE 190", "CSE 197",
  // ECE
  "ECE 5", "ECE 15", "ECE 25", "ECE 30", "ECE 35", "ECE 45", "ECE 65",
  "ECE 85", "ECE 100", "ECE 101", "ECE 102", "ECE 103", "ECE 107",
  "ECE 108", "ECE 109", "ECE 111", "ECE 115", "ECE 118", "ECE 121A",
  "ECE 121B", "ECE 123", "ECE 130A", "ECE 130B", "ECE 130C", "ECE 131A",
  "ECE 132", "ECE 140A", "ECE 140B", "ECE 143", "ECE 145A", "ECE 145B",
  "ECE 145C", "ECE 145L", "ECE 148", "ECE 153", "ECE 154A", "ECE 154B",
  "ECE 155A", "ECE 155B", "ECE 158A", "ECE 158B", "ECE 161A", "ECE 161B",
  "ECE 161C", "ECE 163", "ECE 164", "ECE 165", "ECE 166", "ECE 172A",
  "ECE 174", "ECE 175A", "ECE 175B", "ECE 176",
  // MATH
  "MATH 10A", "MATH 10B", "MATH 10C", "MATH 11", "MATH 18", "MATH 20A",
  "MATH 20B", "MATH 20C", "MATH 20D", "MATH 20E", "MATH 20F", "MATH 31AH",
  "MATH 31BH", "MATH 31CH", "MATH 100A", "MATH 100B", "MATH 100C",
  "MATH 102", "MATH 103A", "MATH 103B", "MATH 104A", "MATH 109",
  "MATH 110A", "MATH 110B", "MATH 120A", "MATH 120B", "MATH 121A",
  "MATH 121B", "MATH 140A", "MATH 140B", "MATH 142A", "MATH 142B",
  "MATH 155A", "MATH 155B", "MATH 160A", "MATH 160B", "MATH 163",
  "MATH 168A", "MATH 170A", "MATH 170B", "MATH 171A", "MATH 171B",
  "MATH 180A", "MATH 180B", "MATH 181A", "MATH 181B", "MATH 183",
  "MATH 184", "MATH 187A", "MATH 187B", "MATH 189",
  // PHYS
  "PHYS 1A", "PHYS 1B", "PHYS 1C", "PHYS 2A", "PHYS 2B", "PHYS 2C",
  "PHYS 2D", "PHYS 100A", "PHYS 100B", "PHYS 100C", "PHYS 105A",
  "PHYS 105B", "PHYS 110A", "PHYS 110B", "PHYS 120", "PHYS 130",
  "PHYS 140A", "PHYS 140B",
  // COGS
  "COGS 1", "COGS 9", "COGS 10", "COGS 13", "COGS 14A", "COGS 14B",
  "COGS 17", "COGS 18", "COGS 101A", "COGS 101B", "COGS 101C",
  "COGS 102A", "COGS 102B", "COGS 102C", "COGS 107A", "COGS 107B",
  "COGS 108", "COGS 109", "COGS 118A", "COGS 118B", "COGS 118C",
  "COGS 120", "COGS 121", "COGS 122", "COGS 125", "COGS 127", "COGS 138",
  "COGS 160", "COGS 162", "COGS 163", "COGS 164", "COGS 171", "COGS 172",
  "COGS 174", "COGS 175", "COGS 176", "COGS 177", "COGS 180", "COGS 185",
  "COGS 188", "COGS 189",
].sort();

router.get("/terms", (_req: Request, res: Response) => {
  res.json({ terms: TERMS });
});

router.get("/courses", (_req: Request, res: Response) => {
  res.json(COURSES);
});

// Instructors are not available without a full course catalog database.
// Return an empty list so the frontend can fall back to text input.
router.get("/instructors", (_req: Request, res: Response) => {
  res.json({ instructors: [] });
});

export default router;
