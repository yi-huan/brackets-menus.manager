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
    preferences = PreferencesManager.getExtensionPrefs("disable.Menus"),
    COMMAND_ID = "disable.menus",
    commandName = 'Disable Menus',
    viewmenu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);

  brackets.getModule("utils/ExtensionUtils").loadStyleSheet(module, "./style.css");

  function addCommandMenu(name, id, fn, pos, rel) {
    CommandManager.register(name, id, fn);
    viewmenu.addMenuItem(id, "", pos, rel);
  }

  function getMenuItem(menu, item) {
    return Menus.getMenuItem(menu + "-" + item);
  }

  function li(str) {
    var tstr = Strings[str.toUpperCase().replace(/-/gi, "_")],
      strhtml = (tstr || str);
    return '<li><a class="btn" data-toggle="pill" href="#' + str + '">' + strhtml + '</a></li>';
  }

  function table(str) {
    return '<div id="' + str + '" class="tab-pane fade"><table width="100%">';
  }

  function item(str, menu) {
    var key = KeyBindingManager.getKeyBindings(str),
      tdm = '<td data-menu="'+menu+'" data-commandid="' + str.getID() + '" class="disable-menu">&emsp;&emsp;<input type="checkbox">&ensp;<span>' + str.getName() + '</span></td>',
      tdk = '<td data-relativemenu="' + menu+'-'+str.getID() + '" ' + ((key.length > 0) ? 'data-disablekey="' + key[0].key + '"' : '') + ' class="' + ((key.length > 0) ? "disable-keybinding" : "") + '">' + ((key.length > 0) ? '&emsp;&emsp;<input type="checkbox">&ensp;<span>' + key[0].key + '</span>' : "") + '</td>';
    return "<tr>" + tdm + tdk + "</tr>";
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function storedisabledata(elems, objects) {
    var pga = preferences.get("all"),
      sti;
    if (pga) {
      for (sti = 0; sti < elems.length; sti += 1) {
        //console.log(elems[sti]);
        console.log(pga[sti]);
        /*if ("disable-menu" === elems[sti].getAttribute("class")) {
          elems[sti].getElementsByTagName("input")[0].checked = pga[elems[sti].getAttribute("data-commandid")];
        }
        if ("disable-keybinding" === elems[sti].getAttribute("class")) {
          elems[sti].getElementsByTagName("input")[0].checked = pga[elems[sti].getAttribute("data-disablekey")];
        }*/
      }
    }
    //console.dir(objects);
  }

  function showed() {
    var settingsDialogTemplate = require('text!./menus.html'),
      compiledTemplate = Mustache.render(settingsDialogTemplate, Strings),
      dialog = Dialogs.showModalDialogUsingTemplate(compiledTemplate, true);
    var allgets = {},
      allMenus = Menus.getAllMenus(),
      allCommands = CommandManager.getAll(),
      ify,
      cif,
      contentul = "",
      contenttable = "";
    for (ify in allMenus) {
      if (allMenus.hasOwnProperty(ify)) {
        contentul += li(Menus.getMenu(ify).id);
        var ifc;
        contenttable += table(Menus.getMenu(ify).id);
        for (ifc = 0; ifc < allCommands.length; ifc += 1) {
          var items = CommandManager.get(allCommands[ifc]);
          if (null !== items.getName()) {
            if ("undefined" !== typeof getMenuItem(ify, items.getID())) {
              contenttable += item(getMenuItem(ify, items.getID()).getCommand(), ify);
            }
          }
        }
        contenttable += '</table></div>';
      }
    }
    var context = $("#context-menu-bar ul .dropdown.context-menu"),
      editorcontextual = "",
      editortable = "";
    for (cif = 0; cif < context.length; cif += 1) {
      editorcontextual += '<li><a class="btn" data-toggle="pill" href="#' + context[cif].id.replace(/-/gi, "") + '">' + capitalizeFirstLetter(context[cif].id).replace(/context |menu |context|menu/gi, "").replace(/-/gi, " ") + '</a></li>';
      var icm,
        iitem = context[cif].getElementsByTagName("li");
      editortable += table(context[cif].id.replace(/-/gi, ""));
      for (icm = 0; icm < iitem.length; icm += 1) {
        if (iitem[icm].getElementsByTagName("a").length > 0) {
          editortable += item(Menus.getMenuItem(iitem[icm].getElementsByTagName("a")[0].id).getCommand(), context[cif].id);
        }
      }
      editortable += '</table></div>';
    }
    var editortabs = '<div id="contextual" class="tab-pane fade"><ul class="nav nav-pills nav-justified">' + editorcontextual + '</ul><div class="tab-content">' + editortable + '</div></div>';
    var contextual = '<li style="float:right;"><a class="btn" data-toggle="pill" href="#contextual">Contextual</a></li>';
    dialog.getElement().find(".modal-header").html('<ul class="nav nav-pills nav-justified">' + contentul + contextual + '</ul>');
    dialog.getElement().find(".modal-body").html('<div class="tab-content">' + contenttable + editortabs + '</div>');
    window.setTimeout(function () {
      dialog.getElement().find(".nav-pills li").first().addClass("active");
      dialog.getElement().find(".tab-content .tab-pane").first().addClass("in active");

      dialog.getElement().find("#contextual .nav-pills li").last().addClass("active");
      dialog.getElement().find("#contextual .tab-content .tab-pane").last().addClass("in active");

      storedisabledata(dialog.getElement().find(".modal-body table tr td"));
    }, 2);
    //prefsStore(dialog.getElement());
    dialog.done(function (i) {
      //console.log(i);
      if ("cancel" === i || "dontsave" === i) {
        return;
      } else if ("ok" === i) {
        //CommandManager.get(str.getID())
        var tdinput = dialog.getElement().find(".modal-body table tr td"),
          tdi;
        for (tdi = 0; tdi < tdinput.length; tdi += 1) {
          if ("disable-menu" === tdinput[tdi].getAttribute("class")) {
            allgets[tdinput[tdi].getAttribute("data-commandid")] = tdinput[tdi].getElementsByTagName("input")[0].checked;
          }
          if ("disable-keybinding" === tdinput[tdi].getAttribute("class")) {
            //console.log(tdinput[tdi].getAttribute("data-relativecommandid"), , );
            allgets[tdinput[tdi].getAttribute("data-disablekey")] = tdinput[tdi].getElementsByTagName("input")[0].checked;
          }
        }
        //console.log(dialog.getElement().find("td").data("commandid"));
        //console.log(dialog.getElement().find("td").data("commandkey"));
        preferences.set("all", allgets);
        preferences.save();
      }
    });
  }
  addCommandMenu(commandName, COMMAND_ID, showed, Menus.BEFORE, Commands.CMD_SPLITVIEW_NONE);
  AppInit.extensionsLoaded(function(){
    var pga = preferences.get("all"),
        rci;
    if(pga){
      for(rci in pga){
        if(pga.hasOwnProperty(rci)){
          //console.log(KeyBindingManager._getDisplayKey(rci));
          /*if(KeyBindingManager.getKeyBindings(rci).length>0){
            if(pga[KeyBindingManager.getKeyBindings(rci)[0].key]){
              KeyBindingManager.removeBinding(KeyBindingManager.getKeyBindings(rci)[0].key);
            }
          }
          if(CommandManager.get(rci)){
            if(pga[CommandManager.get(rci).getID()]){
              //console.log(CommandManager.get(rci).getID());
              //console.log(Menus);
              //Menus.removeMenuItem(CommandManager.get(rci));
            }
          }*/
        }
      }
      //console.log(getMenuItem("file-menu", "file.openFolder"));
    }
  });
});
