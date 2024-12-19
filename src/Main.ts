import { Lightning } from '@lightningjs/sdk'
import Menu from "./menu/Menu";


interface MainTemplateSpec extends Lightning.Component.TemplateSpec {
  Menu: typeof Menu
}
export default class Main extends Lightning.Component<MainTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<MainTemplateSpec> {

  protected readonly _Menu = this.getByRef('Menu')!

  static override _template(): Lightning.Component.Template<MainTemplateSpec> {
    return {
      Menu: {
        x: 600,
        y: 400,
        type: Menu,
        items: [
          { label: 'START NEW GAME', action: 'start' },
          { label: 'CONTINUE', action: 'continue' },
          { label: 'ABOUT', action: 'about' },
          { label: 'EXIT', action: 'exit' }
        ] satisfies MenuItemData[]
      }
    }
  }

  override _handleEnter() {
    this.signal("select", { item: this._Menu.activeItem });
  }
}

export type MenuItemData = {
  label: string;
  action: string;
}