service PackagingEFCalculation {

     action uploadFile( payload : array of fileUpload) returns array of resultMessage;
     action saveData() returns String;
 type fileUpload : {
    data       : LargeString;
    
 }
 type resultMessage:{
    Status:String;
    Message:String;
  }
}