import { courseSeeds } from "../src/db/seed-data";

process.stdout.write(JSON.stringify({ courses: courseSeeds }));
