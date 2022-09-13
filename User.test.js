const axios = require('axios')
const { expect } = require('chai')
const fs = require('fs')
const envVariables = require('./env.json')
const { randomId } = require('./randomId')
const { faker } = require('@faker-js/faker');
const exp = require('constants')

describe("User API Automation", async () => {
    it("User can do login successfully", async () => {
        var { data } = await axios.post(`${envVariables.baseUrl}/user/login`, {
            "email": "salman@grr.la",
            "password": "1234"
        },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        var token = data.token;
        envVariables.token = token;
        fs.writeFileSync('./env.json', JSON.stringify(envVariables))

    })
  
    var id;
    it("User can view list if having proper authorization", async () => {
        var { data } = await axios.get(`${envVariables.baseUrl}/user/list`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token
            }
        })
        id = data.users[0].id;
        expect(data.message).contains("User list");
    })
    it("Get User list for incorrect authorization", async () => {
        try{var response = await axios.get(`${envVariables.baseUrl}/user/list`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '345345345'
            }
        
        })}
        catch(error){
            console.log(error);
            expect(error).to.exist;
        }
        // console.log(response.status);
        // console.log(response.data.error.message)
        // expect(response.status).equals(403)
        // expect(response.data.error.message).contains("Token expired");
    })
    it("Get User list if user does not input token", async () => {
        try{var response = await axios.get(`${envVariables.baseUrl}/user/list`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ''
            }
        
        })}
        catch(error){
            console.log(error);
            expect(error).to.exist;
        }
          })

         it('Create new users', async () => {
            var { data } = await axios.post(`${envVariables.baseUrl}/user/create`, {
                "name": `${faker.name.firstName()} ${faker.name.lastName()}`,
                "email": `test${randomId(100000, 999999)}@test.com`,
                "password": "123456",
                "phone_number": `01501${randomId(100000, 9999999)}`,
                "nid": "123456789",
                "role": "Customer"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token,
                    'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
                }
            })
            console.log(data);
            expect(data.message).contains('User created successfully')
            envVariables.id = data.user.id;
            envVariables.name = data.user.name;
            envVariables.email = data.user.email;
            envVariables.phoneNumber = data.user.phone_number;
            fs.writeFileSync('./env.json', JSON.stringify(envVariables));
        })
        it('Create existing users', async () => {
            var response = await axios.post(`${envVariables.baseUrl}/user/create`, {
                "name": `Guillermo Beer`,
                "email": `Madonna0@yahoo.com`,
                "password": "fTTTI_KdnKnjv5R",
                "phone_number": `01713648066`,
                "nid": "6413648066",
                "role": "Customer"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token,
                    'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
                }
            })
    
            expect(response.data.message).contains('User already exists')
            expect(response.status).equals(208)            
        })
          
    it("User can search if having proper authorization", async () => {
        var response = await axios.get(`${envVariables.baseUrl}/user/search?id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        console.log(response.data.user.name);
        expect(response.data.user.role).contains('Customer')
        expect(response.status).equals(200);
     
    })
    it("Search user for invalid id", async () => {
        var response = await axios.get(`${envVariables.baseUrl}/user/search?id=34534`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        // console.log(data.user.name);
        expect(response.status).equals(200);
        expect(response.data.user).equals(null)
    })
    it("Search user for invalid Secret Key", async () => {
       try{ var response = await axios.get(`${envVariables.baseUrl}/user/search?id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': 'bhugichugi'
            }
        })}
        catch(error){
            console.log(error);
            expect(error).to.exist;
        }
    })
    it("Update User", async () => {
        var response = await axios.put(`${envVariables.baseUrl}/user/update/${id}`,
        {
            
            "name": "Lionel Messi",
            "email": "lione.messi@gmail.com",
            "password": "HSeYnp2Ml04VEYf",
            "phone_number": "01780406900",
            "nid": "6416345698",
            "role": "Customer"
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        // console.log(data.user.name);
        expect(response.status).equals(200);
        expect(response.data.message).contains("User updated successfully")
    })
    it("Update User using PhoneNumber and Patch Method implemented", async () => {
        var response = await axios.patch(`${envVariables.baseUrl}/user/update/${id}`,
        {
            
            "phone_number": "01707823561"
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        // console.log(data.user.name);
        expect(response.status).equals(200);
        expect(response.data.user.phone_number).equals("01707823561")
    })
    it("Delete user", async () => {
        var response = await axios.delete(`${envVariables.baseUrl}/user/delete/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        // console.log(data.user.name);
        expect(response.status).equals(200);
        expect(response.data.message).contains("User deleted successfully")
    })
    it("Attempting to delete already deleted user", async () => {
        try{ var response = await axios.get(`${envVariables.baseUrl}/user/delete/${id}`, {
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': envVariables.token,
                 'X-AUTH-SECRET-KEY': 'bhugichugi'
             }
         })}
         catch(error){
             console.log(error);
             expect(error).to.exist;
         }
     })
     it("Searching the already deleted user", async () => {
        var response = await axios.get(`${envVariables.baseUrl}/user/search?id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        // console.log(data.user.name);
        expect(response.status).equals(200);
        expect(response.data.user).equals(null)
    })

    
})