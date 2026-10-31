/**
 * 📚 TypeScript — Interfaces & Type Aliases
 *
 * Run this file: npx tsx examples/02-interfaces/interfaces.ts
 */

// ============================================
// 1. Interface Basics
// ============================================

interface User {
  name: string;
  age: number;
  email?: string; // optional
  readonly id: number; // immutable after creation
}

const user: User = { id: 1, name: "Tanvi", age: 25 };
console.log("👤 User:", user);
// user.id = 2; // ❌ Error! readonly

// ============================================
// 2. Extending Interfaces
// ============================================

interface Admin extends User {
  role: "admin" | "superadmin";
  permissions: string[];
}

const admin: Admin = {
  id: 2,
  name: "Alice",
  age: 30,
  role: "admin",
  permissions: ["read", "write", "delete"],
};

console.log("🔑 Admin:", admin);

// ============================================
// 3. Type Aliases vs Interfaces
// ============================================

// Type aliases can do unions (interfaces can't)
type Result = "success" | "error" | "loading";
type StringOrNumber = string | number;

// Type aliases can do intersections
type Employee = User & { employeeId: string; department: string };

const emp: Employee = {
  id: 3,
  name: "Bob",
  age: 28,
  employeeId: "EMP-001",
  department: "Engineering",
};

console.log("💼 Employee:", emp);

// ============================================
// 4. Index Signatures
// ============================================

interface Dictionary {
  [key: string]: string;
}

const colors: Dictionary = {
  primary: "#3178c6",
  secondary: "#61dafb",
  danger: "#ff6b6b",
};

console.log("🎨 Colors:", colors);

// ============================================
// 5. Function Types in Interfaces
// ============================================

interface MathOperation {
  (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

console.log("➕ add(2, 3) =", add(2, 3));
console.log("✖️ multiply(2, 3) =", multiply(2, 3));

// ============================================
// 6. Discriminated Unions — THE power pattern
// ============================================

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}

console.log("⭕ Circle area:", area({ kind: "circle", radius: 5 }).toFixed(2));
console.log("⬛ Square area:", area({ kind: "square", side: 4 }));
console.log("▬ Rectangle area:", area({ kind: "rectangle", width: 3, height: 7 }));

console.log("\n✅ All examples ran successfully!");
