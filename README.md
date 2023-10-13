# User Management Server App

Welcome to the User Management Server App, a tiny server application based on
Node.js that allows you to manage a simple organization user structure. This
application supports three user roles: Administrator, Boss, and Regular user,
with each user (except the Administrator) having a strict boss.

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

## Prerequisites

- Node.js and npm installed on your machine.

## Installation

- Clone the repository:

```sh
gh repo clone yuliiamaiboroda/incode-group-test-back
```

- Change into the project directory:

```sh
cd incode-group-test-back
```

- Install dependencies:

```sh
npm install
```

- Start the development server:

```sh
npm run start:dev
```

-Use [http://localhost:3000](http://localhost:3000) to interact with REST API.

- For production environments.

```sh
npm start
```

## Configuration with Environment Variables

---

Secure and Modular Settings

To configure your application, create a .env file in the root directory and
populate it with the following environment variables:

### MongoDB

- **MONGO_CONNECTION_STRING:** Your MongoDB connection string.

### JWT (JSON Web Tokens)

- **JWT_SECRET:** Secret key for encoding and decoding JWT tokens.
- **JWT_EXPIRATION:** Expiration time for regular JWT tokens (in seconds).

### Port

- **PORT:** The port on which the server will run. Specify the desired port
  number here.

Ensure these variables are properly set in your .env file to enable secure and
seamless functionality within your application.

## Enpoints

### Auth user

#### Registration:

(The first user created will have the highest role)

- **Endpoint:** `POST /api/auth/register`
- **Auth:** -
- **Request Body:**

```
{
  "name":"string",
  "surname":"string",
  "email":"string",
  "password":"string"
  }
```

- **Responses:**
  - 201:
  ```
  {
    "accessToken": "string",
    "user": {
        "_id": "string",
        "name": "string",
        "surname": "string",
        "email": "string",
        "role": "string",
        "boss": "string|null",
        "subordinates": array
    }
  }
  ```
  - 400: Validatiom error
  - 409: Email in use

#### Login

- **Endpoint:** `POST /api/auth/login`
- **Auth:** -
- **Request Body:**

```
{
  "email":"string",
  "password":"string"
}
```

- **Responses:**
  - 200:
  ```
  {
    "accessToken": "string",
    "user": {
        "_id": "string",
        "name": "string",
        "surname": "string",
        "email": "string",
        "role": "string",
        "boss": "string|null",
        "subordinates": array
    }
  }
  ```
  - 400: Validatiom error
  - 401: Unauthorized

#### Logout

- **Endpoint:** `POST /api/auth/logout`
- **Auth:** Bearer token
- **Request Body:** -
- **Responses:**
  - 204: Successful logout
  - 401: Unauthorized

#### Get current user

- **Endpoint:** `GET /api/auth/current-user`
- **Auth:** Bearer token
- **Request Body:** -
- **Responses:**
  - 200:
  ```
  {
       "_id": "string",
       "name": "string",
       "surname": "string",
       "email": "string",
       "role": "string",
       "boss": "string|null",
       "subordinates": array
  }
  ```
  - 401: Unauthorized

### Users

#### Get list of users

- **Endpoint:** `GET /api/users/`
- **Auth:** Bearer token
- **Request Body:** -
- **Responses:**
  - for **_Administrator_**
    - 200:
    ```
    [{
          "_id": "string",
          "name": "string",
          "surname": "string",
          "role": "string",
          "subordinates": array,
          "boss": "string|null",
          "email": "string",
      },
      {...}
      ]
    ```
  - for **_Boss_**
    - 200:
    ```
    {
      "_id": "string",
      "name": "string",
      "surname": "string",
      "role": "string",
      "role": "string",
      "boss": "string",
      "email": "string",
      "subordinates": [
          {
            "_id": "string",
            "name": "string",
            "surname": "string",
            "role": "string",
            "subordinates": array,
            "boss": "string",
            "email": "string",
          },
          {...}
          ]
    }
    ```
  - for **_User_**
    - 200
    ```
    {
      "_id": "string",
      "name": "string",
      "surname": "string",
      "role": "string",
      "subordinates": [],
      "boss": "string",
      "email": "string",
    }
    ```
  - 401: Unauthorized

#### Change boss of user

- **Endpoint:** `POST /api/users/`
- **Auth:** Bearer token
- **Request Body:**

  ```
  {
    "bossId":"string",
    "userId":"string"
  }

  ```

- **Responses:**
  - 200:
  ```
  {
    updatedOldBoss:{
      "_id": "string",
      "name": "string",
      "surname": "string",
      "role": "string",
      "subordinates": array,
      "boss": "string|null",
      "email": "string",
    },
    updatedNewBoss:{
      "_id": "string",
      "name": "string",
      "surname": "string",
      "role": "string",
      "subordinates": array,
      "boss": "string|null",
      "email": "string",
    },
    updatedUser:{
       "_id": "string",
      "name": "string",
      "surname": "string",
      "role": "string",
      "subordinates": array,
      "boss": "string",
      "email": "string",
    }
  }
  ```
  - 400: Bad Request ( This user is already boss for current user or validation
    error)
  - 401: Unauthorized
  - 403: Forbidden (Access error or forbidden action )
  - 404: Not found

## Other commands

**Start the server in production mode.**

```sh
npm start
```

**Start the server in development mode.**

```sh
npm run start:dev
```

**Run eslint code checks. This should be done before each PR, and all linting
errors must be fixed.**

```sh
npm run lint
```

**Similar to linting check, but automatically fixes simple errors.**

```sh
npm lint:fix
```
