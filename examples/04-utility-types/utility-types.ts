/**
 * 📚 TypeScript — Utility Types
 *
 * Run this file: npx tsx examples/04-utility-types/utility-types.ts
 */

// ============================================
// Base interface we'll use throughout
// ============================================

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: "admin" | "user" | "guest";
}

// ============================================
// 1. Partial<T> — All properties optional
// ============================================

type UpdateUser = Partial<User>;

function updateUser(id: number, updates: Partial<User>): void {
  console.log(`📝 Updating user ${id} with:`, updates);
}

updateUser(1, { name: "Tanvi" }); // Only update name — valid!
updateUser(1, { age: 26, role: "admin" }); // Update multiple — valid!

// ============================================
// 2. Required<T> — All properties required
// ============================================

interface FormData {
  name?: string;
  email?: string;
  bio?: string;
}

type CompleteForm = Required<FormData>;

const form: CompleteForm = {
  name: "Tanvi", // must provide ALL fields
  email: "tanvi@redhat.com",
  bio: "Software Engineer",
};
console.log("📋 Complete form:", form);

// ============================================
// 3. Pick<T, K> — Select specific properties
// ============================================

type UserPreview = Pick<User, "name" | "email">;

const preview: UserPreview = { name: "Tanvi", email: "tanvi@redhat.com" };
console.log("👀 Preview:", preview);

// ============================================
// 4. Omit<T, K> — Remove specific properties
// ============================================

type CreateUser = Omit<User, "id">; // ID is auto-generated

const newUser: CreateUser = {
  name: "Alice",
  email: "alice@example.com",
  age: 28,
  role: "user",
};
console.log("➕ New user (no id):", newUser);

// ============================================
// 5. Record<K, T> — Create a mapped type
// ============================================

type UserRoles = Record<string, User>;

const team: UserRoles = {
  lead: { id: 1, name: "Tanvi", email: "tanvi@redhat.com", age: 25, role: "admin" },
  dev: { id: 2, name: "Bob", email: "bob@redhat.com", age: 30, role: "user" },
};
console.log("👥 Team:", Object.keys(team));

// Status count example
type StatusCount = Record<User["role"], number>;
const counts: StatusCount = { admin: 1, user: 5, guest: 10 };
console.log("📊 Counts:", counts);

// ============================================
// 6. Extract & Exclude — Filter union types
// ============================================

type AllRoles = "admin" | "user" | "guest" | "superadmin" | "moderator";

type PrivilegedRoles = Extract<AllRoles, "admin" | "superadmin" | "moderator">;
// Result: "admin" | "superadmin" | "moderator"

type BasicRoles = Exclude<AllRoles, "admin" | "superadmin">;
// Result: "user" | "guest" | "moderator"

console.log("🔐 Type-level filtering works at compile time!");

// ============================================
// 7. ReturnType<T> — Get function's return type
// ============================================

function createUser(name: string, age: number) {
  return {
    id: Math.random(),
    name,
    age,
    createdAt: new Date(),
  };
}

type CreatedUser = ReturnType<typeof createUser>;
// { id: number; name: string; age: number; createdAt: Date }

const user: CreatedUser = createUser("Tanvi", 25);
console.log("🏭 Created:", user);

// ============================================
// 8. NonNullable<T> — Remove null & undefined
// ============================================

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string

function processName(name: NonNullable<string | null>): string {
  return name.toUpperCase(); // Safe — null is excluded
}

console.log("🔤", processName("tanvi"));

// ============================================
// 9. Readonly<T> — Make all properties readonly
// ============================================

type FrozenUser = Readonly<User>;

const frozen: FrozenUser = {
  id: 1,
  name: "Tanvi",
  email: "tanvi@redhat.com",
  age: 25,
  role: "admin",
};
// frozen.name = "Alice"; // ❌ Error! All properties are readonly

console.log("🧊 Frozen user:", frozen.name);

// ============================================
// 10. Combining Utility Types — Real World
// ============================================

// API endpoint types built from a single source
type CreateUserDTO = Omit<User, "id">; // POST body
type UpdateUserDTO = Partial<Omit<User, "id">>; // PATCH body
type UserResponse = Readonly<User>; // GET response
type UserListItem = Pick<User, "id" | "name" | "role">; // List view

console.log("\n🎯 Pattern: Define ONE interface, derive ALL your DTOs from it!");
console.log("   CreateUserDTO = Omit<User, 'id'>");
console.log("   UpdateUserDTO = Partial<Omit<User, 'id'>>");
console.log("   UserResponse  = Readonly<User>");
console.log("   UserListItem  = Pick<User, 'id' | 'name' | 'role'>");

console.log("\n✅ All examples ran successfully!");
