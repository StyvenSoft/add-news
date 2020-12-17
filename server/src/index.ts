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

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();
    const PORT = process.env.PORT || 4000;
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [testResolver, postResolver, userResolver],
            validate: false
        }),
        context: () => ({ em: orm.em })
    });

    apolloServer.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    })    
};

main().catch((err) => {
    console.log(err);
});