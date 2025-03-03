import { ISSMLParseResult, ISSMLTag } from "./interface";

// AI part

/**
 * Converts an array of SSML tags back into a properly formatted SSML string
 * @param tags Array of SSML tag objects
 * @returns Formatted SSML string
 */
export function constructSSML(tags: ISSMLTag[]): string {
  // First, sort tags by startIndex to ensure correct order
  const sortedTags = [...tags].sort((a, b) => a.startIndex - b.startIndex);

  let result = "";

  for (const tag of sortedTags) {
    if (tag.type === "normal") {
      // For normal text segments, just add the innerText
      result += tag.innerText;
    } else if (tag.isSelfClosing) {
      // Handle self-closing tags like <break/>
      result += constructTagString(tag.type, tag.attributes, true);
    } else {
      // For regular tags, add opening tag, innerText, and closing tag
      result += constructTagString(tag.type, tag.attributes, false);
      result += tag.innerText;
      result += `</${tag.type}>`;
    }
  }

  return result;
}

/**
 * Helper function to construct a tag string with its attributes
 * @param tagName Name of the tag
 * @param attributes Object containing attribute key-value pairs
 * @param isSelfClosing Whether the tag is self-closing
 * @returns Formatted tag string
 */
function constructTagString(
  tagName: string,
  attributes: Record<string, string> | null,
  isSelfClosing: boolean
): string {
  if (!attributes || Object.keys(attributes).length === 0) {
    // Tag with no attributes
    return isSelfClosing ? `<${tagName}/>` : `<${tagName}>`;
  }

  // Build attribute string
  const attributeStr = Object.entries(attributes)
    .map(([key, value]) => {
      // Escape quotes in the attribute value
      const escapedValue = value.replace(/"/g, '\\"');
      return `${key}="${escapedValue}"`;
    })
    .join(" ");

  // Return the complete tag string
  return isSelfClosing
    ? `<${tagName} ${attributeStr}/>`
    : `<${tagName} ${attributeStr}>`;
}

/**
 * Parses SSML tags from text and returns structured data about each tag
 * @param text Text containing SSML tags
 * @returns Object containing parsed tags and plaintext without tags
 */
export function parseSSML(text: string): ISSMLParseResult {
  const result: ISSMLParseResult = {
    tags: [],
    plainText: "",
  };

  // Updated regex to handle hyphenated tag names like say-as
  const tagRegex = /<\/?([a-z0-9][a-z0-9\-]*[a-z0-9]?)(\s+[^>]*?)?\/?>/gi;

  // To track all segments and avoid duplicating text
  const allSegments: ISSMLTag[] = [];

  // Track which parts of the text have been processed
  const processedRanges: { start: number; end: number }[] = [];

  // Stack to handle nested tags
  const tagStack: {
    type: string;
    startIndex: number;
    endOfOpenTagIndex: number; // Index after the '>' of opening tag
    attributes: Record<string, string>;
  }[] = [];

  let match;
  while ((match = tagRegex.exec(text)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const attributesStr = match[2] || "";
    const isSelfClosing = fullTag.endsWith("/>");
    const isClosingTag = fullTag.startsWith("</");
    const matchIndex = match.index;
    const tagEndIndex = matchIndex + fullTag.length;

    // Parse attributes for non-closing tags
    const attributes: Record<string, string> = {};
    if (!isClosingTag && attributesStr) {
      // Improved attribute regex that handles escaped quotes
      const attrRegex =
        /([a-z0-9\-]+)=(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')/gi;
      let attrMatch;

      while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
        // Get value from either double quotes (group 2) or single quotes (group 3)
        const value = attrMatch[2] !== undefined ? attrMatch[2] : attrMatch[3];
        // Unescape any escaped quotes or characters
        attributes[attrMatch[1]] = value.replace(/\\(["'\\])/g, "$1");
      }
    }

    if (isClosingTag) {
      // Find the matching opening tag
      let i = tagStack.length - 1;
      while (i >= 0 && tagStack[i].type !== tagName) {
        i--;
      }

      if (i >= 0) {
        const openingTag = tagStack.splice(i, 1)[0];

        // Extract the content between opening and closing tags (after '>' and before '</')
        const innerText = text.substring(
          openingTag.endOfOpenTagIndex,
          matchIndex
        );

        // Mark this range as processed
        processedRanges.push({
          start: openingTag.startIndex,
          end: tagEndIndex,
        });

        // Add the complete tag data to our results
        allSegments.push({
          type: tagName,
          attributes: openingTag.attributes,
          isSelfClosing: false,
          innerText,
          startIndex: openingTag.startIndex,
          endIndex: tagEndIndex,
        });

        // Add this text to plainText
        result.plainText += innerText;
      }
    } else if (isSelfClosing) {
      // Handle self-closing tags
      allSegments.push({
        type: tagName,
        attributes,
        isSelfClosing: true,
        innerText: "",
        startIndex: matchIndex,
        endIndex: tagEndIndex,
      });

      // Mark this range as processed
      processedRanges.push({ start: matchIndex, end: tagEndIndex });
    } else {
      // Push opening tag to stack
      tagStack.push({
        type: tagName,
        startIndex: matchIndex,
        endOfOpenTagIndex: tagEndIndex,
        attributes,
      });
    }
  }

  // Handle normal text segments that aren't inside tags
  let lastIndex = 0;
  // Sort processed ranges by start index
  processedRanges.sort((a, b) => a.start - b.start);

  for (const range of processedRanges) {
    if (range.start > lastIndex) {
      // There's unprocessed text before this tag
      const normalText = text.substring(lastIndex, range.start);
      allSegments.push({
        type: "normal",
        attributes: null,
        isSelfClosing: false,
        innerText: normalText,
        startIndex: lastIndex,
        endIndex: range.start,
      });

      result.plainText += normalText;
    }
    lastIndex = Math.max(lastIndex, range.end);
  }

  // Handle any remaining text after the last tag
  if (lastIndex < text.length) {
    const normalText = text.substring(lastIndex);
    allSegments.push({
      type: "normal",
      attributes: null,
      isSelfClosing: false,
      innerText: normalText,
      startIndex: lastIndex,
      endIndex: text.length,
    });

    result.plainText += normalText;
  }

  // Sort segments by startIndex to ensure correct order
  allSegments.sort((a, b) => a.startIndex - b.startIndex);
  result.tags = allSegments;

  return result;
}
