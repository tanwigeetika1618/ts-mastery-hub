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
  {
    id: 7,
    title: "The satisfies Operator",
    difficulty: "Intermediate",
    question: "What is the type of `config.port` after using `satisfies`?",
    codeSnippet: `const config = {\n  port: 3000,\n  host: "localhost",\n  debug: true\n} satisfies Record<string, string | number | boolean>;\n\nconst port = config.port;`,
    options: [
      "string | number | boolean",
      "number",
      "3000",
      "unknown",
    ],
    correctAnswer: 1,
    explanation:
      "The `satisfies` operator (TS 4.9+) validates that an expression matches a type WITHOUT widening the inferred type. So `config.port` remains `number` (not widened to `string | number | boolean`). If you used a type annotation (`: Record<...>`) instead, the type WOULD be widened. This is why `satisfies` is so powerful — you get both validation AND narrow types.",
  },
  {
    id: 8,
    title: "Typeof with Arrays",
    difficulty: "Beginner",
    question: "What is the type of `Status`?",
    codeSnippet: `const STATUSES = ["active", "inactive", "pending"] as const;\n\ntype Status = (typeof STATUSES)[number];`,
    options: [
      "string[]",
      "string",
      '"active" | "inactive" | "pending"',
      "readonly string[]",
    ],
    correctAnswer: 2,
    explanation:
      "This is a very common pattern! `as const` makes the array readonly with literal types. `typeof STATUSES` gives us the tuple type `readonly [\"active\", \"inactive\", \"pending\"]`. Indexing with `[number]` extracts a union of all element types. This is great because you define the values ONCE (the array) and derive the type from it — no duplication!",
  },
  {
    id: 9,
    title: "Mapped Types",
    difficulty: "Advanced",
    question: "What does `Optional<User>` produce?",
    codeSnippet: `interface User {\n  name: string;\n  age: number;\n  email: string;\n}\n\ntype Optional<T> = {\n  [K in keyof T]?: T[K]\n};\n\ntype Result = Optional<User>;`,
    options: [
      "Same as User — no change",
      "{ name?: string; age?: number; email?: string }",
      "{ name: string | undefined; age: number | undefined; email: string | undefined }",
      "Compile error — invalid syntax",
    ],
    correctAnswer: 1,
    explanation:
      "This is exactly how the built-in `Partial<T>` utility type works under the hood! `[K in keyof T]` iterates over every key in T, and `?:` makes each property optional. The result has all the same properties as User, but each one is optional. Understanding mapped types is key to understanding most of TypeScript's utility types.",
  },
  {
    id: 10,
    title: "Type Narrowing with `in`",
    difficulty: "Intermediate",
    question: "Does this code compile, and what type is `animal` inside the if block?",
    codeSnippet: `interface Dog { bark(): void; breed: string; }\ninterface Cat { meow(): void; color: string; }\n\nfunction speak(animal: Dog | Cat) {\n  if ("bark" in animal) {\n    animal;  // What type here?\n  }\n}`,
    options: [
      "Dog | Cat — no narrowing with 'in'",
      "Dog — narrowed by the 'in' check",
      "Compile error — 'in' only works with strings",
      "any",
    ],
    correctAnswer: 1,
    explanation:
      "The `in` operator narrows union types! When you check `\"bark\" in animal`, TypeScript knows that only `Dog` has the `bark` property, so it narrows the type to `Dog` inside that block. This is a cleaner alternative to type guards when your interfaces have unique properties. It's especially useful when you don't have a discriminant property like `kind`.",
  },
  {
    id: 11,
    title: "Promise Return Types",
    difficulty: "Beginner",
    question: "What is the return type of this async function?",
    codeSnippet: `async function fetchUser(id: number) {\n  const response = await fetch(\`/api/users/\${id}\`);\n  const data = await response.json();\n  return data as { name: string; email: string };\n}`,
    options: [
      "{ name: string; email: string }",
      "Promise<{ name: string; email: string }>",
      "Promise<any>",
      "Promise<Response>",
    ],
    correctAnswer: 1,
    explanation:
      "Async functions ALWAYS return a Promise. Even though the function body returns `{ name: string; email: string }`, the actual return type is `Promise<{ name: string; email: string }>`. TypeScript automatically wraps the return type in a Promise for async functions. When you `await` the function call, you unwrap the Promise and get the inner type.",
  },
  {
    id: 12,
    title: "keyof and Lookup Types",
    difficulty: "Intermediate",
    question: "What is the type of `value`?",
    codeSnippet: `interface Config {\n  host: string;\n  port: number;\n  debug: boolean;\n}\n\nfunction getConfig<K extends keyof Config>(key: K): Config[K] {\n  const config: Config = { host: "localhost", port: 3000, debug: true };\n  return config[key];\n}\n\nconst value = getConfig("port");`,
    options: [
      "string | number | boolean",
      "number",
      "keyof Config",
      "unknown",
    ],
    correctAnswer: 1,
    explanation:
      "This is the power of `keyof` with generics! When you call `getConfig(\"port\")`, TypeScript infers K as the literal type `\"port\"`. Then `Config[K]` becomes `Config[\"port\"]` which is `number`. The function returns different types depending on which key you pass — `getConfig(\"host\")` returns `string`, `getConfig(\"debug\")` returns `boolean`. This pattern is everywhere in well-typed libraries.",
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
