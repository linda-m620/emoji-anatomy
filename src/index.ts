#!/usr/bin/env node

import { readFileSync } from "node:fs";

type Role =
  | "base"
  | "zwj"
  | "vs15"
  | "vs16"
  | "skin-tone"
  | "regional-indicator"
  | "keycap"
  | "tag";

interface Piece {
  codepoint: number;
  role: Role;
  label: string;
}

interface Sequence {
  cluster: string;
  pieces: Piece[];
}

// Ranges of codepoints that make emoji sequences worth reporting. A bare
// combining accent on a letter, or a Hangul jamo cluster, also comes out
// of Intl.Segmenter as one multi-codepoint grapheme, but neither is an
// emoji sequence, so we only flag clusters that touch one of these.
const EMOJI_RANGES: Array<[number, number]> = [
  [0x1f1e6, 0x1f1ff], // regional indicators (flags)
  [0x1f300, 0x1faff], // main pictograph blocks
  [0x2600, 0x27bf], // misc symbols and dingbats
  [0x2300, 0x23ff], // misc technical (watch, hourglass, ...)
  [0x25a0, 0x25ff], // geometric shapes
  [0x2b00, 0x2bff], // misc symbols and arrows
  [0xe0020, 0xe007f], // tag characters (subdivision flags)
];

const SKIN_TONES: Record<number, string> = {
  0x1f3fb: "type 1-2, light",
  0x1f3fc: "type 3, medium-light",
  0x1f3fd: "type 4, medium",
  0x1f3fe: "type 5, medium-dark",
  0x1f3ff: "type 6, dark",
};

function isEmojiRelated(cp: number): boolean {
  if (cp === 0x200d || cp === 0xfe0e || cp === 0xfe0f || cp === 0x20e3) {
    return true;
  }
  return EMOJI_RANGES.some(([start, end]) => cp >= start && cp <= end);
}

function regionalLetter(cp: number): string {
  return String.fromCharCode(65 + (cp - 0x1f1e6));
}

function classify(cp: number): Piece {
  if (cp === 0x200d) {
    return { codepoint: cp, role: "zwj", label: "zero-width joiner" };
  }
  if (cp === 0xfe0f) {
    return { codepoint: cp, role: "vs16", label: "variation selector-16 (emoji style)" };
  }
  if (cp === 0xfe0e) {
    return { codepoint: cp, role: "vs15", label: "variation selector-15 (text style)" };
  }
  if (cp === 0x20e3) {
    return { codepoint: cp, role: "keycap", label: "keycap combining mark" };
  }
  if (cp >= 0x1f3fb && cp <= 0x1f3ff) {
    return { codepoint: cp, role: "skin-tone", label: `skin tone modifier, ${SKIN_TONES[cp]}` };
  }
  if (cp >= 0x1f1e6 && cp <= 0x1f1ff) {
    return {
      codepoint: cp,
      role: "regional-indicator",
      label: `regional indicator "${regionalLetter(cp)}"`,
    };
  }
  if (cp === 0xe007f) {
    return { codepoint: cp, role: "tag", label: "cancel tag" };
  }
  if (cp >= 0xe0020 && cp <= 0xe007e) {
    return { codepoint: cp, role: "tag", label: `tag letter "${String.fromCharCode(cp - 0xe0000)}"` };
  }
  return { codepoint: cp, role: "base", label: "base emoji" };
}

function findSequences(text: string): Sequence[] {
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const results: Sequence[] = [];
  for (const { segment } of segmenter.segment(text)) {
    const codepoints = Array.from(segment, (ch) => ch.codePointAt(0)!);
    if (codepoints.length < 2) {
      continue;
    }
    if (!codepoints.some(isEmojiRelated)) {
      continue;
    }
    results.push({ cluster: segment, pieces: codepoints.map(classify) });
  }
  return results;
}

function formatHex(cp: number): string {
  return "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
}

function printSequence(seq: Sequence): void {
  console.log(`sequence: ${seq.cluster}`);
  for (const piece of seq.pieces) {
    console.log(`  ${formatHex(piece.codepoint).padEnd(10)} ${piece.label}`);
  }
  console.log("");
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readInput(args: string[]): Promise<string> {
  if (args.length === 0) {
    return readStdin();
  }
  const parts: string[] = [];
  for (const arg of args) {
    parts.push(arg === "-" ? await readStdin() : readFileSync(arg, "utf8"));
  }
  return parts.join("\n");
}

const HELP = `usage: emoji-anatomy [file ...]

Reads text from the given files, or from stdin if no files are given,
and prints a breakdown of every emoji sequence it finds: ZWJ sequences,
flag sequences, keycap sequences, skin tone modifiers, and variation
selector pairs. A plain single-codepoint emoji is not reported, since
there is nothing in it to decompose.

Use "-" as a filename to read stdin explicitly alongside real files.

Examples:
  emoji-anatomy notes.txt
  echo "\u{1f468}‍\u{1f469}‍\u{1f467}‍\u{1f466}" | emoji-anatomy
  emoji-anatomy chat.log - extra.txt
`;

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write(HELP);
    return;
  }

  const text = await readInput(args);
  const sequences = findSequences(text);

  if (sequences.length === 0) {
    console.log("no emoji sequences found");
    return;
  }

  for (const seq of sequences) {
    printSequence(seq);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
