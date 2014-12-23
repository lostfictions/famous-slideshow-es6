import View from 'famous/core/View';
import Surface from 'famous/core/Surface';
import Transform from 'famous/core/Transform';
import StateModifier from 'famous/modifiers/StateModifier';

import Lightbox from 'famous/views/Lightbox';

import SlideView from 'views/SlideView';

const defaultOptions = {
  size: [450, 500],
  lightboxOpts: {}
};

export default class SlideshowView extends View {
  constructor(options) {
    super();

    this.options = Object.assign({}, defaultOptions, options);

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
    this.lightbox.show(this.slides[this.currentIndex]);
  }

  showNextSlide() {
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

    slide.on('click', this.showNextSlide.bind(this));

    return slide;
  });

  // console.dir(this.slid es);

  this.showCurrentSlide();
}
