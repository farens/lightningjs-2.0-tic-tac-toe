import { Lightning } from '@lightningjs/sdk'

interface SplashTemplateSpec extends Lightning.Component.TemplateSpec {
  Logo: {
    type: object
  }
}
interface SplashTypeConfig extends Lightning.Component.TypeConfig {
  SignalMapType: SplashSignalMap
}
interface SplashSignalMap extends Lightning.Component.SignalMap {
  loaded(): void
}
export default class Splash
  extends Lightning.Component<SplashTemplateSpec, SplashTypeConfig>
  implements Lightning.Component.ImplementTemplateSpec<SplashTemplateSpec> {

  private _Logo = this.getByRef('Logo')!
  private _pulse?: Lightning.types.Animation

  static override _template(): Lightning.Component.Template<SplashTemplateSpec> {
    return {
      Logo: {
        x: 960,
        y: 540,
        mount: 0.5,
        text: {
          text: 'Loading...',
          fontFace: 'regular',
          fontSize: 64,
          textColor: 0xbbffffff,
        },
      },
    }
  }

  override _init() {
    // create animation and store a reference, so we can start / stop / pause
    // in the fututre
    this._pulse = this._Logo.animation({
      duration: 4,
      repeat: 0,
      actions: [{ p: 'alpha', v: { 0: 0, 0.5: 0.5, 1: 1 } }],
    })

    // add a finish eventlistener, so we can send a signal
    // to the parent when the animation is completed
    this._pulse?.on('finish', () => {
      this.signal('loaded')
    })

    // start the animation
    this._pulse?.start()
  }

  override _active(): void {
    this._pulse?.start()
  }
}
