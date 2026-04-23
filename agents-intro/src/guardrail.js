const BLOCKED_KEYWORDS = [
  'hack', 'exploit', 'illegal', 'violence',
  'nsfw', 'weapon', 'drug', 'bomb'
];

export function checkGuardrail(input) {
  const lower = input.toLowerCase();

  for (const keyword of BLOCKED_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        blocked: true,
        reason: `Input blocked: contains restricted keyword "${keyword}"`,
      };
    }
  }

  if (input.trim().length < 2) {
    return { blocked: true, reason: 'Input too short.' };
  }

  return { blocked: false };
}