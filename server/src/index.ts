import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
// import { Post } from './entities/Post';
import microConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { testResolver } from './resolvers/test';

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [testResolver],
            validate: false
        })
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('Server started on port: localhost:4000');
    })
    // const post = orm.em.create(Post, {title: 'My title'});
    // await orm.em.persistAndFlush(post);
    // await orm.em.nativeInsert(Post, {title: 'Second post!'});
    // const posts = await orm.em.find(Post, {});
    // console.log(posts);
    
};

main().catch((err) => {
    console.log(err);
});