---
title: '#8 Nestjs, Graphql과 Redis로 캐싱하기 '
date: "2023-08-23T00:00:00.000Z"
description: ""
tag:
  - Project
  - NodeJS
---

필자는 현재는 어플리케이션에 캐싱을 적용할 필요가 없지만 Nestjs와 Graphql에서 캐싱을 어떻게 적용하는지에 대해 알고 싶었습니다. 그래서 이 글에서는 캐싱에 대해 알아보겠습니다. 

Nestjs에서는 `cache-manager` 라이브러리를 이용하면 캐싱을 쉽게 구현할 수 있습니다. 이제 캐싱을 설정하는 법을 알아보겠습니다.

## Redis를 활용한 캐싱

우선 디펜던시들을 설치합니다.

```
pnpm install @nestjs/cache-manager cache-manager
```

디폴트인 in-memory 캐싱을 사용하는 대신에 필자는 **Redis**를 사용하기로 했습니다. 이를 위해 필요한 디펜던시들을 추가적으로 설치합니다.

```
pnpm install cache-manager-redis-store@2
pnpm install --save-dev @types/cache-manager-redis-store
```

캐싱이 가능하게 만드려면 `toilet.moduel.ts` 파일에 cache 모듈을 import합니다.

```js
imports: [
  CacheModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => ({
      ttl: config.get('REDIS_DEFAULT_TTL'),
      isGlobal: true,
      store: redisStore,
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_POST'),
    }),
    inject: [ConfigService],
  }),
  //..
]
```

Redis 설정을 위해 config 모듈을 불러온 것을 확인하실 수 있습니다. 이는 여러 환경들을 대비하여 설정하기 위함입니다 - _`.env`파일에 Redis 설정을 위한 적절한 값을 넣어주어야 합니다._

## Docker로 Redis 시작

`docker-compose.yml` 파일에 Docker를 이용해 Redis를 로컬 환경에서 설치 및 실행하기 위해 다음의 코드를 입력합니다.

```bash
services
  redis:
    container_name: cache
    image: redis
    ports:
      - 6379:6379
    volumes:
      - redis:/data
volumes:
  redis:
    driver: local
```

`docker-compose up -d`을 입력하면 Redis가 포트 6379에서 실행이 될 것입니다.

## toilet 캐싱

toilet 서비스에서 캐싱이 어떻게 되는지 알아보기 위해 toilet 쿼리를 캐싱해볼 것입니다.

```js
@Injectable()
export class ToiletsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    //..
  ) {}

  public async getToilet(getToiletArgs: GetToiletArgs): Promise<Toilet> {
    const cachedData = await this.cacheService.get<Toilet>(getToiletArgs.id);
    if (cachedData) return cachedData;

    const toilet = await this.repository.getToilet({
      where: { id: getToiletArgs.id },
    });

    await this.cacheService.set(getToiletArgs.id, toilet);
    return toilet;
  }
  //..
}
```

cache manager를 contructor에 주입하고 `getToilet` 메소드에 캐싱을 적용할 것입니다. 쿼리를 전달받을 때 해당 toilet이 캐싱이 되었다면 캐싱이 된 값을 반환할 것이고 캐싱이 되지 않았다면 데이터 베이스에서 불러온 값을 반환하고 Redis에 저장하게 될 것입니다.

## Redis에 저장된 캐싱 값 확인

캐싱이 된 값이 Redis에 저장이 되었는지 확인해 보기 위해 Redis docker 컨테이너를 접속한 뒤 `redis-cli`를 이용해 값을 확인할 수 있습니다.

```
docker exec -it [redis-container-id] redis-cli
// if accessed

127.0.0.1:6379> GET [id of toilet that was cached]
"{\"id\":\"[id of toilet that was cached]\",\"isPaid\":true,\"price\":1000}"
or
(nil)
```

toilet 쿼리를 전달할 때, 캐싱이 되었다면 해당 화장실 정보를 출력되고 그렇지 않다면 nil을 출력할 것입니다. 

## 정리
글의 서두에서 언급했다시피 아직 이 어플리케이션은 캐싱이 필요하지 않을 수 있습니다. 아직 오랫동안 변화가 없으면서 복잡한 연산이 없고 트래픽이 많지 않기 때문입니다. 하지만 캐싱을 적용하는 법을 미리 익힌다면 캐싱이 필요할 때 빠르게 도움이 될 것이라고 생각합니다.

_**읽어 주셔서 감사합니다. To be continued!**_

### 참조
- https://docs.nestjs.com/techniques/caching
- https://www.tomray.dev/nestjs-caching-redis