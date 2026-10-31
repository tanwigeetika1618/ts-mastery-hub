/**
 * 📚 TypeScript Basics — Type Annotations
 *
 * Run this file: npx tsx examples/01-basics/types.ts
 */

// ============================================
// 1. Primitive Types
// ============================================

const name: string = "Tanvi";
const age: number = 25;
const isActive: boolean = true;
const nothing: null = null;
const notDefined: undefined = undefined;

console.log("📦 Primitives:", { name, age, isActive });

// ============================================
// 2. Arrays & Tuples
// ============================================

const numbers: number[] = [1, 2, 3, 4, 5];
const names: Array<string> = ["Alice", "Bob", "Charlie"];

// Tuple — fixed length and types at each position
const person: [string, number] = ["Tanvi", 25];
const [personName, personAge] = person;

console.log("📋 Arrays:", numbers, names);
console.log("📌 Tuple:", personName, personAge);

// ============================================
// 3. Union Types
// ============================================

type ID = string | number;

function printId(id: ID): void {
  // TypeScript narrows the type inside each branch
  if (typeof id === "string") {
    console.log(`String ID: ${id.toUpperCase()}`);
  } else {
    console.log(`Number ID: ${id.toFixed(0)}`);
  }
}

printId("abc-123");
printId(42);

// ============================================
// 4. Literal Types
// ============================================

type Direction = "north" | "south" | "east" | "west";
type HttpStatus = 200 | 404 | 500;

function move(direction: Direction): string {
  return `Moving ${direction}`;
}

console.log("🧭", move("north"));
// move("up"); // ❌ Error! "up" is not in Direction

// ============================================
// 5. Type Assertions
// ============================================

const input = document.getElementById("myInput") as HTMLInputElement;
// Or: const input = <HTMLInputElement>document.getElementById("myInput");

// ============================================
// 6. any vs unknown vs never
// ============================================

// any — disables type checking (avoid!)
let anything: any = 42;
anything = "hello";
anything.someMethod(); // No error, but might crash at runtime

// unknown — safe alternative to any (must narrow before use)
let mystery: unknown = 42;
// mystery.toFixed(); // ❌ Error! Must narrow first
if (typeof mystery === "number") {
  mystery.toFixed(); // ✅ Works after narrowing
}

// never — represents impossible values
function throwError(msg: string): never {
  throw new Error(msg);
}

console.log("\n✅ All examples ran successfully!");
