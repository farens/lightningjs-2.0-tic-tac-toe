export type TileContent = "e" | "X" | "O";

const getMatchingPatterns = (regex: RegExp, tiles: TileContent[]) => {
    const patterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];
    return patterns.reduce((sets, pattern) => {
        const normalized = pattern.map((tileIndex) => {
            return tiles[tileIndex];
        }).join("");
        if (regex.test(normalized)) {
            // @ts-ignore Find the error's cause. Didn't look into it yet, as it's copied code.
            sets.push(pattern);
        }
        return sets;
    }, []);
};

const getFutureWinningIndex = (tiles: TileContent[]) => {
    let index = -1;
    const player = /(ex{2}|x{2}e|xex)/i;
    const ai = /(eO{2}|O{2}e|OeO)/i;

    // since we're testing for ai we give prio to letting ourself win
    // instead of blocking the potential win for the player
    const set = [
        ...getMatchingPatterns(player, tiles),
        ...getMatchingPatterns(ai, tiles)
    ];

    if (set.length) {
        // @ts-ignore Find the error's cause. Didn't look into it yet, as it's copied code.
        set.pop()?.forEach((tileIndex: number) => {
            if (tiles[tileIndex] === 'e') {
                index = tileIndex;
            }
        });
    }

    return index;
};

export default {
    AI: (tiles: TileContent[]) => {
        const mostLogicalIndex = getFutureWinningIndex(tiles);
        if (mostLogicalIndex !== -1) {
            return mostLogicalIndex;
        } else {
            const opt = tiles.map((el: TileContent, idx: number) => {
                if (el === "e") return idx;
            }).filter(Boolean);

            // test for tie
            if (!opt.length) {
                return -1;
            }
            return opt[~~(Math.random() * opt.length)];
        }
    },
    getWinner: (tiles: TileContent[]) => {
        const regex = /(x{3}|O{3})/i;
        const set = getMatchingPatterns(regex, tiles);
        if (set) {
            // @ts-ignore
            return tiles[set.join("")[0]];
        }
        return false;
    }
};