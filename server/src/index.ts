import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
// import { Post } from './entities/Post';
import microConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { testResolver } from './resolvers/test';
import { postResolver } from './resolvers/post';
import { userResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 Years
                httpOnly: true,
                sameSite: "lax", // csrf
                secure: __prod__, // cookie only works in https
            },
            saveUninitialized: false,
            secret: 'sadwdaswfegresawex',
            resave: false,
        })
    )
    const PORT = process.env.PORT || 4000;
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [testResolver, postResolver, userResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => <MyContext>({em: orm.em, req, res}),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    })
};

main().catch((err) => {
    console.log(err);
});