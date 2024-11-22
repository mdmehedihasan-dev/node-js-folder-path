const http = require("http");
const fs = require('fs')
const path = require('path')
// console.log(path.join(__dirname,"mehedi"))

const BASE_FOLDER = path.join(__dirname,"folders")
let parseRequestBody = (req) => {
  return new Promise((resolve,rejects)=>{
    let body = ""
    req.on('data',chunk=>{
      body +=chunk.toString();
      // console.log(chunk)
    })
    req.on('end',()=>{
      try {
        resolve(JSON.parse(body))
      } catch (error) {
        rejects(error)
      }
    })
  })
};

const sendJSONResponse = (res,statusCode,data)=>{
  res.writeHead(statusCode,{'Content-Type':'application/json'})
  res.end(JSON.stringify(data))
}

const server = http.createServer(async (req, res) => {
 
  if (req.url === "/api/create" && req.method == "POST") {
    const body = await parseRequestBody(req);
    const {folderPath} = body;
    console.log(folderPath);
    if(!folderPath){
      return sendJSONResponse(res,400,{'message':'Folder path is required'})
    }
    const fullPath = path.join(BASE_FOLDER,folderPath)
    // console.log(fullPath)
    if(!fs.existsSync(fullPath)){
      fs.mkdirSync(fullPath,{recursive:true})
      sendJSONResponse(res,200,{'message':'Folder created successfully'})
    }



  }
});


const PORT = 8000;
server.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});
