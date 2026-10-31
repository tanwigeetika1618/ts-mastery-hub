import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";

const ROADMAP_ART = `
${chalk.bold.hex("#3178c6")("╔══════════════════════════════════════════════════════════════════════╗")}
${chalk.bold.hex("#3178c6")("║")}               ${chalk.bold.white("🗺️  DEVELOPER LEARNING ROADMAP")}                          ${chalk.bold.hex("#3178c6")("║")}
${chalk.bold.hex("#3178c6")("╚══════════════════════════════════════════════════════════════════════╝")}

  ${chalk.bold.green("PHASE 1: TypeScript Foundations")}                  ${chalk.gray("⏱️ 2-3 weeks")}
  ${chalk.green("┌─────────────────────────────────────────────────────────────┐")}
  ${chalk.green("│")}  ${chalk.white("Basic Types → Interfaces → Functions → Generics")}            ${chalk.green("│")}
  ${chalk.green("│")}  ${chalk.gray("Learn the type system that powers everything else")}            ${chalk.green("│")}
  ${chalk.green("│")}  ${chalk.yellow("📚 TypeScript Handbook  •  Total TypeScript (free)")}          ${chalk.green("│")}
  ${chalk.green("│")}  ${chalk.yellow("🏋️ Exercism TS Track  •  TypeHero")}                          ${chalk.green("│")}
  ${chalk.green("└──────────────────────────────┬──────────────────────────────┘")}
                                 ${chalk.green("│")}
                                 ${chalk.green("▼")}
  ${chalk.bold.hex("#61dafb")("PHASE 2: React + TypeScript")}                       ${chalk.gray("⏱️ 2-3 weeks")}
  ${chalk.hex("#61dafb")("┌─────────────────────────────────────────────────────────────┐")}
  ${chalk.hex("#61dafb")("│")}  ${chalk.white("Typed Components → Hooks → Context → Patterns")}             ${chalk.hex("#61dafb")("│")}
  ${chalk.hex("#61dafb")("│")}  ${chalk.gray("Build type-safe UIs with confidence")}                        ${chalk.hex("#61dafb")("│")}
  ${chalk.hex("#61dafb")("│")}  ${chalk.yellow("📚 React TS Cheatsheet  •  React.dev (TS section)")}          ${chalk.hex("#61dafb")("│")}
  ${chalk.hex("#61dafb")("│")}  ${chalk.yellow("🎥 Jack Herrington  •  Matt Pocock")}                         ${chalk.hex("#61dafb")("│")}
  ${chalk.hex("#61dafb")("└──────────────────────────────┬──────────────────────────────┘")}
                                 ${chalk.hex("#61dafb")("│")}
                                 ${chalk.hex("#61dafb")("▼")}
  ${chalk.bold.hex("#68bc71")("PHASE 3: Node.js + TypeScript")}                     ${chalk.gray("⏱️ 2-3 weeks")}
  ${chalk.hex("#68bc71")("┌─────────────────────────────────────────────────────────────┐")}
  ${chalk.hex("#68bc71")("│")}  ${chalk.white("Express → Database (Prisma) → APIs (Zod) → Auth")}           ${chalk.hex("#68bc71")("│")}
  ${chalk.hex("#68bc71")("│")}  ${chalk.gray("Build robust, type-safe backend services")}                    ${chalk.hex("#68bc71")("│")}
  ${chalk.hex("#68bc71")("│")}  ${chalk.yellow("📚 Prisma Docs  •  Zod Docs  •  tRPC")}                       ${chalk.hex("#68bc71")("│")}
  ${chalk.hex("#68bc71")("│")}  ${chalk.yellow("🏋️ Build a REST API project")}                                ${chalk.hex("#68bc71")("│")}
  ${chalk.hex("#68bc71")("└──────────────────────────────┬──────────────────────────────┘")}
                                 ${chalk.hex("#68bc71")("│")}
                                 ${chalk.hex("#68bc71")("▼")}
  ${chalk.bold.hex("#c21325")("PHASE 4: Testing")}                                  ${chalk.gray("⏱️ 1-2 weeks")}
  ${chalk.hex("#c21325")("┌─────────────────────────────────────────────────────────────┐")}
  ${chalk.hex("#c21325")("│")}  ${chalk.white("Unit Tests → Integration → E2E → CI/CD")}                    ${chalk.hex("#c21325")("│")}
  ${chalk.hex("#c21325")("│")}  ${chalk.gray("Write tests that catch bugs before users do")}                ${chalk.hex("#c21325")("│")}
  ${chalk.hex("#c21325")("│")}  ${chalk.yellow("📚 Vitest  •  Testing Library  •  Playwright")}               ${chalk.hex("#c21325")("│")}
  ${chalk.hex("#c21325")("│")}  ${chalk.yellow("🏋️ Kent C. Dodds — Testing JavaScript")}                      ${chalk.hex("#c21325")("│")}
  ${chalk.hex("#c21325")("└──────────────────────────────┬──────────────────────────────┘")}
                                 ${chalk.hex("#c21325")("│")}
                                 ${chalk.hex("#c21325")("▼")}
  ${chalk.bold.hex("#9b59b6")("PHASE 5: Advanced Patterns")}                        ${chalk.gray("⏱️ Ongoing")}
  ${chalk.hex("#9b59b6")("┌─────────────────────────────────────────────────────────────┐")}
  ${chalk.hex("#9b59b6")("│")}  ${chalk.white("Mapped Types → Conditional Types → Type Guards")}            ${chalk.hex("#9b59b6")("│")}
  ${chalk.hex("#9b59b6")("│")}  ${chalk.white("Monorepos → Design Patterns → Architecture")}                ${chalk.hex("#9b59b6")("│")}
  ${chalk.hex("#9b59b6")("│")}  ${chalk.gray("Level up to senior-level TypeScript mastery")}                ${chalk.hex("#9b59b6")("│")}
  ${chalk.hex("#9b59b6")("│")}  ${chalk.yellow("📚 Type Challenges  •  Advent of TypeScript")}                ${chalk.hex("#9b59b6")("│")}
  ${chalk.hex("#9b59b6")("│")}  ${chalk.yellow("🏋️ Contribute to open-source TS projects")}                   ${chalk.hex("#9b59b6")("│")}
  ${chalk.hex("#9b59b6")("└─────────────────────────────────────────────────────────────┘")}

  ${chalk.bold.cyan("Total estimated time:")} ${chalk.bold.yellow("8-12 weeks")} ${chalk.gray("(at a comfortable pace)")}
  ${chalk.gray("💡 Pro tip: Don't rush. Practice > speed. Build projects at each phase.")}
`;

export async function showRoadmap(): Promise<void> {
  console.log(ROADMAP_ART);

  const { detail } = await inquirer.prompt([
    {
      type: "list",
      name: "detail",
      message: chalk.bold("Want more detail on a phase?"),
      choices: [
        { name: `${chalk.green("Phase 1:")} TypeScript Foundations`, value: 1 },
        { name: `${chalk.hex("#61dafb")("Phase 2:")} React + TypeScript`, value: 2 },
        { name: `${chalk.hex("#68bc71")("Phase 3:")} Node.js + TypeScript`, value: 3 },
        { name: `${chalk.hex("#c21325")("Phase 4:")} Testing`, value: 4 },
        { name: `${chalk.hex("#9b59b6")("Phase 5:")} Advanced Patterns`, value: 5 },
        { name: chalk.gray("← Back to main menu"), value: 0 },
      ],
    },
  ]);

  if (detail === 0) return;

  const phaseDetails: Record<number, string> = {
    1: `${chalk.bold.green("Phase 1: TypeScript Foundations — Detailed Breakdown")}\n
${chalk.bold("Week 1:")} Basic types, type annotations, arrays, tuples, enums
  → Practice: Rewrite a small JS utility file in TypeScript
  → Resource: TypeScript Handbook chapters 1-3

${chalk.bold("Week 2:")} Interfaces, type aliases, unions, intersections, type guards
  → Practice: Define types for a REST API response
  → Resource: Total TypeScript — Beginners section

${chalk.bold("Week 3:")} Generics, utility types, mapped types
  → Practice: Build a typed utility library (like a mini Lodash)
  → Resource: Type Challenges (easy + medium)`,

    2: `${chalk.bold.hex("#61dafb")("Phase 2: React + TypeScript — Detailed Breakdown")}\n
${chalk.bold("Week 1:")} Component typing, props interfaces, children, event handlers
  → Practice: Convert a React JS component library to TypeScript
  → Resource: React TypeScript Cheatsheet

${chalk.bold("Week 2:")} Hooks (useState, useRef, useReducer), context, custom hooks
  → Practice: Build a typed todo app with context
  → Resource: React.dev — TypeScript section

${chalk.bold("Week 3:")} Advanced patterns, HOCs, render props, compound components
  → Practice: Build a typed form library
  → Resource: Jack Herrington's advanced React TS videos`,

    3: `${chalk.bold.hex("#68bc71")("Phase 3: Node.js + TypeScript — Detailed Breakdown")}\n
${chalk.bold("Week 1:")} Project setup, tsconfig, Express with types, middleware
  → Practice: Set up a typed Express REST API from scratch
  → Resource: Express TypeScript template

${chalk.bold("Week 2:")} Database access (Prisma/Drizzle), Zod validation
  → Practice: Add a database layer with Prisma to your API
  → Resource: Prisma docs — Getting Started

${chalk.bold("Week 3:")} Authentication, error handling, API patterns, deployment
  → Practice: Add JWT auth and error handling to your API
  → Resource: tRPC docs (for type-safe fullstack patterns)`,

    4: `${chalk.bold.hex("#c21325")("Phase 4: Testing — Detailed Breakdown")}\n
${chalk.bold("Week 1:")} Unit testing with Vitest, mocking, typed test helpers
  → Practice: Add tests to your utility library from Phase 1
  → Resource: Vitest docs — Getting Started

${chalk.bold("Week 2:")} React component testing, E2E with Playwright
  → Practice: Add tests to your todo app from Phase 2
  → Resource: Testing Library docs + Playwright docs`,

    5: `${chalk.bold.hex("#9b59b6")("Phase 5: Advanced Patterns — Ongoing")}\n
${chalk.bold("Topics to explore:")}
  • Conditional types and distributive conditional types
  • Template literal types for string manipulation
  • Mapped types with key remapping
  • Recursive types and type-level programming
  • Module augmentation and declaration merging
  • Monorepo setup (Turborepo/Nx with shared TS configs)
  • Design patterns in TypeScript (Strategy, Observer, Builder)
  • Contributing to open-source TypeScript projects

${chalk.bold("Resources:")}
  • Type Challenges (medium + hard)
  • Advent of TypeScript (December annually)
  • Read source code of popular TS libraries (Zod, tRPC, Prisma)`,
  };

  console.log(
    boxen(phaseDetails[detail], {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: "round",
      borderColor: "cyan",
    })
  );

  await inquirer.prompt([
    {
      type: "input",
      name: "continue",
      message: chalk.gray("Press Enter to continue..."),
    },
  ]);
}
