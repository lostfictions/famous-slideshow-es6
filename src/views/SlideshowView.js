import View from 'famous/core/View';
import Transform from 'famous/core/Transform';
import StateModifier from 'famous/modifiers/StateModifier';
import Easing from 'famous/transitions/Easing';

import Lightbox from 'famous/views/Lightbox';

import SlideView from 'views/SlideView';

const defaultOptions = {
  photoUrls: [],
  size: [450, 500],
  lightboxOpts: {
    inOpacity: 1,
    outOpacity: 0,
    inTransform: Transform.thenMove(Transform.rotateX(0.9), [0, -300, -300]),
    outTransform: Transform.thenMove(Transform.rotateZ(0.7), [0, window.innerHeight, -1000]),
    inTransition: { duration: 650, curve: 'easeOut' },
    outTransition: { duration: 500, curve: Easing.inCubic }
  }
};

export default class SlideshowView extends View {
  constructor(options) {
    super();

    Object.assign(this.options, defaultOptions, options);

    this.rootModifier = new StateModifier({
      size: this.options.size,
      origin: [0.5, 0],
      align: [0.5, 0]
    });

    this.mainNode = this.add(this.rootModifier);

    makeLightbox.call(this);
    makeSlides.call(this);
  }

  showCurrentSlide() {
    this.ready = false;

    const slide = this.slides[this.currentIndex];
    this.lightbox.show(slide, () => {
      slide.fadeIn();
      this.ready = true;
    });
  }

  showNextSlide() {
    if(!this.ready) {
      return;
    }

    this.currentIndex++;
    if(this.currentIndex === this.slides.length) {
      this.currentIndex = 0;
    }
    this.showCurrentSlide();
  }
}

function makeLightbox() {
  this.lightbox = new Lightbox(this.options.lightboxOpts);
  this.mainNode.add(this.lightbox);
}

function makeSlides() {
  this.currentIndex = 0;

  this.slides = this.options.photoUrls.map(photoUrl => {
    const slide = new SlideView({
      size: this.options.size,
      photoUrl: photoUrl
    });

    slide.on('click', () => { this.showNextSlide(); });

    return slide;
  });

  this.showCurrentSlide();
}
