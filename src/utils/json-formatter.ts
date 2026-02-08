import { JsonFormatMode } from '@/types';

export function formatJson(input: string, mode: JsonFormatMode): { output: string; error: string | null } {
  try {
    const trimmed = input.trim();
    if (!trimmed) {
      return { output: '', error: 'Please enter JSON input' };
    }

    const parsed = JSON.parse(input);

    let output: string;
    if (mode === 'pretty') {
      output = JSON.stringify(parsed, null, 2);
    } else {
      output = JSON.stringify(parsed);
    }

    return { output, error: null };
  } catch (e) {
    const error = e as Error;
    return { output: '', error: error.message || 'Invalid JSON' };
  }
}
