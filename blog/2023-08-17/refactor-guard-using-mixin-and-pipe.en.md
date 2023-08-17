---
title: '#7 Refactor Guard using mixin/pipe and class-transformer'
date: "2023-08-17T00:00:00.000Z"
description: ""
tag:
  - Project
  - NodeJS
---

_You can see the whole code on the [nestjs-auth](https://github.com/shkim04/find-your-wc/tree/nestjs-auth) branch._

Previously, we have only applied **Guard** to `deleteReview` method. I think that we should add the functionality to `updateReview` method so that authenticated users can modify their reviews. 

However, if we implement the same Guard to the method, it won't work out. The reason is that the Guard we have created only takes `deleteReviewArgs` from **context**, which is the argument objects for the delete operation. We also need to take `updateReviewArgs` for the update operation to update. To do this, we have to let the Gaurd know what argument it takes. We can accomplish the mission using `mixin`.

## Add mixin
In `auth/guards/gql.guard.ts`, we will wrap the Guard around a function that takes the name of the arguments and returns `mixin`.

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

With the `mixin`, we now have Guard that can be instantiated and take an argument. We will implement this Guard to both `updateReview` and `deleteReview` methods and pass in the name of each of the arguments to the Guard.

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

However, when we try to update a review and do the update operation for the same review, you will get **Unauthorized** exception from the server. 

It is because we have used `bcrypt` to hash a password and save it on our database, when the password passed in and not hashed overwrites the hashed password. There are two options to fix this problem. One is to hash the password in `updateReview` service. The other is to exclude the password before it reaches the router handler. We will talk about the latter one.

## Exclude password using class-transformer and pipe
First of all, we will install `class-transformer`.

```
pnpm install class-transformer
```

And then, we will annotate `password` field with **@Exlucde()** decorator in `UpdateReviewInput` model in `dto/args/update-review.input.ts`.

```js
@InputType()
export class UpdateReviewInput {
  // ...

  @Field()
  @Exclude()
  password: string;
}
```

Finally, we will apply **ValidationPipes** , which validates fields, to `updateReview` method. This pipe does exclude fields that are annotated with **@Exlucde()** decorator and if validated, let them go to the router handler. When we try to do the update operation, it will work out as expected now.

> Besides, I have also omitted the **@Field()** decorator from `password` field in `Review` model object so that clients cannot get the password information.

_You can see the whole code on the [nestjs-auth](https://github.com/shkim04/find-your-wc/tree/nestjs-auth) branch._

_**THANKS FOR READING. SEE YOU NEXT TIME!**_

### References
- https://docs.nestjs.com/techniques/serialization
