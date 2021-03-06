import View from 'famous/core/View';
import Transform from 'famous/core/Transform';
import StateModifier from 'famous/modifiers/StateModifier';

import ImageSurface from 'famous/surfaces/ImageSurface';
import ContainerSurface from 'famous/surfaces/ContainerSurface';

import SlideshowView from 'views/SlideshowView';

const defaultOptions = {
  photoUrls: [],
  cameraWidth: 0.5 * window.innerHeight
};

defaultOptions.slideWidth = 0.8 * defaultOptions.cameraWidth;
defaultOptions.slideHeight = defaultOptions.slideWidth + 40;
defaultOptions.slidePosition = 0.77 * defaultOptions.cameraWidth;

export default class AppView extends View {
  constructor(options) {
    super();

    Object.assign(this.options, defaultOptions, options);

    makeSlideshow.call(this);

    makeCamera.call(this);
  }
}

function makeSlideshow() {

  const slideshowView = new SlideshowView({
    size: [this.options.slideWidth, this.options.slideHeight],
    photoUrls: this.options.photoUrls
  });

  const slideshowModifier = new StateModifier({
    origin: [0.5, 0],
    align: [0.5, 0],
    transform: Transform.translate(0, this.options.slidePosition, 0)
  });

  const slideshowContainer = new ContainerSurface({
    properties: {
      overflow: 'hidden'
    }
  });

  this.add(slideshowModifier).add(slideshowContainer);
  slideshowContainer.add(slideshowView);
  slideshowContainer.context.setPerspective(1000);
}

function makeCamera() {
  const cameraImage = new ImageSurface({
    size: [this.options.cameraWidth, true],
    content: 'img/camera.png',
    properties: {
      width: '100%',
      zIndex: -1
    }
  });

  const cameraModifier = new StateModifier({
    origin: [0.5, 0],
    align: [0.5, 0],
    transform: Transform.behind
  });

  this.add(cameraModifier).add(cameraImage);
}
