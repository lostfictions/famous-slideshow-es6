import View from 'famous/core/View';
import Surface from 'famous/core/Surface';
import Transform from 'famous/core/Transform';
import StateModifier from 'famous/modifiers/StateModifier';

import ImageSurface from 'famous/surfaces/ImageSurface';

const defaultOptions = {
  size: [400, 450],
  filmBorder: 15,
  photoBorder: 3
};

export default class SlideView extends View {
  constructor(options) {
    super();

    Object.assign(this.options, defaultOptions, options);

    this.rootModifier = new StateModifier({
      size: options.size
    });

    this.mainNode = this.add(this.rootModifier);

    makeBackground.call(this);
    makeFilm.call(this);
    makePhoto.call(this);
  }
}

function makeBackground() {
  const background = new Surface({
    properties: {
      backgroundColor: '#FFFFF5',
      boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)'
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
    transform: Transform.translate(0, this.options.filmBorder + this.options.photoBorder, 2)
  });

  this.mainNode.add(this.photoModifier).add(photo);
}
