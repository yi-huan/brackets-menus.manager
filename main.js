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
  /*function getMenuItem(menu, item) {
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
      /for(gli=0;gli<liv.length;gli+=1){
        if(undefined!==liv[gli].getElementsByTagName("a")[0]){
          console.log(Menus.getMenuItem(liv[gli].getElementsByTagName("a")[0].id).id);
        }
      }/
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
  }*/
  function trainShow() {
    var Dialogs = brackets.getModule("widgets/Dialogs"),
      //StringUtils = brackets.getModule("utils/StringUtils"),
      settingsDialogTemplate = require('text!./menus.html'),
      compiledTemplate = Mustache.render(settingsDialogTemplate, Strings),
      dialog = Dialogs.showModalDialogUsingTemplate(compiledTemplate, true),
      allMenus = Menus.getAllMenus(),
      allCommands = CommandManager.getAll(),
      contextEditor = $("#context-menu-bar ul .dropdown.context-menu"),
      getMenuItem = function (menu, item) {
        return Menus.getMenuItem(menu + "-" + item);
      },
      onlyLetters = function (str){
        return str.replace(/[^A-Za-z]/g, "")+"XMANAGER";
      },
      li = function (id, boo) {
        var tstr = Strings[id.toUpperCase().replace(/-/gi, "_")],
          strhtml = (tstr || ((boo)?id.replace(/ context| menu|context|menu/gi, "").replace(/-/gi, " "):id));
        return '<li id="'+onlyLetters(id)+'-LI" class="'+id+'-menusmanager"><a class="btn" data-toggle="pill" href="#' + onlyLetters(id) + '">' + strhtml + '</a></li>';
      },
      table = function (id) {
        return '<div id="' + onlyLetters(id) + '" class="tab-pane fade"><table width="100%">';
      },
      item = function (id, valuea, key, valueb) {
        var tdm = '<td id="'+onlyLetters(id)+'" class="menusmanager-menu">&emsp;&emsp;<input type="checkbox" checked="'+valuea+'">&ensp;'+CommandManager.get(id).getName()+'<span></span></td>',
        tdk = '<td'+((key)?' id="'+onlyLetters(window.btoa(key))+'" class="menukey menusmanager-key">&emsp;&emsp;<input type="checkbox" checked="'+valueb+'">&ensp;'+key+'<span></span>':' class="menukey">')+'</td>';
        return "<tr>" + tdm + tdk + "</tr>";
      },
      displayMenus = function(){
        var liforul = "",
          tablefordiv = "",
          liforbody = "",
          tableforbody = "";
        var retriveDataMenus = preferences.get("menus"),
          retriveDataKeys = preferences.get("keys"),
          retriveMenus = function(){
            if(retriveDataMenus&&retriveDataKeys){
              var rmi;
              for(rmi in retriveDataMenus){
                if(retriveDataMenus.hasOwnProperty(rmi)){
                  if("context"!==rmi){
                  //console.log("%c" + li(rmi), "background : green;");
                  liforul += li(rmi);
                  tablefordiv += table(rmi);
                    var rsm = retriveDataMenus[rmi],
                    rsmi;
                    for(rsmi in rsm){
                      if(rsm.hasOwnProperty(rsmi)){
                        var rkb = KeyBindingManager.getKeyBindings(rsmi);
                        if(rkb.length){
                          //console.log(rsm[rsmi], retriveDataKeys[window.btoa(rkb[0].key)]);
                          tablefordiv += item(rsmi, rsm[rsmi], rkb[0].key, retriveDataKeys[window.btoa(rkb[0].key)]);
                        } else {
                          if("object"===typeof rsm[rsmi]){
                            //console.log("%c" + rsmi, "background : orange;");
                            //tablefordiv += li(rsmi);
                            //tablefordiv += rsmi;
                            tablefordiv += table(rsmi);
                            var rsk = rsm[rsmi],
                              rscmi;
                            for(rscmi in rsk){
                              if(rsk.hasOwnProperty(rscmi)){
                                var rki = KeyBindingManager.getKeyBindings(rscmi);
                                if(rki.length){
                                  //console.log(rsk[rscmi], retriveDataKeys[window.btoa(rki[0].key)]);
                                  //tablefordiv += item(rscmi, rsk[rscmi], window.btoa(rki[0].key), retriveDataKeys[window.btoa(rki[0].key)]);
                                } else {
                                  //console.log(rsk[rscmi]);
                                  //tablefordiv += item(rscmi, rsk[rscmi]);
                                }
                              }
                            }
                            tablefordiv += '</table></div>';
                          } else {
                            //console.log(rsm[rsmi]);
                            tablefordiv += item(rsmi, rsm[rsmi]);
                          }
                        }
                      }
                    }
                    tablefordiv += '</table></div>';
                  } else {
                    
                  }
                }
              }
            }
            var editorTab = '<ul class="nav nav-pills nav-justified">' + liforbody + '</ul><div class="tab-content">' + tableforbody + '</div>';
            dialog.getElement().find(".modal-header").html('<ul class="nav nav-pills nav-justified">' + liforul + '</ul>');
            dialog.getElement().find(".modal-body").html('<div class="tab-content">' + tablefordiv + '</div>');
          },
          getMenus = function(){
            console.log("%c" + "getMenus!", "background : red;");
            var gmi,
              gei;
            for (gmi in allMenus) {
              if (allMenus.hasOwnProperty(gmi)) {
                var gci,
                    mgma = Menus.getMenu(gmi).id;
                console.log("%c" + mgma, "background : #AF17C3;");
                for (gci = 0; gci < allCommands.length; gci += 1) {
                  if(undefined !== getMenuItem(gmi, allCommands[gci])){
                    var cida = getMenuItem(gmi, allCommands[gci]),
                      gkba = KeyBindingManager.getKeyBindings(cida.getCommand());
                    if(gkba.length){
                      //console.log(mgma, cida.id, cida.getCommand().getName(), gkba[0].key);
                      console.log(cida.getCommand().getID(), gkba[0].key);
                    } else {
                      console.log(cida.getCommand().getID());
                    }
                  }
                }
              }
            }
            for(gei=0;gei<contextEditor.length;gei+=1){
              var gli,
                  mgmb = contextEditor[gei].id;
              console.log("%c" + mgmb, "background : pink;");
              for (gli = 0; gli < allCommands.length; gli += 1) {
                if(undefined !== getMenuItem(mgmb, allCommands[gli])){
                  var cidb = getMenuItem(mgmb, allCommands[gli]),
                    gkbb = KeyBindingManager.getKeyBindings(cidb.getCommand());
                    if(gkbb.length){
                      console.log(cidb.getCommand().getID(), gkbb[0].key);
                    } else {
                      console.log(cidb.getCommand().getID());
                    }
                }
              }
            }
          };
        retriveMenus();
        //getMenus();
      },
      testSave = function(){
        var storeDataMenus = {},
          storeDataKeys = {};
        var ami,
            cei,
            aci;
        for(ami in allMenus){
          if(allMenus.hasOwnProperty(ami)){
            storeDataMenus[ami]={};
            for(aci=0;aci<allCommands.length;aci+=1){
              var gmia = Menus.getMenuItem(ami+"-"+allCommands[aci]);
              if(gmia){
                var gkba = KeyBindingManager.getKeyBindings(gmia.getCommand());
                if(gkba.length){
                  //storeDataKeys[window.btoa(gkba[0].key)]=[gmia.id, false];
                  storeDataKeys[window.btoa(gkba[0].key)]=false;
                }
                storeDataMenus[ami][gmia.getCommand().getID()]=false;
              }
            }
          }
        }
        storeDataMenus.context={};
        for(cei=0;cei<contextEditor.length;cei+=1){
          storeDataMenus.context[contextEditor[cei].id]={};
          for(aci=0;aci<allCommands.length;aci+=1){
            var gmib = Menus.getMenuItem(contextEditor[cei].id+"-"+allCommands[aci]);
            if(gmib){
              var gkbb = KeyBindingManager.getKeyBindings(gmib.getCommand());
              if(gkbb.length){
                storeDataKeys[window.btoa(gkbb[0].key)]=false;
              }
              storeDataMenus.context[contextEditor[cei].id][gmib.getCommand().getID()]=false;
            }
          }
        }
        preferences.set("menus", storeDataMenus);
        preferences.save();
        preferences.set("keys", storeDataKeys);
        preferences.save();
      };
    displayMenus();
    dialog.done(function (i) {
      if ("cancel" === i || "dontsave" === i) {
        return;
      } else if ("ok" === i) {
        //testSave();
      }
    });
  }
  addCommandMenu('Menus Manager...',"menus.manager",trainShow,Menus.BEFORE,Commands.CMD_SPLITVIEW_NONE);
  AppInit.extensionsLoaded(function(){
    //removekey
  });
});
