---
title: '#16 docker-compose로 PostgresQL과 redis 어플리케이션에 연결하기'
date: "2023-11-15T00:00:00.000Z"
description: ""
tag:
  - Project
---

**Docker**를 이용하여 어플리케이션을 배포하려고 하기 때문에 Docker 컨테이너로 구동하는 다른 서비스들과 연결하는 것이 필요합니다.

> 이전 글을 읽지 않고 이 글을 읽으신 분들은 [여기](https://github.com/shkim04/find-your-wc)에서 백엔드의 전체 코드를 확인하실 수 있습니다.

## Docker 서비스 연결

![docker-compose-script](../imgs/2023-11-15/docker-compose-script.png)

하나의 컨테이너는 개별적인 환경을 갖추고 있는데 네트워크 환경 역시 개별적으로 갖추고 있기 때문에 **find_your_wc**, **postgres**와 **redis** 서비스들은 기본적으로 서로에게 연결이 되어 있지 않습니다.

**find_your_wc** 어플리케이션은 다른 두 개의 서비스를 사용하고 있는데 그 서비스들과 연결이 되어야 한다는 의미입니다. 이를 위해서 `docker-compose.yml`에 `find_your_wc` 서비스 아래 `links` 플래그를 이용하면 됩니다.

이제 **postgres**와 **redis** 서비스들은 어플리케이션에서 이름으로 접근이 가능합니다. 예를 들면 개발 환경에서 호스트 이름을 `localhost`를 사용하여 `.env` 파일에 데이터베이스 url을 저장했습니다. 이를 도커 컨테이너에서 구동되는 어플리케이션에 연결하기 위해 `docker-compose.yml`에 정의한 서비스의 이름인 **postgres**로 바꾸어주면 됩니다 - _이는 위 스크립트에서 **environment** 부분에서 확인할 수 있습니다_. 같은 방식으로 캐쉬 모듈에 필요한 redis 호스트 이름은 **redis**로 넣어주면 됩니다.

> 경우에 따라 데이터베이스 서비스가 구동될 때 `[package-manger] prisma migrate dev [proper-migration-name]`을 입력하여 **Prisma**를 데이터베이스에 마이그레이션을 해야할 수도 있습니다. 이는 도커 컨테이너 쉘에서 할 필요는 없습니다. 프로젝트가 저장되어 있는 개인 컴퓨터에서 진행해도 상관없습니다.

_**읽어 주셔서 감사합니다. To be continued!**_

### 참조
- https://docs.docker.com/compose/networking/
- https://www.tomray.dev/nestjs-docker-compose-postgres
