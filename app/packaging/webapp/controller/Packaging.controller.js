sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "pcf/com/acc/packaging/service/odataHelper",
    "sap/ushell/Container"
], (Controller,BusyIndicator,MessageBox,odataHelper,Container) => {
    "use strict";

    return Controller.extend("pcf.com.acc.packaging.controller.Packaging", {
        onInit() {
          var that=this;
          this.userID="demoTestUser";
         
          var excelModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(excelModel, "excelData");  
          this.PackagingState = this.getOwnerComponent().getState("Packaging");
          this.PackagingService = this.getOwnerComponent().getService("Packaging");
          
         this.getView().getModel("excelData").setProperty("/btEditEnabled", "InActive");
          this.oGlobalBusyDialog = new sap.m.BusyDialog(); 
         // this.getUserInfo();

        if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
        sap.ushell.Container.getServiceAsync("UserInfo").then(function(oUserInfo) {
            if (oUserInfo) {
                var uID = oUserInfo.getId(); // Get the user's ID
                //console.log("Logged-in BTP user ID:", sUserId);

                // You can also retrieve other user details:
                that.userID = oUserInfo.getEmail();
                // var sFirstName = oUserInfo.getFirstName();
               // var sFullName = oUserInfo.getShellUserInfo().getFullName();

                //console.log("Logged-in BTP user ID details:", sUserId +":"+sEmail);
                 that.onExecute();
            }
        }).catch(function(oError) {
            console.error("Error getting UserInfo service:", oError);
        });
    } else {
        console.warn("SAP Fiori Launchpad shell services not available. User information may not be accessible.");
    }
     
        },
        onSaveChanges: function () {
          const that = this;
          var userName;

            //const oModel = this.getView().getModel("excelData");
        var exData = this.getOwnerComponent().getModel("locModel").getProperty("/excelData");
             var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ results: exData });
         //that.getView().setModel(oModel, "excelData");



            if (!oModel || !oModel.getData().results || oModel.getData().results.length === 0) {
                MessageBox.warning("No data available to save.");
                return;
            }

            const aData = oModel.getData().results;

           
            const matPost = [];
            var pWeight;
            var pSpend;
            for(let i=0;i<aData.length;i++){

              if(aData[i]['Weight'].length == 0){
                pWeight = null;
              }else{
                pWeight = aData[i]['Weight']
              }

              if(aData[i]['Spend (in Millions)'].toString().length == 0){
                pSpend = null;
              }else{
                pSpend = aData[i]['Spend (in Millions)']
              }
            
              matPost.push({
            "Site_ID": aData[i]['Site ID'],
            "Country_Name": aData[i]['Country Name'],     
            "Material_ID":String(aData[i]['Material ID']),
            "Material_Name": aData[i]['Material Name'],
            "Short_Description": aData[i]['Short Description'],
            "Weight":pWeight,
            "Weight_Unit":aData[i]['Weight Unit'],
            "Spend":pSpend,
            "Spend_Currency_Unit":aData[i]['Spend Currency Unit']
              });
            }

            
            
            const savePayload = {
              "uName": this.userID,
              "Industry": "Dairy",
              "material":matPost
            }
            

            this.oGlobalBusyDialog.open();     
      var oModel1 = this.getOwnerComponent().getModel();
           
          odataHelper.postData(oModel1, "/saveData", savePayload)
               .then((oData) => {
                
                  if(oData.saveData.result == "Material details stored successfully."){
                    that.onRunExecute();
                  }
                  if(oData.saveData.statusCode == 502){
                    let errMessag = oData.saveData.reason.response.body.error;
                    MessageBox.error(errMessag.split(":")[1]+":"+errMessag.split(":")[2]);
                    this.oGlobalBusyDialog.close();
                  }
                 
              })
              .catch((oError) => {
                    // Handle the error
                    console.error("Error reading data:", oError);
                    this.oGlobalBusyDialog.close();
                    // Display an error message, etc.
                });
         
          
          
            // Convert JSON data to Excel sheet
            // const worksheet = XLSX.utils.json_to_sheet(aData);
            // const workbook = XLSX.utils.book_new();
            // XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Data");

            //  download of the updated Excel file
            //XLSX.writeFile(workbook, "Updated_PackagingData.xlsx");

            //MessageBox.success("Changes saved successfully!");
        },

        onEditChanges: function(){
          var that=this;
          const editPost = [];
          const oModel = this.getView().getModel("excelData");
          const aData = oModel.getData().results;
    
          for(let j=0;j<aData.length;j++){
            editPost.push({
              "row_id":aData[j].row_id,
              "active_result_id": aData[j].active_result_id,
              "Total_Emission":aData[j]['Total Emission']
    
            })
    
          }
    
          const editPayloadSave = {
            "editPayload":editPost
          }
    
          this.oGlobalBusyDialog.open();     
          var oModel1 = this.getOwnerComponent().getModel();
         
        odataHelper.postData(oModel1, "/editData", editPayloadSave)
             .then((oData) => {
              
                // if(oData.saveData.result == "Material details stored successfully."){
                //   that.onRunExecute();
                // }
                   that.onRunExecute();
            })
            .catch((oError) => {
                  // Handle the error
                  console.error("Error reading data:", oError);
                  this.oGlobalBusyDialog.close();
                  // Display an error message, etc.
              });

        },
        getUserInfo: function(){
          // var oModel1 = this.getOwnerComponent().getModel();
          // odataHelper.getData(oModel1, "/userInfoUAA")
          //      .then((oData) => {
          //      console.log("Odata UserInf" + oData);
          //     })
          //     .catch((oError) => { 
          //           console.error("Error reading data:", oError);
          //       });

          $.ajax({
            method: "GET",
            url: "/user-api/currentUser",
            async: true,
            success: function(data) {
              console.log(JSON.stringify(data))
            },
            error: function(err) {
              console.log(err)
            }
          });

        },
          onRunExecute: function(){
            const that = this;
          var oModel1 = this.getOwnerComponent().getModel();

          const runPayload = {
              "uName": this.userID
            }
           
          odataHelper.postData(oModel1, "/runAPI", runPayload)
               .then((oData) => {

               // console.log("RUN PAYLOAD" + oData.saveData.result );

                if(oData.runAPI.result == "Processing Completed"){
                   that.onExecute();
               }
               
              })
              .catch((oError) => {
                    // Handle the error
                    console.error("Error reading data:", oError);
                    that.oGlobalBusyDialog.close();
                    // Display an error message, etc.
                });

          },
          loadXLSXLibrary: function () {
            return new Promise(function (resolve, reject) {
                if (window.XLSX) {
                    resolve();
                    return;
                }
         
                var script = document.createElement("script");
                script.src = jQuery.sap.getModulePath("pcf.com.acc.packaging.lib", "/xlsx.full.min.js");
                script.onload = function () {
                    resolve();
                };
                script.onerror = function () {
                    reject("Failed to load XLSX library");
                };
         
                document.head.appendChild(script);
            });
        },        
        onMappedActivityChange:function(oEvent){


          var oSelectedItem = oEvent.getParameter("selectedItem");
        var sSelectedKey = oSelectedItem.getKey();

        let oModel = this.getView().getModel("excelData").getProperty("/results");
      //   const oContext = oEvent.getSource().getBindingContext();
      //  const oModel2 = oContext.getModel();
      // const sPath = oContext.getPath();

      const excelModel = oEvent.getSource().getBindingContext('excelData');

        let oFilterObj = excelModel.getProperty("top_activity_ids").filter(
          oObject => oObject.result_id === sSelectedKey);

          excelModel.setProperty("Total Emission", oFilterObj[0].total_emission);

          if(oFilterObj[0].activity_id == "custom"){
            excelModel.setProperty(excelModel.getPath() +"/btEditEnabled", "Active");
            //this.getOwnerComponent().getModel("locModel").setProperty("/btEditEnabled",true);
          }else{
            excelModel.setProperty(excelModel.getPath() +"/btEditEnabled", "InActive");
          }
        },
        onDownloadTemplate: function(){
          var fileName = "PackagingTemplate.xlsx";
          //  var sURL = sap.ui.require.toUrl(`zbue0004_massresui/DownloadTemplate/${fileName}`);
          var sURL = sap.ui.require.toUrl(`pcf/com/acc/packaging/DownloadTemplate/${fileName}`);
          //var sURL = `./DownloadTemplate/${fileName}`;
          const oA = document.createElement("a");
          oA.href = sURL;
          oA.style.display = "none";
          document.body.appendChild(oA);
          oA.click();
          document.body.removeChild(oA);
      },
        /**
* Triggerd on click of execute button
* calls _uploadFileExecute and _chkFile function
* @public
*/
    onExecute: function () {
      const that = this;
      this.getView().byId("table").setBusy(true);
      // var aTableData = this.getOwnerComponent().getModel("locModel").getProperty("/d/fetchAPI/result/");
      // this.getView().setModel(oModel1, "excelData");

      //         aTableData.forEach(row => {
      //               const match = row.top_activity_ids.find(item => item.result_id === row.active_result_id);
      //               row.mapped_activity_id = match ? match.activity_id : null;
      //             });
      //             var oModel = new sap.ui.model.json.JSONModel({ results: aTableData });

                 
      //             this.getView().setModel(oModel, "excelData");
      //             this.getView().getModel().refresh(true);
      var oModel1 = this.getOwnerComponent().getModel();
      const fetchPayload = {
              "uName": this.userID
            }

          odataHelper.postData(oModel1, "/fetchAPI", fetchPayload)
             .then((oData) => {
                
                  var aTableData = oData.fetchAPI.result;
                  aTableData.forEach(row => {
                    const match = row.top_activity_ids.find(item => item.result_id === row.active_result_id);
                    row.mapped_activity_id = match ? match.activity_id : null;
                  });
                  var oModel = new sap.ui.model.json.JSONModel({ results: aTableData });

                 
                  this.getView().setModel(oModel, "excelData");
                  this.getView().getModel().refresh(true);
                  that.getOwnerComponent().getModel("locModel").setProperty("/btEditCEnabled",true);
                  this.oGlobalBusyDialog.close();
                   this.getView().byId("table").setBusy(false);
              })
              .catch((oError) => {
                    
                    console.error("Error reading data:", oError);
                    
                    this.oGlobalBusyDialog.close();
                     this.getView().byId("table").setBusy(false);
                });
    
    },
    handleTxtFilter: function(oEvent) {
      const sQuery = oEvent.getParameter("query").trim();
    if (!sQuery) {
      this.byId("table").getBinding("rows").filter([]);
      return;
    }

    const aFilters = [
      new Filter("Site ID", FilterOperator.Contains, sQuery),
      new Filter("Country Name", FilterOperator.Contains, sQuery),
      new Filter("Material Name", FilterOperator.Contains, sQuery),
      new Filter("Short Description", FilterOperator.Contains, sQuery),
      new Filter("Spend Currency Unit", FilterOperator.Contains, sQuery),
      new Filter("Weight Unit", FilterOperator.Contains, sQuery)
    ];

    // Handle numeric inputs for materialid, spendinmillions, weight
    const fNum = parseFloat(sQuery);
    if (!isNaN(fNum)) {
      aFilters.push(
        new Filter("Material ID", FilterOperator.EQ, fNum),
        new Filter("Spend (in Millions)", FilterOperator.EQ, fNum),
        new Filter("Weight", FilterOperator.EQ, fNum)
      );
    }

    const oMultiFilter = new Filter({
      filters: aFilters,
      and: false // OR logic
    });

    this.byId("table").getBinding("rows").filter(oMultiFilter);
  },

    onEditPress: function(oEvent){
      var that = this;
      // this.getView().byId("btSave").setVisible(true);
      // this.getView().byId("btRun").setVisible(false);

      var oButton = oEvent.getSource().getParent();
      var aCells = oButton.getCells();
      var oVBox = aCells[9]; 
      //var oInput = aCells[10];  
      var oSelect = oVBox.getItems()[0];
      
      if (oSelect) {
       // oInput.setEditable(oInput.getEditable() === false);
        oSelect.setEditable(oSelect.getEditable() === false);
      }
      
      //  const oContext = oEvent.getSource().getBindingContext();
      //  const oModel = oContext.getModel();
      // const sPath = oContext.getPath();
  
      // Update the model to enable the dropdown for this row
     // oModel.setProperty(sPath + "/isDropdownEnabled", true);
     

    },
    _getFileUploader: function () {
      return this.getView().byId("fileUploaderDialog");
    },
     /**
   * Triggerd on click of execute button
   * frames the payload and calls _sendPayload function
   * @private
   */
     _uploadFileExecute: function () {
      const that = this;
      BusyIndicator.show(0);
      return new Promise(async function (resolve, reject) {
        const oFileUploader = that._getFileUploader();
        const oFile = oFileUploader.oFileUpload.files[0];
        const oFileName = oFile.name;
        sap.ui.getCore().fileUploadArr = [];
        const mimeDet = oFile.type;
       // let sCurrentUserEmailID ="g.lakshmi.dhandapani@accenture.com"
        let file1 = await that._base64conversionMethod(mimeDet, oFileName, oFile);
        if (file1) {
          let payload = {
            "payload": [
              {
                "data": file1
              }
            ]
          };
          that._sendPayload(payload);
        }
      });
    },
     /**
    *  Method to convert the uploaded file to base64
    @param {Object} fileMime, fileName, fileDetails, DocNum passed as param to upload the file
    * @private
    */
    _base64conversionMethod: async function (fileMime, fileName, fileDetails, DocNum) {
      return new Promise((resolve, reject) => {
        const that = this;
        if (!FileReader.prototype.readAsBinaryString) {
          FileReader.prototype.readAsBinaryString = function (fileData) {
            const binary = "";
            const reader = new FileReader();
            reader.onload = async function (e) {
              const bytes = new Uint8Array(reader.result);
              const length = bytes.byteLength;
              for (const i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              that.base64ConversionRes = await btoa(binary);
              sap.ui.getCore().fileUploadArr.push({
                "DocumentType": DocNum,
                "MimeType": fileMime,
                "FileName": fileName,
                "Content": that.base64ConversionRes,
              });
            };
            reader.readAsArrayBuffer(fileData);
          };
        }
        const reader = new FileReader();
        reader.onload = async function (readerEvt) {
          const binaryString = readerEvt.target.result;
          that.base64ConversionRes = await btoa(binaryString);
          await sap.ui.getCore().fileUploadArr.push({
            "DocumentType": DocNum,
            "MimeType": fileMime,
            "FileName": fileName,
            "Content": that.base64ConversionRes,
          });
          let excelpayload = new sap.ui.getCore().fileUploadArr[0].Content;
          resolve(excelpayload);
        };
        reader.readAsBinaryString(fileDetails);
      });
    },
      /**
   * Triggerd on click of execute button
   * validation for file and  mandatory check for plant is handled in this fucntion
   * @private
   */
      _chkFile: function () {
          const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
          const oFile = this._getFileUploader().oFileUpload.files[0];
          return new Promise(function (resolve, reject) {
            if (typeof oFile === UIConstants.undefined) {
              MessageBox.error(oResourceBundle.getText('fileValidation'));
              return reject();
            }
            else if (plantCd.length === 0) {
              MessageBox.error(oResourceBundle.getText('mandatoryChck'));
            }
            else {
              resolve();
            }
          });
  
        },
        _sendPayload: async function (payload) {
          const that = this;
          const oResourceBundle = that.getView().getModel("i18n").getResourceBundle();
          BusyIndicator.show(0);
          return await this.PackagingService.uploadData(payload).then(
            function (data) {
              BusyIndicator.hide();
  
              if (data.data) {
  
               
              } else {
  
                MessageBox.error(oResourceBundle.getText("errorMsg"), {
                  onClose: function () {
                    //that._resetFields();
                  }
                });
              }
            }.bind(this),
            function (error) {
              BusyIndicator.hide();
              const oerrMsg = JSON.parse(error.responseText).error.message.value;
              MessageBox.error(oerrMsg, {
                onClose: function () {
                  //that._resetFields();
                }
              });
            }.bind(this));
        },
     
      onImportExcel: function () {
        this.byId("fuV1000FileUploaderId").$().find("input")[0].click();  // This triggers the file dialog
      },
      
    
    onFileSelected: function (oEvent) {
      var file = oEvent.getParameter("files")[0];
      if (file) {
          var reader = new FileReader();
          reader.onload = function (e) {
              var data = e.target.result;
              var workbook = XLSX.read(data, { type: "binary" });
              var sheetName = workbook.SheetNames[0];
              var worksheet = workbook.Sheets[sheetName];
              var jsonData = XLSX.utils.sheet_to_json(worksheet);
  
              // 🔸 Check if the file is empty (no data rows)
              if (!jsonData || jsonData.length === 0) {
                  MessageBox.error("Please fill all the mandatory fields.");
                  return;
              }
  
              // 🔸 Mandatory field validation
              var requiredFields = ["Site ID", "Country Name", "Material ID","Material Name", "Short Description"];
              var isValid = jsonData.every(row =>
                  requiredFields.every(field => row[field] && row[field].toString().trim() !== "")
              );
  
              if (!isValid) {
                  MessageBox.error("Please fill all the mandatory fields.");
                  return;
              }
  
              // 🔸 Set the model to the view (or to specific control if needed)
              var oModel = new sap.ui.model.json.JSONModel();
              oModel.setData({ results: jsonData });
              // this.getView().setModel(oModel, "excelData");
  
          }.bind(this);
          reader.readAsBinaryString(file);
      }
      
  },
  onFileSelected: function (oEvent) {
    const oFile = oEvent.getParameter("files")[0];
    if (oFile) {
        this._selectedFile = oFile;
    }
},
// onUploadFile: function () {
//     if (!this._selectedFile) {
//         sap.m.MessageToast.show("Please select a file first.");
//         return;
//     }
//     //this._uploadFileExecute();
    
//       var reader = new FileReader();
//       reader.onload = function (e) {
//           var data = e.target.result;
//           var workbook = XLSX.read(data, { type: "binary" });
//           var sheetName = workbook.SheetNames[0];
//           var worksheet = workbook.Sheets[sheetName];
//           var jsonData = XLSX.utils.sheet_to_json(worksheet);

//           // 🔸 Check if the file is empty (no data rows)
//           if (!jsonData || jsonData.length === 0) {
//               MessageBox.error("Please fill all the mandatory fields.");
//               return;
//           }

//           // 🔸 Mandatory field validation
//           var requiredFields = ["Site ID", "Packaging ID", "Configuration", "Short Description"];
//           var isValid = jsonData.every(row =>
//               requiredFields.every(field => row[field] && row[field].toString().trim() !== "")
//           );

//           if (!isValid) {
//               MessageBox.error("Please fill all the mandatory fields.");
//               return;
//           }

//           // 🔸 Set the model to the view (or to specific control if needed)
//           var oModel = new sap.ui.model.json.JSONModel();
//           oModel.setData({ results: jsonData });
//           // this.getView().setModel(oModel, "excelData");

//           console.log("Parsed Excel Data:", jsonData);
//           this._oUploadDialog.close();
//         }.bind(this);
     
//       reader.readAsBinaryString(this._selectedFile);
  
    
// },
//   onUploadFile: function () {
//     if (!this._selectedFile) {
//         sap.m.MessageToast.show("Please select a file first.");
//         return;
//     }

//     const requiredFields = ["Site ID", "Country Code", "Material ID","Material Name", "Short Description"];
//     const that = this;

//     var reader = new FileReader();
//     reader.onload = function (e) {
//         var data = e.target.result;
//         var workbook = XLSX.read(data, { type: "binary" });
//         var sheetName = workbook.SheetNames[0];
//         var worksheet = workbook.Sheets[sheetName];
//         var jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // ensures missing cells are empty strings

//         // 🔹 File is empty
//         if (!jsonData || jsonData.length === 0) {
//             MessageBox.error("Please fill all the mandatory fields.");
//             return;
//         }

//         // 🔹 Field-level validation with row numbers
//         let invalidRows = [];
//         jsonData.forEach((row, index) => {
//             let isValid = requiredFields.every(field => row[field] && row[field].toString().trim() !== "");
//             if (!isValid) {
//                 invalidRows.push(index + 2); // +2 because Excel is 1-based and header is row 1
//             }
//         });

//         if (invalidRows.length > 0) {
//             MessageBox.error(
//                 `Please fill all the mandatory fields.\nMissing fields Row Numbers : ${invalidRows.join(", ")}`
//             );
//             return;
//         }

//         // ✅ Valid data
//         var oModel = new sap.ui.model.json.JSONModel();
//         oModel.setData({ results: jsonData });
//         // that.getView().setModel(oModel, "excelData"); // optional

//         console.log("Parsed Excel Data:", jsonData);
//         that._oUploadDialog.close();
//     };
//     reader.readAsBinaryString(this._selectedFile);
// },

onUploadFile: function () {
  this.getView().getModel("excelData").setProperty("isDropdownEnabled",false);    
if (!this._selectedFile) {
    sap.m.MessageToast.show("Please select a file first.");
    return;
}

const requiredFields = ["Site ID", "Country Name", "Material ID", "Material Name", "Short Description"];
const that = this;
this.loadXLSXLibrary().then(function () {
 // var file = oEvent.getParameter("files")[0];
var reader = new FileReader();
reader.onload = function (e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, { type: "binary" });
    var sheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[sheetName];
    var jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    // ✅ Check if Excel is completely empty or has only headers
    if (!jsonData || jsonData.length === 0) {
        MessageBox.error("Please fill all the mandatory fields.");
        that.getView().getModel("excelData").setData({ results: [] });
        return;
    }

    let invalidRowIndexes = [];

    jsonData.forEach((row, index) => {
        let isValid = requiredFields.every(field => row[field] && row[field].toString().trim() !== "");
        if (!isValid) {
            // Excel row numbers start at 2 (1 for header)
            invalidRowIndexes.push(index + 2);
        }
    });

    if (invalidRowIndexes.length > 0) {
        MessageBox.error(
            "Please fill all the mandatory fields.\nMissing fields Row Numbers: " + invalidRowIndexes.join(", ")
        );
        that.getView().getModel("excelData").setData({ results: [] });
        return;
    }

    // All rows are valid — bind to model
    // var oModel = new sap.ui.model.json.JSONModel();
    // oModel.setData({ results: jsonData });
    // that.getView().setModel(oModel, "excelData");
    that.getOwnerComponent().getModel("locModel").setProperty("/excelData",jsonData);

    if(jsonData || jsonData.length > 0){
      that.onSaveChanges();
    }

   // MessageBox.success("File uploaded and validated successfully.");

    if (that._oUploadDialog) {
        that._oUploadDialog.close();
    }
};

reader.readAsBinaryString(that._selectedFile);
}).catch(function (error) {
console.error(error);
});

},




onOpenUploadDialog: function () {
 const _getFileUploader= this.getView().byId('fileUploaderDialog');
 if(_getFileUploader){
  _getFileUploader.clear();
  this._selectedFile="";
 }
    if (!this._oUploadDialog) {
        this._oUploadDialog = new sap.m.Dialog({
            title: "Upload Excel File",
            contentWidth: "400px",
            content: [
                new sap.ui.unified.FileUploader({
                    id: this.createId("fileUploaderDialog"),
                    name: "upload",
                    fileType: ["xlsx", "csv"],
                    change: this.onFileSelected.bind(this)
                })
            ],
            beginButton: new sap.m.Button({
                text: "Upload",
                press: this.onUploadFile.bind(this)
            }),
            endButton: new sap.m.Button({
                text: "Close",
                press: function () {
                    this._oUploadDialog.close();
                }.bind(this)
            })
        });
    }

    this._oUploadDialog.open();
},
onExport: function () {
//   const oModel = this.getView().getModel("excelData");

//   if (!oModel || !oModel.getData().results || oModel.getData().results.length === 0) {
//       sap.m.MessageBox.warning("No data available to export.");
//       return;
//   }
//   const aData = oModel.getData().results;

//   this.loadXLSXLibrary().then(function () {

// const worksheet = XLSX.utils.json_to_sheet(aData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");
  
//   XLSX.writeFile(workbook, "PackagingEFData.xlsx");

// }).catch(function (error) {
// console.error(error);
// });
const oModel = this.getView().getModel("excelData");
 
  if (!oModel || !oModel.getData().results || oModel.getData().results.length === 0) {
      sap.m.MessageBox.warning("No data available to export.");
      return;
  }
 
  var aData = oModel.getData().results;
   

  this.loadXLSXLibrary().then(function () {
    var worksheet = XLSX.utils.json_to_sheet(aData);
  const headersToKeep = ["Site ID", "Country Name", "Material ID", "Material Name", "Short Description", "Weight", "Weight Unit", "Spend (in Millions)", "Spend Currency Unit", "mapped_activity_id", "Total Emission", "error_status"];  // Replace with your actual field names
 
  // Create filtered data array containing only the selected columns
  const filteredData = aData.map(item =>
    Object.fromEntries(
      headersToKeep.map(h => [h, item[h]])
    )
  );
 // Generate worksheet and workbook with specified headers order
  var worksheet = XLSX.utils.json_to_sheet(filteredData, { header: headersToKeep });
  var workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");
 
 
  XLSX.writeFile(workbook, "PackagingEFData.xlsx");
      }).catch(function (error) {
console.error(error);
  });
 
 
  
},
onFilter: function () {
  var oSmartTable = this._getSmartTable();
  if (oSmartTable) {
    oSmartTable.openPersonalisationDialog("Filter");
  }
},
_getSmartTable: function () {
  if (!this._oSmartTable) {
    this._oSmartTable = this.getView().byId("smartTable");
  }
  return this._oSmartTable;
},


    
    });
});