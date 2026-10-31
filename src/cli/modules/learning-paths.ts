import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";
import Table from "cli-table3";

interface PathStep {
  topic: string;
  description: string;
  timeEstimate: string;
  difficulty: "🟢" | "🟡" | "🔴";
}

interface LearningPath {
  title: string;
  emoji: string;
  color: string;
  description: string;
  steps: PathStep[];
}

const PATHS: LearningPath[] = [
  {
    title: "TypeScript Foundations",
    emoji: "🏗️",
    color: "#3178c6",
    description: "Master the core type system from scratch",
    steps: [
      { topic: "Basic Types & Type Annotations", description: "string, number, boolean, arrays, tuples, enums", timeEstimate: "2-3 hours", difficulty: "🟢" },
      { topic: "Interfaces & Type Aliases", description: "Defining shapes, extending interfaces, union & intersection types", timeEstimate: "3-4 hours", difficulty: "🟢" },
      { topic: "Functions & Generics", description: "Typed functions, generic functions, constraints, default types", timeEstimate: "4-5 hours", difficulty: "🟡" },
      { topic: "Type Guards & Narrowing", description: "typeof, instanceof, discriminated unions, custom type guards", timeEstimate: "3-4 hours", difficulty: "🟡" },
      { topic: "Utility Types", description: "Partial, Required, Pick, Omit, Record, ReturnType & more", timeEstimate: "3-4 hours", difficulty: "🟡" },
      { topic: "Advanced Types", description: "Mapped types, conditional types, template literal types, infer", timeEstimate: "5-6 hours", difficulty: "🔴" },
    ],
  },
  {
    title: "React + TypeScript",
    emoji: "⚛️",
    color: "#61dafb",
    description: "Build type-safe React applications",
    steps: [
      { topic: "Typing Components & Props", description: "FC type, props interfaces, children, default props", timeEstimate: "2-3 hours", difficulty: "🟢" },
      { topic: "Hooks with TypeScript", description: "useState, useEffect, useRef, useReducer — all typed", timeEstimate: "3-4 hours", difficulty: "🟢" },
      { topic: "Context & Custom Hooks", description: "Typed context providers, generic custom hooks", timeEstimate: "3-4 hours", difficulty: "🟡" },
      { topic: "Event Handling & Forms", description: "React event types, form handling, controlled components", timeEstimate: "2-3 hours", difficulty: "🟡" },
      { topic: "Advanced Patterns", description: "HOCs, render props, compound components — all type-safe", timeEstimate: "4-5 hours", difficulty: "🔴" },
      { topic: "Testing React+TS", description: "Jest, React Testing Library with TypeScript", timeEstimate: "3-4 hours", difficulty: "🟡" },
    ],
  },
  {
    title: "Node.js + TypeScript",
    emoji: "🟩",
    color: "#68bc71",
    description: "Build robust backend services with TypeScript",
    steps: [
      { topic: "Project Setup & Config", description: "tsconfig.json, ts-node, nodemon, ESM vs CJS", timeEstimate: "1-2 hours", difficulty: "🟢" },
      { topic: "Express with TypeScript", description: "Typed routes, middleware, request/response types", timeEstimate: "3-4 hours", difficulty: "🟢" },
      { topic: "Database & ORM Types", description: "TypeORM, Prisma, Drizzle — typed database access", timeEstimate: "4-5 hours", difficulty: "🟡" },
      { topic: "API Design Patterns", description: "REST typing, validation (Zod), error handling", timeEstimate: "3-4 hours", difficulty: "🟡" },
      { topic: "Authentication & Middleware", description: "JWT typing, session types, middleware chains", timeEstimate: "3-4 hours", difficulty: "🟡" },
      { topic: "Testing Backend Code", description: "Vitest/Jest, supertest, mocking with types", timeEstimate: "3-4 hours", difficulty: "🟡" },
    ],
  },
  {
    title: "Testing Mastery",
    emoji: "🧪",
    color: "#c21325",
    description: "Write bulletproof tests with TypeScript",
    steps: [
      { topic: "Testing Fundamentals", description: "Unit vs integration vs e2e, test structure, assertions", timeEstimate: "2-3 hours", difficulty: "🟢" },
      { topic: "Jest / Vitest with TS", description: "Setup, typed mocks, matchers, async testing", timeEstimate: "3-4 hours", difficulty: "🟢" },
      { topic: "Mocking & Stubbing", description: "Type-safe mocks, dependency injection, test doubles", timeEstimate: "3-4 hours", difficulty: "🟡" },
      { topic: "React Testing Library", description: "Component testing, user events, accessibility queries", timeEstimate: "3-4 hours", difficulty: "🟡" },
      { topic: "Playwright / Cypress", description: "E2E testing with TypeScript, page objects, fixtures", timeEstimate: "4-5 hours", difficulty: "🟡" },
      { topic: "CI/CD Testing Patterns", description: "Test pipelines, coverage reports, snapshot testing", timeEstimate: "2-3 hours", difficulty: "🔴" },
    ],
  },
];

function renderPath(path: LearningPath): void {
  const header = boxen(
    chalk.hex(path.color).bold(`${path.emoji}  ${path.title}`) +
      "\n" +
      chalk.gray(path.description),
    {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      margin: { top: 1, bottom: 0, left: 2, right: 2 },
      borderStyle: "round",
      borderColor: "cyan",
    }
  );
  console.log(header);

  const table = new Table({
    head: [
      chalk.bold.cyan("#"),
      chalk.bold.cyan("Topic"),
      chalk.bold.cyan("What You'll Learn"),
      chalk.bold.cyan("Time"),
      chalk.bold.cyan("Level"),
    ],
    colWidths: [5, 30, 48, 12, 8],
    style: { head: [], border: ["gray"] },
    wordWrap: true,
  });

  path.steps.forEach((step, i) => {
    table.push([
      chalk.white(`${i + 1}`),
      chalk.bold.white(step.topic),
      chalk.gray(step.description),
      chalk.yellow(step.timeEstimate),
      step.difficulty,
    ]);
  });

  console.log(table.toString());

  const totalHours = path.steps.reduce((acc, s) => {
    const match = s.timeEstimate.match(/(\d+)-(\d+)/);
    return acc + (match ? (parseInt(match[1]) + parseInt(match[2])) / 2 : 3);
  }, 0);

  console.log(
    chalk.gray(`\n  ⏱️  Estimated total: `) +
      chalk.bold.yellow(`~${Math.round(totalHours)} hours`) +
      chalk.gray(` • ${path.steps.length} modules\n`)
  );
}

export async function showLearningPaths(): Promise<void> {
  const { pathChoice } = await inquirer.prompt([
    {
      type: "list",
      name: "pathChoice",
      message: chalk.bold("Choose a learning path:"),
      choices: [
        ...PATHS.map((p) => ({
          name: `${p.emoji}  ${chalk.bold(p.title)} ${chalk.gray("— " + p.description)}`,
          value: p.title,
        })),
        { name: chalk.gray("← Back to main menu"), value: "back" },
      ],
    },
  ]);

  if (pathChoice === "back") return;

  const selected = PATHS.find((p) => p.title === pathChoice);
  if (selected) renderPath(selected);

  await inquirer.prompt([
    {
      type: "input",
      name: "continue",
      message: chalk.gray("Press Enter to continue..."),
    },
  ]);
}
