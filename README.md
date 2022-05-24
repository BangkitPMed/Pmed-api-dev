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

##### Example cURL

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

------------------------------------------------------------------------------------------
