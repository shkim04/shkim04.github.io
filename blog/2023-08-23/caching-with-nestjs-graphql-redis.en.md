---
title: '#8 Caching with Nestjs, Graphql and Redis'
date: "2023-08-23T00:00:00.000Z"
description: ""
tag:
  - Project
  - NodeJS
---

Even though our application does not seem to need caching at the moment, I have wanted to figure out how caching works with Nestjs and Graphql. So, we will practice caching in our application.

In Nestjs, it is easy to cache by using `cache-manager`. Let's begin with how to configure caching

## Configrue cache using Redis

We will first install dependencies.

```
pnpm install @nestjs/cache-manager cache-manager
```

Instead of using in-memory cache by default, I have chosen to use **Redis** for caching. For that, we need to install additional dependencies.

```
pnpm install cache-manager-redis-store@2
pnpm install --save-dev @types/cache-manager-redis-store
```

Now, we will import cache module to enable caching in the `toilet.moduel.ts`.

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

Notice that I have imported config module to configure Redis. It gives us flexibility to set up for multiple environments - _Give proper values for Redis in `.env` file_.

## Run Redis locally with Docker

In the `docker-compose.yml`, we will add the following code to install and run Redis locally using Docker.

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

We can run Redis on the port 6379 locally by entering `docker-compose up -d`.

## Cache a toilet

We will cache a toilet queried to see how caching works in the toilet service.

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

We will inject cache manager into the constructor and then implement it in `getToilet` method. When queried, if the toilet is cached, it will return the cached value. Otherwise, it will return the matched value from the database and store it in Redis.

## Check cached values in Redis

To see if cached value is stored in Redis, we can access the Redis docker container and check it using `redis-cli`.

```
docker exec -it [redis-container-id] redis-cli
// if accessed

127.0.0.1:6379> GET [id of toilet that was cached]
"{\"id\":\"[id of toilet that was cached]\",\"isPaid\":true,\"price\":1000}"
or
(nil)
```

When making a toilet query, you will get the toilet information if cached or nil.

## Thoughts
As I mentioned in the beginning, our application still does not seem to need caching yet. It is because there is not any complex operation that stays still for a long time and also not a lot of traffic yet. However, it is good to know how caching works and prepare to use it when necessary.

_**THANKS FOR READING. SEE YOU NEXT TIME!**_

### References
- https://docs.nestjs.com/techniques/caching
- https://www.tomray.dev/nestjs-caching-redis
