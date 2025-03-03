export const TAG_TYPE_BREAK = "BREAK";
export const TAG_TYPE_EMPHASIS = "EMPHASIS";
export const TAG_TYPE_PROSODY = "PROSODY";
export const TAG_TYPE_SUB = "SUB";

/**
 * Represents a single SSML tag or normal text segment
 */
export interface ISSMLTag {
  type: string; // The tag name (e.g., 'sub', 'prosody', 'emphasis') or 'normal' for plain text
  attributes: Record<string, string> | null; // Key-value pairs of attributes, null for normal text
  isSelfClosing: boolean; // Whether tag is self-closing like <break/>
  innerText: string; // The content inside the tag or the text itself for normal type
  startIndex: number; // Position in the original text where tag or text starts
  endIndex: number; // Position in the original text where tag or text ends
}

/**
 * Result of parsing SSML tags
 */
export interface ISSMLParseResult {
  tags: ISSMLTag[]; // All parsed tags including normal text segments
  plainText: string; // The text with all tags removed
}
