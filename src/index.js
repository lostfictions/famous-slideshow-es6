import 'styles';

import Engine from 'famous/core/Engine';

import {loadURL} from 'famous/utilities/Utility';
import SlideData from 'data/SlideData';

import AppView from 'views/AppView';

const mainContext = Engine.createContext();

// mainContext.setPerspective(1000);

loadURL(SlideData.getUrl(), initApp);

function initApp(data) {
  const photoUrls = SlideData.parse(data);
  const appView = new AppView({ photoUrls: photoUrls });

  mainContext.add(appView);
}
