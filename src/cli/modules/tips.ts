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
  {
    title: "Exhaustive Switch with `never`",
    category: "Patterns",
    content:
      "Use the `never` type to make TypeScript enforce that you've handled every case in a switch statement. If you add a new union member later, you get a compile error reminding you to handle it.",
    code: `type Status = "active" | "inactive" | "pending";

function getLabel(status: Status): string {
  switch (status) {
    case "active":   return "✅ Active";
    case "inactive": return "❌ Inactive";
    case "pending":  return "⏳ Pending";
    default:
      // If you add a new status and forget to handle it,
      // this line will show a compile error!
      const _exhaustive: never = status;
      return _exhaustive;
  }
}

// Now add "archived" to Status...
// TypeScript immediately tells you to handle it here! 🎉`,
  },
  {
    title: "Builder Pattern with Method Chaining",
    category: "Patterns",
    content:
      "Use TypeScript generics to create type-safe builders where each method adds to the type. The final object knows exactly which fields were set.",
    code: `class QueryBuilder<T extends Record<string, unknown> = {}> {
  private params: T;
  constructor(params: T = {} as T) { this.params = params; }

  where<K extends string, V>(key: K, value: V) {
    return new QueryBuilder({ ...this.params, [key]: value } as T & Record<K, V>);
  }

  build(): T { return this.params; }
}

const query = new QueryBuilder()
  .where("name", "Tanvi")
  .where("age", 25)
  .where("active", true)
  .build();

// Type of query: { name: string; age: number; active: boolean }
// Fully typed — autocomplete works on every property! 🎉`,
  },
  {
    title: "Type-Safe Event Emitter",
    category: "Real World",
    content:
      "Create an event emitter where TypeScript knows the exact payload type for each event. No more `any` in event handlers.",
    code: `type EventMap = {
  "user:login":  { userId: string; timestamp: Date };
  "user:logout": { userId: string };
  "error":       { message: string; code: number };
};

class TypedEmitter<T extends Record<string, unknown>> {
  private handlers = new Map<string, Function[]>();

  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void) {
    const list = this.handlers.get(event as string) || [];
    list.push(handler);
    this.handlers.set(event as string, list);
  }

  emit<K extends keyof T>(event: K, payload: T[K]) {
    this.handlers.get(event as string)?.forEach(fn => fn(payload));
  }
}

const emitter = new TypedEmitter<EventMap>();
emitter.on("user:login", (data) => {
  console.log(data.userId);    // ✅ Typed as string
  console.log(data.timestamp); // ✅ Typed as Date
});
emitter.emit("error", { message: "oops", code: 500 }); // ✅ Type-checked`,
  },
  {
    title: "Assertion Functions",
    category: "TypeScript 5+",
    content:
      "Assertion functions narrow types AND throw if the condition isn't met. They replace the common pattern of `if (!x) throw` + type assertion.",
    code: `// Instead of this everywhere:
if (!user) throw new Error("User not found");
// (TypeScript still doesn't narrow after this in some cases)

// Use an assertion function:
function assertDefined<T>(
  value: T | null | undefined,
  message: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

// Usage:
const user: User | null = await findUser(id);
assertDefined(user, "User not found");
// After this line, TypeScript KNOWS user is User (not null)
console.log(user.name); // ✅ No null check needed!

// Works great with API responses, DB queries, config values`,
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
