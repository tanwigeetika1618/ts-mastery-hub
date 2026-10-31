import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";

interface CheatSection {
  title: string;
  emoji: string;
  items: { label: string; code: string; note?: string }[];
}

const SHEETS: CheatSection[] = [
  {
    title: "Basic Types",
    emoji: "📦",
    items: [
      { label: "Primitives", code: "let name: string = \"Tanvi\";\nlet age: number = 25;\nlet active: boolean = true;" },
      { label: "Arrays", code: "let nums: number[] = [1, 2, 3];\nlet names: Array<string> = [\"a\", \"b\"];" },
      { label: "Tuples", code: "let pair: [string, number] = [\"age\", 25];" },
      { label: "Enums", code: "enum Status { Active, Inactive, Pending }\nlet s: Status = Status.Active;" },
      { label: "Any / Unknown", code: "let flexible: any = 4;      // no type checking\nlet safe: unknown = 4;      // must narrow before use", note: "Prefer `unknown` over `any` — it forces type checking" },
      { label: "Void / Never", code: "function log(msg: string): void { console.log(msg); }\nfunction fail(msg: string): never { throw new Error(msg); }" },
    ],
  },
  {
    title: "Interfaces & Types",
    emoji: "🏗️",
    items: [
      { label: "Interface", code: "interface User {\n  name: string;\n  age: number;\n  email?: string;     // optional\n  readonly id: number; // immutable\n}" },
      { label: "Type Alias", code: "type Point = { x: number; y: number };\ntype ID = string | number;" },
      { label: "Extending", code: "interface Admin extends User {\n  role: \"admin\" | \"superadmin\";\n}\ntype AdminType = User & { role: string };" },
      { label: "Union Types", code: "type Result = \"success\" | \"error\" | \"loading\";\ntype Value = string | number;" },
      { label: "Intersection", code: "type Employee = Person & { employeeId: number };" },
      { label: "Interface vs Type", code: "// Interface: extendable, mergeable, best for objects\n// Type: unions, intersections, mapped types, primitives\n// Rule of thumb: use interface for objects, type for everything else", note: "Both work for objects — team consistency matters most" },
    ],
  },
  {
    title: "Generics",
    emoji: "🔧",
    items: [
      { label: "Basic Generic", code: "function identity<T>(arg: T): T {\n  return arg;\n}\nconst result = identity<string>(\"hello\");" },
      { label: "Generic Constraint", code: "function getLength<T extends { length: number }>(arg: T): number {\n  return arg.length;\n}" },
      { label: "Generic Interface", code: "interface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n}" },
      { label: "Multiple Generics", code: "function merge<T, U>(obj1: T, obj2: U): T & U {\n  return { ...obj1, ...obj2 };\n}" },
      { label: "Default Generic", code: "interface PaginatedList<T = any> {\n  items: T[];\n  total: number;\n  page: number;\n}" },
    ],
  },
  {
    title: "Utility Types",
    emoji: "🛠️",
    items: [
      { label: "Partial<T>", code: "type PartialUser = Partial<User>;\n// All properties become optional" },
      { label: "Required<T>", code: "type RequiredUser = Required<User>;\n// All properties become required" },
      { label: "Pick<T, K>", code: "type UserPreview = Pick<User, \"name\" | \"email\">;" },
      { label: "Omit<T, K>", code: "type UserWithoutId = Omit<User, \"id\">;" },
      { label: "Record<K, T>", code: "type UserMap = Record<string, User>;\ntype StatusCounts = Record<Status, number>;" },
      { label: "ReturnType<T>", code: "type FnReturn = ReturnType<typeof myFunction>;" },
      { label: "Exclude / Extract", code: "type T1 = Exclude<\"a\" | \"b\" | \"c\", \"a\">; // \"b\" | \"c\"\ntype T2 = Extract<\"a\" | \"b\" | \"c\", \"a\" | \"f\">; // \"a\"" },
      { label: "NonNullable<T>", code: "type T = NonNullable<string | null | undefined>; // string" },
    ],
  },
  {
    title: "React + TypeScript",
    emoji: "⚛️",
    items: [
      { label: "Typed Component", code: "interface ButtonProps {\n  label: string;\n  onClick: () => void;\n  variant?: \"primary\" | \"secondary\";\n}\n\nconst Button: React.FC<ButtonProps> = ({ label, onClick, variant = \"primary\" }) => (\n  <button className={variant} onClick={onClick}>{label}</button>\n);" },
      { label: "useState", code: "const [user, setUser] = useState<User | null>(null);" },
      { label: "useRef", code: "const inputRef = useRef<HTMLInputElement>(null);" },
      { label: "Event Types", code: "const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {};\nconst handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};" },
      { label: "Context", code: "const ThemeContext = React.createContext<Theme | undefined>(undefined);\n\nfunction useTheme() {\n  const ctx = useContext(ThemeContext);\n  if (!ctx) throw new Error(\"useTheme must be within ThemeProvider\");\n  return ctx;\n}" },
    ],
  },
];

export async function showCheatSheet(): Promise<void> {
  const { section } = await inquirer.prompt([
    {
      type: "list",
      name: "section",
      message: chalk.bold("Choose a cheat sheet:"),
      choices: [
        ...SHEETS.map((s) => ({
          name: `${s.emoji}  ${chalk.bold(s.title)} ${chalk.gray(`(${s.items.length} items)`)}`,
          value: s.title,
        })),
        { name: chalk.gray("← Back"), value: "back" },
      ],
    },
  ]);

  if (section === "back") return;

  const sheet = SHEETS.find((s) => s.title === section)!;

  console.log(
    chalk.bold.cyan(`\n  ${sheet.emoji}  ${sheet.title} Cheat Sheet\n`)
  );

  for (const item of sheet.items) {
    console.log(
      boxen(
        chalk.bold.yellow(item.label) +
          "\n\n" +
          chalk.hex("#3178c6")(item.code) +
          (item.note ? "\n\n" + chalk.gray.italic(`💡 ${item.note}`) : ""),
        {
          padding: { top: 0, bottom: 0, left: 1, right: 1 },
          margin: { top: 0, bottom: 0, left: 2, right: 2 },
          borderStyle: "round",
          borderColor: "gray",
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
