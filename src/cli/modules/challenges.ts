import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";

interface Challenge {
  id: number;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  question: string;
  codeSnippet: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Type Inference",
    difficulty: "Beginner",
    question: "What type does TypeScript infer for the variable `x`?",
    codeSnippet: `const x = [1, "hello", true];`,
    options: [
      "any[]",
      "(string | number | boolean)[]",
      "[number, string, boolean]",
      "unknown[]",
    ],
    correctAnswer: 1,
    explanation:
      'TypeScript infers the widest possible type for array literals. Since the array contains number, string, and boolean values, TS infers `(string | number | boolean)[]`. It does NOT infer a tuple type unless you use `as const` or explicitly annotate it.',
  },
  {
    id: 2,
    title: "Readonly Properties",
    difficulty: "Beginner",
    question: "What happens when you try to compile this code?",
    codeSnippet: `interface Config {\n  readonly apiUrl: string;\n  readonly timeout: number;\n}\n\nconst config: Config = { apiUrl: "https://api.example.com", timeout: 5000 };\nconfig.timeout = 10000;`,
    options: [
      "Compiles fine, runtime error",
      "Compile error: Cannot assign to 'timeout' because it is a read-only property",
      "Compiles fine, no error",
      "Compile error: Config is not assignable",
    ],
    correctAnswer: 1,
    explanation:
      "`readonly` properties can only be set during initialization. Attempting to reassign `config.timeout` causes a compile-time error. Note: `readonly` is a compile-time check only — it doesn't prevent mutation at runtime in plain JavaScript.",
  },
  {
    id: 3,
    title: "Generic Constraints",
    difficulty: "Intermediate",
    question: "Which function signature correctly constrains the generic to objects with a `length` property?",
    codeSnippet: `// Which one is correct?\n\nA: function getLength<T>(arg: T): number\nB: function getLength<T extends { length: number }>(arg: T): number\nC: function getLength<T implements Lengthwise>(arg: T): number\nD: function getLength<T: { length: number }>(arg: T): number`,
    options: [
      "A — Generic with no constraint",
      "B — Generic with extends constraint",
      "C — Generic with implements keyword",
      "D — Generic with colon constraint",
    ],
    correctAnswer: 1,
    explanation:
      "In TypeScript, generic constraints use the `extends` keyword, not `implements` or `:`. Option B correctly constrains T to any type that has a `length` property of type `number`. This means you can pass strings, arrays, or any object with a length property.",
  },
  {
    id: 4,
    title: "Discriminated Unions",
    difficulty: "Intermediate",
    question: "What makes this a discriminated union, and what type is `shape` inside the 'circle' case?",
    codeSnippet: `type Shape =\n  | { kind: "circle"; radius: number }\n  | { kind: "square"; size: number }\n  | { kind: "rectangle"; width: number; height: number };\n\nfunction area(shape: Shape): number {\n  switch (shape.kind) {\n    case "circle":\n      return Math.PI * shape.radius ** 2;\n    // ...\n  }\n}`,
    options: [
      "shape is Shape — no narrowing happens",
      'shape is { kind: "circle"; radius: number } — narrowed by discriminant',
      "shape is { radius: number } — kind is removed",
      "shape is any — switch doesn't narrow",
    ],
    correctAnswer: 1,
    explanation:
      "The `kind` property is the **discriminant** — a common literal type property across all union members. Inside the `case \"circle\"` block, TypeScript narrows `shape` to `{ kind: \"circle\"; radius: number }`, giving you safe access to `shape.radius`. This pattern is incredibly powerful for state machines, Redux actions, and API responses.",
  },
  {
    id: 5,
    title: "Conditional Types",
    difficulty: "Advanced",
    question: "What does `ExtractString<string | number | boolean>` resolve to?",
    codeSnippet: `type ExtractString<T> = T extends string ? T : never;\n\ntype Result = ExtractString<string | number | boolean>;`,
    options: [
      "string | number | boolean",
      "string",
      "never",
      "string | never",
    ],
    correctAnswer: 1,
    explanation:
      "Conditional types **distribute** over union types. So `ExtractString<string | number | boolean>` becomes:\n`(string extends string ? string : never) | (number extends string ? never : never) | (boolean extends string ? never : never)`\n= `string | never | never` = `string`.\nThis is exactly how the built-in `Extract<T, U>` utility type works!",
  },
  {
    id: 6,
    title: "Template Literal Types",
    difficulty: "Advanced",
    question: "What type does `EventName` resolve to?",
    codeSnippet: `type Color = "red" | "blue";\ntype Size = "sm" | "lg";\n\ntype EventName = \`\${Color}-\${Size}-click\`;`,
    options: [
      '"red-sm-click"',
      '"red-sm-click" | "red-lg-click" | "blue-sm-click" | "blue-lg-click"',
      "string",
      '"Color-Size-click"',
    ],
    correctAnswer: 1,
    explanation:
      "Template literal types create all possible combinations of the union members. With 2 colors × 2 sizes, you get 4 specific string literal types. This is incredibly useful for creating typed event systems, CSS class generators, and API route types.",
  },
];

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "Beginner":
      return "#68bc71";
    case "Intermediate":
      return "#f7df1e";
    case "Advanced":
      return "#ff6b6b";
    default:
      return "#ffffff";
  }
}

export async function showChallenge(): Promise<void> {
  const { level } = await inquirer.prompt([
    {
      type: "list",
      name: "level",
      message: chalk.bold("Choose difficulty:"),
      choices: [
        { name: `🟢  ${chalk.green("Beginner")}     ${chalk.gray("— Core concepts & syntax")}`, value: "Beginner" },
        { name: `🟡  ${chalk.yellow("Intermediate")} ${chalk.gray("— Generics, unions & patterns")}`, value: "Intermediate" },
        { name: `🔴  ${chalk.red("Advanced")}     ${chalk.gray("— Conditional types & type gymnastics")}`, value: "Advanced" },
        { name: `🎲  ${chalk.magenta("Random")}       ${chalk.gray("— Surprise me!")}`, value: "random" },
        { name: chalk.gray("← Back"), value: "back" },
      ],
    },
  ]);

  if (level === "back") return;

  let filtered =
    level === "random"
      ? CHALLENGES
      : CHALLENGES.filter((c) => c.difficulty === level);

  const challenge = filtered[Math.floor(Math.random() * filtered.length)];

  console.log(
    boxen(
      chalk.hex(getDifficultyColor(challenge.difficulty)).bold(
        `Challenge #${challenge.id}: ${challenge.title}`
      ) +
        chalk.gray(` [${challenge.difficulty}]`) +
        "\n\n" +
        chalk.white(challenge.question) +
        "\n\n" +
        chalk.hex("#3178c6")(challenge.codeSnippet),
      {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: "round",
        borderColor: "blue",
        title: "⚡ TypeScript Challenge",
        titleAlignment: "center",
      }
    )
  );

  const { answer } = await inquirer.prompt([
    {
      type: "list",
      name: "answer",
      message: chalk.bold("Your answer:"),
      choices: challenge.options.map((opt, i) => ({
        name: `${String.fromCharCode(65 + i)}) ${opt}`,
        value: i,
      })),
    },
  ]);

  const isCorrect = answer === challenge.correctAnswer;

  if (isCorrect) {
    console.log(
      boxen(
        chalk.bold.green("✅ Correct! Well done!") +
          "\n\n" +
          chalk.white(challenge.explanation),
        {
          padding: 1,
          margin: { top: 0, bottom: 1, left: 2, right: 2 },
          borderStyle: "round",
          borderColor: "green",
        }
      )
    );
  } else {
    console.log(
      boxen(
        chalk.bold.red("❌ Not quite!") +
          "\n\n" +
          chalk.white("Correct answer: ") +
          chalk.bold.green(
            `${String.fromCharCode(65 + challenge.correctAnswer)}) ${challenge.options[challenge.correctAnswer]}`
          ) +
          "\n\n" +
          chalk.white(challenge.explanation),
        {
          padding: 1,
          margin: { top: 0, bottom: 1, left: 2, right: 2 },
          borderStyle: "round",
          borderColor: "red",
        }
      )
    );
  }

  const { tryAnother } = await inquirer.prompt([
    {
      type: "confirm",
      name: "tryAnother",
      message: "Try another challenge?",
      default: true,
    },
  ]);

  if (tryAnother) await showChallenge();
}
