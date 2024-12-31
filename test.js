const axios = require('axios')

const BACKEND_URL = "http://localhost:3000"

describe("Authentication ", ()=>{
    test('user is able to signup ', () => {
      const username = "Joshua" + Math.random();
      const password = "23456";


    const response =   axios.post(`{BACKEND_URL}/api/v1/user/signup`, {
        username,
        password,
        type: "admin"
      });

      expect(response.statusCode).tobe(200)

      const updatedResponse =   axios.post(`{BACKEND_URL}/api/v1/user/signup`, {
        username,
        password,
        type: "admin"
      });

      expect(updatedResponse.statusCode).tobe(400)
        });

    test('Signup request if user name is empty', async ()=>{
        const username = `Joshua ${Math.random()}`
        const password = "23456"

        const response =   axios.post(`{BACKEND_URL}/api/v1/user/signup`, {
            password,
        });
            
            
        expect(response.statusCode).tobe(400)
    })
    
    test("Signin if username and password are correct", async ()=>{
        const username =    `joshua-${Math.random()}`
        const password = "23456"
    
        axios.post(`{BACKEND_URL}/api/v1/user/signup`, {
            username,
            password,
            
          });

          const response =   axios.post(`{BACKEND_URL}/api/v1/user/signin`, {
            username,
            password,
           
          });
          expect(response.statusCode).tobe(200)
          expect(response.body.token).tobeDefined()
    })

    test("Signin if username and password are incorrect", async ()=>{
        const username =    `joshua-${Math.random()}`
        const password = "23456"
    
        axios.post(`{BACKEND_URL}/api/v1/user/signup`, {
            username,
            password,
            
          });

          const response =   axios.post(`{BACKEND_URL}/api/v1/user/signin`, {
            username = "Wrongusername",
            password,
           
          });
          expect(response.statusCode).tobe(403)
        //   expect(response.body.token).tobeDefined()
    })

    
});

describe("User MetaData Endpoints", ()=>{
    let token = ""
    let avatarId = ""; 


    beforeAll(async ()=>{
       const username = `Joshua-${Math.random()}`
       const password = "23456"

       await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username, 
        password,
        type:"admin"


       })

       const response = await  axios.post(`{BACKEND_URL}/api/v1/signin`,{
        username,
        password
       })

       token = response.data.token
    })


    test("user can't update meta data with a wrong avatar Id", async ()=>{
       const response = await axios.post(`{BACKEND_URL}/api/v1/user/metadata`, {
        avatarId :"13345435"
       },
       {


        headers: {
            "Authorization": `Bearer ${token}`
        }

       })

       expect(response.statusCode).tobe(400)
    })

    test("user can update their metadata to the ", async ()=>{
        const response = await axios.post(`{BACKEND_URL}/api/v1/user/metadata`, {
            avatarId 
           },
           {
    
    
            headers: {
                "Authorization": `Bearer ${token}`
            }
    
           })
    
           expect(response.statusCode).tobe(400)
    })

    test("user is not able to update metadata if the auth data isn't Present", async ()=>{
        const response = await axios.post(`{BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
           },
           {
    
    
            headers: {
                "Authorization": `Bearer ${token}`
            }
    
           })
    
           expect(response.statusCode).tobe(403)
    })

})


describe("user Avatar Information", ()=>{
  let avatarId;
  let token;
  let userId;

    beforeAll(async ()=>{

        const username = `Joshua-${Math.random()}`
        const password = "23456"
 
        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
         username, 
         password,
         type:"admin"
        },{
headers:{
    Authorization: `Bearer ${token}`
}
        });

        userId = signupResponse.data.userId

 
        const response = await  axios.post(`${BACKEND_URL}/api/v1/signin`,{
         username,
         password
        })
 
        token = response.data.token
     })

     test("get back Avatar Info for a user", async ()=>{

        axios.get (`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`)
        
        expect(response.data.avatars.length).toBe(1)
        expect(response.data.avatars[0].userId).toBe(userDefined);

})

 test("check Available avatars list", async()=>{
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);

    expect(response.data.avatars.length).not.toBe(0)
    const currentAvatar = response.data.avatars.find(x => x.id == avatarId)
    expect(currentAvatar).tobeDefined()
 })
  

})

describe("User Space information", ()=>{

    let element1Id;
    let userId; 
    let userToken 
    let adminToken
    let adminId
    let mapId
    let element2Id;

beforeAll(async ()=>{

    const username = `Joshua-${Math.random()}`
    const password = "23456"

    const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
     username, 
     password,
     type:"admin"
    });
    

    
    adminId = adminSignupResponse.data.adminId
    
    
    const adminSigninResponse = await  axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username,
        password
    })
    
    adminToken = adminSigninResponse.data.token


    const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username: username + "-user",
        password,
        type:"user",
       });
       
   
       
       userId = userSignupResponse.data.userId
       
       
       const userSigninResponse = await  axios.post(`${BACKEND_URL}/api/v1/signin`,{
           username: username + "-user",
           password
       })
       
       userToken = userSigninResponse.data.userToken

    const element1 = axios.post(`${BACKEND_URL}/api/v1/admin/element/`, {
        "ImageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        "width": 1,
        "height": 1,
        "static": true
    
    },{
        headers: {
            Authorization : `Bearer ${adminToken}`
        }
    });

    const element2 = axios.post(`${BACKEND_URL}/api/v1/admin/element/`, {
        "ImageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        "width": 1,
        "height": 1,
        "static": true
    
    },{
        headers: {
            Authorization : `Bearer ${adminToken}`
        }
    });

    element1Id = element1.id
    element2Id = element2.id

    const map = await axios.post(`${BACKEND_URL}/api/v1/map`, {
        "thumbnail": "https://via.placeholder.com/300x200.png?text=Object+File",
        "dimensions": "100x200",
        "defaultElements": [{
            elementId:element1Id,
            x:20,
            y:20
        },{
            elementId: element1Id,
            x:18,
            y:20
        },{
            elementId: element2Id,
            x:19,
            y:20
        }]
    },{
        headers:{
            Authorization: `Bearer ${adminToken}`
        }
    })

})
 test("create a new Space ", async()=>{
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
        "name": "test",
        "dimension":"100x200",
        "mapId": mapId
    },{
        headers:{
            Authorization: `Bearers ${userToken}`
        }
    })

 })

  test("user is able to create a space without mapId(Empty space)", async()=>{
   const response =  await axios.post(`${BACKEND_URL}/api/v1/space`, {
        "name":"Test",
        "dimension": "100x200"

    }, {
        headers:{
            Authorization: `Bearers ${userToken}`
        }
  })
    expect(response.spaceId).tobeDefined()
  })

  test("user is  not able to create a space without  mapId", async()=>{
   const response =  await axios.post(`${BACKEND_URL}/api/v1/space`, {
        "name":"Test",
   },{
    headers:{
        Authorization: `Bearers ${userToken}`
    }
})
    expect(response.statusCode).toBe(400)
  })

  test("user is  not able to delete a space doesn't exist", async()=>{
    const response =  await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`)
     expect(response.statusCode).toBe(400)
   },{
    headers:{
        Authorization: `Bearers ${userToken}`
    }
   })

  test("user is   able to delete a space that exist", async()=>{
    const response =  await axios.post(`${BACKEND_URL}/api/v1/space`, {
         "name":"Test",
         "dimension":"100x200"
    },{headers:{
        Authorization: `Bearers ${userToken}`
    }});

         const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`)
    
     expect(deleteResponse.statusCode).toBe(400)
   })

   test("user is  not able to delete a another user space", async()=>{
    const delresponse =  await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{
        headers:{
            Authorization: `Bearers ${adminToken}`
        }})

        expect(delresponse.statusCode).toBe(400)
})

 test("admin has no space initially", async () =>{

    const spaceCreateResponse = axios.post(`${BACKEND_URL}/api/v1/space/`, {
        "name": "Test",
        "dimensions": "`100x200"
    },{
        headers: {
            Authorization : `Bearer ${userToken}`
        }
    });

    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
    const filteredSpace = response.data.spaces.find(x => x.id == spaceCreateResponse.spaceId)
    expect(response.data.spaces.length).toBe(1)
    expect(filteredSpace).tobeDefined()

 })

})

describe("Arena Endpoint info", ()=>{

    let element1Id;
    let userId; 
    let userToken 
    let adminToken
    let adminId
    let mapId
    let element2Id;
    let spaceId

beforeAll(async ()=>{

    const username = `Joshua-${Math.random()}`
    const password = "23456"

    const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
     username, 
     password,
     type:"admin"
    });
    

    
    adminId = adminSignupResponse.data.adminId
    
    
    const adminSigninResponse = await  axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username,
        password
    })
    
    adminToken = adminSigninResponse.data.token


    const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username: username + "-user",
        password,
        type:"user",
       });
       
   
       
       userId = userSignupResponse.data.userId
       
       
       const userSigninResponse = await  axios.post(`${BACKEND_URL}/api/v1/signin`,{
           username: username + "-user",
           password
       })
       
       userToken = userSigninResponse.data.userToken

    const element1Response = axios.post(`${BACKEND_URL}/api/v1/admin/element/`, {
        "ImageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        "width": 1,
        "height": 1,
        "static": true
    
    },{
        headers: {
            Authorization : `Bearer ${adminToken}`
        }
    });

    const element2Response = axios.post(`${BACKEND_URL}/api/v1/admin/element/`, {
        "ImageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        "width": 1,
        "height": 1,
        "static": true
    
    },{
        headers: {
            Authorization : `Bearer ${adminToken}`
        }
    });

    element1Id = element1Response.id
    element2Id = element2Response.id

    const map = await axios.post(`${BACKEND_URL}/api/v1/map`, {
        "thumbnail": "https://via.placeholder.com/300x200.png?text=Object+File",
        "dimensions": "100x200",
        "defaultElements": [{
            elementId:element1Id,
            x:20,
            y:20
        },{
            elementId: element1Id,
            x:18,
            y:20
        },{
            elementId: element2Id,
            x:19,
            y:20
        }]
    },{
        headers:{
            Authorization: `Bearer ${adminToken}`
        }
    })
    mapId = map.id

    const space = await axios.post(`${BACKEND_URL}/api/v1/`, {
        "name":"Test",
        "dimensions": "100x200",
        "mapId": "map1"
        
    },{
        headers:{
            Authorization: `Bearer ${userToken}`
        }
    })
    spaceId = space.spaceId

})

 test("incorrect SpaceID returns a 400", async ()=>{
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/123489hcve`)
    expect(response.statusCode).toBe(400)
 })

 test("Correct SpaceID returns all elements", async ()=>{
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`)
    expect(response.data.dimension).toBe("100x200")
    expect(response.data.elements.length).toBe(2)
 })

 test("delete spaceID ", async ()=>{
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`)
 

    await axios.delete(`${BACKEND_URL}/api/v1/space/element`,{
        spaceId:spaceId,
        elementId: response.data.elements[0].id
    });

    const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`);

    expect(newResponse.data.elements.length).toBe(2)
 })


 test("adding an element if it fails if it lies outside the dimension ", async ()=>{
    const response = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
        "elementId": element1Id,
        "spaceId":spaceId,
        "x": 29200,
        "y":399000
    }, {
        headers:{
            Authorization: `Bearer ${userToken}`
        }
    })    


    expect(response.statusCode).toBe(404)
 })

 test("adding an element works as expected ", async ()=>{
    const response = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
        "elementId": element1Id,
        "spaceId":"123",
        "x": 50,
        "y":30
    }, {
        headers:{
            Authorization: `Bearer ${userToken}`
        }
    })    

    const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
        headers:{
            Authorization: `Bearer ${userToken}`
        }
    });

    expect(newResponse.data.elements.length).toBe(3)
 })

})

describe("Create an Element", ()=>{
  
    let userId; 
    let userToken 
    let adminToken
    let adminId

   

beforeAll(async ()=>{

    const username = `Joshua-${Math.random()}`
    const password = "23456"

    const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
     username, 
     password,
     type:"admin"
    });
    

    
    adminId = adminSignupResponse.data.adminId
    
    
    const adminSigninResponse = await  axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username,
        password
    })
    
    adminToken = adminSigninResponse.data.token


    const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username: username + "-user",
        password,
        type:"user",
       });
       
   
       
       userId = userSignupResponse.data.userId
       
       
       const userSigninResponse = await  axios.post(`${BACKEND_URL}/api/v1/signin`,{
           username: username + "-user",
           password
       })
       
       userToken = userSigninResponse.data.userToken

})

test("user is not able to hit admin endpoint", async ()=>{
    const elementResonse = axios.post(`${BACKEND_URL}/api/v1/admin/element/`, {
        "ImageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        "width": 1,
        "height": 1,
        "static": true
    
    },{
        headers: {
            Authorization : `Bearer ${userToken}`
        }
    });

    
    const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/map`, {
        "thumbnail": "https://via.placeholder.com/300x200.png?text=Object+File",
        "dimensions": "100x200",
        "defaultElements": []
    },{
        headers:{
            Authorization: `Bearer ${userToken}`
        }
    })

    const AvatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
        "imageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        "name": "timmy"
    },{
        headers:{
            Authorization: `Bearer ${userToken}`
        }
    })

    const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`, {
        "imageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        
    },{
        headers:{
            Authorization: `Bearer ${userToken}`
        }
    })
    
    expect(elementResonse.statusCode).toBe(403);
    expect(mapResponse.statusCode).toBe(403);
    expect(AvatarResponse.statusCode).toBe(403);
    expect(updateElementResponse.statusCode).toBe(403);

})

test("user is  able to hit admin endpoint", async ()=>{
    const elementResonse = axios.post(`${BACKEND_URL}/api/v1/admin/element/`, {
        "ImageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        "width": 1,
        "height": 1,
        "static": true
    
    },{
        headers: {
            Authorization : `Bearer ${adminToken}`
        }
    });

    
    const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/map`, {
        "thumbnail": "https://via.placeholder.com/300x200.png?text=Object+File",
        "dimensions": "100x200",
        "defaultElements": []
    },{
        headers:{
            Authorization: `Bearer ${adminToken}`
        }
    })

    const AvatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
        "imageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        "name": "timmy"
    },{
        headers:{
            Authorization: `Bearer ${adminToken}`
        }
    })

    const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`, {
        "imageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        
    },{
        headers:{
            Authorization: `Bearer ${userToken}`
        }
    })
    
    expect(elementResonse.statusCode).toBe(200);
    expect(mapResponse.statusCode).toBe(200);
    expect(AvatarResponse.statusCode).toBe(200);
    expect(updateElementResponse.statusCode).toBe(403);

})
 test("admin is able to update the imageUrl for an Element", async ()=>{
   
    const elementResonse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
         "imageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        "width": 1,
        "height":1,
        "static": true
    }, {
        headers:{
            Authorization: `Bearer ${adminToken}`
        }
    })
   
    const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResonse.data.id}`, {
        "imageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
        
    },{
        headers:{
            Authorization: `Bearer ${adminToken}`
        }
    })
    
    expect(updateElementResponse.statusCode).toBe(200);
 })
 
 
})

describe("Websocket tests",  ()=>{
    let adminToken;
    let adminUserId;;
    let spaceId;
    let userToken;
    let userId;
    let element1Id;
    let element2Id;
    let mapId;
    let ws1;
    let ws2;
    let ws1Messages = []
    let ws2Messages = []


 function waitForAndPopLatestMessage(msgArr){
    return new Promise(r =>{
        if(msgArr.length > 0){
            resolve(msgArr.shift())
        }else{
          let interval =  setInterval(() => {
                if(msgArr.length > 0){
                   resolve(msgArr.shift())
                   clearInterval(interval)
                }
            }, 100);
        }
 })
}

   async  function setupHTTP() {

    }
  async  function setUpWs(){
        ws1 = new WebSocket(WS_URL)
        ws2 = new WebSocket(WS_URL)

        await new Promises(r => {
            ws1.onopen = r
        })

        await new Promises(r => {
           ws2.onopen = r;
        })

        ws1.onmessage = (event)=>{
            ws1.push(JSON.parse(event.data))
        }

        ws2.onmessage = (event)=>{
            ws2.push(JSON.parse(event.data))
        }

    }

    

    beforeAll(async ()=>{
        const username = `Joshua - ${Math.random()}` 
        const password = "23456"

        const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            role: "admin"
        })
        const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password,
           
        })


        adminUserId = adminSignupResponse.data.userId;
        adminToken = adminSigninResponse.data.token;


        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username : username + `-user`,
            password
        })

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username : username + `-user`,
            password
        })

        userId = userSignupResponse.data.userId;
        adminToken = userSigninResponse.data.token;


        const element1Response = axios.post(`${BACKEND_URL}/api/v1/admin/element/`, {
            "ImageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
            "width": 1,
            "height": 1,
            "static": true
        
        },{
            headers: {
                Authorization : `Bearer ${adminToken}`
            }
        });
    
        const element2Response = axios.post(`${BACKEND_URL}/api/v1/admin/element/`, {
            "ImageUrl": "https://via.placeholder.com/300x200.png?text=Object+File",
            "width": 1,
            "height": 1,
            "static": true
        
        },{
            headers: {
                Authorization : `Bearer ${adminToken}`
            }
        });
    
        element1Id = element1Response.id
        element2Id = element2Response.id
    
        const map = await axios.post(`${BACKEND_URL}/api/v1/map`, {
            "thumbnail": "https://via.placeholder.com/300x200.png?text=Object+File",
            "dimensions": "100x200",
            "defaultElements": [{
                elementId:element1Id,
                x:20,
                y:20
            },{
                elementId: element1Id,
                x:18,
                y:20
            },{
                elementId: element2Id,
                x:19,
                y:20
            }]
        },{
            headers:{
                Authorization: `Bearer ${adminToken}`
            }
        })
        mapId = map.id
    
        const space = await axios.post(`${BACKEND_URL}/api/v1/`, {
            "name":"Test",
            "dimensions": "100x200",
            "mapId": "map1"
            
        },{
            headers:{
                Authorization: `Bearer ${userToken}`
            }
        })
        spaceId = space.spaceId
    

    })

})
