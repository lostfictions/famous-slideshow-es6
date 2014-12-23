import View from 'famous/core/View';
import Surface from 'famous/core/Surface';
import Transform from 'famous/core/Transform';
import StateModifier from 'famous/modifiers/StateModifier';

import SlideshowView from 'views/SlideshowView';

export default class AppView extends View {
  constructor(options) {
    super();

    this.add(new SlideshowView(options));
  }
}
