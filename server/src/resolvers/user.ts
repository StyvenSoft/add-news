import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from '@mikro-orm/postgresql';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from 'uuid';

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver()
export class userResolver {
    @Mutation(() => UserResponse) 
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() { redis, req }: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 3) {
            return { errors:  
                [
                    {
                        field: "newPassword",
                        message: "Lenght must be greater than 3"
                    },
                ] 
            };
        }
        const key = FORGET_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if(!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "Token Expired"
                    },
                ]
            }
        }
        const userIdNum = parseInt(userId);
        const user = await User.findOne(userIdNum);
        if(!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "User no longer exists"
                    },
                ]
            }
        }

        await User.update(
            { id: userIdNum},
            { password: await argon2.hash(newPassword) }
        );

        await redis.del(key);
        // Login user after change password
        req.session.userId = user.id;

        return { user };
    }

    @Mutation(() => Boolean)
    async forgotPassword(@Arg("email") email: string, @Ctx() { redis }: MyContext) {
        const user = await User.findOne( { where: { email } });
        if (!user) {
            // The email is not in DB
            return true;
        }
        const token = v4();
        await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3); // 3 days
        await sendEmail(email, 
            `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`)
        return true;
    }

    @Query(() => User, { nullable: true })
    me(@Ctx() { req }: MyContext) {
        // Your not logged in
        if (!req.session.id) {
            return null
        }
        return User.findOne(req.session.userId);
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) {
            return { errors };
        }


        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
                username: options.username,
                email: options.email,
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning("*");
            user = result[0];
        } catch (err) {
            if (err.code === "23505") {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username already taken"
                        },
                    ],
                };
            }
        }

        req.session.userId = user.id;
        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(
            User,
            usernameOrEmail.includes("@")
            ? { email: usernameOrEmail }
            : { username: usernameOrEmail } 
        );
        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "That username doesn't exist",
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password",
                    },
                ],
            };
        }

        req.session.userId = user.id;

        return {
            user,
        };
    }

    @Mutation(() => Boolean)
    logout (@Ctx() { req, res }: MyContext) {
        return new Promise ((resolve) => 
            req.session.destroy((err) => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }

                resolve(true);
            })
        );
    }
}