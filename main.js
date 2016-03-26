/*jslint vars : true*/
/*globals define, brackets, Mustache, $, window*/
define(function (require, exports, module) {
  "use strict";
  var AppInit = brackets.getModule("utils/AppInit"),
    Menus = brackets.getModule("command/Menus"),
    KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
    PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
    preferences = PreferencesManager.getExtensionPrefs("menusManager.store"),
    CommandManager = brackets.getModule("command/CommandManager"),
    Commands = brackets.getModule("command/Commands");

  brackets.getModule("utils/ExtensionUtils").loadStyleSheet(module, "./style.css");

  function addCommandMenu(name, id, fn, pos, rel) {
    CommandManager.register(name, id, fn);
    Menus.getMenu(Menus.AppMenuBar.VIEW_MENU).addMenuItem(id, "", pos, rel);
  }

  function getMenuItem(menu, item) {
    return Menus.getMenuItem(menu + "-" + item);
  }

  function removeMenuItem(menu, id) {
    menu.removeMenuItem(CommandManager.get(id));
  }

  function trainManagerKeys(keys) {
    var rkf;
    for (rkf in keys) {
      if (keys.hasOwnProperty(rkf)) {
        if (keys[rkf][1]) {
          KeyBindingManager.removeBinding(window.atob(keys[rkf][0]));
        }
      }
    }
  }

  function trainsManagerMenus(menus, boo) {
    //removeMenuDivider: function (menuItemID)
    //removeMenuItem: function (command)
    //._getMenuItemForCommand
    var rmf;
    for (rmf in menus) {
      if (menus.hasOwnProperty(rmf)) {
        if ("context" !== rmf) {
          var rmsi;
          for (rmsi in menus[rmf]) {
            if (menus[rmf].hasOwnProperty(rmsi)) {
              //console.log(rmf, rmsi);
              if (menus[rmf][rmsi]) {
                //console.log(getMenuItem(rmf, rmsi));
                if (getMenuItem(rmf, rmsi)) {
                  if (boo) {
                    //console.log(rmf, CommandManager.get(rmsi).getName());
                    removeMenuItem(Menus.getContextMenu(rmf), rmsi);
                    //Menus.getContextMenu(rmf).removeMenuItem(CommandManager.get(rmsi));
                  } else {
                    //console.log(CommandManager.get(rmsi).getName());
                    removeMenuItem(Menus.getMenu(rmf), rmsi);
                    //Menus.getMenu(rmf).removeMenuItem(CommandManager.get(rmsi));
                  }
                }
                /* else {
                                  console.info("Error when removing > " + rmsi);
                                }*/
              }
            }
          }
        } else {
          trainsManagerMenus(menus.context, true);
        }
      }
    }
  }

  function onlyLetters(str) {
    //console.log("$YTGF%&$##$re gf1f321b51sf#%$/&".match(/[a-zA-Z]+/g));
    //console.log(/^[a-zA-Z]+$/.test("$YTGF%&$##$re gf1f321b51sf#%$/&"));
    //console.log(/^[a-zA-Z]*$/.test("$YTGF%&$##$re gf1f321b51sf#%$/&"));
    //return str.replace(/[^A-Za-z]/g, "")+"XMANAGER";
    return str.match(/[a-zA-Z]+/g).join("");
  }

  function saveData(id, value) {
    preferences.set(id, value);
    preferences.save();
  }

  function trainShow() {
    var Dialogs = brackets.getModule("widgets/Dialogs"),
      Strings = brackets.getModule("strings"),
      //StringUtils = brackets.getModule("utils/StringUtils"),
      settingsDialogTemplate = require('text!./menus.html'),
      compiledTemplate = Mustache.render(settingsDialogTemplate, Strings),
      dialog = Dialogs.showModalDialogUsingTemplate(compiledTemplate, true),
      getdlg = dialog.getElement(),
      allMenus = Menus.getAllMenus(),
      allCommands = CommandManager.getAll(),
      contextEditor = $("#context-menu-bar ul .dropdown.context-menu"),
      li = function (id, boo, booclass) {
        var tstr = Strings[id.toUpperCase().replace(/-/gi, "_")],
          strhtml = (tstr || ((boo) ? id.replace(/ context| menu|context|menu/gi, "").replace(/-/gi, " ") : id));
        return '<li id="' + onlyLetters(id) + '-LI" class="' + id + '-menusmanager ' + (booclass ? "addedmanager" : "") + '"><a class="btn" data-toggle="pill" href="#' + onlyLetters(id) + '">' + strhtml + '</a></li>';
      },
      table = function (id) {
        return '<div data-id="' + id + '" id="' + onlyLetters(id) + '" class="tab-pane fade"><table width="100%">';
      },
      item = function (parent, id, valuea, key, valueb, booclass) {
        var boo = (CommandManager.get(id))?true:false,
          tdm = '<td ' + ((parent[1]) ? 'data-context="' + parent[1] + '"' : '') + 'data-parent="' + parent[0] + '" data-id="' + id + '" id="' + onlyLetters((parent[1] || "") + parent[0] + id) + '" class="menusmanager-menu">&emsp;&emsp;<input type="checkbox"' + ((valuea) ? ' checked' : '') + (boo?'':' disabled') + '><span>&ensp;' + ((boo)?CommandManager.get(id).getName():id) + '</span></td>',
          tdk = '<td' + ((key) ? ' class="menukey menusmanager-key" data-id="' + id + '" data-key="' + window.btoa(key) + '">&emsp;&emsp;<input class="onclickkey-menusmanager" type="checkbox"' + ((valueb) ? ' checked' : '') + (boo?'':' disabled') + '><span>&ensp;' + key + '</span>' : ' class="menukey">') + '</td>';
        return '<tr ' + (booclass ? 'class="addedmanager"' : '') + (boo?'':' style="opacity: 0.2;"') + '>' + tdm + tdk + '</tr>';
      },
      displayMenus = function () {
        var liforul = "",
          tablefordiv = "",
          liforbody = "",
          tableforbody = "";
        var retriveDataMenus = preferences.get("menus"),
          retriveDataKeys = preferences.get("keys"),
          retriveMenus = function () {
            if (retriveDataMenus && retriveDataKeys) {
              var rmi;
              for (rmi in retriveDataMenus) {
                if (retriveDataMenus.hasOwnProperty(rmi)) {
                  if ("context" !== rmi) {
                    var rsm = retriveDataMenus[rmi],
                      rsmi;
                    //console.log("%c" + li(rmi), "background : green;");
                    liforul += li(rmi);
                    tablefordiv += table(rmi);
                    for (rsmi in rsm) {
                      if (rsm.hasOwnProperty(rsmi)) {
                        var rkb = retriveDataKeys[onlyLetters(rsmi)];
                        //var rkb = KeyBindingManager.getKeyBindings(rsmi);
                        if (rkb) {
                          //var  trtakeys = retriveDataKey s[window.btoa(rkb[0].key)];
                          //if(undefined!==trtakeys){
                          //console.log(rsm[rsmi], retriveDataKey s[window.btoa(rkb[0].key)]);
                          tablefordiv += item([rmi], rsmi, rsm[rsmi], window.atob(rkb[0]), rkb[1]);
                        } else {
                          //console.log(rsm[rsmi]);
                          tablefordiv += item([rmi], rsmi, rsm[rsmi]);
                        }
                      }
                    }
                    tablefordiv += '</table></div>';
                  } else {
                    var rcmi = retriveDataMenus.context,
                      imi;
                    for (imi in rcmi) {
                      if (rcmi.hasOwnProperty(imi)) {
                        var rsk = rcmi[imi],
                          rscmi;
                        //console.log("%c" + imi, "background : orange;");
                        liforbody += li(imi, true);
                        tableforbody += table(imi);
                        for (rscmi in rsk) {
                          if (rsk.hasOwnProperty(rscmi)) {
                            //console.log(rscmi);
                            var rki = retriveDataKeys[onlyLetters(rscmi)];
                            //var rki = KeyBindingManager.getKeyBindings(rscmi);
                            if (rki) {
                              //console.log(rsk[rscmi], retriveDataKey s[window.btoa(rki[0].key)]);
                              //console.log(rmi===context);
                              tableforbody += item([imi, "context"], rscmi, rsk[rscmi], window.atob(rki[0]), rki[1]);
                            } else {
                              //console.log(rsk[rscmi]);
                              tableforbody += item([imi, "context"], rscmi, rsk[rscmi]);
                            }
                          }
                        }
                        tableforbody += '</table></div>';
                      }
                    }
                  }
                }
              }
            }
            var editortabs = '<div data-id="contextual" id="contextualxMANAGER" class="tab-pane fade"><ul class="nav nav-pills nav-justified">' + liforbody + '</ul><div class="tab-content">' + tableforbody + '</div></div>';
            var contextual = '<li id="contextualxMANAGER-LI" style="float:right;"><a class="btn" data-toggle="pill" href="#contextualxMANAGER">Contextual</a></li>';
            getdlg.find(".modal-header").html('<ul class="nav nav-pills nav-justified">' + liforul + contextual + '</ul>');
            getdlg.find(".modal-body").html('<div class="tab-content">' + tablefordiv + editortabs + '</div>');
          },
          getMenus = function () {
            //console.log("%c" + "getMenus!", "background : red;");
            var gmi,
              gei,
              hasItem = function (parent, boo, context) {
                if (getdlg.find("#" + onlyLetters(parent)).length) {
                  return;
                } else {
                  if (boo) {
                    if (context) {
                      getdlg.find("#contextualxMANAGER .nav").append(li(parent, true, true));
                      getdlg.find("#contextualxMANAGER .tab-content").append(table(parent) + '</table></div>');
                      //console.log("%c" + "-"+onlyLetters(parent), "background : red;");
                    } else {
                      getdlg.find(".modal-header .nav #contextualxMANAGER-LI").before(li(parent, true, true));
                      getdlg.find(".modal-body .tab-content #contextualxMANAGER").before(table(parent) + '</table></div>');
                    }
                  }
                  //console.log("%c" + false, "background : red;");
                }
              },
              setItem = function (parent, id, context) {
                var igkb = KeyBindingManager.getKeyBindings(id);
                if (context) {
                  if (getdlg.find("#" + onlyLetters("context" + parent + id)).length) {
                    return;
                  } else {
                    //console.log("%c" + parent, "background : orange;");
                    if (igkb.length) {
                      //(id, valuea, key, valueb, forcontext, booclass)
                      var checkeda = (retriveDataKeys && retriveDataKeys[id]) ? retriveDataKeys[id][1] : false;
                      getdlg.find("#" + onlyLetters(parent) + " table").append(item([parent, "context"], id, false, igkb[0].key, checkeda, true));
                    } else {
                      getdlg.find("#" + onlyLetters(parent) + " table").append(item([parent, "context"], id, false, false, false, true));
                    }
                  }
                } else {
                  if (getdlg.find("#" + onlyLetters(parent + id)).length) {
                    return;
                  } else {
                    //console.log("%c" + parent, "background : yellow;");
                    if (igkb.length) {
                      var checkedb = (retriveDataKeys && retriveDataKeys[id]) ? retriveDataKeys[id][1] : false;
                      getdlg.find("#" + onlyLetters(parent) + " table").append(item([parent], id, false, igkb[0].key, checkedb, true));
                    } else {
                      getdlg.find("#" + onlyLetters(parent) + " table").append(item([parent], id, false, false, false, true));
                    }
                  }
                }
              };
            for (gmi in allMenus) {
              if (allMenus.hasOwnProperty(gmi)) {
                var gci,
                  mgma = Menus.getMenu(gmi).id;
                //console.log("%c" + hasItem(mgma), "background : #AF17C3;");
                hasItem(mgma, true);
                for (gci = 0; gci < allCommands.length; gci += 1) {
                  if (undefined !== getMenuItem(gmi, allCommands[gci])) {
                    //var cida = getMenuItem(gmi, allCommands[gci]);
                    /*gkba = KeyBindingManager.getKeyBindings(cida.getCommand());
                    if(gkba.length){
                      //console.log(mgma, cida.id, cida.getCommand().getName(), gkba[0].key);
                      hasItem(mgma, cida.getCommand().getID());
                      hasItem(mgma, gkba[0].key);
                    } else {*/
                    //hasItem(mgma, cida.getCommand().getID());
                    //console.log(allCommands[gci], cida.getCommand().getID());
                    //setItem(mgma, cida.getCommand().getID());
                    setItem(mgma, allCommands[gci]);
                    //}
                  }
                }
              }
            }
            for (gei = 0; gei < contextEditor.length; gei += 1) {
              var gli,
                mgmb = contextEditor[gei].id;
              //console.log("%c" + hasItem(mgmb), "background : pink;");
              hasItem(mgmb, true, true);
              for (gli = 0; gli < allCommands.length; gli += 1) {
                if (undefined !== getMenuItem(mgmb, allCommands[gli])) {
                  //var cidb = getMenuItem(mgmb, allCommands[gli]);
                  /*gkbb = KeyBindingManager.getKeyBindings(cidb.getCommand());
                  if(gkbb.length){
                    hasItem(mgmb, cidb.getCommand().getID());
                    hasItem(mgmb, gkbb[0].key);
                  } else {*/
                  //hasItem(mgmb, cidb.getCommand().getID());
                  //setItem(mgmb, cidb.getCommand().getID(), true);
                  setItem(mgmb, allCommands[gli], true);
                  //console.log(allCommands[gli], cidb.getCommand().getID());
                  //}
                }
              }
            }
          };
        retriveMenus();
        window.setTimeout(function () {
          getMenus();

          getdlg.find(".nav-pills li").first().addClass("active");
          getdlg.find(".tab-content .tab-pane").first().addClass("in active");

          getdlg.find("#contextualxMANAGER .nav-pills li").first().addClass("active");
          getdlg.find("#contextualxMANAGER .tab-content .tab-pane").first().addClass("in active");
          //storeData(getdlg.find(".modal-body table tr td"));
        }, 2);
      };

    displayMenus();
    dialog.done(function (i) {
      if ("cancel" === i || "dontsave" === i) {
        return;
      } else if ("ok" === i) {
        //testSave();
        var storeDataMenus = {};
        storeDataMenus.context = {};
        var storeDataKeys = {},
          setData = function (elem) {
            if ("menukey" === elem.getAttribute("class")) {
              return;
            }
            var checked = elem.getElementsByTagName("input")[0].checked;
            if ("menusmanager-menu" === elem.getAttribute("class")) {
              //console.log("%c" + "menu", "background : green;");
              if (elem.getAttribute("data-context")) {
                storeDataMenus.context[elem.getAttribute("data-parent")] = {};
                //console.log(valueToJSON(elem.getAttribute("data-parent"), elem.getAttribute("data-id"), checked));
                //console.log("%c" + elem.getAttribute("data-parent"), "background : green;");
                //console.log("%c" + elem.getAttribute("data-id"), "background : red;");
                window.setTimeout(function () {
                  storeDataMenus.context[elem.getAttribute("data-parent")][elem.getAttribute("data-id")] = checked;
                }, 1);
              } else {
                storeDataMenus[elem.getAttribute("data-parent")] = {};
                window.setTimeout(function () {
                  storeDataMenus[elem.getAttribute("data-parent")][elem.getAttribute("data-id")] = checked;
                }, 1);
              }

            } else {
              storeDataKeys[onlyLetters(elem.getAttribute("data-id"))] = [elem.getAttribute("data-key"), checked];
            }
          },
          getData = function () {
            //var tdinput = getdlg.find(".modal-body table tr td");
            //var oktt = getdlg.find(".tab-content .tab-pane"),
            var output = getdlg.find(".tab-pane table td"),
              oki;
            for (oki = 0; oki < output.length; oki += 1) {
              setData(output[oki], true);
              /*var gattr = oktt[oki].getAttribute("data-id");
              if("contextual"!==gattr){
                if("contextualxMANAGER"===oktt[oki].parentNode.parentNode.id){
                  console.log("contextual", gattr);
                } else {
                  console.log(gattr);
                }
              } else {
                
              }*/
            }
          };
        getData();
        //console.dir(storeDataKeys);
        //console.dir(storeDataParents);
        //console.dir(storeDataMenus);

        saveData("keys", storeDataKeys);
        trainManagerKeys(storeDataKeys);
        window.setTimeout(function () {
          saveData("menus", storeDataMenus);
          trainsManagerMenus(storeDataMenus);
        }, 2);
      }
    });
  }
  addCommandMenu('Menus Manager...', "menus.manager", trainShow, Menus.BEFORE, Commands.CMD_SPLITVIEW_NONE);

  function testSave() {
    var allMenus = Menus.getAllMenus(),
      allCommands = CommandManager.getAll(),
      contextEditor = $("#context-menu-bar ul .dropdown.context-menu");
    var storeDataMenus = {},
      storeDataKeys = {};
    var ami,
      cei,
      aci;
    for (ami in allMenus) {
      if (allMenus.hasOwnProperty(ami)) {
        storeDataMenus[ami] = {};
        for (aci = 0; aci < allCommands.length; aci += 1) {
          var acm = allCommands[aci],
            gmia = Menus.getMenuItem(ami + "-" + acm);
          if (gmia) {
            var gkba = KeyBindingManager.getKeyBindings(gmia.getCommand());
            if (gkba.length) {
              var getChecked = onlyLetters(acm),
                setKey,
                setValue;
              if (preferences.get("keys")[getChecked]) {
                setKey = preferences.get("keys")[getChecked][0];
                setValue = preferences.get("keys")[getChecked][1];
              } else {
                setKey = window.btoa(gkba[0].key);
                setValue = false;
              }
              //storeDataKeys[window.btoa(gkba[0].key)]=[gmia.id, false];
              //console.log(preferences.get("kesy")[ami][aci]);
              storeDataKeys[getChecked] = [setKey, setValue];
            }
            //console.log(preferences.get("menus")[ami][gmia]);
            if (preferences.get("menus")[ami]) {
              storeDataMenus[ami][acm] = !!preferences.get("menus")[ami][acm];
            } else {
              storeDataMenus[ami][acm] = false;
            }
          }
        }
      }
    }
    storeDataMenus.context = {};
    for (cei = 0; cei < contextEditor.length; cei += 1) {
      var gcei = contextEditor[cei].id;
      storeDataMenus.context[gcei] = {};
      for (aci = 0; aci < allCommands.length; aci += 1) {
        var gcm = allCommands[aci],
          gmib = Menus.getMenuItem(gcei + "-" + gcm);
        if (gmib) {
          var gkbb = KeyBindingManager.getKeyBindings(gmib.getCommand());
          if (gkbb.length) {
            var getCheckeda = onlyLetters(allCommands[aci]),
              setKeya,
              setValueb;
            if (preferences.get("keys")[getCheckeda]) {
              setKeya = preferences.get("keys")[getCheckeda][0];
              setValueb = preferences.get("keys")[getCheckeda][1];
            } else {
              setKeya = window.btoa(gkbb[0].key);
              setValueb = false;
            }
            storeDataKeys[getCheckeda] = [setKeya, setValueb];
            //storeDataKeys[window.btoa(gkbb[0].key)]=false;
          }
          if (preferences.get("menus").context[gcei]) {
            storeDataMenus.context[gcei][gcm] = !!preferences.get("menus").context[gcei][gcm];
          } else {
            storeDataMenus.context[gcei][gcm] = false;
          }
          //storeDataMenus.context[contextEditor[cei].id][gmib.getCommand().getID()]=false;
        }
      }
    }
    saveData("menus", storeDataMenus);
    saveData("keys", storeDataKeys);
  }
  preferences.definePreference("sync", "boolean").on('change', function () {
    if (preferences.get("sync")) {
      testSave();
    }
  });
  $(window.document.body).on("click", ".onclickkey-menusmanager", function () {
    var self = $(this);
    //console.log(self.parent().data("key"), $(this).prop("checked"));
    $(".onclickkey-menusmanager").each(function ( /*number, elem*/ ) {
      if ($(this).parent().data("key") === self.parent().data("key")) {
        //console.log($(this).prop("checked"));
        $(this).prop("checked", self.prop("checked"));
      }
    });
  });
  AppInit.appReady(function () {
    //removekey
    //console.log(getMenuItem("editor-context-menu", "get_dimensions"));
    window.setTimeout(function () {
      //console.log(preferences.get("sync"));
      saveData("sync", !!preferences.get("sync"));
      //console.log(preferences.get("sync"));
      if (preferences.get("sync")) {
        testSave();
      }
      trainManagerKeys(preferences.get("keys"));
      trainsManagerMenus(preferences.get("menus"));
    }, 75);
  });
});
