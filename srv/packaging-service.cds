service PackagingEFCalculation {

     action uploadFile( payload : array of fileUpload) returns array of resultMessage;
     action saveData() returns array of resultMessage;
 type fileUpload : {
    data       : LargeString;
    
 }
 type resultMessage:{
    Status:String;
    Message:String;
  }
}