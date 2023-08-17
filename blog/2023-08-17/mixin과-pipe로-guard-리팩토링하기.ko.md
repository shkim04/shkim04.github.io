---
title: '#7 Mixin과 Pipe로 Guard 리팩토링하기'
date: "2023-08-17T00:00:00.000Z"
description: ""
tag:
  - Project
  - NodeJS
---

_[nestjs-auth](https://github.com/shkim04/find-your-wc/tree/nestjs-auth) 브랜치에서 전체 코드를 확인하실 수 있습니다._

이전에 **Guard**를 `deleteReview` 메소드에 적용하였습니다. 이 기능을 `updateReview` 메소드에도 동일하게 적용해서 인증된 사용자들이 자신들의 리뷰를 수정할 수 있게 해야 할 것입니다.

하지만 같은 Guard를 해당 메소드에 적용하게 되면 정상 작동을 하지 않을 것입니다. 이유는 이 Guard는 **context**로부터 삭제 작업을 위한 인자인 `deleteReviewArgs` 만을 받게끔 코드가 작성이 되었기 때문입니다. 수정 작업을 위한 `updateReviewArgs`도 받게끔 코드를 수정할 필요가 있습니다. 이를 위해서는 Guard가 어떤 인자를 받는지 알 수 있게 만들어줘야 합니다. 이는 `mixin`을 통해 구현이 가능합니다.

## mixin 추가
`auth/guards/gql.guard.ts` 파일에 있는 Guard를 인자의 이름을 전달받고 `mixin`을 반환하는 함수로 감쌉니다.

```js
export const ReviewGuard: any = (args) => {
  @Injectable()
  class GqlAuthGuard extends AuthGuard('local') {
    getRequest(context: GqlExecutionContext): any {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();

      // get the argument and save it on request body
      req.body = ctx.getArgs()[args];

      return req;
    }
  }

  return mixin(GqlAuthGuard);
};
```

이 `mixin`을 통해 인자를 전달받고 인스턴스화가 가능한 Guard를 얻게 됩니다. 이 Guard를 `updateReview`와 `deleteReview` 메소드 각각에 적용하고 인자의 이름을 Guard에 전달합니다.

```js
@Injectable()
export class ReviewResolver {
  // ...
  @Mutation(() => Review)
  @UseGuards(ReviewGuard('updateReviewData'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateReview(
    @Args('updateReviewData') updateReviewData: UpdateReviewInput,
  ): Promise<Review> {
    return this.reviewService.updateReview(updateReviewData);
  }

  @Mutation(() => Review)
  @UseGuards(ReviewGuard('deleteReviewData'))
  async deleteReview(
    @Args('deleteReviewData') deleteReviewData: DeleteReviewInput,
  ): Promise<Review> {
    return this.reviewService.deleteReview(deleteReviewData);
  }
}
```

여기서 리뷰를 수정하고 같은 리뷰를 다시 수정을 했을 때 서버로부터 **Unauthorized** 메시지를 받을 것입니다.

이는 필자가 비밀번호를 해싱(hash)하고 데이터베이스에 저장하기 위해 `bcrypt`를 사용했는데 해싱 처리가 되지 않고 전달받은 비밀번호가 기존 해싱이 된 비밀번호에 덮어 쓰기가 됐기 때문입니다. 이 문제를 해결하기 위한 두가지 선택지가 있습니다. 하나는 `updateReview` 서비스 층에서 비밀번호를 해싱 처리하는 것이고 다른 하나는 라우터 핸들러에 오기 전에 비밀번호를 제외하는 것입니다. 후자에 대해 얘기해보겠습니다.

## class-transformer와 pipe 사용하여 비밀번호 제외하기
우선, `class-transformer`를 설치합니다.

```
pnpm install class-transformer
```

그런 다음에 `dto/args/update-review.input.ts`에 있는 `UpdateReviewInput` 모델의 `password` 필드에 **@Exlucde()** 데코레이터를 적용합니다.

```js
@InputType()
export class UpdateReviewInput {
  // ...

  @Field()
  @Exclude()
  password: string;
}
```

마지막으로 필드값들을 타당성을 검증하는 **ValidationPipes**를 `updateReview` 메소드에 적용합니다. 이 파이프는 **@Exlucde()** 데코레이터가 표시된 필드들을 제외시키고 타당성 검증이 되었다면 라우터 핸들러로 갈 수 있게 합니다.
이제 리뷰 수정을 다시 시도해보면 기대하는 바와 같이 정상적으로 작동하게 됩니다.

> 이외에도 필자는 클라이언트로 비밀번호 정보를 전달하지 않도록 `Review` 모델 객체의 `password` 필드에서 **@Field()** 데코레이터를 삭제하였습니다. 

_**읽어 주셔서 감사합니다. To be continued!**_

### 참조
- https://docs.nestjs.com/techniques/serialization