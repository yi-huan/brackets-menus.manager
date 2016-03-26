/*jslint vars : true*/
/*globals define, brackets, console, alert, Mustache, $*/
define(function (require, exports, module) {
  "use strict";
  var AppInit = brackets.getModule("utils/AppInit"),
    Dialogs = brackets.getModule("widgets/Dialogs"),
    Strings = brackets.getModule("strings"),
    StringUtils = brackets.getModule("utils/StringUtils"),
    Menus = brackets.getModule("command/Menus"),
    CommandManager = brackets.getModule("command/CommandManager"),
    KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
    Commands = brackets.getModule("command/Commands"),
    PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
    COMMAND_ID = "cw.disable.menus",
    commandName = 'Disable Menus',
    viewmenu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU),
    settingsDialogTemplate = require('text!./menus.html');

  brackets.getModule("utils/ExtensionUtils").loadStyleSheet(module, "./style.css");


  function getMenuItem(menu, item) {
    return Menus.getMenuItem(menu + "-" + item);
  }
  function getContextMenuItem(menu, item) {
    return Menus.getMenuItem(menu + "-" + item);
  }
  function li(str){
    var tstr = Strings[str.toUpperCase().replace(/-/gi, "_")];
    var lia = $(document.createElement("a"))
        .data("toggle", "tab")
        .attr("href", "#"+str)
        .click(function(){
          alert("change pane!");
        })
        .text(tstr || str);
    return $(document.createElement("li"))
           .html(lia);
  }
  function table(str){
    var la = $(document.createElement("div"))
            .attr("id", str)
            .addClass("tab-pane fade");
    return la.html($(document.createElement("table")).css("width", "100%"));
  }
  function item(str){
    var key = KeyBindingManager.getKeyBindings(str),
        tdm = $(document.createElement("td"))
             .append('&emsp;&emsp;<input type="checkbox" checked>&ensp;<span>'+str.getName()+'</span>'),
        tdk = $(document.createElement("td"))
             .append((key.length>0)?'&emsp;&emsp;<input type="checkbox" checked>&ensp;<span>'+key[0].key+'</span>':"")
             .addClass((key.length>0)?"disable-keybinding":""),
        tr = $(document.createElement("tr"))
             .append(tdm)
             .append(tdk);
    return tr;
  }
  function showed() {
    var compiledTemplate = Mustache.render(settingsDialogTemplate, Strings),
      dialog = Dialogs.showModalDialogUsingTemplate(compiledTemplate, true),
      allMenus = Menus.getAllMenus(),
      allCommands = CommandManager.getAll(),
      ify;
    //console.log(KeyBindingManager.getKeymap());
    for (ify in allMenus) {
      if (allMenus.hasOwnProperty(ify)) {
        //console.log(allCommands.sort());
        //console.log("%c" + Menus.getMenu(ify).id, "background : green;");
        dialog.getElement().find(".nav-tabs").append(li(Menus.getMenu(ify).id));
        var ifc;
        //icf;
        dialog.getElement().find(".tab-content").append(table(Menus.getMenu(ify).id));
        for (ifc = 0; ifc < allCommands.length; ifc += 1) {
          var items = CommandManager.get(allCommands[ifc]);
          if (null !== items.getName()) {
            if ("undefined" !== typeof getMenuItem(ify, items.getID())) {
              //console.log(getMenuItem(ify, items.getID()).getCommand().getName());
              dialog.getElement().find(".tab-content #"+ify+" table").append(item(getMenuItem(ify, items.getID()).getCommand()));
              //<div id="home" class="tab-pane fade in active">
              //<div id="menu1" class="tab-pane fade">
            }
            //if("undefined" !== typeof getContextMenuItem(ify, items.getID())){
            //  console.log(getContextMenuItem(ify, items.getID()).getCommand().getName());
            //}
          }
        }
        //for(icf = 0; icf < allCommands.length; icf += 1){

        //}
      }
    }
    dialog.getElement().find(".nav-tabs li").first().addClass("active");
    dialog.getElement().find(".tab-content .tab-pane").first().addClass("in active");
    //prefsStore(dialog.getElement());
    dialog.done(function (i) {
      if ("cancel" === i || "dontsave" === i) {
        return;
      } else if ("ok" === i) {
        //setPref(dialog.getElement());
        return;
      }
    });
  }

  function addCommandMenu(name, id, fn, pos, rel) {
    CommandManager.register(name, id, fn);
    viewmenu.addMenuItem(id, "", pos, rel);
  }
  addCommandMenu(commandName, COMMAND_ID, showed, Menus.BEFORE, Commands.CMD_SPLITVIEW_NONE);
  /*AppInit.appReady(function(){
    //console.log(Menus.AppMenuBar);
    //console.log(Menus.ContextMenuIds);
    //console.log(Menus.getContextMenu("editor-context-menu"));
    //console.log(Menus.getMenuItem("editor-context-menu" + "-" + "get_dimensions"));
    //console.log(Menus.getMenuItem("editor-context-menu" + "-" + "get_dimensions").getCommand().getName());
    // > console.log(Menus.getMenuItem(Menus.AppMenuBar.VIEW_MENU + "-" + Commands.TOGGLE_LINE_NUMBERS));
    //console.log(getMenuItem("file-menu", "insya.newhtml5"));
    //console.log(CommandManager.get("insya.newhtml5"));
    window.setTimeout(function(){
      var allMenus = Menus.getAllMenus(),
          allCommands = CommandManager.getAll(),
          ify;
      for(ify in allMenus){
        if(allMenus.hasOwnProperty(ify)){
          //console.log(allCommands.sort());
        console.log("%c" + Menus.getMenu(ify).id, "background : green;");
          //<li class="active"><a data-toggle="tab" href="#home">Home</a></li>
          var ifc;
              //icf;
          for(ifc = 0; ifc < allCommands.length; ifc += 1){
          var items = CommandManager.get(allCommands[ifc]);
            if(null !== items.getName()){
              if("undefined" !== typeof getMenuItem(ify, items.getID())){
                console.log(getMenuItem(ify, items.getID()).getCommand().getName());
              }
              //if("undefined" !== typeof getContextMenuItem(ify, items.getID())){
              //  console.log(getContextMenuItem(ify, items.getID()).getCommand().getName());
              //}
            }
          }
          //for(icf = 0; icf < allCommands.length; icf += 1){
            
          //}
        }
      }
      //console.log(Menus.getMenu("insya-tools").removeMenuItem("string_remove_empty_lines"));
      //console.log(Menus.getMenu("insya-tools")._getMenuItemForCommand(CommandManager.get("string_remove_empty_lines")));
      //!console.log(Menus.getMenu("insya-tools")._getMenuItemId("string_remove_empty_lines"));
      //console.dir(Menus.getMenu("insya-tools")._getRelativeMenuItem("string_trim", Menus.BEFORE));
      //console.dir(Menus.getMenu("insya-tools")._getRelativeMenuItem("string_trim", Menus.FIRST));
      //console.dir(Menus.getMenu("insya-tools")._getRelativeMenuItem("string_trim", Menus.FIRST_IN_SECTION));
    }, 1500);
    // > console.log(CommandManager.get(Commands.TOGGLE_LINE_NUMBERS));
    //console.log(brackets.test.PreferencesManager.getAllPreferences());
  });*/
});
