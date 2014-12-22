import Engine from 'famous/core/Engine';
import Modifier from 'famous/core/Modifier';
import Transform from 'famous/core/Transform';
import ImageSurface from 'famous/surfaces/ImageSurface';

import './styles';

const mainContext = Engine.createContext();

const logo = new ImageSurface({
  size: [200, 200],
  content: 'images/famous_logo.png',
  classes: ['backfaceVisibility']
});

const initialTime = Date.now();
const centerSpinModifier = new Modifier({
  align: [0.5, 0.5],
  origin: [0.5, 0.5],
  transform: function() {
    return Transform.rotateY(0.002 * (Date.now() - initialTime));
  }
});

mainContext.add(centerSpinModifier).add(logo);

