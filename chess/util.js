const makeSimpleErrorHandler = (niceText, returnValue) => e => {
    console.error(`!!! ERROR: ${niceText}`, e);
    return returnValue;
};

const columnToIndex = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
const rowToIndex = { 1: 7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1, 8: 0 };

const parseChessCoord = (str = '') => {
    const msgLower = str.toLowerCase().trim();
    const msgParts = msgLower.split('');
    if (msgParts.length === 2) {
        const x = columnToIndex[msgParts[0]];
        const y = rowToIndex[msgParts[1]];
        if (x !== undefined && y !== undefined) {
            return { x, y };
        }
    }
};

const parseChessMove = (str = '') => {
    const msgLower = str.toLowerCase().trim().replace(/to/g, '').replace(/\s+/g, ' ');
    const msgParts = msgLower.split(' ');
    if (msgParts.length === 2 && msgLower.length === 5) {
        const fromCoords = parseChessCoord(msgParts[0]);
        const toCoords = parseChessCoord(msgParts[1]);
        if (fromCoords && toCoords) {
            return {
                from: fromCoords,
                to: toCoords
            };
        }
    }
};

module.exports = { makeSimpleErrorHandler, parseChessCoord, parseChessMove };