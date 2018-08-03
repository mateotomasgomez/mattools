'use babel';
var _getAllFilesFromFolder = function(dir) {

    var filesystem = require("fs");
    var results = [];
    try{
      filesystem.readdirSync(dir).forEach(function(file) {
        try{

          file = dir+'/'+file;
          var stat = filesystem.statSync(file);

          /*if (stat && stat.isDirectory()) {
              results = results.concat(_getAllFilesFromFolder(file))
          } else */results.push(file);
        }catch(e){console.log(e)}

      });

    }catch(e){console.log(e)}


    return results;

};

export default class MattoolsView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('mattools');

    // Create message element
    const message = document.createElement('div');
    message.classList.add('message');
    this.element.appendChild(message);



        var fs = require('fs');
        var paths = atom.project.getPaths();
        var trees = {};
        for(var k in paths){
          var tree = _getAllFilesFromFolder(paths[k] );;
          trees["project " + k] = {};
          trees["project " + k].path = paths[k];
          trees["project " + k].sh = [];

          for(var file_k in tree){
            if(!tree[file_k].includes("node_modules")){
              /*if(tree[file_k].includes("package.json") && !trees["project " + k].package){
                var json = fs.readFileSync(tree[file_k], 'utf8');
                json = JSON.parse(json);

                trees["project " + k].package = json;
              }
              else */if (tree[file_k].includes(".sh")){
                trees["project " + k].sh.push(tree[file_k]);

              }
            }
          }

          trees["project " + k].tree = tree;
          try{
            var json = fs.readFileSync(trees["project " + k].path + "/package.json", 'utf8');
            json = JSON.parse(json);

            trees["project " + k].package = json;

          }
          catch(e){console.log(e)
            trees["project " + k].package = {};
            trees["project " + k].package.name = "undefined";
            trees["project " + k].package.version = "0";
            trees["project " + k].package.description = "";


          }


        }




        for (var kk in trees){
          var project = trees[kk];
          var project_html = document.createElement('div');
          project_html.classList.add('project-element');
          project_html.innerHTML = `
            <h1>${project.package.name} v${project.package.version}</h1>
            <small>${project.path}</small>
            <small>${project.package.description}</small>
          `;
          var toolbar = document.createElement('div');
          toolbar.classList.add('toolbar-element');
          project_html.append(toolbar);

          if (project.package.openUrl){
            var button = document.createElement('button');
            button.innerHTML = '<span class="icon icon-arrow-right"></span>';
            button.className = 'btn';
            toolbar.append(button);
            button.url = project.package.openUrl;
            button.onclick = function(){

              var url = this.url;
              var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
              require('child_process').exec(start + ' ' + url);

            };

          }

          var button = document.createElement('button');
          button.innerHTML = '<span class="icon icon-terminal"></span>';
          button.className = 'btn';

          toolbar.append(button);
          button.path = project.path;
          button.onclick = function(){
            var child_process = require('child_process');
            child_process.exec("gnome-terminal -x sh -c 'cd "+this.path+";exec bash'");

          };




          for (var sh_k in project.sh){
            var button =
          document.createElement('button');
          button.className = 'btn';
          button.aux = project.sh[sh_k];
          var name = project.sh[sh_k].substring(project.sh[sh_k].lastIndexOf(project.path)+project.path.length+1,  999999999);

          button.innerHTML = name;
          if (!name.includes("/")){
            project_html.append(button);
             button.direc = button.aux.substring(0, button.aux.lastIndexOf('/'));
             button.file = button.aux.substring(button.aux.lastIndexOf('/'), 999999999);
            button.onclick = function(){

                 var child_process = require('child_process');
                 child_process.exec("gnome-terminal -x sh -c 'cd "+this.direc+";exec bash -i -c ."+this.file+"'");

              };
          }

          }


          message.append(project_html);


        }
        console.log(trees)






    /*this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
      if (!atom.workspace.isTextEditor(item)) {
        message.innerText = 'Open a file to see important information about it.';
        return;
      }
      console.log(item)
      message.innerHTML = `
      <h1>MatTools</h1>
      <button class="btn" onclick="alert('test');">Start</button>
      <button class="btn">Stop</button>

        <h2>${item.getFileName() || 'untitled'}</h2>
        <ul>

        <li><b>getSelectedText:</b> ${item.getSelectedText()}</li>
        <li><b>getDirectoryPath:</b> ${item.getDirectoryPath()}</li>
        <li><b>Soft Wrap:</b> ${item.softWrapped}</li>
          <li><b>Tab Length:</b> ${item.getTabLength()}</li>
          <li><b>Encoding:</b> ${item.getEncoding()}</li>
          <li><b>Line Count:</b> ${item.getLineCount()}</li>
        </ul>
      `;
    });
*/



  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }



  getTitle() {
    // Used by Atom for tab text
    return 'MatTools';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://mattools';
  }
  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'right';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['left', 'right', 'bottom'];
  }
}
