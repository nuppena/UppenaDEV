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
console.log("URL OF XUAA" +api_def.credentials.url);
   // connect to the XSUAA host
   const xsuaa = await cds.connect.to(api_def);
    srv.on('uploadFile', async (request) => {
        try {
         console.log("I am in File upload");
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
      return await xsuaa.get("/userInfo");
  });

  srv.on('runAPI',async(request) =>{
    const yourData= {
      "User Name": "nagaraju_uppena"
      };
   const awsConnect= await cds.connect.to("AWSAPI");
   return await awsConnect.tx(request).post("/api/run",yourData)

  });

  srv.on('fetchAPI',async(request) =>{
    const yourData= {
       "User Name": "nagaraju_uppena"
       };
    const awsConnect= await cds.connect.to("AWSAPI");
    return await awsConnect.tx(request).post("/api/fetch",yourData)
   });
   srv.on('saveData',async(request) =>{

    const pcfMaterials = request.data.material;
   

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
    
    console.log("Payload123456" +JSON.stringify(savePayload));


    //console.log("Payload" +JSON.stringify(savePayload));
    const awsConnect= await cds.connect.to("AWSAPI");

    return await awsConnect.tx(request).post("/api/save",savePayload)
      });
};