import View from 'famous/core/View';
import Surface from 'famous/core/Surface';
import Transform from 'famous/core/Transform';
import StateModifier from 'famous/modifiers/StateModifier';

import ImageSurface from 'famous/surfaces/ImageSurface';
import Transitionable from 'famous/transitions/Transitionable';
import SpringTransition from 'famous/transitions/SpringTransition';

Transitionable.registerMethod('spring', SpringTransition);


const defaultOptions = {
  size: [400, 450],
  filmBorder: 15,
  photoBorder: 3,
  angle: -0.5
};

export default class SlideView extends View {
  constructor(options) {
    super();

    Object.assign(this.options, defaultOptions, options);

    this.rootModifier = new StateModifier({
      align: [0.5, 0.0],
      origin: [0.5, 0.0],
      size: options.size
    });

    this.mainNode = this.add(this.rootModifier);

    makeBackground.call(this);
    makeFilm.call(this);
    makePhoto.call(this);
  }

  fadeIn() {
    this.photoModifier.setOpacity(1, { duration: 1500, curve: 'easeIn' });
    this.shake();
  }

  shake() {
    this.rootModifier.halt();

    // rotates the slide view back along the top edge
    this.rootModifier.setTransform(
      Transform.rotateX(this.options.angle),
      { duration: 200, curve: 'easeOut' }
    );

    // returns the slide back to 0 degress but using a spring transition
    this.rootModifier.setTransform(
      Transform.identity,
      { method: 'spring', period: 600, dampingRatio: 0.15 }
    );
  }

}

function makeBackground() {
  const background = new Surface({
    properties: {
      backgroundColor: '#FFFFF5',
      boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)',
      cursor: 'pointer'
    }
  });
  this.mainNode.add(background);

  background.on('click', () => {
    this._eventOutput.emit('click');
  });
}

function makeFilm() {
  const filmSize = this.options.size[0] - 2 * this.options.filmBorder;
  this.options.filmSize = filmSize;
  const film = new Surface({
    size: [filmSize, filmSize],
    properties: {
      backgroundColor: '#222',
      zIndex: 1,
      pointerEvents: 'none'
    }
  });
  const filmModifier = new StateModifier({
    origin: [0.5, 0],
    align: [0.5, 0],
    transform: Transform.translate(0, this.options.filmBorder, 1)
  });

  this.mainNode.add(filmModifier).add(film);
}

function makePhoto() {
  const photoSize = this.options.filmSize - 2 * this.options.photoBorder;

  const photo = new ImageSurface({
    size: [photoSize, photoSize],
    content: this.options.photoUrl,
    properties: {
      zIndex: 2,
      pointerEvents: 'none'
    }
  });

  this.photoModifier = new StateModifier({
    origin: [0.5, 0],
    align: [0.5, 0],
    transform: Transform.translate(0, this.options.filmBorder + this.options.photoBorder, 2),
    opacity: 0.01
  });

  this.mainNode.add(this.photoModifier).add(photo);
}
