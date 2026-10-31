#!/usr/bin/env node

import { showWelcomeBanner } from "./ui/banner.js";
import { showMainMenu } from "./ui/menu.js";

async function main(): Promise<void> {
  console.clear();
  await showWelcomeBanner();
  await showMainMenu();
}

main().catch(console.error);
