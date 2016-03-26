/*jslint vars : true*/
/*globals define, brackets, console, Mustache, $, window*/
define(function (require, exports, module) {
  "use strict";
  var AppInit = brackets.getModule("utils/AppInit"),
    Strings = brackets.getModule("strings"),
    Menus = brackets.getModule("command/Menus"),
    KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
    PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
    preferences = PreferencesManager.getExtensionPrefs("menusManager.store"),
    CommandManager = brackets.getModule("command/CommandManager"),
    Commands = brackets.getModule("command/Commands");

  brackets.getModule("utils/ExtensionUtils").loadStyleSheet(module, "./cap.css");

  function addCommandMenu(name, id, fn, pos, rel) {
    CommandManager.register(name, id, fn);
    Menus.getMenu(Menus.AppMenuBar.VIEW_MENU).addMenuItem(id, "", pos, rel);
  }

  function getMenuItem(menu, item) {
    return Menus.getMenuItem(menu + "-" + item);
  }
  function onlyLetters(str){
    //console.log('123abcABC-_*(!@#$%^&*()_-={}[]:\"<>,.?/~`'.replace(/[^A-Za-z]/g, ''));
    return str.replace(/[^A-Za-z]/g, "")+"xMANAGER";
  }
  function li(id, boo) {
    var tstr = Strings[id.toUpperCase().replace(/-/gi, "_")],
      strhtml = (tstr || ((boo)?id.replace(/ context| menu|context|menu/gi, "").replace(/-/gi, " "):id));
    return '<li><a class="btn" data-toggle="pill" href="#' + onlyLetters(id) + '">' + strhtml + '</a></li>';
  }

  function table(id) {
    return '<div id="' + onlyLetters(id) + '" class="tab-pane fade"><table width="100%">';
  }

  function item(id, fullid, name, key) {
    var tdm = '<td data-commandid="'+id+'" data-commandfullid="'+fullid+'" class="menusmanager-menu">&emsp;&emsp;<input type="checkbox">&ensp;<span>'+name+'</span></td>',
      //tdk = '<td data-menu="'+id+'" data-menuid="'+fullid+'" class="menusmanager-key" data-disablekey="'+((key)?key:"")+'" >'+((key)?'&emsp;&emsp;<input type="checkbox">&ensp;<span>'+key+'</span>':"")+'</td>';
        tdk = '<td'+((key)?' data-menu="'+id+'" data-menuid="'+fullid+'" data-disablekey="'+key+'" class="menukey menusmanager-key">&emsp;&emsp;<input type="checkbox">&ensp;<span>'+key+'</span>':' class="menukey">')+'</td>';
    return "<tr>" + tdm + tdk + "</tr>";
  }
  function displayMenus(dlg, menus, commands, context) {
    var liforul = "",
        tablefordiv = "",
        liforbody = "",
        tableforbody = "";
    
    var getData = preferences.get("all");
    if(getData){
      var god = JSON.parse(getData),
          goi;
      for(goi in god){
        if(god.hasOwnProperty(goi)){
          console.log(god[goi][0]);
        }
      }
    }
    
    var gmi,
      gei;
    for (gmi in menus) {
      if (menus.hasOwnProperty(gmi)) {
        //console.log("%c" + li(Menus.getMenu(gmi).id), "background : green;");
        var gci,
            mgma = Menus.getMenu(gmi).id;
        liforul += li(mgma);
        tablefordiv += table(mgma);
        for (gci = 0; gci < commands.length; gci += 1) {
          if(undefined !== getMenuItem(gmi, commands[gci])){
            var cida = getMenuItem(gmi, commands[gci]),
              gkba = KeyBindingManager.getKeyBindings(cida.getCommand());
            if(gkba.length>0){
              tablefordiv += item(mgma, cida.id, cida.getCommand().getName(), gkba[0].key);
            } else {
              tablefordiv += item(mgma, cida.id, cida.getCommand().getName());
            }
          }
        }
        tablefordiv += '</table></div>';
      }
    }
    for(gei=0;gei<context.length;gei+=1){
      var gli,
          //ulv = context[gei].getElementsByTagName("ul")[0],
          //liv = ulv.getElementsByTagName("li"),
          mgmb = context[gei].id;
      //console.log("%c" + li(context[gei].id), "background : orange;");
      liforbody += li(mgmb, true);
      tableforbody += table(mgmb);
      for (gli = 0; gli < commands.length; gli += 1) {
        if(undefined !== getMenuItem(mgmb, commands[gli])){
          var cidb = getMenuItem(mgmb, commands[gli]),
            gkbb = KeyBindingManager.getKeyBindings(cidb.getCommand());
            if(gkbb.length>0){
              tableforbody += item(mgmb, cidb.id, cidb.getCommand().getName(), gkbb[0].key);
            } else {
              tableforbody += item(mgmb, cidb.id, cidb.getCommand().getName());
            }
        }
      }
      tableforbody += '</table></div>';
      /*for(gli=0;gli<liv.length;gli+=1){
        if(undefined!==liv[gli].getElementsByTagName("a")[0]){
          console.log(Menus.getMenuItem(liv[gli].getElementsByTagName("a")[0].id).id);
        }
      }*/
    }
    var editortabs = '<div id="contextualxMANAGER" class="tab-pane fade"><ul class="nav nav-pills nav-justified">' + liforbody + '</ul><div class="tab-content">' + tableforbody + '</div></div>';
    var contextual = '<li style="float:right;"><a class="btn" data-toggle="pill" href="#contextualxMANAGER">Contextual</a></li>';
    
    dlg.getElement().find(".modal-header").html('<ul class="nav nav-pills nav-justified">' + liforul + contextual + '</ul>');
    dlg.getElement().find(".modal-body").html('<div class="tab-content">' + tablefordiv + editortabs + '</div>');
  }
  function storeData(elem){
    var spm = JSON.parse(preferences.get("all")),
      sei;
    for(sei=0;sei<elem.length;sei+=1){
      if("menusmanager-menu"===elem[sei].getAttribute("class")){
        if(elem[sei].getAttribute("data-commandfullid")===spm[elem[sei].getAttribute("data-commandfullid")][2]){
          elem[sei].getElementsByTagName("input")[0].checked = spm[elem[sei].getAttribute("data-commandfullid")][1];
        }
      }
      if("menukey menusmanager-key"===elem[sei].getAttribute("class")){
        if(elem[sei].getAttribute("data-disablekey")===spm[window.btoa(elem[sei].getAttribute("data-disablekey"))][3]){
          elem[sei].getElementsByTagName("input")[0].checked = spm[window.btoa(elem[sei].getAttribute("data-disablekey"))][1];
        }
      }
    }
  }

  function trainShow() {
    var Dialogs = brackets.getModule("widgets/Dialogs"),
      //StringUtils = brackets.getModule("utils/StringUtils"),
      settingsDialogTemplate = require('text!./menus.html'),
      compiledTemplate = Mustache.render(settingsDialogTemplate, Strings),
      dialog = Dialogs.showModalDialogUsingTemplate(compiledTemplate, true),
      allMenus = Menus.getAllMenus(),
      allCommands = CommandManager.getAll(),
      contextEditor = $("#context-menu-bar ul .dropdown.context-menu");
    displayMenus(dialog, allMenus, allCommands, contextEditor);
    
    window.setTimeout(function () {
      dialog.getElement().find(".nav-pills li").first().addClass("active");
      dialog.getElement().find(".tab-content .tab-pane").first().addClass("in active");
      
      dialog.getElement().find("#contextualxMANAGER .nav-pills li").first().addClass("active");
      dialog.getElement().find("#contextualxMANAGER .tab-content .tab-pane").first().addClass("in active");
      
      storeData(dialog.getElement().find(".modal-body table tr td"));
    }, 2);
    //prefsStore(dialog.getElement());
    
    dialog.done(function (i) {
      if ("cancel" === i || "dontsave" === i) {
        return;
      } else if ("ok" === i) {
        var setData = {};
        //CommandManager.get(str.getID())
        var tdinput = dialog.getElement().find(".modal-body table tr td"),
            tti;
        for(tti=0;tti<tdinput.length;tti+=1){
          if("menusmanager-menu"===tdinput[tti].getAttribute("class")){
            setData[tdinput[tti].getAttribute("data-commandfullid")] = [tdinput[tti].getAttribute("data-commandid"), tdinput[tti].getElementsByTagName("input")[0].checked, tdinput[tti].getAttribute("data-commandfullid")];
            //setData[tdinput[tti].getAttribute("data-commandfullid")] = [tdinput[tti].getAttribute("data-commandid"), tdinput[tti].getAttribute("data-commandfullid"), tdinput[tti].getElementsByTagName("input")[0].checked];
          }
          if("menukey menusmanager-key"===tdinput[tti].getAttribute("class")){
            setData[window.btoa(tdinput[tti].getAttribute("data-disablekey"))] = [tdinput[tti].getAttribute("data-menuid"), tdinput[tti].getElementsByTagName("input")[0].checked, tdinput[tti].getAttribute("data-menu"), tdinput[tti].getAttribute("data-disablekey")];
              //setData[tdinput[tti].getAttribute("data-menuid")] = [tdinput[tti].getAttribute("data-menu"), tdinput[tti].getAttribute("data-menuid"), tdinput[tti].getElementsByTagName("input")[0].checked];
          }
        }
        preferences.set("all", JSON.stringify(setData));
        preferences.save();
      }
    });
  }
  addCommandMenu('Menus Manager...',"menus.manager",trainShow,Menus.BEFORE,Commands.CMD_SPLITVIEW_NONE);
  AppInit.extensionsLoaded(function(){
  });
});
