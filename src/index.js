import 'styles';

import Engine from 'famous/core/Engine';
import Modifier from 'famous/core/Modifier';
import Transform from 'famous/core/Transform';
import ImageSurface from 'famous/surfaces/ImageSurface';

import {loadURL} from 'famous/utilities/Utility';
import SlideData from 'data/SlideData';

import AppView from 'views/AppView';

const mainContext = Engine.createContext();

loadURL(SlideData.getUrl(), initApp);

function initApp(data) {
  const photoUrls = SlideData.parse(data);
  const appView = new AppView({ photoUrls: photoUrls });

  mainContext.add(appView);
}



