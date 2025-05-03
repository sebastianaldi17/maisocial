export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function convertMacrons(text: string): string {
  const macronMap: Record<string, string> = {
    ā: "aa",
    ī: "ii",
    ū: "uu",
    ē: "ee",
    ō: "ou",
    Ā: "AA",
    Ī: "II",
    Ū: "UU",
    Ē: "EE",
    Ō: "OU",
  };

  return text.replace(/[āīūēōĀĪŪĒŌ]/g, (match) => macronMap[match] || match);
}
