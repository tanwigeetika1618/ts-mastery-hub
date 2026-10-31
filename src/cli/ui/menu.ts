import inquirer from "inquirer";
import chalk from "chalk";
import { showLearningPaths } from "../modules/learning-paths.js";
import { showResources } from "../modules/resources.js";
import { showCheatSheet } from "../modules/cheatsheet.js";
import { showChallenge } from "../modules/challenges.js";
import { showRoadmap } from "../modules/roadmap.js";
import { showTips } from "../modules/tips.js";

const MENU_CHOICES = [
  {
    name: `${chalk.hex("#3178c6")("📚")}  Learning Paths         ${chalk.gray("— Structured paths from beginner to advanced")}`,
    value: "paths",
  },
  {
    name: `${chalk.hex("#f7df1e")("⚡")}  Quick Challenges       ${chalk.gray("— Test your TypeScript skills interactively")}`,
    value: "challenges",
  },
  {
    name: `${chalk.hex("#61dafb")("📋")}  Cheat Sheets           ${chalk.gray("— Quick reference for types, generics & more")}`,
    value: "cheatsheet",
  },
  {
    name: `${chalk.hex("#68bc71")("🗺️")}   Developer Roadmap      ${chalk.gray("— Visual roadmap: TS → React → Node → Testing")}`,
    value: "roadmap",
  },
  {
    name: `${chalk.hex("#ff6b6b")("🔗")}  Curated Resources      ${chalk.gray("— Best tutorials, videos, repos & courses")}`,
    value: "resources",
  },
  {
    name: `${chalk.hex("#ffd93d")("💡")}  Pro Tips & Patterns    ${chalk.gray("— Real-world patterns used at Red Hat & beyond")}`,
    value: "tips",
  },
  {
    name: `${chalk.red("👋")}  Exit`,
    value: "exit",
  },
];

export async function showMainMenu(): Promise<void> {
  let running = true;

  while (running) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: chalk.bold.cyan("What would you like to explore?"),
        choices: MENU_CHOICES,
        pageSize: 10,
      },
    ]);

    switch (choice) {
      case "paths":
        await showLearningPaths();
        break;
      case "challenges":
        await showChallenge();
        break;
      case "cheatsheet":
        await showCheatSheet();
        break;
      case "roadmap":
        await showRoadmap();
        break;
      case "resources":
        await showResources();
        break;
      case "tips":
        await showTips();
        break;
      case "exit":
        console.log(
          chalk.cyan("\n  👋 Happy learning! Remember: ") +
            chalk.bold.yellow("consistency > intensity\n")
        );
        running = false;
        break;
    }
  }
}
