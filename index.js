const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
} = require("graphql");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

const picture = new GraphQLObjectType({
  name: "Picture",
  description: "Picture of the user",
  fields: () => ({
    large: {
      type: GraphQLString,
    },
    medium: {
      type: GraphQLString,
    },
    thumbnail: {
      type: GraphQLString,
    },
  }),
});

const id = new GraphQLObjectType({
  name: "ID",
  description: "ID of the user",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    value: {
      type: GraphQLString,
    },
  }),
});

const registered = new GraphQLObjectType({
  name: "Registered",
  description: "Registered data of the user",
  fields: () => ({
    date: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
  }),
});

const dob = new GraphQLObjectType({
  name: "Dob",
  description: "Dob of the user",
  fields: () => ({
    date: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
  }),
});

const login = new GraphQLObjectType({
  name: "Login",
  description: "Login data of the user",
  fields: () => ({
    uuid: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
    salt: {
      type: GraphQLString,
    },
    md5: {
      type: GraphQLString,
    },
    sha1: {
      type: GraphQLString,
    },
    sha256: {
      type: GraphQLString,
    },
  }),
});

const timezone = new GraphQLObjectType({
  name: "Timezone",
  description: "Timezone of the location",
  fields: () => ({
    offset: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
  }),
});

const coordinates = new GraphQLObjectType({
  name: "Coordinates",
  description: "Coordinates of the location",
  fields: () => ({
    latitude: {
      type: GraphQLString,
    },
    longitude: {
      type: GraphQLString,
    },
  }),
});

const location = new GraphQLObjectType({
  name: "Location",
  description: "Location of the user",
  fields: () => ({
    street: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    state: {
      type: GraphQLString,
    },
    postcode: {
      type: GraphQLString,
    },
    coordinates: {
      type: coordinates,
      resolve: (parent) => parent.coordinates,
    },
    timezone: {
      type: timezone,
      resolve: (parent) => parent.timezone,
    },
  }),
});

const username = new GraphQLObjectType({
  name: "Username",
  description: "Name of the user",
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    first: {
      type: GraphQLString,
    },
    last: {
      type: GraphQLString,
    },
  }),
});

const user = new GraphQLObjectType({
  name: "User",
  description: "User data",
  fields: () => ({
    gender: {
      type: GraphQLString,
    },
    name: {
      type: username,
      resolve: (parent) => parent.name,
    },
    location: {
      type: location,
      resolve: (parent) => parent.location,
    },
    email: {
      type: GraphQLString,
    },
    login: {
      type: login,
      resolve: (parent) => parent.login,
    },
    dob: {
      type: dob,
      resolve: (parent) => parent.dob,
    },
    registered: {
      type: registered,
      resolve: (parent) => parent.registered,
    },
    phone: {
      type: GraphQLString,
    },
    cell: {
      type: GraphQLString,
    },
    id: {
      type: id,
      resolve: (parent) => parent.id,
    },
    picture: {
      type: picture,
      resolve: (parent) => parent.picture,
    },
    nat: {
      type: GraphQLString,
    },
  }),
});

const rootQuery = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    users: {
      type: new GraphQLList(user),
      description: "List of Users",
      args: {
        count: {
          type: GraphQLInt,
        },
      },
      resolve: (perent, args) => {
        return axios
          .get(`https://randomuser.me/api/?results=${args.count}`)
          .then((response) => response.data.results);
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: rootQuery,
});

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
