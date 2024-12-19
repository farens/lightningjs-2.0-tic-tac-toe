import { Lightning } from "@lightningjs/sdk";
import GameUtils, { TileContent } from "./lib/GameUtils";


interface GameTemplateSpec extends Lightning.Component.TemplateSpec {
    Game: {
        type: object
    }
    Notification: {
        type: object
    }
}
export default class Game extends Lightning.Component<GameTemplateSpec>
    implements Lightning.Component.ImplementTemplateSpec<GameTemplateSpec> {
    // TODO: shouldn't this be called "focusedItemIndex" for better clarity? 
    private _index = 0;
    private _aiScore = 0;
    private _playerScore = 0;
    private _tiles: TileContent[] = [];

    protected readonly _Game = this.getByRef('Game')!;
    protected readonly _PlayerPosition = this._Game.childList.getByRef('PlayerPosition')!
    protected readonly _Markers = this._Game.childList.getByRef('Markers')!
    protected readonly _Field = this._Game.childList.getByRef('Field')!
    protected readonly _ScoreBoard = this._Game.childList.getByRef('ScoreBoard')!
    protected readonly _Notification = this.getByRef('Notification')!

    static override _template(): Lightning.Component.Template<GameTemplateSpec> {
        return {
            Game: {
                // @ts-expect-error
                PlayerPosition: {
                    rect: true, w: 250, h: 250, color: 0x40ffffff,
                    x: 425, y: 125
                },
                Field: {
                    x: 400, y: 100,
                    children: [
                        { rect: true, w: 1, h: 5, y: 300 },
                        { rect: true, w: 1, h: 5, y: 600 },
                        { rect: true, h: 1, w: 5, x: 300, y: 0 },
                        { rect: true, h: 1, w: 5, x: 600, y: 0 }
                    ]
                },
                Markers: {
                    x: 400, y: 100
                },
                ScoreBoard: {
                    x: 100, y: 170,
                    Player: {
                        text: { text: 'Player 0', fontSize: 29, fontFace: 'regular' }
                    },
                    Ai: {
                        y: 40,
                        text: { text: 'Computer 0', fontSize: 29, fontFace: 'regular' }
                    }
                }
            },
            // TODO: move this out of the game component. Should live somewhere above it, i guess.
            Notification: {
                x: 100, y: 170, text: { fontSize: 70, fontFace: 'regular' }, alpha: 0
            }
        }
    }

    override _active() {
        this._reset();

        // we iterate over the outlines of the field and do a nice
        // transition of the width / height, so it looks like the
        // lines are being drawn realtime.
        this._Field.children.forEach((el: any, idx: number) => {
            el.setSmooth(idx < 2 ? "w" : "h", 900, { duration: 0.7, delay: idx * 0.15 })
        })
    }

    _reset() {
        // reset tiles
        this._tiles = [
            'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'
        ];

        // force render
        this.render(this._tiles);

        // change back to rootstate
        this._setState("");
    }

    render(tiles: TileContent[]) {
        this._Markers.children = tiles.map((tileContent, idx) => {
            return {
                x: idx % 3 * 300 + 110,
                y: ~~(idx / 3) * 300 + 90,
                text: { text: tileContent === "e" ? '' : `${tileContent}`, fontSize: 100 },
            }
        });
    }

    override _handleUp() {
        let idx = this._index;
        if (idx - 3 >= 0) {
            this._setIndex(idx - 3);
        }
    }
    override _handleDown() {
        let idx = this._index;
        if (idx + 3 <= this._tiles.length - 1) {
            this._setIndex(idx + 3);
        }
    }
    override _handleLeft() {
        let idx = this._index;
        if (idx % 3) {
            this._setIndex(idx - 1);
        }
    }
    override _handleRight() {
        const newIndex = this._index + 1;
        if (newIndex % 3) {
            this._setIndex(newIndex);
        }
    }
    _setIndex(idx: number) {
        this._PlayerPosition.patch({
            smooth: {
                x: idx % 3 * 300 + 425,
                y: ~~(idx / 3) * 300 + 125
            }
        });
        this._index = idx;
    }
    override _handleEnter() {
        if (this._tiles[this._index] === "e") {
            if (this.place(this._index, "X")) {
                this._setState("Computer");
            }
        }
    }

    place(index: number, tileContent: TileContent) {
        this._tiles[index] = tileContent;
        this.render(this._tiles);

        const winner = GameUtils.getWinner(this._tiles);
        if (winner) {
            this._setState("End.Winner", [{ winner }]);
            return false;
        }

        return true;
    }

    static override _states() {
        return [
            class Computer extends this {
                override $enter() {
                    const position = GameUtils.AI(this._tiles);
                    if (position === -1) {
                        this._setState("End.Tie");
                        return false;
                    }

                    setTimeout(() => {
                        // @ts-ignore
                        if (this.place(position, "O")) {
                            this._setState("");
                        }
                    }, ~~(Math.random() * 1200) + 200);

                    this._PlayerPosition.setSmooth("alpha", 0);
                }

                // make sure we don't handle
                // any keypresses when the computer is playing
                override _captureKey(keyCode: any) { }

                override $exit() {
                    this._PlayerPosition.setSmooth("alpha", 1);
                }
            },
            class End extends this {
                override _handleEnter() {
                    this._reset();
                }
                override $exit() {
                    this.patch({
                        Game: {
                            smooth: { alpha: 1 }
                        },
                        Notification: {
                            text: { text: '' },
                            smooth: { alpha: 0 }
                        }
                    });
                }
                static override _states() {
                    return [
                        class Winner extends this {
                            override $enter(args: any, { winner }: { winner: TileContent }) {
                                if (winner === 'X') {
                                    this._playerScore += 1;
                                } else {
                                    this._aiScore += 1;
                                }
                                this.patch({
                                    Game: {
                                        smooth: { alpha: 0 },
                                        // @ts-expect-error some typing is missing here yet
                                        ScoreBoard: {
                                            Player: { text: { text: `Player ${this._playerScore}` } },
                                            Ai: { text: { text: `Computer ${this._aiScore}` } },
                                        }
                                    },
                                    Notification: {
                                        text: { text: `${winner === 'X' ? `Player` : `Computer`} wins (press enter to continue)` },
                                        smooth: { alpha: 1 }
                                    }
                                });
                            }
                        },
                        class Tie extends this {
                            override $enter() {
                                this.patch({
                                    Game: {
                                        smooth: { alpha: 0 }
                                    },
                                    Notification: {
                                        text: { text: `Tie :( (press enter to try again)` },
                                        smooth: { alpha: 1 }
                                    }
                                });
                            }
                        }
                    ]
                }
            }
        ]
    }


}