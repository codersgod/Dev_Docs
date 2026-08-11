---
title: "GraphQL"
category: "nodejs"
chapterId: "node-frameworks-api"
slug: "node-graphql"
description: "Schemas, queries, mutations, and resolvers with Apollo Server."
---

# GraphQL

## Core concepts

- **Schema**: Defines types and the shape of the API.
- **Query**: Read data.
- **Mutation**: Write/update data.
- **Resolver**: The function that provides the data for a field.

## Apollo Server setup

```bash
npm install @apollo/server graphql
```

```js
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Post {
    id: ID!
    title: String!
    body: String!
  }

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, body: String!): Post!
  }
`;

const posts = [];

const resolvers = {
  Query: {
    posts: () => posts,
    post: (_, { id }) => posts.find(p => p.id === id),
  },
  Mutation: {
    createPost: (_, { title, body }) => {
      const post = { id: String(Date.now()), title, body };
      posts.push(post);
      return post;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`GraphQL ready at ${url}`);
```

## Query example (client)

```graphql
query {
  posts {
    id
    title
  }
}

mutation {
  createPost(title: "Hello", body: "World") {
    id
    title
  }
}
```

## REST vs GraphQL

| | REST | GraphQL |
|---|---|---|
| Endpoint count | Many | One (`/graphql`) |
| Over-fetching | Common | Avoided |
| Under-fetching | Common | Avoided |
| Typing | Manual | Schema-enforced |
