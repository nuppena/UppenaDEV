const cds = require('@sap/cds');
const validation = require('./util/validations');
const onPrem = require('./onPrem/onPrem');
const {createLogger} = require('@sap-cloud-sdk/util');
const log = createLogger('goods-servicejs');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
module.exports = async (srv) => {
   // API reference
   const apiURL = 'xsuaa_api';

   // Get the XSUAA host URL from service binding
   const xsuaa_bind = JSON.parse(process.env.VCAP_SERVICES).xsuaa[0];
   
   const api_def = cds.env.requires[apiURL];
   
   api_def.credentials.url = xsuaa_bind.credentials.url;

   // connect to the XSUAA host
   const xsuaa = await cds.connect.to(api_def);
    srv.on('uploadFile', async (request) => {
        try {
         
          const updFileData = validation.base64ToJSON(request.data.payload[0].data);
          payloadsample=
          {
              "UserName" : "u1234",
              "Industry" : "Dairy",
              "Material Details":  MaterialDetails              
          };
         for(let i=0;i<updFileData.items.length;i++)
         {
        
         }
         
          
          
         
        } catch (error) {
          log.info("createSchedule service response............")
          return request.error({
            message: constants.JOBFAILED,
            status: constants.FAILSTATUS,
          });
        }
      });
      srv.on('userInfo', req => {
        const user = {
            id : req.user.id,
            tenant : req.user.tenant,
            _roles: req.user._roles,
            attr : req.user.attr
        }
console.log("User Info" + user);
        return user;
    });
    // using the XSUAA API
    srv.on('userInfoUAA', async () => {
      return await xsuaa.get("/userinfo");
  });

  srv.on('runAPI',async(request) =>{
    const yourData= {
      "User Name": "u1234"
      };
   const awsConnect= await cds.connect.to("AWSAPI");
   return await awsConnect.tx(request).post("/api/run",yourData)

  });

  srv.on('fetchAPI',async(request) =>{
    const yourData= {
       "User Name": "u1234"
       };
    const awsConnect= await cds.connect.to("AWSAPI");
    return await awsConnect.tx(request).post("/api/fetch",yourData)
   });

   srv.on('editData',async(request) =>{
    const eArray=[];
    const pcfEditpay = request.data.editPayload;

    for(let i=0;i<pcfEditpay.length;i++)
      {
        eArray.push( {
          "row_id": pcfEditpay[i].row_id,
          "active_result_id": pcfEditpay[i].active_result_id,
          "Total Emission": pcfEditpay[i].Total_Emission
      })
      }


      const editPayload1 = {
        "edit_request":eArray
              }

     //console.log("Payload" +JSON.stringify(savePayload));
    const awsConnect= await cds.connect.to("AWSAPI");
     return await awsConnect.tx(request).post("/api/edit",editPayload1)
  
   });

   srv.on('saveData',async(request) =>{

    const pcfMaterials = request.data.material;
  console.log("Use Infor in SAVE" + request.user.id);
    const mArray=[];

    for(let i=0;i<pcfMaterials.length;i++)
      {
        mArray.push( {
          "Site ID": pcfMaterials[i].Site_ID,
          "Country Name": pcfMaterials[i].Country_Name,
          "Material ID": pcfMaterials[i].Material_ID,
          "Material Name": pcfMaterials[i].Material_Name,
          "Short Description": pcfMaterials[i].Short_Description,
          "Weight": pcfMaterials[i].Weight,
          "Weight Unit": pcfMaterials[i].Weight_Unit,
          "Spend (in Millions)": pcfMaterials[i].Spend,
          "Spend Currency Unit": pcfMaterials[i].Spend_Currency_Unit
      })
      }

    const savePayload = {
      "User Name": request.data.uName,
      "Industry": request.data.Industry,
     "Material Details":mArray
    }
    
      //console.log("Payload" +JSON.stringify(savePayload));
    const awsConnect= await cds.connect.to("AWSAPI");
try{
    return await awsConnect.tx(request).post("/api/save",savePayload)
}
catch(err) {
  console.log("err------------>", err)
  return err;
  //return res.status(500).send({ret_code: ReturnCodes.SOMETHING_WENT_WRONG});
} 
      });
};