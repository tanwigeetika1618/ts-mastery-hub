import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";
import Table from "cli-table3";

interface Resource {
  name: string;
  url: string;
  type: "📖 Docs" | "🎥 Video" | "🏋️ Practice" | "📚 Course" | "🔧 Tool" | "📦 Repo";
  level: "Beginner" | "Intermediate" | "Advanced" | "All";
  description: string;
}

interface ResourceCategory {
  title: string;
  emoji: string;
  resources: Resource[];
}

const CATEGORIES: ResourceCategory[] = [
  {
    title: "TypeScript Core",
    emoji: "🔷",
    resources: [
      { name: "Official TS Handbook", url: "https://typescriptlang.org/docs/handbook", type: "📖 Docs", level: "All", description: "The definitive guide — start here" },
      { name: "TS Playground", url: "https://typescriptlang.org/play", type: "🔧 Tool", level: "All", description: "Try TypeScript in the browser instantly" },
      { name: "Type Challenges", url: "https://github.com/type-challenges/type-challenges", type: "🏋️ Practice", level: "Intermediate", description: "Collection of TS type challenges — like LeetCode for types" },
      { name: "Total TypeScript (Matt Pocock)", url: "https://totaltypescript.com", type: "📚 Course", level: "All", description: "Best comprehensive TS course available (free beginners section)" },
      { name: "Matt Pocock YouTube", url: "https://youtube.com/@mattpocockuk", type: "🎥 Video", level: "All", description: "Short, brilliant TS tips — perfect for daily learning" },
      { name: "TypeScript Deep Dive", url: "https://basarat.gitbook.io/typescript", type: "📖 Docs", level: "Intermediate", description: "Free online book covering TS in depth" },
      { name: "Execute Program", url: "https://executeprogram.com/courses/typescript", type: "📚 Course", level: "Beginner", description: "Spaced repetition learning for TypeScript" },
      { name: "TS Error Translator", url: "https://ts-error-translator.vercel.app", type: "🔧 Tool", level: "Beginner", description: "Translates cryptic TS errors into human-readable messages" },
    ],
  },
  {
    title: "React + TypeScript",
    emoji: "⚛️",
    resources: [
      { name: "React TypeScript Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app", type: "📖 Docs", level: "All", description: "Community-maintained cheatsheet — bookmark this!" },
      { name: "React Docs (TypeScript)", url: "https://react.dev/learn/typescript", type: "📖 Docs", level: "Beginner", description: "Official React docs TypeScript section" },
      { name: "Josh Comeau — Joy of React", url: "https://joyofreact.com", type: "📚 Course", level: "Intermediate", description: "Premium React course with TS throughout" },
      { name: "Jack Herrington YouTube", url: "https://youtube.com/@jherr", type: "🎥 Video", level: "Intermediate", description: "Advanced React+TS patterns and tutorials" },
    ],
  },
  {
    title: "Node.js + TypeScript",
    emoji: "🟩",
    resources: [
      { name: "ts-node", url: "https://github.com/TypeStrong/ts-node", type: "🔧 Tool", level: "Beginner", description: "Run TypeScript files directly in Node.js" },
      { name: "tsx", url: "https://github.com/privatenumber/tsx", type: "🔧 Tool", level: "Beginner", description: "Faster alternative to ts-node (recommended)" },
      { name: "Prisma", url: "https://prisma.io", type: "🔧 Tool", level: "Intermediate", description: "Type-safe database access for Node.js" },
      { name: "Zod", url: "https://zod.dev", type: "📦 Repo", level: "Intermediate", description: "TypeScript-first schema validation" },
      { name: "tRPC", url: "https://trpc.io", type: "📦 Repo", level: "Advanced", description: "End-to-end type-safe APIs" },
    ],
  },
  {
    title: "Testing",
    emoji: "🧪",
    resources: [
      { name: "Vitest", url: "https://vitest.dev", type: "🔧 Tool", level: "All", description: "Blazing fast TS-native test runner (recommended)" },
      { name: "Testing Library", url: "https://testing-library.com", type: "🔧 Tool", level: "Beginner", description: "Simple and accessible testing utilities" },
      { name: "Playwright", url: "https://playwright.dev", type: "🔧 Tool", level: "Intermediate", description: "Best E2E testing framework (excellent TS support)" },
      { name: "Kent C. Dodds — Testing JS", url: "https://testingjavascript.com", type: "📚 Course", level: "All", description: "Gold standard testing course" },
    ],
  },
  {
    title: "Practice & Challenges",
    emoji: "🏋️",
    resources: [
      { name: "Type Challenges", url: "https://github.com/type-challenges/type-challenges", type: "🏋️ Practice", level: "Intermediate", description: "Type-level programming challenges" },
      { name: "Exercism — TypeScript Track", url: "https://exercism.org/tracks/typescript", type: "🏋️ Practice", level: "All", description: "Free mentored TypeScript exercises" },
      { name: "TypeHero", url: "https://typehero.dev", type: "🏋️ Practice", level: "All", description: "Interactive type challenges in the browser" },
      { name: "LeetCode (TS)", url: "https://leetcode.com", type: "🏋️ Practice", level: "All", description: "Algorithm practice with TypeScript support" },
      { name: "Advent of TypeScript", url: "https://adventofts.com", type: "🏋️ Practice", level: "Advanced", description: "Annual type challenge advent calendar (December)" },
    ],
  },
];

export async function showResources(): Promise<void> {
  const { category } = await inquirer.prompt([
    {
      type: "list",
      name: "category",
      message: chalk.bold("Choose a resource category:"),
      choices: [
        ...CATEGORIES.map((c) => ({
          name: `${c.emoji}  ${chalk.bold(c.title)} ${chalk.gray(`(${c.resources.length} resources)`)}`,
          value: c.title,
        })),
        { name: chalk.gray("← Back"), value: "back" },
      ],
    },
  ]);

  if (category === "back") return;

  const cat = CATEGORIES.find((c) => c.title === category)!;

  const table = new Table({
    head: [
      chalk.bold.cyan("Resource"),
      chalk.bold.cyan("Type"),
      chalk.bold.cyan("Level"),
      chalk.bold.cyan("Description"),
    ],
    colWidths: [30, 14, 15, 40],
    style: { head: [], border: ["gray"] },
    wordWrap: true,
  });

  cat.resources.forEach((r) => {
    table.push([
      chalk.bold.white(r.name),
      r.type,
      r.level === "Beginner"
        ? chalk.green(r.level)
        : r.level === "Intermediate"
          ? chalk.yellow(r.level)
          : r.level === "Advanced"
            ? chalk.red(r.level)
            : chalk.cyan(r.level),
      chalk.gray(r.description),
    ]);
  });

  console.log(
    chalk.bold.cyan(`\n  ${cat.emoji}  ${cat.title} Resources\n`)
  );
  console.log(table.toString());
  console.log(chalk.gray("\n  💡 Tip: Copy a resource name and search for it in your browser!\n"));

  console.log(chalk.bold.cyan("  🔗 Quick Links:\n"));
  cat.resources.forEach((r) => {
    console.log(`  ${chalk.gray("•")} ${chalk.bold(r.name)}: ${chalk.underline.blue(r.url)}`);
  });
  console.log();

  await inquirer.prompt([
    {
      type: "input",
      name: "continue",
      message: chalk.gray("Press Enter to continue..."),
    },
  ]);
}
