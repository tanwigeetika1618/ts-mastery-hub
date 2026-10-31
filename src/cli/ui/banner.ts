import figlet from "figlet";
import gradient from "gradient-string";
import boxen from "boxen";
import chalk from "chalk";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function showWelcomeBanner(): Promise<void> {
  const asciiArt = figlet.textSync("TS Mastery", {
    font: "ANSI Shadow",
    horizontalLayout: "fitted",
  });

  const coloredArt = gradient(["#3178c6", "#f7df1e", "#3178c6"])(asciiArt);
  console.log(coloredArt);

  await sleep(300);

  const subtitle = boxen(
    chalk.bold.white("  Interactive TypeScript & Modern Web Dev Learning Hub  ") +
      "\n\n" +
      chalk.gray("  Built with ") +
      chalk.hex("#3178c6").bold("TypeScript") +
      chalk.gray(" • Made for developers who want to level up  ") +
      "\n" +
      chalk.gray("  by ") +
      chalk.hex("#ee0000").bold("Red Hat") +
      chalk.gray(" engineers, for engineers  "),
    {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 2, right: 2 },
      borderStyle: "double",
      borderColor: "cyan",
      title: "🚀 v1.0.0",
      titleAlignment: "right",
    }
  );

  console.log(subtitle);
}
