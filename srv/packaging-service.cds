using { sap.common.Locale } from '@sap/cds/common';

service PackagingEFCalculation {

   


     action uploadFile( payload : array of fileUpload) returns array of resultMessage;
     action saveData(uName: String, Industry: String, material: array of savePay) returns String;
     function userInfoUAA() returns String;
     action fetchAPI() returns String;
      action runAPI() returns String;
 type fileUpload : {
    data       : LargeString;
    
 }

 type savePay:{
    Site_ID : String;
    Country_Name: String;
    Material_ID:Integer;
    Material_Name: String;
    Short_Description:String;
    Weight:Decimal;
    Weight_Unit:String;
    Spend:Decimal;
    Spend_Currency_Unit:String;
 }
 type resultMessage:{
    Status:String;
    Message:String;
  }
}