//
// App
//

import { ForceList } from './app/force-list';

class App {
    static init() {
        new ForceList();
        // new stopSearch('northumbria');

        return this;
    };
};

App.init();