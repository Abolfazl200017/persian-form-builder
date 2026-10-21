export interface RequiredLabelParts {
  text: string;
  separator: string;
  required: boolean;
}

/** Splits a trailing `*` marker (and its spacing) so it can be rendered in red. */
export function splitRequiredLabel(label: string): RequiredLabelParts {
  const match = label.match(/^(.*?)(\s*)\*$/s);
  if (!match) return { text: label, separator: '', required: false };
  return { text: match[1].replace(/\s+$/, ''), separator: match[2], required: true };
}
