import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";

interface Tip {
  title: string;
  category: string;
  content: string;
  code?: string;
}

const TIPS: Tip[] = [
  {
    title: "Use `satisfies` for Type-Safe Object Literals",
    category: "TypeScript 5+",
    content:
      "The `satisfies` operator (TS 4.9+) validates that an expression matches a type WITHOUT widening. This means you get both type checking AND type inference.",
    code: `// ❌ Without satisfies — type is widened
const config: Record<string, string | number> = {
  port: 3000,
  host: "localhost"
};
config.port.toFixed(); // Error! Type is string | number

// ✅ With satisfies — validated + narrow types preserved
const config = {
  port: 3000,
  host: "localhost"
} satisfies Record<string, string | number>;
config.port.toFixed(); // Works! Type is number`,
  },
  {
    title: "Use `as const` for Literal Types",
    category: "Type Narrowing",
    content:
      "Adding `as const` creates readonly literal types instead of widened types. Essential for discriminated unions, route definitions, and config objects.",
    code: `// Without as const
const routes = { home: "/", about: "/about" };
// Type: { home: string; about: string }

// With as const
const routes = { home: "/", about: "/about" } as const;
// Type: { readonly home: "/"; readonly about: "/about" }

// Super useful for arrays too:
const STATUSES = ["active", "inactive", "pending"] as const;
type Status = (typeof STATUSES)[number];
// Type: "active" | "inactive" | "pending"`,
  },
  {
    title: "Discriminated Unions > Enums (Usually)",
    category: "Patterns",
    content:
      "Discriminated unions with literal types often work better than enums in TypeScript. They're tree-shakeable, work with exhaustive checks, and don't add runtime code.",
    code: `// ❌ Enum approach
enum Shape { Circle, Square }
interface CircleData { type: Shape.Circle; radius: number }

// ✅ Discriminated union approach  
type Shape =
  | { type: "circle"; radius: number }
  | { type: "square"; side: number }
  | { type: "rectangle"; width: number; height: number };

function area(s: Shape): number {
  switch (s.type) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side ** 2;
    case "rectangle": return s.width * s.height;
  }
  // TS knows this is exhaustive — no default needed!
}`,
  },
  {
    title: "Zod for Runtime Type Safety",
    category: "Real World",
    content:
      "TypeScript types vanish at runtime. For API responses, form data, and external input, use Zod to validate AND infer types from a single schema.",
    code: `import { z } from "zod";

// Define schema once
const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(18).optional(),
});

// Infer TypeScript type from schema — no duplication!
type User = z.infer<typeof UserSchema>;
// { name: string; email: string; age?: number }

// Validate at runtime
const result = UserSchema.safeParse(apiResponse);
if (result.success) {
  console.log(result.data.name); // Fully typed!
} else {
  console.error(result.error.issues);
}`,
  },
  {
    title: "Generic Wrapper Pattern for API Calls",
    category: "Patterns",
    content:
      "Create a generic fetch wrapper that provides type-safe API calls. This is one of the most practical patterns used in production codebases at Red Hat and beyond.",
    code: `interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(\`/api\${endpoint}\`, options);
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json() as Promise<ApiResponse<T>>;
}

// Usage — fully typed!
interface User { id: number; name: string; }
const { data: users } = await fetchApi<User[]>("/users");
// users is User[] — autocomplete works perfectly`,
  },
  {
    title: "Use `unknown` Instead of `any`",
    category: "Best Practices",
    content:
      "Every time you reach for `any`, use `unknown` instead. It forces you to narrow the type before using it, catching bugs at compile time rather than runtime.",
    code: `// ❌ any — no type safety at all
function processData(data: any) {
  data.forEach(item => item.name.toUpperCase()); // No errors, crashes at runtime
}

// ✅ unknown — must narrow before use
function processData(data: unknown) {
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (typeof item === "object" && item !== null && "name" in item) {
        console.log((item as { name: string }).name.toUpperCase());
      }
    });
  }
}

// ✅✅ Even better — use Zod for runtime validation
function processData(data: unknown) {
  const parsed = z.array(z.object({ name: z.string() })).parse(data);
  parsed.forEach(item => item.name.toUpperCase()); // Fully typed!
}`,
  },
  {
    title: "Const Generics for Strict Inference",
    category: "TypeScript 5+",
    content:
      "Use `const` type parameters (TS 5.0+) to infer literal types from arguments without requiring `as const` at the call site.",
    code: `// Without const generic
function createRoute<T extends string>(path: T) { return path; }
const r = createRoute("/users"); // Type: string 😞

// With const generic (TS 5.0+)
function createRoute<const T extends string>(path: T) { return path; }
const r = createRoute("/users"); // Type: "/users" 🎉

// Super powerful for builders:
function defineConfig<const T extends Record<string, unknown>>(config: T) {
  return config;
}
const config = defineConfig({ port: 3000, debug: true });
// Type: { port: 3000; debug: true } — literal types preserved!`,
  },
  {
    title: "Branded Types for Domain Safety",
    category: "Advanced",
    content:
      "Branded types prevent mixing up values that share the same primitive type. Essential for IDs, currencies, and domain-specific values.",
    code: `// Problem: Both are strings, but semantically different
type UserId = string;
type OrderId = string;

function getUser(id: UserId) { /* ... */ }
getUser(orderId); // No error! But this is a bug.

// Solution: Branded types
type Brand<T, B extends string> = T & { __brand: B };
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function userId(id: string): UserId { return id as UserId; }
function orderId(id: string): OrderId { return id as OrderId; }

function getUser(id: UserId) { /* ... */ }
getUser(orderId("abc")); // ✅ Compile error! Can't mix them up.
getUser(userId("abc"));  // ✅ Works!`,
  },
];

export async function showTips(): Promise<void> {
  const categories = [...new Set(TIPS.map((t) => t.category))];

  const { filter } = await inquirer.prompt([
    {
      type: "list",
      name: "filter",
      message: chalk.bold("Filter tips by category:"),
      choices: [
        { name: `🎲  ${chalk.bold("Show all tips")} ${chalk.gray(`(${TIPS.length} tips)`)}`, value: "all" },
        ...categories.map((c) => ({
          name: `📂  ${chalk.bold(c)} ${chalk.gray(`(${TIPS.filter((t) => t.category === c).length})`)}`,
          value: c,
        })),
        { name: chalk.gray("← Back"), value: "back" },
      ],
    },
  ]);

  if (filter === "back") return;

  const filtered = filter === "all" ? TIPS : TIPS.filter((t) => t.category === filter);

  for (const tip of filtered) {
    console.log(
      boxen(
        chalk.bold.yellow(`💡 ${tip.title}`) +
          chalk.gray(` [${tip.category}]`) +
          "\n\n" +
          chalk.white(tip.content) +
          (tip.code ? "\n\n" + chalk.hex("#3178c6")(tip.code) : ""),
        {
          padding: 1,
          margin: { top: 1, bottom: 0, left: 2, right: 2 },
          borderStyle: "round",
          borderColor: "yellow",
        }
      )
    );
  }

  await inquirer.prompt([
    {
      type: "input",
      name: "continue",
      message: chalk.gray("Press Enter to continue..."),
    },
  ]);
}
