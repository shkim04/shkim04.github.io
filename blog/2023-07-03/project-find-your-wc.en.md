---
title: '#3 Project - Find Your W.C.'
date: "2023-07-03T00:00:00.000Z"
description: ""
tag:
  - Project
---

In two of the previous articles, I mentioned that I am currently working on a project on the side. This may have been late to present what it is actually about since I first wanted to try a few of cloud services on which my project will run. Finally, I am going to talk about the project!

## Find Your W.C.
As you might already notice, it is about toilets. I have always thought that it would be nice if I could know where all the good and pleasant toilets are whenever I travel. So, I decided to build an application where local people and travellers share information about toilets in a certain area.

## Basic User Behavior
I would like to tell you what I would think user might do via the application. Here is some of behaviors expected:

- A Reviewer register a toilet that will be reviewed with some basic information about it
- Add its address to the toilet information
- Leave review with a structured format(cleanliness, description, etc)
- Another reviewer could add a review to an existing review set of a toilet

![user_bahavior](../imgs/2023-07-03/user_behavior.png)

## Simplified Business Logic
Here is the basic logic that I think I would develop according to the user behaviors shown above:

- Save and hold information about toilet, when a request with the information is made - _Not in database yet_
- When address information is sent, check if it already exists in database
- Decide what response to send back based on the result of the steps shown above
- Save a review about the toilet with the corresponding its toilet id when a request to save the review is made

![business_logic](../imgs/2023-07-03/business_logic.png)

In the following article, I will write about how to set up and configrue NestJS + Graphql + Prisma + PostgreSQL.

_**THANKS FOR READING. SEE YOU NEXT TIME!**_
