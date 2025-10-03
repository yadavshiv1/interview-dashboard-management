export function sanitizeText(input: string) {
  return input.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '').trim()
}

export function isValidScore(n: any) {
  const num = Number(n)
  return Number.isInteger(num) && num >= 1 && num <= 10
}
