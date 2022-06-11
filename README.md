# Pmed-api-dev
## SET UP PMED API PROJECT AND DEPLOY TO GOOGLE CLOUD

- To deploy this api you need google cloud account
------------------------------------------------------------------------------------------
1. First open cloud shell to create vpc network pmed-vpc-web-server-prod

   ```shell
   gcloud compute networks create pmed-vpc-web-server-prod --subnet-mode=custom --mtu=1460 --bgp-routing-mode=regional
   ```
   ```shell
   gcloud compute networks subnets create pmed-vpc-asia-southeast-2 --range=10.128.0.0/24 --stack-type=IPV4_ONLY --network=pmed-vpc-web-server-prod --region=asia-southeast2
   ```
2. create vm instance for web server api. make sure This vm does not have an external ip because we will ssh using an identity aware proxy.
    ```shell
     gcloud compute instances create pmed-web-server --zone=asia-southeast2-a --machine-type=e2-micro --network-interface=subnet=pmed-vpc-asia-southeast-  2,no-address --create-disk=auto-delete=yes,boot=yes,device-name=pmed-web-server,image=projects/ubuntu-os-cloud/global/images/ubuntu-1804-bionic-20220530,mode=rw,size=10
     ```
3. Create firewall rules to allow ssh from iap(identity aware proxy) tcp 22.

   ```shell
   gcloud compute firewall-rules create allow-ssh-ingress-from-aip-pmed-web-server --direction=INGRESS --priority=1000 --network=pmed-vpc-web-server-prod --action=ALLOW --rules=tcp:22 --source-ranges=35.235.240.0/20
   ```
4. After create vpc , vm and set up firewall rules. go to to create postgresql instance.

## Documentaion PMED API

- Base url: {{enter your link}}

------------------------------------------------------------------------------------------

#### Register user

<details>
 <summary><code>POST</code> <code><b>/register</b></code> <code>(register user)</code></summary>

##### Body

> | name      |  is required     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | username      |  true | string   | must be unique  |
> | fullname      |  true | string   | N/A  |
> | email         |  true | string   | must be unique  |
> | age           |  true | number   | N/A  |
> | gender        |  true | string   | N/A  |
> | password      |  true | string   | N/A  |


##### Status code

> | http code     |  description                                                        |
> |---------------|---------------------------------------------------------------------|
> | `201`         | `user successfully created`                                         |
> | `400`         | `it cause body not contain needed property or not meet data type`   |
> | `500`         | `server error`                                                      |

##### Example response
```JSON
{
 "status": "success",
 "message": "successfully registered user, please verify email to log in",
 "data": {
    "userId": "user-123",
    "token": "ecrytped data",
  },
},
```

##### Example Fetch javasript

```javascript
  const request = await fetch(`${BASEURL}/register`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          username,
          fullname,
          email,
          age,
          gender,
          password,
        }),
      });

  return request.json();
```

</details>

#### Request otp

<details>
 <summary><code>POST</code> <code><b>/req-otp</b></code> <code>(it will be sent otp via email)</code></summary>

##### Body

> | name      |  is required     | data type               | description                                                    |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | token      |  true | string   | you will get this token when you register and login if email not verified  |


##### Status code

> | http code     |  description                                                        |
> |---------------|---------------------------------------------------------------------|
> | `200`         | `successfully send otp to xxxx@gmail.com`                                                      |
> | `400`         | `it cause body not contain needed property or not meet data type`   |
> | `500`         | `server error`                                                                     |

##### Example response
```JSON
{
 "status": "success",
 "message": "successfully send otp to xxxx@gmail.com",
},
```

##### Example Fetch javasript

```javascript
  const request = await fetch(`${BASEURL}/req-otp`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          token,
        }),
      });

  return request.json();
```
</details>

#### Verify otp

<details>
 <summary><code>POST</code> <code><b>/verifyotp</b></code> <code>(verify otp that has been sent via email. otp will expire in 5 minutes)</code></summary>

##### Body

> | name      |  is required     | data type               | description                                                    |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | token      |  true | string   | you will get this token when you register and login if email not verified  |
> | otp      |  true | number   | put otp from your email  |


##### Status code

> | http code     |  description                                                        |
> |---------------|---------------------------------------------------------------------|
> | `200`         | `successfully verified email`                                     |
> | `400`         | `it cause body not contain needed property or not meet data type or otp expired`   |
> | `500`         | `server error`                                                      |

##### Example response
```JSON
{
 "status": "success",
 "message": "successfully verified email",
},
```

##### Example Fetch javasript

```javascript
  const request = await fetch(`${BASEURL}/verifyotp`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          token,
          otp,
        }),
      });

  return request.json();
```
</details>

#### Log-in

<details>
 <summary><code>POST</code> <code><b>/auth</b></code> <code>(login to your account to get accessToken and refreshToken)</code></summary>

##### Body

> | name      |  is required     | data type               | description                                                    |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | email      |  true | string   | N/A  |
> | password   |  true | string   | N/A  |


##### Status code

> | http code     |  description                                                        |
> |---------------|---------------------------------------------------------------------|
> | `201`         | `Successfully log-in`                                     |
> | `400`         | `it cause body not contain needed property or not meet data type or your email not verified`   |
> | `500`         | `server error`                                                      |

##### Example response
```JSON
{
 "status": "success",
 "message": "Successfully log-in",
 "data": {
        "accessToken": "this token is used to access private api path and this token will be expired in 10 second",
        "refreshToken": "this token is use to genereate new accessToken if accessToken expired",
    },
},
```

##### Example Fetch javasript

```javascript
  const request = await fetch(`${BASEURL}/auth`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

  return request.json();
```
</details>

#### Generate new accessToken

<details>
 <summary><code>PUT</code> <code><b>/auth</b></code> <code>(generate new accessToken for access restricted api)</code></summary>

##### Body

> | name      |  is required     | data type               | description                                                    |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | refreshToken      |  true | string   | N/A  |


##### Status code

> | http code     |  description                                                        |
> |---------------|---------------------------------------------------------------------|
> | `200`         | `successfully update the token`                                     |
> | `400`         | `it cause body not contain needed property or not meet data type`   |
> | `404`         | `it because user has logged out`   |
> | `500`         | `server error`                                                      |

##### Example response
```JSON
{
 "status": "success",
 "message": "successfully update the token",
 "data": {
        "accessToken": "this token is used to access private api path and this token will be expired in 10 second",
    },
},
```

##### Example Fetch javasript

```javascript
  const request = await fetch(`${BASEURL}/auth`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({
          refreshToken
        }),
      });

  return request.json();
```
</details>

#### Log-out

<details>
 <summary><code>DELETE</code> <code><b>/auth</b></code> <code>(Log out)</code></summary>

##### Body

> | name      |  is required     | data type               | description                                                    |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | refreshToken      |  true | string   | N/A  |


##### Status code

> | http code     |  description                                                        |
> |---------------|---------------------------------------------------------------------|
> | `200`         | `successfully deleted refresh token`                                     |
> | `400`         | `it cause body not contain needed property or not meet data type`   |
> | `404`         | `it because user has logged out`   |
> | `500`         | `server error`                                                      |

##### Example response
```JSON
{
 "status": "success",
 "message": "successfully deleted refresh token",
},
```

##### Example Fetch javasript

```javascript
  const request = await fetch(`${BASEURL}/auth`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({
          refreshToken
        }),
      });

  return request.json();
```
</details>

#### Get user profile information

<details>
 <summary><code>GET</code> <code><b>/profile</b></code> <code>(retun all information user)</code></summary>

##### Authorization

> Bearer Token

##### Body

> None

##### Status code

> | http code     |  description                                                        |
> |---------------|---------------------------------------------------------------------|
> | `200`         | `successfully get all user information`                             |
> | `401`         | `not attach Barrer token in authorization`                          |
> | `403`         | `accessToken expired`                                               |
> | `500`         | `server error`                                                      |

##### Example response
```JSON
{
 "status": "success",
 "message": "successfully get user information",
 "data": {
     "profile":{
        "email": "user@gmail.com",
        "username": "username",
        "fullname": "My full name",
        "gender": "male",
        "age": "30",
        "createdAt": "2022-05-24T14:36:28.344Z",
    },
 }
},
```

##### Example Fetch javasript

```javascript
  const request = await fetch(`${BASEURL}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        method: 'GET',
      });

  return request.json();
```
</details>


#### Get all and search medicine

<details>
 <summary><code>GET</code> <code><b>/medicines</b></code> <code>(retun all name and id medicine and search medicine if put query parameter)</code></summary>

##### parameter

> | name      |  is required     | data type               | description                                                    |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | q      |  false | string   | search query  |

##### Body

> None

##### Status code

> | http code     |  description                                                        |
> |---------------|---------------------------------------------------------------------|
> | `200`         | `successfully get all medicine`                                |
> | `500`         | `server error`                                                      |

##### Example response
```JSON
{
 "status": "success",
 "data": {
     "medicines": [
         {
             "id": "medicine-123",
             "name": "obat abc"
         },
         ...
     ],
 }
},
```

##### Example Fetch javasript

```javascript
  const request = await fetch(`${BASEURL}/medicines`, {
        method: 'GET',
      });

  return request.json();
```
</details>

#### Get medicine details

<details>
 <summary><code>GET</code> <code><b>/medicines/{medicineId}</b></code> <code>(retun all medicine information)</code></summary>


##### Body

> None

##### Status code

> | http code     |  description                                                        |
> |---------------|---------------------------------------------------------------------|
> | `200`         | `successfully get medicine details`                                |
> | `404`         | `medicine id not found`                                |
> | `500`         | `server error`                                                      |

##### Example response
```JSON
{
 "status": "success",
 "data": {
     "medicines": [
         {
             "id": "medicine-123",
             "nama": "obat abc",
             "pengunaan": "....",
             "cara_kerja": "............",
             "efek_samping": "............",
             "pemakaian_obat": "............",
             "dosis": "............",
             "interaksi": "............",
         },
     ],
 }
},
```

##### Example Fetch javasript

```javascript
  const request = await fetch(`${BASEURL}/medicines/medicine-123`, {
        method: 'GET',
      });

  return request.json();
```
</details>

#### Post reminder

<details>
 <summary><code>POST</code> <code><b>/reminder/{medicineId}</b></code> <code>(this resticted path you need login to post reminder)</code></summary>

##### Authorization

> Bearer Token

##### Body

> | name      |  is required     | data type               | description                                                    |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | startAt      |  true | string   | N/A  |
> | endAt      |  true | string   | N/A  |
> | reminderTime      |  false | array   | N/A  |
> | time      |  true | string   | N/A  |


##### Status code

> | http code     |  description                                                        |
> |---------------|---------------------------------------------------------------------|
> | `201`         | `successfully add reminder`                             |
> | `401`         | `not attach Barrer token in authorization`                          |
> | `403`         | `accessToken expired`                                               |
> | `404`         | `medicine id not found`                                |
> | `500`         | `server error`                                                      |

##### Example response
```JSON
{
 "status": "success",
 "message": "successfully add reminder",
},
```

##### Example Fetch javasript

```javascript
  const request = await fetch(`${BASEURL}/reminder/medicine-xxx`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
        body: JSON.stringify({
          startAt: "string date",
          endAt: "string date",
          reminderTime: [
            {
              time: "18.00",
            },
             {
              time: "21.00",
            }
          ]
        }),
      });

  return request.json();
```
</details>

#### Get all reminder

<details>
 <summary><code>GET</code> <code><b>/reminder</b></code> <code>(this resticted path you need login to get all history)</code></summary>

##### Authorization

> Bearer Token

##### Body

> None

##### Status code

> | http code     |  description                                                        |
> |---------------|---------------------------------------------------------------------|
> | `200`         | `successfully get all reminder`                             |
> | `401`         | `not attach Barrer token in authorization`                          |
> | `403`         | `accessToken expired`                                               |
> | `500`         | `server error`                                                      |

##### Example response
```JSON
{
 "status": "success",
 "message": "successfully get all reminder",
 "data": {
     "reminder": [
         {
            "id": "reminder-123",
            "name": "obat a",
            "startAt": "2022-05-24T14:36:28.344Z",
            "endAt": "2022-05-24T14:36:28.344Z",
            "reminderTime": [
              {
                "time": "18.00",
              }
            ]
        },
     ]
 }
},
```

##### Example Fetch javasript

```javascript
  const request = await fetch(`${BASEURL}/reminder`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        method: 'GET',
      });

  return request.json();
```
</details>



------------------------------------------------------------------------------------------
