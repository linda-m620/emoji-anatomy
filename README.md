# emoji-anatomy

Most emoji you see aren't a single character. The family emoji is four
person emoji joined with zero-width joiners. A flag is two regional
indicator letters. A thumbs-up with a skin tone is a base emoji plus a
modifier codepoint. Copy one of these into a text field on the wrong
platform and it falls apart into its pieces, and it's not obvious from
looking at it why.

`emoji-anatomy` reads text and prints, for every emoji sequence it
finds, the list of codepoints that make it up and what each one is
doing (base emoji, joiner, modifier, regional indicator, and so on).
Plain single-codepoint emoji are skipped, since there's nothing to take
apart.

## Usage

```
$ echo "👨‍👩‍👧‍👦" | emoji-anatomy
sequence: 👨‍👩‍👧‍👦
  U+1F468    base emoji
  U+200D     zero-width joiner
  U+1F469    base emoji
  U+200D     zero-width joiner
  U+1F467    base emoji
  U+200D     zero-width joiner
  U+1F466    base emoji

$ echo "🇨🇦 👋🏽" | emoji-anatomy
sequence: 🇨🇦
  U+1F1E8    regional indicator "C"
  U+1F1E6    regional indicator "A"

sequence: 👋🏽
  U+1F44B    base emoji
  U+1F3FD    skin tone modifier, type 4, medium
```

It reads from files given as arguments, or from stdin when no files
are given:

```
emoji-anatomy chat-export.txt
cat chat-export.txt | emoji-anatomy
emoji-anatomy file-a.txt - file-b.txt   # "-" reads stdin in place
```

## Building

There are no dependencies to install. Compile with a TypeScript
compiler you already have on your machine:

```
tsc
node dist/index.js chat-export.txt
```

## What it doesn't do (yet)

It classifies each codepoint by role but doesn't print the Unicode
character name (e.g. "MAN", "FAMILY"), since that needs a name table
this project doesn't bundle yet. It also treats each line of input the
same way regardless of source, so it won't tell you which file or line
a sequence came from.
