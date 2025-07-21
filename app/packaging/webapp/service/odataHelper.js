sap.ui.define([], function() {
    "use strict";
    return {
        readData: function(oModel, sPath) {
            return new Promise(function(resolve, reject) {
                oModel.create(sPath, {
                    success: function(oData) {
                        resolve(oData);
                    },
                    error: function(oError) {
                        reject(oError);
                    }
                });
            });
        }
    };
});