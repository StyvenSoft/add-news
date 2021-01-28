import { MyContext } from "../types";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, Query, Resolver, Root, UseMiddleware, ObjectType } from "type-graphql";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
    @Field()
    title: string
    @Field()
    text: string
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
}

@Resolver(Post)
export class postResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() post: Post) {
        return post.text.slice(0, 80);
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit)
        const reaLimitPlusOne = realLimit + 1;

        const replacements: any[] = [reaLimitPlusOne];

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const posts = await getConnection().query(`
            select p.*,
            json_build_object(
                    'id', u.id,
                    'username', u.username,
                    'email', u.email,
                    'createdAt', u."createdAt",
                    'updatedAt', u."updatedAt"
                ) creator
            from post p
            inner join public.user u on u.id = p."creatorId"
            ${cursor ? `where p."createdAt" < $2` : ""}
            order by p."createdAt" DESC
            limit $1
        `,
            replacements
        );

        return {
            posts: posts.slice(0, realLimit),
        };
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg("id") id: number
    ): Promise<Post | undefined> {
        return Post.findOne(id)
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<Post> {
        return Post.create({
            ...input,
            creatorId: req.session.userId,
        }).save();
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String, { nullable: true }) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOne(id);
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            await Post.update({ id }, { title });
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,
    ): Promise<Boolean> {
        await Post.delete(id);
        return true;
    }

}