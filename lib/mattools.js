'use babel';

import MattoolsView from './mattools-view';
import { CompositeDisposable,Disposable } from 'atom';
export default {

  mattoolsView: null,
  modalPanel: null,
  subscriptions: null,
  store: null,
  unsubscribe: null,
  node: null,
  tile: "sdsasdf",

  activate(state) {
    /*this.mattoolsView = new MattoolsView(state.mattoolsViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.mattoolsView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
*/
    // Register command that toggles this view
    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'mattools:toggle': () => this.toggle()
    // }));


    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://mattools') {
          return new MattoolsView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'mattools:toggle': () => this.toggle()
      }),

      // Destroy any MattoolsViews when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof MattoolsView) {
            item.destroy();
          }
        });
      })
    );






  },

  deactivate() {
  //  this.modalPanel.destroy();
    this.subscriptions.dispose();
    //this.mattoolsView.destroy();
  },

  // serialize() {
  //   return {
  //     mattoolsViewState: this.mattoolsView.serialize()
  //   };
  // },
  getTitle() {
    // Used by Atom for tab text
    return 'Active Editor Info';
  },

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://mattools';
  },
  toggle() {
    // var child_process = require('child_process');
    // child_process.execSync("gnome-terminal -x sh -c 'cd ;");

    console.log('Mattools was toggled!');
        atom.workspace.toggle('atom://mattools');
    /*return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );*/
  },
  dispose() {
    this.unsubscribe();

    if (this.tile) {
      this.tile.destroy();
      this.tile = null;
    }

  },

  consumeStatusBar(statusBar) {
    const item = document.createElement('div');
    item.className = 'inline-block';
    item.innerHTML = '<a class="inline-block">MATTOOLS</button>';
    item.onclick = function(){
      atom.workspace.toggle('atom://mattools');
    };
    this.tile = statusBar.addRightTile({
      item,
      priority: 1000,
    });
  }

};
