// Unicode character names for the base emoji codepoints that most often
// show up joined into sequences: people, hand gestures, hearts, and the
// objects used in profession ZWJ sequences (👩‍🔬, 👨‍🍳, and so on). This
// is not the full emoji-data.txt name list, just enough that the common
// cases in ZWJ, skin-tone, and flag-adjacent sequences get a name instead
// of a bare "base emoji".
export const BASE_EMOJI_NAMES: Record<number, string> = {
  // people
  0x1f466: "BOY",
  0x1f467: "GIRL",
  0x1f468: "MAN",
  0x1f469: "WOMAN",
  0x1f470: "BRIDE WITH VEIL",
  0x1f471: "PERSON WITH BLOND HAIR",
  0x1f472: "MAN WITH GUA PI MAO",
  0x1f473: "MAN WITH TURBAN",
  0x1f474: "OLDER MAN",
  0x1f475: "OLDER WOMAN",
  0x1f476: "BABY",
  0x1f477: "CONSTRUCTION WORKER",
  0x1f478: "PRINCESS",
  0x1f47c: "BABY ANGEL",

  // hand gestures
  0x1f44a: "FISTED HAND SIGN",
  0x1f44b: "WAVING HAND SIGN",
  0x1f44c: "OK HAND SIGN",
  0x1f44d: "THUMBS UP SIGN",
  0x1f44e: "THUMBS DOWN SIGN",
  0x1f44f: "CLAPPING HANDS SIGN",
  0x1f450: "OPEN HANDS SIGN",
  0x1f64b: "HAPPY PERSON RAISING ONE HAND",
  0x1f64c: "PERSON RAISING BOTH HANDS IN CELEBRATION",
  0x1f64f: "PERSON WITH FOLDED HANDS",
  0x1f91d: "HANDSHAKE",
  0x1f4aa: "FLEXED BICEPS",
  0x270a: "RAISED FIST",
  0x270b: "RAISED HAND",
  0x270c: "VICTORY HAND",
  0x270d: "WRITING HAND",

  // hearts
  0x2764: "HEAVY BLACK HEART",
  0x1f48b: "KISS MARK",
  0x1f48f: "KISS",
  0x1f491: "COUPLE WITH HEART",
  0x1f494: "BROKEN HEART",
  0x1f495: "TWO HEARTS",
  0x1f496: "SPARKLING HEART",
  0x1f497: "GROWING HEART",
  0x1f498: "HEART WITH ARROW",
  0x1f499: "BLUE HEART",
  0x1f49a: "GREEN HEART",
  0x1f49b: "YELLOW HEART",
  0x1f49c: "PURPLE HEART",
  0x1f49d: "HEART WITH RIBBON",
  0x1f49e: "REVOLVING HEARTS",
  0x1f49f: "HEART DECORATION",

  // profession objects
  0x2695: "STAFF OF AESCULAPIUS",
  0x2696: "SCALES",
  0x2708: "AIRPLANE",
  0x1f373: "COOKING",
  0x1f3a4: "MICROPHONE",
  0x1f3a8: "ARTIST PALETTE",
  0x1f3eb: "SCHOOL",
  0x1f3e2: "OFFICE BUILDING",
  0x1f3e5: "HOSPITAL",
  0x1f3ed: "FACTORY",
  0x1f4bc: "BRIEFCASE",
  0x1f4bb: "PERSONAL COMPUTER",
  0x1f527: "WRENCH",
  0x1f52c: "MICROSCOPE",
  0x1f680: "ROCKET",
};
