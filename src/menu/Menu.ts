import { Lightning } from '@lightningjs/sdk'
import Item from './Item';
import { MenuItemData } from '../Main';

interface MenuTemplateSpec extends Lightning.Component.TemplateSpec {
  items: MenuItemData[],
  Items: {
    type: object
  },
  FocusIndicator: {
    type: object
  }
}
export default class Menu extends Lightning.Component<MenuTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<MenuTemplateSpec> {

  private _activeItemIdx: number = 0;
  private _Items = this.getByRef('Items')!;
  private _FocusIndicator = this.getByRef('FocusIndicator')!;
  private _blink: Lightning.types.Animation | undefined;

  static override _template(): Lightning.Component.Template<MenuTemplateSpec> {
    return {
      // we define a empty holder for our items of
      // position it 40px relative to the component position
      // so we have some space for our focus indicator
      Items: {
        x: 40
      },
      // Create a text component that indicates which item has focus
      FocusIndicator: {
        y: 5,
        text: { text: '>', fontFace: 'regular' }
      }
    }
  }

  // TODO: make these handlers work!
  override _handleUp() {
    console.log("handleup")
    this._setItemActive(Math.max(0, --this._activeItemIdx));
  }

  override _handleDown() {
    console.log("handledown")
    this._setItemActive(Math.min(++this._activeItemIdx, this.items.length - 1));
  }

  get activeItem() {
    return this.items[this._activeItemIdx];
  }

  _setItemActive(idx: number) {
    // since it's a one time transition we use smooth
    this._FocusIndicator.setSmooth("y", idx * 90 + 5);

    // store new index
    this._activeItemIdx = idx;
  }

  get items() {
    return this._Items.children;
  }

  set items(v: any[]) {
    this._Items.children = v.map((item, idx) => {
      return { type: Item, action: item.action, label: item.label, y: idx * 90 }
    })
  }

  override _init() {
    // create a blinking animation
    this._blink = this._FocusIndicator.animation({
      duration: 0.5, repeat: -1, actions: [
        { p: 'x', v: { 0: 0, 0.5: -40, 1: 0 } }
      ]
    });

    // current focused menu index
    this._activeItemIdx = 0;
  }

  override _active() {
    this._blink!.start();
  }

  override _inactive() {
    this._blink!.stop();
  }
}