import { ping } from "./ping.js";
import { stats } from "./stats.js";
import type { Command } from "./types.js";

export const commands = new Map<string, Command>(
  [ping, stats].map((command) => [command.data.name, command])
);
