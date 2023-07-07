---
title: How To Use Session in Next.js
date: "2023-05-15T00:00:00.000Z"
description: ""
tag: 
    - React
---

Session is stored and used to communicate clients and servers for a certain amount of time. Today, we will talk about how to implement session in Next.js application. We will create a simple application to understand how it works in Next.js. Let's dig into it.

## Prerequisite
- Basic knowledge about Next.js and typescript

## Install
We will use [iron-session](https://github.com/vvo/iron-session) because it is featured in the Next.js documentation and it is easy to apply. Install iron-session in the Next.js application:
```
npm install iron-session
```

## Goal
We will create two pages. One is the index page and the other is login page. In the index page, we will display a username if any user is logged in or a text saying _**I'm Guest User**_ as a default. What will happen in the login page is that we will make a request to an API to log in. If the request succeeds, it will redirect to the index page. Finally, we will need the API to handle log-in request, which is where we save session data.

The goal here is once a user is logged in, we will see if their name shows and when the page is refreshed, the name still stays still for a certain amount of time. 

## App Structure
This is the structure of the core part under the project folder:
```
├── lib
│   ├── withSession.tsx
├── pages
│   ├── api
│   │   ├── login.tsx
│   ├── login
│   │   ├── index.tsx
│   ├── index.tsx
│   ├── _app.tsx
```

## lib/withSession.tsx
We will create two wrappers that handle session behind the scene. One is for the API route and the other is for **getServersideProps** function as you can infer from their names. 

There are a few things to talk about.
1. Since we use typescript, we should let typescript know what we will store in session - _**username** is added to IronSessionData interface here_
2. We should put a password that is at least 32 character long for the option of the session.
3. We can set up **cookieOptions** based on our needs

```js
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from "next";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    username?: string;
  }
}

const sessionOptions = {
  password: "cookie-password-must-be-at-least-32-character-long",
  cookieName: "my-cookie-name",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 100
  },
};

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown } >(
  handler: ({req, res}: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionOptions);
}
```

## pages/index.tsx
Notice that **getServerSideProps** is passed to the session wrapper we have created an argument. In **getServerSideProps**, session data can be accessed and it will be passed to the Home component as a prop. If any username is stored in the session, the username will be displayed on the client side.

```js
import Link from "next/link";
import { withSessionSsr } from "../lib/withSession";

interface Props {
  username: string;
}

export default function Home({ username }: Props) {
  return (
    <div>
      <div className="name">I'm {username || "Guest User"}</div>
      <button><Link href={"/login"}>Go To Login</Link></button>
    </div>
  )
}

export const getServerSideProps = withSessionSsr(
  async function getServersideProps({ req, res }) {
    try {
      const username = req.session.username || "";
      
      return {
        props: {
          username: username
        }
      }
    }
    catch(err) {
      console.log("page Home error", err);

      return {
        redirect: {
          destination: '/login',
          statusCode: 307
        }
      }
    }
  }
)
```

## pages/login/index.tsx
Login component will handle user information and make a request to `api/login` route. If any user is logged in, it will redirect to the Home route.

```js
import { FormEvent, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { withSessionSsr } from "../../lib/withSession";

interface Props {
  username: string
}

export default function Login({ username }: Props) {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(username) {
      router.push({pathname: "/"});
    }
  }, [])

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(!emailRef.current) return;

    const email = emailRef.current.value;
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email })
      }
      const response = await fetch('/api/login', options);
      if(response.status !== 200) throw new Error("Can't login")
      router.push({ pathname: "/" });
    }
    catch(err) {
      console.log(err);
    }
  }
  return (
    <div>
      <form onSubmit={login}>
        <input type="text" ref={emailRef} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export const getServerSideProps = withSessionSsr(
  async function getServersideProps({ req, res }) {
    try {
      const username = req.session.username || "";

      return {
        props: {
          username: username
        }
      }
    }
    catch(err) {
      console.log(err);

      return {
        redirect: {
          destination: '/login',
          statusCode: 307
        }
      }
    }
  }
)
```

## pages/api/login.tsx
This endpoint takes a log-in request from the client and find a user from a database and then, save the information in session if the matching user is found - _As you know, instead of using **mockUsers** as shown below, you should implement a database in the endpoint in a real world_. 

```js
import { withSessionRoute } from "../../lib/withSession";

const mockUsers = [
  {
    username: "Admin User",
    email: "admin@gmail.com"
  },
  {
    username: "Just User",
    email: "justuser@gmail.com"
  }
];

export default withSessionRoute(
  async function handler(req, res) {
    switch (req.method) {
      case "POST":
        const { email } = req.body;
				const loggedInUsername = mockUsers.find(user => user.email === email);

        if(!loggedInUsername) {
          res.status(404).send("Can't find the user");
          break;
        }

        req.session.username = loggedInUsername.username;
        await req.session.save();

        res.status(200).send('Found the user');
        break;
      default: 
        res.status(405).end(`${req.method} Not Allowed`);
        break;
    }
  }
);
```

## Run
Run the code and try like this:

![next-session-login](../gifs/next-sesion-login.gif)

As you can see, when a user named **Admin User** is logged in and then, the page is refreshed, it still shows **Admin User** because the data is now stored in the session for an amount of time we set.

Although this practice is simplified to solely explain how the session works in Next.js, I hope you have grasped the core concept and elaborate it based on your projects.

_**THANKS FOR READING. SEE YOU NEXT TIME!**_