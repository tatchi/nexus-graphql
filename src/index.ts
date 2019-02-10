/// <reference path="./my-generated-types.d.ts" />
import { ApolloServer, gql } from 'apollo-server';
import {
  objectType,
  queryType,
  makeSchema,
  intArg,
  stringArg,
  idArg,
} from 'nexus';
const path = require('path');

interface book {
  id: string;
  title: string;
  author: string;
}

const rates = [
  {
    name: 'United Arab Emirates Dirham',
    rate: '3.67',
    currency: 'AED',
  },
  {
    name: 'Afghan Afghani',
    rate: '74.85',
    currency: 'AFN',
  },
  {
    name: 'Albanian Lek',
    rate: '109.50',
    currency: 'ALL',
  },
];

const books: book[] = [
  {
    id: '1',
    title: 'Harry Potter and the Chamber of Secrets 12',
    author: 'J.K. Rowling',
  },
  {
    id: '2',
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const Book = objectType({
  name: 'Book',
  definition(t) {
    t.id('id');
    t.string('title', { nullable: true });
    t.string('author');
  },
});
const Rate = objectType({
  name: 'Rate',
  definition(t) {
    t.string('name');
    t.string('rate');
    t.string('currency');
  },
});

const Query = queryType({
  definition(t) {
    t.list.field('books', {
      type: Book,
      async resolve(root, args, ctx) {
        return await new Promise(resolve => setTimeout(resolve, 1000)).then(
          () => books,
        );
      },
    });
    t.list.field('rates', {
      type: Rate,
      args: {
        currency: stringArg({ required: true }),
      },
      async resolve(root, args, ctx) {
        return await new Promise(resolve => setTimeout(resolve, 1000)).then(
          () => rates,
        );
      },
    });
    t.field('bookById', {
      type: Book,
      nullable: true,
      args: {
        id: idArg({ nullable: false }),
      },
      resolve(root, args, ctx) {
        return books.find(b => b.id === args.id) || null;
      },
    });
  },
});

const schema = makeSchema({
  types: [Book, Rate, Query],
  outputs: {
    schema: path.join(__dirname, './my-schema.graphql'),
    typegen: path.join(__dirname, './my-generated-types.d.ts'),
  },
});

const server = new ApolloServer({
  schema,
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
