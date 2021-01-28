import 'reflect-metadata';
import { COOKIE_NAME, __prod__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { testResolver } from './resolvers/test';
import { postResolver } from './resolvers/post';
import { userResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Post } from './entities/Post';
import { User } from './entities/User';
// import path from 'path';
// import { User } from './entities/User';
// import { sendEmail } from './utils/sendEmail';

const main = async () => {
    await createConnection({
        type: "postgres",
        database: "addnews",
        username: "postgres",
        password: "postgres",
        logging: true,
        synchronize: true,
        // migrations: [path.join(__dirname, "./migrations/*")],
        entities: [Post, User],
    });
    // await conn.runMigrations();
    // sendEmail("test@test.com", "Hello test welcome");
    // await orm.em.nativeDelete(User, {})

    const app = express();

    const RedisStore = connectRedis(session)
    const redis = new Redis();
    
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis,
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
        context: ({ req, res }) => ({ req, res, redis }),
    });

    apolloServer.applyMiddleware({ 
        app,
        cors: false,
    });

    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    })
};

main().catch((err) => {
    console.log(err);
});