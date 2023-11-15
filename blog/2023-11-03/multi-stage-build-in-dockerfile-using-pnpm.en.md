---
title: '#15 Multi-stage build in Dockerfile using pnpm'
date: "2023-11-03T00:00:00.000Z"
description: ""
tag:
  - Project
---

I chose to use **npm** as the package manager in the beginning as usual. But, I have changed it into **pnpm** and migrated it to this project since I was curious what it is like - _I am not sure but I think it might impose a potential danger on the application. I should look more into this topic later._ 

I had to change **Docker** script for it was written for **npm**. Let me break down the Dockerfile that I have implemented.

> For those who might read this article without reading the previous articles, You can find the whole backend code [here](https://github.com/shkim04/find-your-wc)

## Development stage

![development-stage](../imgs/2023-11-03/development-stage.png)

Installing `pnpm` is added to the script by writing `RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm`.

Notice that instead of **install**, **fetch** is used for loading packages and it only requires `pnpm-lock.yaml` file - _I reason that `pnpm fetch` is equivalent to `npm ci` when you use `npm` for the build._ 

According to the official document of **pnpm**, `pnpm fetch` and `pnpm install --offline` will save so much time.

Lastly, since we use **Prisma** in the application, we should add `RUN pnpm exec prisma generate` to generate prisma client.

## Build stage

![build-stage](../imgs/2023-11-03/build-stage.png)

We can now copy `node_modules` folder created from the development stage. I have also copied **.env** file since it has some information when running the application.

Finally by using `--prod` flag for installing packages after the build, Only production packages will be installed.

## Production stage

![production-stage](../imgs/2023-11-03/production-stage.png)

In the production stage, we will simply copy `node_modules` and `dist` folders created from the build stage and then run the application.

Once you enter the command `docker build -t [image-name-you-want-give] -f Dockerfile .` to build an image, the image will be created and you can see how fast it is created and how light it is - _You can build an image without implementing multi-stage build to compare._

_**THANKS FOR READING. SEE YOU NEXT TIME!**_

### References
- https://pnpm.io/cli/fetch