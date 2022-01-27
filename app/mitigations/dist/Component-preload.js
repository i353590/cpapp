//@ui5-bundle ns/mitigations/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"ns/mitigations/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","./model/models","./controller/ErrorHandler"],function(t,s,e,i){"use strict";return t.extend("ns.mitigations.Component",{metadata:{manifest:"json"},init:function(){t.prototype.init.apply(this,arguments);this._oErrorHandler=new i(this);this.setModel(e.createDeviceModel(),"device");this.getRouter().initialize()},destroy:function(){this._oErrorHandler.destroy();t.prototype.destroy.apply(this,arguments)},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(document.body.classList.contains("sapUiSizeCozy")||document.body.classList.contains("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!s.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass}})});
},
	"ns/mitigations/controller/App.controller.js":function(){sap.ui.define(["./BaseController"],function(t){"use strict";return t.extend("ns.mitigations.controller.App",{onInit:function(){this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())}})});
},
	"ns/mitigations/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/UIComponent","sap/m/library"],function(e,t,r){"use strict";var n=r.URLHelper;return e.extend("ns.mitigations.controller.BaseController",{getRouter:function(){return t.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},onShareEmailPress:function(){var e=this.getModel("objectView")||this.getModel("worklistView");n.triggerEmail(null,e.getProperty("/shareSendEmailSubject"),e.getProperty("/shareSendEmailMessage"))}})});
},
	"ns/mitigations/controller/ErrorHandler.js":function(){sap.ui.define(["sap/ui/base/Object","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,s,t,n){"use strict";return e.extend("ns.mitigations.controller.ErrorHandler",{constructor:function(e){var s=sap.ui.getCore().getMessageManager(),i=s.getMessageModel(),o=e.getModel("i18n").getResourceBundle(),r=o.getText("errorText"),a=o.getText("multipleErrorsText");this._oComponent=e;this._bMessageOpen=false;this.oMessageModelBinding=i.bindList("/",undefined,[],new t("technical",n.EQ,true));this.oMessageModelBinding.attachChange(function(e){var t=e.getSource().getContexts(),n=[],i;if(this._bMessageOpen||!t.length){return}t.forEach(function(e){n.push(e.getObject())});s.removeMessages(n);i=n.length===1?r:a;this._showServiceError(i,n[0].message)},this)},_showServiceError:function(e,t){this._bMessageOpen=true;s.error(e,{id:"serviceErrorMessageBox",details:t,styleClass:this._oComponent.getContentDensityClass(),actions:[s.Action.CLOSE],onClose:function(){this._bMessageOpen=false}.bind(this)})}})});
},
	"ns/mitigations/controller/NotFound.controller.js":function(){sap.ui.define(["./BaseController"],function(n){"use strict";return n.extend("ns.mitigations.controller.NotFound",{onLinkPressed:function(){this.getRouter().navTo("worklist")}})});
},
	"ns/mitigations/controller/Object.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","sap/ui/core/routing/History","../model/formatter"],function(e,t,n,i){"use strict";return e.extend("ns.mitigations.controller.Object",{formatter:i,onInit:function(){var e=new t({busy:true,delay:0});this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched,this);this.setModel(e,"objectView")},onNavBack:function(){var e=n.getInstance().getPreviousHash();if(e!==undefined){history.go(-1)}else{this.getRouter().navTo("worklist",{},true)}},_onObjectMatched:function(e){var t=e.getParameter("arguments").objectId;this._bindView("/Mitigations"+t)},_bindView:function(e){var t=this.getModel("objectView");this.getView().bindElement({path:e,events:{change:this._onBindingChange.bind(this),dataRequested:function(){t.setProperty("/busy",true)},dataReceived:function(){t.setProperty("/busy",false)}}})},_onBindingChange:function(){var e=this.getView(),t=this.getModel("objectView"),n=e.getElementBinding();if(!n.getBoundContext()){this.getRouter().getTargets().display("objectNotFound");return}var i=this.getResourceBundle();e.getBindingContext().requestObject().then(function(e){var n=e.ID,o=e.ID;t.setProperty("/busy",false);t.setProperty("/shareSendEmailSubject",i.getText("shareSendEmailObjectSubject",[n]));t.setProperty("/shareSendEmailMessage",i.getText("shareSendEmailObjectMessage",[o,n,location.href]))}.bind(this))}})});
},
	"ns/mitigations/controller/Worklist.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","../model/formatter","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,t,i,o,s){"use strict";return e.extend("ns.mitigations.controller.Worklist",{formatter:i,onInit:function(){var e;this._aTableSearchState=[];e=new t({worklistTableTitle:this.getResourceBundle().getText("worklistTableTitle"),shareOnJamTitle:this.getResourceBundle().getText("worklistTitle"),shareSendEmailSubject:this.getResourceBundle().getText("shareSendEmailWorklistSubject"),shareSendEmailMessage:this.getResourceBundle().getText("shareSendEmailWorklistMessage",[location.href]),tableNoDataText:this.getResourceBundle().getText("tableNoDataText")});this.setModel(e,"worklistView")},onUpdateFinished:function(e){var t,i=e.getSource(),o=e.getParameter("total");if(o&&i.getBinding("items").isLengthFinal()){t=this.getResourceBundle().getText("worklistTableTitleCount",[o])}else{t=this.getResourceBundle().getText("worklistTableTitle")}this.getModel("worklistView").setProperty("/worklistTableTitle",t)},onPress:function(e){this._showObject(e.getSource())},onNavBack:function(){history.go(-1)},onSearch:function(e){if(e.getParameters().refreshButtonPressed){this.onRefresh()}else{var t=[];var i=e.getParameter("query");if(i&&i.length>0){t=[new o("ID",s.Contains,i)]}this._applySearch(t)}},onRefresh:function(){var e=this.byId("table");e.getBinding("items").refresh()},_showObject:function(e){var t=this;e.getBindingContext().requestCanonicalPath().then(function(i){t.getRouter().navTo("object",{objectId_Old:e.getBindingContext().getProperty("ID"),objectId:i.slice("/Mitigations".length)})})},_applySearch:function(e){var t=this.byId("table"),i=this.getModel("worklistView");t.getBinding("items").filter(e,"Application");if(e.length!==0){i.setProperty("/tableNoDataText",this.getResourceBundle().getText("worklistNoDataWithSearchText"))}}})});
},
	"ns/mitigations/i18n/i18n.properties":'# This is the resource bundle for Mitigations\n\n#XTIT: Application name\nappTitle=Mitigations\n\n#YDES: Application description\nappDescription=Mitigations\n\n#~~~ Worklist View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n#XTIT: Worklist view title\nworklistViewTitle=Manage <MitigationsPlural>\n\n#XTIT: Worklist page title\nworklistTitle=Mitigations\n\n#XTIT: Table view title\nworklistTableTitle=<MitigationsPlural>\n\n#XTOL: Tooltip for the search field\nworklistSearchTooltip=Enter an <Mitigations> name or a part of it.\n\n#XBLI: text for a table with no data with filter or search\nworklistNoDataWithSearchText=No matching <MitigationsPlural> found\n\n#XTIT: Table view title with placeholder for the number of items\nworklistTableTitleCount=<Mitigations> ({0})\n\n#XTIT: The title of the column containing the ID of Mitigations\ntableNameColumnTitle=<ID>\n\n#XTIT: The title of the column containing the  and the unit of measure\ntableUnitNumberColumnTitle=<>\n\n#XBLI: text for a table with no data\ntableNoDataText=No <MitigationsPlural> are currently available\n\n#XLNK: text for link in \'not found\' pages\nbackToWorklist=Show Mitigations\n\n#~~~ Object View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n#XTIT: Object view title\nobjectViewTitle=<Mitigations> Details\n\n#XTIT: Object page title\nobjectTitle=<Mitigations>\n\n#XTIT: Label for the ID\nIDLabel=ID\n\n#XTIT: Label for the \nLabel=\n\n\n#~~~ Share Menu Options ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Send E-Mail subject\nshareSendEmailWorklistSubject=<Email subject PLEASE REPLACE ACCORDING TO YOUR USE CASE>\n\n#YMSG: Send E-Mail message\nshareSendEmailWorklistMessage=<Email body PLEASE REPLACE ACCORDING TO YOUR USE CASE>\\r\\n{0}\n\n#XTIT: Send E-Mail subject\nshareSendEmailObjectSubject=<Email subject including object identifier PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0}\n\n#YMSG: Send E-Mail message\nshareSendEmailObjectMessage=<Email body PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0} (id: {1})\\r\\n{2}\n\n\n#~~~ Not Found View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Not found view title\nnotFoundTitle=Not Found\n\n#YMSG: The Mitigations not found text is displayed when there is no Mitigations with this id\nnoObjectFoundText=This <Mitigations> is not available\n\n#YMSG: The Mitigations not available text is displayed when there is no data when starting the app\nnoObjectsAvailableText=No <MitigationsPlural> are currently available\n\n#YMSG: The not found text is displayed when there was an error loading the resource (404 error)\nnotFoundText=The requested resource was not found\n\n#~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~~~~\n\n#YMSG: Error dialog description\nerrorText=Sorry, a technical error occurred! Please try again later.\n\n#YMSG: Multiple errors message\nmultipleErrorsText=There have been multiple technical errors. One example: \n',
	"ns/mitigations/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"ns.mitigations","type":"application","i18n":"i18n/i18n.properties","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"resources":"resources.json","dataSources":{"mainService":{"uri":"service/risk/","type":"OData","settings":{"odataVersion":"4.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"Mitigations-display":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"Mitigations","action":"display"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://task","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"ns.mitigations.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.98.0","libs":{"sap.ui.core":{},"sap.m":{},"sap.f":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"ns.mitigations.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"operationMode":"Server","groupId":"$direct","synchronizationMode":"None","autoExpandSelect":true}}},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"ns.mitigations.view","controlId":"app","controlAggregation":"pages","bypassed":{"target":["notFound"]},"async":true},"routes":[{"pattern":"","name":"worklist","target":["worklist"]},{"pattern":"Mitigations{objectId}","name":"object","target":["object"]}],"targets":{"worklist":{"viewName":"Worklist","viewId":"worklist","viewLevel":1,"title":"{i18n>worklistViewTitle}"},"object":{"viewName":"Object","viewId":"object","viewLevel":2,"title":"{i18n>objectViewTitle}"},"objectNotFound":{"viewName":"ObjectNotFound","viewId":"objectNotFound"},"notFound":{"viewName":"NotFound","viewId":"notFound"}}}},"sap.cloud":{"public":true,"service":"cpapp.service"}}',
	"ns/mitigations/model/formatter.js":function(){sap.ui.define([],function(){"use strict";return{numberUnit:function(n){if(!n){return""}return parseFloat(n).toFixed(2)}}});
},
	"ns/mitigations/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"ns/mitigations/view/App.view.xml":'<mvc:View\n\tcontrollerName="ns.mitigations.controller.App"\n\tdisplayBlock="true"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><App id="app"/></mvc:View>',
	"ns/mitigations/view/NotFound.view.xml":'<mvc:View\n\tcontrollerName="ns.mitigations.controller.NotFound"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><MessagePage\n\t\ttitle="{i18n>notFoundTitle}"\n\t\ttext="{i18n>notFoundText}"\n\t\ticon="sap-icon://document"\n\t\tid="page"\n\t\tdescription=""><customDescription><Link id="link" text="{i18n>backToWorklist}" press=".onLinkPressed" /></customDescription></MessagePage></mvc:View>',
	"ns/mitigations/view/Object.view.xml":'<mvc:View\n\tcontrollerName="ns.mitigations.controller.Object"\n\txmlns="sap.m"\n\t xmlns:l="sap.ui.layout"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:semantic="sap.f.semantic"><semantic:SemanticPage\n\t\tid="page"\n\t\theaderPinnable="false"\n\t\ttoggleHeaderOnTitleClick="false"\n\t\tbusy="{objectView>/busy}"\n\t\tbusyIndicatorDelay="{objectView>/delay}"><semantic:titleHeading><Title text="{description}" /></semantic:titleHeading><semantic:headerContent><ObjectNumber\n\t\t\t/></semantic:headerContent><semantic:sendEmailAction><semantic:SendEmailAction id="shareEmail" press=".onShareEmailPress"/></semantic:sendEmailAction><semantic:content><l:VerticalLayout><ObjectStatus title="Description" text="{description}"/><ObjectStatus title="Owner" text="{owner}"/><ObjectStatus title="Timeline" text="{timeline}"/></l:VerticalLayout></semantic:content></semantic:SemanticPage></mvc:View>',
	"ns/mitigations/view/ObjectNotFound.view.xml":'<mvc:View\n\tcontrollerName="ns.mitigations.controller.NotFound"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><MessagePage\n\t\ttitle="{i18n>objectTitle}"\n\t\ttext="{i18n>noObjectFoundText}"\n\t\ticon="sap-icon://product"\n\t\tdescription=""\n\t\tid="page"><customDescription><Link id="link" text="{i18n>backToWorklist}" press=".onLinkPressed" /></customDescription></MessagePage></mvc:View>',
	"ns/mitigations/view/Worklist.view.xml":'<mvc:View\n\tcontrollerName="ns.mitigations.controller.Worklist"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:semantic="sap.f.semantic"><semantic:SemanticPage\n\t\tid="page"\n\t\theaderPinnable="false"\n\t\ttoggleHeaderOnTitleClick="false"><semantic:titleHeading><Title text="{i18n>worklistTitle}" /></semantic:titleHeading><semantic:content><Table\n\t\t\t\tid="table"\n\t\t\t\twidth="auto"\n\t\t\t\titems="{\n\t\t\t\t\tpath: \'/Mitigations\',\n\t\t\t\t\tsorter: {\n\t\t\t\t\t\tpath: \'ID\',\n\t\t\t\t\t\tdescending: false\n\t\t\t\t\t}\n\t\t\t\t}"\n\t\t\t\tnoDataText="{worklistView>/tableNoDataText}"\n\t\t\t\tgrowing="true"\n\t\t\t\tgrowingScrollToLoad="true"\n\t\t\t\tupdateFinished=".onUpdateFinished"><headerToolbar><Toolbar><Title id="tableHeader" text="{worklistView>/worklistTableTitle}"/><ToolbarSpacer /><SearchField\n\t\t\t\t\t\t\tid="searchField"\n\t\t\t\t\t\t\ttooltip="{i18n>worklistSearchTooltip}"\n\t\t\t\t\t\t\tsearch=".onSearch"\n\t\t\t\t\t\t\twidth="auto"></SearchField></Toolbar></headerToolbar><columns><Column id="DescriptionColumn"><Text text="Description" id="DescriptionColumnTitle"/></Column><Column id="OwnerColumn"><Text text="Owner" id="OwnerColumnTitle"/></Column><Column id="TimelineColumn"><Text text="Timeline" id="TimelineColumnTitle"/></Column></columns><items><ColumnListItem\n\t\t\t\t\t\ttype="Navigation"\n\t\t\t\t\t\tpress=".onPress"><cells><ObjectIdentifier\n\t\t\t\t\t\t\t\ttext="{description}" /><Text\n                    text="{owner}" /><Text\n                    text="{timeline}" /></cells></ColumnListItem></items></Table></semantic:content><semantic:sendEmailAction><semantic:SendEmailAction id="shareEmail" press=".onShareEmailPress"/></semantic:sendEmailAction></semantic:SemanticPage></mvc:View>'
}});
