---
title: '#11 Nextjs App router로 Graphql mutation 쿼리 요청하기'
date: "2023-09-20T00:00:00.000Z"
description: ""
tag:
  - Project
  - ReactJS
---

이 어플리케이션은 이제 나라, 도시 그리고 길 이름에 따라 동적으로 화장실 정보를 보여주는 페이지를 가지고 있습니다. 하지만 사용자들이 처음에 화장실 주소, 리뷰 등을 적어 화장실 정보를 등록할 수 있어야 합니다. 그래서 화장실 정보를 form에 담아 graphql mutation 쿼리를 요청하는 `/contribute` 라우트를 만들어 보겠습니다.

## Contribute 컴포넌트 생성

아래와 같이 `/contribute` 라우트를 생성하기 위해 `contribute`라는 이름의 폴더를 만듭니다.

```
src/app
├── contribute
│   └── page.tsx
└── toilets
    ├── [country]
    │   ├── [city]
    │   │   ├── [street]
    │   │   │   └── page.tsx
    │   │   └── page.tsx
    │   └── page.tsx
    └── page.tsx
```

`contribute` 폴더 하위에 `page.tsx` 파일 안에 다음 코드를 작성합니다.

```js
'use client';
import { useState, useRef } from 'react';
import create from './action';

export default function Contribute() {
  const [paid, setPaid] = useState('');
  const priceRef = useRef<HTMLInputElement>(null);
  const streetNumberRef = useRef<HTMLInputElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const cleanlinessRef = useRef<HTMLInputElement>(null);
  const performanceRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <form
        className='w-1/2 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
        action={create}
      >
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Paid or not
          </label>
          <div className='flex items-center mb-4'>
            <input
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              checked={paid === 'Yes'}
              type='radio'
              name='paid'
              value='Yes'
              onChange={(e) => setPaid(e.target.value)}
            />
            <label
              htmlFor='Yes'
              className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            >
              Yes
            </label>
          </div>
          <div className='flex items-center mb-4'>
            <input
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              checked={paid === 'No'}
              type='radio'
              name='paid'
              value='No'
              onChange={(e) => setPaid(e.target.value)}
            />
            <label
              htmlFor='No'
              className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            >
              No
            </label>
          </div>
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Price
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            name='price'
            placeholder='How much is it?'
            ref={priceRef}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Street no.
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            name='streetNumber'
            ref={streetNumberRef}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Street
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            name='street'
            ref={streetRef}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            City
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            name='city'
            ref={cityRef}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Country
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            name='country'
            ref={countryRef}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Cleanliness
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            type='number'
            step={0.1}
            name='cleanliness'
            placeholder='How clean is it?'
            ref={cleanlinessRef}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Performance
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            type='number'
            step={0.1}
            name='performance'
            placeholder='How well does it work?'
            ref={performanceRef}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Description
          </label>
          <textarea
            className='resize-none shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            rows={2}
            name='description'
            placeholder='Write your experience in less than 500 characters'
            maxLength={500}
            ref={descriptionRef}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Email
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            type='email'
            name='email'
            ref={emailRef}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Password
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            type='password'
            name='password'
            ref={passwordRef}
          />
        </div>
        <div className='flex items-center justify-between'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
```

어플리케이션을 개발 환경에서 동작시키고 브라우저에서 `http://localhost:4000/contribute`를 입력하면 다음과 같은 화면이 보일 것입니다.

![create-form-2.png](../imgs/2023-09-20/create-form-2.png)

## Graphql mutation query 요청

직전에 만든 컴포넌트에서 **Submit** 버튼을 누를 때 `create` 함수를 호출하는 form을 볼 수 있습니다. 이 함수가 form에서 받은 데이터들이 처리되고 우리가 graphql 쿼리를 만드는 곳입니다.

이를 위해 `contribute` 폴더 하위에 `action.ts`라는 이름의 파일을 만듭니다.

```
src/app
├── contribute
    ├── action.ts
    └── page.tsx
```

`action.ts` 파일에 다음의 코드를 작성합니다.

```js
'use server';
import { redirect } from 'next/navigation';

export default async function create(formData: FormData) {
  const isPaid = formData.get('paid') === 'Yes' ? true : false;
  const price = parseInt(formData.get('price') as string);
  const streetNumber = formData.get('streetNumber');
  const street = formData.get('street');
  const city = formData.get('city');
  const country = formData.get('country');
  const email = formData.get('email');
  const password = formData.get('password');
  const cleanliness = parseFloat(formData.get('cleanliness') as string);
  const performance = parseFloat(formData.get('performance') as string);
  const description = formData.get('description');

  const apiUrl = 'http://localhost:4000/graphql';
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { createToilet(createToiletData: {
          isPaid: ${isPaid}
          price: ${price}
          address: {
            streetNumber: "${streetNumber}"
            street: "${street}"
            city: "${city}"
            country: "${country}"
          }
          reviews: {
            contributedBy: "${email}"
            password: "${password}"
            cleanliness: ${cleanliness}
            performance: ${performance}
            description: "${description}"
          }
        }) {
          id
          isPaid
          price
          address {
            street
            city
            country
          }
        }
      }`,
    }),
  });

  const data = await response.json();
  console.log(data);
  redirect('/');
}
```

간략하게 설명하자면 이 `create` 함수가 `Contribute` 컴포넌트로부터 form 데이터를 받고 이를 사용하여 graphql mutation 쿼리를 만듭니다. 이 mutation 쿼리는 body 안에 포함됩니다. 이 쿼리가 서버에 전달이 되면 응답을 기다리고 콘솔에 로그를 생성합니다. 마지막으로 root 라우트로 리다이렉트가 됩니다.

이제 화장실을 등록하기 위해 먼저 백엔드 서버를 알맞은 포트에 동작시킵니다.

`/contribute`로 이동하고 form에 있는 모든 필드값을 채운 뒤 **Submit** 버튼을 누르면 터미널에서 다음과 같은 로그를 볼 수 있어야 합니다.

![create-response.png](../imgs/2023-09-20/create-response.png)

로그 이외에도 `/toilets` 라우트를 사용하면 화장실이 등록이 되었는지 아닌지 여부를 확인할 수 있을 것입니다.

_**읽어 주셔서 감사합니다. To be continued!**_

### 참조
- https://nextjs.org/docs/pages/building-your-application/data-fetching/forms-and-mutations
