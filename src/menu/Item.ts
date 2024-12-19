import { Lightning } from '@lightningjs/sdk'


interface ItemTemplateSpec extends Lightning.Component.TemplateSpec {
}
export default class Item extends Lightning.Component<ItemTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<ItemTemplateSpec> {

  private _action: string | undefined;

  static override _template(): Lightning.Component.Template<ItemTemplateSpec> {
    return {
      text: { text: '', fontFace: 'regular', fontSize: 50 }
    }
  }

  // will be automatically called
  set label(v: string) {
    //  @ts-ignore fix me
    this.text.text = v;
  }

  // will be automatically called
  set action(v: string) {
    //  @ts-ignore fix me
    this._action = v;
  }

  // will be automatically called
  get action(): string | undefined {
    return this._action;
  }
}
