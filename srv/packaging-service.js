const cds = require('@sap/cds');
const validation = require('./util/validations');
const onPrem = require('./onPrem/onPrem');
const {createLogger} = require('@sap-cloud-sdk/util');
const log = createLogger('goods-servicejs');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
module.exports = async (srv) => {
    srv.on('uploadFile', async (request) => {
        try {
         
          const updFileData = validation.base64ToJSON(request.data.payload[0].data);
          payloadsample=
          {
              "UserName" : "test",
              "Industry" : "Dairy",
              "Material Details":  MaterialDetails              
          };
         for(let i=0;i<updFileData.items.length;i++)
         {
        
         }
         
          console.log(updFileData);
          
         
        } catch (error) {
          log.info("createSchedule service response............")
          return request.error({
            message: constants.JOBFAILED,
            status: constants.FAILSTATUS,
          });
        }
      });
      srv.on('saveData',async(request) =>{

       const yourData= {
          "User Name": "debjit_123"
          };

        
const awsConnect= await cds.connect.to("AWSAPI");

return await awsConnect.tx(request).post("/api/fetch",
  yourData
)
      });
};