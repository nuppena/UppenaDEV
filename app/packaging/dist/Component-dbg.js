sap.ui.define([
    "sap/ui/core/UIComponent",
    "pcf/com/acc/packaging/model/models",
    "./service/PackagingService",
    "./state/PackagingState",
    'sap/ui/model/json/JSONModel'
], (UIComponent, models,PackagingService,PackagingState,JSONModel) => {
    "use strict";

    return UIComponent.extend("pcf.com.acc.packaging.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
            let i18nModel = new sap.ui.model.resource.ResourceModel({
                bundleUrl: "i18n/i18n.properties",
                bundleName: "bsjv.com.acc.massgrgiui.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");
            sap.ui.getCore().setModel(i18nModel, "i18n");
            // set the device model
            let oJsonModel = new JSONModel();
            this.setModel(oJsonModel, "oJsonModel");
       
            this._oPackagingService = new PackagingService(this.getModel());
            this._oPackagingState = new PackagingState(this._oPackagingService);
            this.setModel(this._oPackagingState.getModel(), "oModel");
            // enable routing
            this.getRouter().initialize();
        },
        getService: function (sService) {
            return this["_o" + sService + "Service"];
        },
        getState: function (sState) {
            return this["_o" + sState + "State"];
        }
    });
});