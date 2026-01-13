export const NukuLanguage = {
  id: "nuku",
  name: "ぬく方言",
  commands: {
    "+": { op: "ADD", delta: 1 },
    "-": { op: "ADD", delta: -1 },
    ">": { op: "MOVE", delta: 1 },
    "<": { op: "MOVE", delta: -1 },
    ".": { op: "OUTPUT" },
    ",": { op: "INPUT" },
    "[": { op: "LOOP_START" },
    "]": { op: "LOOP_END" },
  },
};
