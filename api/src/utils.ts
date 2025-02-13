export function escapeRegex(input: string): string {
  return input.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}