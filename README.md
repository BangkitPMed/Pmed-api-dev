# Pmed-api-dev
## Documentaion PMED API

- Base url: https://pmed-dev.herokuapp.com

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
> | `201`         | `successfully send otp to xxxx@gmail.com`                                                      |
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
> | `201`         | `successfully verified email`                                     |
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
> | `201`         | `successfully update the token`                                     |
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
------------------------------------------------------------------------------------------
