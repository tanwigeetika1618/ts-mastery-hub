/**
 * 📚 TypeScript — Generics
 *
 * Run this file: npx tsx examples/03-generics/generics.ts
 */

// ============================================
// 1. Generic Functions
// ============================================

function identity<T>(value: T): T {
  return value;
}

const str = identity("hello"); // type: string
const num = identity(42); // type: number

console.log("🔄 Identity:", str, num);

// ============================================
// 2. Generic with Constraints
// ============================================

function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

console.log("📏 String length:", getLength("TypeScript"));
console.log("📏 Array length:", getLength([1, 2, 3, 4]));
// getLength(42); // ❌ Error! number doesn't have .length

// ============================================
// 3. Generic Interfaces
// ============================================

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "Tanvi", email: "tanvi@redhat.com" },
  status: 200,
  message: "OK",
  timestamp: new Date(),
};

console.log("📡 API Response:", userResponse);

// ============================================
// 4. Multiple Generics
// ============================================

function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: "Tanvi" }, { age: 25, role: "engineer" });
console.log("🔗 Merged:", merged);
// merged.name, merged.age, merged.role — all typed!

// ============================================
// 5. Generic Classes
// ============================================

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.push(3);
console.log("📚 Stack peek:", numberStack.peek()); // 3
console.log("📚 Stack pop:", numberStack.pop()); // 3
console.log("📚 Stack size:", numberStack.size); // 2

// ============================================
// 6. keyof and Lookup Types
// ============================================

interface Config {
  host: string;
  port: number;
  debug: boolean;
}

function getConfigValue<K extends keyof Config>(
  config: Config,
  key: K
): Config[K] {
  return config[key];
}

const config: Config = { host: "localhost", port: 3000, debug: true };

const host = getConfigValue(config, "host"); // type: string
const port = getConfigValue(config, "port"); // type: number
const debug = getConfigValue(config, "debug"); // type: boolean

console.log("⚙️ Config:", { host, port, debug });

// ============================================
// 7. Generic Utility: Type-Safe Pick
// ============================================

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

const fullUser = { id: 1, name: "Tanvi", email: "tanvi@redhat.com", age: 25 };
const preview = pick(fullUser, ["name", "email"]);
console.log("🎯 Picked:", preview); // { name: "Tanvi", email: "tanvi@redhat.com" }

console.log("\n✅ All examples ran successfully!");
