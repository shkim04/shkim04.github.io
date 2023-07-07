---
title: 영역 밖에서 발생하는 클릭 감지하는 React 컴포넌트
date: "2023-02-19T00:00:00.000Z"
description: ""
tag: 
    - React
---

![click-outside](../gifs/click-outside.gif)

이 글을 읽고 있다면 아마도 `modal`과 `dropdown` 메뉴 같이 - _적어도 필자의 경우는 그랬다_. `modal`과 `dropdown` 메뉴는 React 개발에 있어서 자주 쓰이는 UI 요소이기 때문에 React 개발자라면 클릭이 어디서 일어났는지 아는 방법을 찾고 싶어할 가능성이 높다. 이 글에서 그 방법에 대해 이야기하려고 한다.

## ClickOutside 컴포넌트
필자는 컴포넌트 이름은 **ClickOutside**라고 지었는데 단순히 이 컴포넌트가 클릭 이벤트가 안팎 어디에서 감지되는지 확인하기 때문이다. 적절한 다른 이름이 생각나는 분은 다르게 지으셔도 좋다. 다음과 같은 접근으로 이 컴포넌트를 만들어 보자:

첫째, `useRef` 훅을 사용해서 컴포넌트가 반환하는 외곽 div 태그를 컴포넌트 안에서 지칭할 수 있도록 한다.

다음, 이벤트가 지칭된 외곽 `div` 태그 안팎 중 어디에서 발생했는지 결정하고 그 결과에 따라 행동을 취하는 핸들러 함수를 생성한다.

마지막으로 `mousedown` 이벤트 리스너를 추가하여 클릭이 발생할 시 이 핸들러 함수가 실행하게 만든다.

다음이 위에서 언급한 접근이 반영된 코드다:

```js
import { useRef, useEffect } from 'react';

export default function ClickOutside({ children, exceptionRef, onClick, className }) {
  const wrapperRef = useRef();

  useEffect(() => {
    document.addEventListener('mousedown', handleClickListener);
    
    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  }, []);

  const handleClickListener = (event) => {
    let clickedInside;
    if(exceptionRef) {
      clickedInside = (wrapperRef && wrapperRef.current.contains(event.target)) || exceptionRef.current === event.target || exceptionRef.current.contains(event.target);
    }
    else {
      clickedInside = (wrapperRef && wrapperRef.current.contains(event.target));
    }

    if (clickedInside) return;
    else onClick();
  }
  
  return (
    <div ref={wrapperRef} className={`${className || ''}`}>
      {children}
    </div>
  );
};
```

이 컴포넌트는 parent 컴포넌트로부터 4개의 prop을 받는다.

> **children** 지칭된 외곽 div 태그 안에 들어가는 컴포넌트 혹은 태그.
> 
> **exceptionRef** 이 컴포넌트의 기능에서 제외가 되는 지칭된 컴포넌트 혹은 태그. 즉, exceptionRef를 클릭할 시 **ClickOutside** 컴포넌트 안에서 발생한다고 간주한다.
> 
> **onClick** 컴포넌트 밖에서 클릭이 발생하면 실행되는 핸들러 함수.
> 
> **className** class 이름을 받아 css를 적용할 때 사용한다.

## 예시
```js
import { useState } from "react";
import ClickOuside from "./components/ClickOutside";
import './App.css';

function App() {
  const [visible, setVisible] = useState(false);

  const toggleText = () => {
    setVisible(prev => !prev);
  };

  return (
    <div className='container'>
      <ClickOuside
        onClick={toggleText}
      >
        <div className='red-box'>
          <div>
            If you click here inside this red box, Nothing happens.
          </div>
        </div>
      </ClickOuside>
      {
        visible && (
          <div className='hidden-text'>
            You clicked outside of the red box!<br/>To make this message disappear, click outside of the red box again.
          </div>
        )
      }
    </div>
  );
}

export default App; 
```

red box라는 class 이름을 가진 `div` 태그를 생성하고 _**If you click here inside this red box, Nothing happens.**_ 이라는 문자를 입력한다. 이 `div` 태그를 **ClickOutside** 컴포넌트로 감싼다. 

다음, 숨겨진 문자를 가진 `div` 태그의 노출 유무 상태를 전환하는 핸들러 함수를 **ClickOutside** 컴포넌트에 prop으로 보낸다.

이제 빨간 상자 밖을 클릭하면 _**You clicked outside of the red box! To make this message disappear, click outside of the red box again.**_ 라는 숨겨진 문자가 나타날 것이다. 다시 빨간 상자 밖을 클릭하면 문자가 사라질 것이다.

다른 `div` 태그를 만들어 `useRef` 훅을 이용해서 지칭한 후 exceptionRef prop으로 보내서 그 `div` 태그를 클릭해보길 바란다. **ClickOutside** 컴포넌트 안쪽을 클릭할 때처럼 아무 변화가 없을 것이다.

이 컴포넌트가 React 어플리케이션에 다양하게 쓰일 수 있을 거라고 생각한다. 필자는 이 글을 읽는 모든 분이 이 컴포넌트를 더 발전시켜 근사하게 사용하리라 믿는다.

_**읽어 주셔서 감사합니다. To be continued!**_

_이 글은 [Medium](https://medium.com/@shkim04/react-how-to-detect-click-outside-a-component-984fe2e003e8)에도 업로드 되었습니다._
_놀러 오세요!_