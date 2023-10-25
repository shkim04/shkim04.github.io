---
title: '#14 Display aggregated data in Nextjs application'
date: "2023-10-25T00:00:00.000Z"
description: ""
tag:
  - Project
  - React
---

Since I have added the method that aggregates some numbers I need in the backend server, it is time to bring the numbers into the Nextjs application.

> For those who might read this article without reading the previous articles, You can find the whole backend code [here](https://github.com/shkim04/find-your-wc)

## Toilets Route

We will use server action directly into the component that displays **toilets** page. Here is the code.

```js
interface ResponseData {
  aggregate: AggregateData;
}

interface AggregateData {
  numOfToilets: number;
  numOfReviews: number;
  numOfCountries: number;
  numOfCities: number;
  numOfStreets: number;
}

async function getAggregatedData() {
  try {
    const response = await fetch(`${process.env.API_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ aggregate {
          numOfToilets
          numOfReviews
          numOfCountries
          numOfCities
          numOfStreets
        }}`,
      }),
    });
    const jsonData = await response.json();
    return jsonData.data;
  } catch (err) {
    console.log(err);
  }
}

export default async function Toilets() {
  const data: ResponseData = await getAggregatedData();
  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <div className='z-10 max-w-5xl w-full items-center text-sm lg:flex mb-10'>
        <p className='w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
          Contributed aggregation
        </p>
      </div>
      <div className='z-10 max-w-5xl w-full items-center text-sm lg:flex mb-5'>
        <p className='w-full mr-1 justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
          Toilets: {data.aggregate.numOfToilets}
        </p>
        <p className='w-full mr-1 justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
          Reviews: {data.aggregate.numOfReviews}
        </p>
      </div>
      <div className='z-10 max-w-5xl w-full items-center text-sm lg:flex'>
        <p className='w-full mr-1 justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
          Countries: {data.aggregate.numOfCountries}
        </p>
        <p className='w-full mr-1 justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
          Cities: {data.aggregate.numOfCities}
        </p>
        <p className='w-full mr-1 justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
          Streets: {data.aggregate.numOfStreets}
        </p>
      </div>
    </main>
  );
}
```

> Note that we have no specified input object in the query made in **getAggregatedData** function. That is how we can make graphql query when there is no input object.

## Test

Let's check out if it does work as expected by hitting `http://localhost:3000/toilets`.

![toilets-aggregate](../imgs/2023-10-25/toilets-aggregate.png)

Numbers are properly shown!

_**THANKS FOR READING. SEE YOU NEXT TIME!**_
