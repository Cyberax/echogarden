export function includesAnyOf(str, substrings) {
    return indexOfAnyOf(str, substrings) >= 0;
}
export function indexOfAnyOf(str, substrings) {
    for (const substring of substrings) {
        const index = str.indexOf(substring);
        if (index >= 0) {
            return index;
        }
    }
    return -1;
}
export function startsWithAnyOf(str, prefixes) {
    for (const prefix of prefixes) {
        if (str.startsWith(prefix)) {
            return true;
        }
    }
    return false;
}
export function formatHMS(timeHMS, decimalSeparator = '.') {
    return `${formatIntegerWithLeadingZeros(timeHMS.hours, 2)}:${formatIntegerWithLeadingZeros(timeHMS.minutes, 2)}:${formatIntegerWithLeadingZeros(timeHMS.seconds, 2)}${decimalSeparator}${formatIntegerWithLeadingZeros(timeHMS.milliseconds, 3)}`;
}
export function formatMS(timeMS, decimalSeparator = '.') {
    return `${formatIntegerWithLeadingZeros(timeMS.minutes, 2)}:${formatIntegerWithLeadingZeros(timeMS.seconds, 2)}${decimalSeparator}${formatIntegerWithLeadingZeros(timeMS.milliseconds, 3)}`;
}
export function formatIntegerWithLeadingZeros(num, minDigitCount) {
    num = Math.floor(num);
    let numAsString = `${num}`;
    while (numAsString.length < minDigitCount) {
        numAsString = `0${numAsString}`;
    }
    return numAsString;
}
export function formatListWithQuotedElements(strings, quoteSymbol = `'`) {
    return strings.map(str => `${quoteSymbol}${str}${quoteSymbol}`).join(', ');
}
export function getUTF32Chars(str) {
    const utf32chars = [];
    const mapping = [];
    let utf32Index = 0;
    for (const utf32char of str) {
        utf32chars.push(utf32char);
        for (let i = 0; i < utf32char.length; i++) {
            mapping.push(utf32Index);
        }
        utf32Index += 1;
    }
    mapping.push(utf32Index);
    return { utf32chars, mapping };
}
export function containsInvalidCodepoint(str) {
    for (const char of str) {
        if (char.codePointAt(0) === 65533) {
            return true;
        }
    }
    return false;
}
export function splitAndPreserveSeparators(text, separatorRegex) {
    if (!separatorRegex.flags.includes('g')) {
        throw new Error('RegExp must be global');
    }
    // Use the match method to find all matches for the separators
    const matches = text.match(separatorRegex);
    // If no matches are found, return the original text as a single element array
    if (!matches) {
        return [text];
    }
    // Initialize the result array
    const result = [];
    // Initialize the start position
    let lastIndex = 0;
    // Iterate through the matches
    matches.forEach(match => {
        // Get the index of the current match
        const matchIndex = text.indexOf(match, lastIndex);
        // Add the substring before the match to the result, joined with the match itself
        result.push(text.substring(lastIndex, matchIndex) + match);
        // Update the last index to the end of the current match
        lastIndex = matchIndex + match.length;
    });
    // Add the remaining substring after the last match to the result
    {
        const remainingText = text.substring(lastIndex);
        if (remainingText.length > 0) {
            result.push(remainingText);
        }
    }
    return result;
}
export function getTokenRepetitionScore(tokens) {
    const maxCycleLength = Math.floor(tokens.length / 2);
    const matchLengthForCycleLength = [0];
    for (let cycleLength = 1; cycleLength <= maxCycleLength; cycleLength++) {
        let matchCount = 0;
        for (let leftIndex = cycleLength; leftIndex < tokens.length; leftIndex++) {
            const referenceIndex = leftIndex - cycleLength;
            if (tokens[leftIndex] !== tokens[referenceIndex]) {
                break;
            }
            matchCount += 1;
        }
        const score = matchCount;
        matchLengthForCycleLength.push(score);
    }
    let longestMatch = -Infinity;
    let longestCycleRepetition = -Infinity;
    for (let i = 1; i <= matchLengthForCycleLength.length; i++) {
        const matchLength = matchLengthForCycleLength[i];
        if (matchLength > longestMatch) {
            longestMatch = matchLength;
        }
        const cycleCount = (matchLength / i) + 1;
        if (cycleCount > longestCycleRepetition) {
            longestCycleRepetition = cycleCount;
        }
    }
    return { longestMatch, longestCycleRepetition };
}
export async function convertHtmlToText(html) {
    const { htmlToText } = await import('html-to-text');
    const text = htmlToText(html, {
        wordwrap: false,
        selectors: [
            { selector: 'a', options: { ignoreHref: true } },
            { selector: 'img', format: 'skip' },
            { selector: 'h1', options: { uppercase: false } },
            { selector: 'h2', options: { uppercase: false } },
            { selector: 'h3', options: { uppercase: false } },
            { selector: 'h4', options: { uppercase: false } },
            { selector: 'table', options: { uppercaseHeaderCells: false } }
        ]
    });
    return text || '';
}
export function substituteCharactersUsingLookup(text, substitutionLookup) {
    let resultText = '';
    for (const char of text) {
        const substitution = substitutionLookup[char];
        if (substitution !== undefined) {
            resultText += substitution;
        }
        else {
            resultText += char;
        }
    }
    return resultText;
}
//# sourceMappingURL=StringUtilities.js.map