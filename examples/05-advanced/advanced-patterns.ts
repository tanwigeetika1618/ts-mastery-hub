/**
 * 📚 TypeScript — Advanced Patterns
 *
 * Run this file: npx tsx examples/05-advanced/advanced-patterns.ts
 */

// ============================================
// 1. satisfies — Validate without widening
// ============================================

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Record<string, string | number[]>;

// palette.red is number[] (not string | number[])!
const redChannel = palette.red[0]; // ✅ Works! Type is number
console.log("🎨 Red channel:", redChannel);

// ============================================
// 2. as const — Readonly literal types
// ============================================

const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  USERS: "/users",
  USER_DETAIL: "/users/:id",
} as const;

type Route = (typeof ROUTES)[keyof typeof ROUTES];
// Type: "/" | "/about" | "/users" | "/users/:id"

function navigate(route: Route) {
  console.log(`🧭 Navigating to: ${route}`);
}

navigate(ROUTES.HOME);
navigate(ROUTES.ABOUT);
// navigate("/invalid"); // ❌ Error!

// ============================================
// 3. Conditional Types
// ============================================

type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"
type C = IsString<"hello">; // "yes" — literal extends string

// Practical example: Unwrap promises
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type X = UnwrapPromise<Promise<string>>; // string
type Y = UnwrapPromise<Promise<number[]>>; // number[]
type Z = UnwrapPromise<string>; // string — not a promise, returns as-is

console.log("🔄 Conditional types work at compile time!");

// ============================================
// 4. Template Literal Types
// ============================================

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiPath = "/users" | "/posts" | "/comments";
type ApiEndpoint = `${HttpMethod} ${ApiPath}`;
// "GET /users" | "GET /posts" | ... (12 combinations)

function callApi(endpoint: ApiEndpoint): void {
  const [method, path] = endpoint.split(" ");
  console.log(`📡 ${method} → ${path}`);
}

callApi("GET /users");
callApi("POST /posts");
// callApi("PATCH /users"); // ❌ Error! PATCH is not in HttpMethod

// ============================================
// 5. Mapped Types with Key Remapping
// ============================================

interface User {
  name: string;
  email: string;
  age: number;
}

// Create getter functions for every property
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getName: () => string; getEmail: () => string; getAge: () => number }

// Create event names from properties
type PropertyEvents<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (
    newValue: T[K],
    oldValue: T[K]
  ) => void;
};

type UserEvents = PropertyEvents<User>;
// { onNameChange: (new, old) => void; onEmailChange: ... }

console.log("🗺️ Mapped types with key remapping = automatic API generation!");

// ============================================
// 6. Builder Pattern with Generics
// ============================================

class RequestBuilder<T extends Record<string, unknown> = {}> {
  private config: T;

  constructor(config: T = {} as T) {
    this.config = config;
  }

  header<K extends string, V extends string>(key: K, value: V) {
    return new RequestBuilder({
      ...this.config,
      headers: {
        ...(this.config as any).headers,
        [key]: value,
      },
    });
  }

  url(url: string) {
    return new RequestBuilder({ ...this.config, url });
  }

  method(method: HttpMethod) {
    return new RequestBuilder({ ...this.config, method });
  }

  build(): T {
    return this.config;
  }
}

const request = new RequestBuilder()
  .url("https://api.example.com/users")
  .method("GET")
  .header("Authorization", "Bearer token123")
  .header("Content-Type", "application/json")
  .build();

console.log("🔨 Built request:", request);

// ============================================
// 7. Exhaustive Switch with never
// ============================================

type Status = "active" | "inactive" | "pending" | "archived";

function getStatusEmoji(status: Status): string {
  switch (status) {
    case "active":
      return "✅";
    case "inactive":
      return "❌";
    case "pending":
      return "⏳";
    case "archived":
      return "📦";
    default:
      // If you add a new status and forget to handle it,
      // this line will have a compile error!
      const _exhaustive: never = status;
      return _exhaustive;
  }
}

console.log("Status emojis:");
(["active", "inactive", "pending", "archived"] as Status[]).forEach((s) => {
  console.log(`  ${s}: ${getStatusEmoji(s)}`);
});

console.log("\n✅ All advanced examples ran successfully!");
