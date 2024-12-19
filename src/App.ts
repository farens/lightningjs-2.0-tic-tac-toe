import { Lightning, Utils } from '@lightningjs/sdk'
import Splash from './Splash'
import Main, { MenuItemData } from './Main'
import Game from './Game'

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
  Logo: object
  Splash: typeof Splash
  Main: typeof Main
  Game: typeof Game
}
export default class App
  extends Lightning.Component<AppTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<AppTemplateSpec> {

  protected readonly _Splash = this.getByRef('Splash')!
  protected readonly _Main = this.getByRef('Main')!
  protected readonly _Game = this.getByRef('Game')!

  static override _template(): Lightning.Component.Template<AppTemplateSpec> {
    return {
      Logo: {
        x: 100,
        y: 100,
        text: { text: 'TicTacToe', fontFace: 'regular' },
      },
      rect: true,
      color: 0xff000000,
      w: 1920,
      h: 1080,
      Splash: {
        type: Splash,
        signals: {
          loaded: true,
        },
        alpha: 0,
      },
      Main: {
        type: Main,
        alpha: 0,
        signals: { select: 'menuSelect' },
      },
      Game: {
        type: Game,
        alpha: 0,
      },
    }
  }

  static getFonts() {
    return [
      {
        family: 'regular',
        url: Utils.asset('fonts/Roboto-Regular.ttf'),
        descriptor: {},
      },
    ]
  }

  override _setup() {
    this._setState('Splash')
  }

  static override _states(): Lightning.Component.Constructor[] {
    return [
      class Splash extends this {
        override $enter() {
          this._Splash.setSmooth('alpha', 1)
        }
        override $exit() {
          this._Splash.setSmooth('alpha', 0)
        }
        // signaled by Splash component.
        // This is the receiving side which cannot be written type safe!
        loaded() {
          this._setState('Main')
        }
      },
      class Main extends this {
        override $enter() {
          this._Main.patch({
            smooth: { alpha: 1, y: 0 },
          })
        }
        override $exit() {
          this._Main.patch({
            smooth: { alpha: 0, y: 100 },
          })
        }
        // signaled by Main component.
        // This is the receiving side which cannot be written type safe!
        menuSelect({ item }: { item: MenuItemData }) {
          const action = item.action;
          // @ts-expect-error looks like typing is missing. The function exists in: lightning/src/application/StateMachine.mjs
          if (this._hasMethod(action)) {
            // @ts-expect-error
            return this[action]();
          }
        }

        start() {
          this._setState("Game")
        }

        continue() {
          console.log("not implemented yet")
        }

        about() {
          console.log("not implemented yet")
        }

        exit() {
          console.log("not implemented yet")
        }

        // change focus path to main
        // component which handles the remotecontrol
        override _getFocused() {
          return this._Main
        }
      },
      class Game extends this {
        override $enter() {
          this._Game.setSmooth('alpha', 1)
        }

        override $exit() {
          this._Game.setSmooth('alpha', 0)
        }

        override _getFocused() {
          return this._Game
        }
      },
    ]
  }
}
