const { graphql } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')
const fs = require('fs')

const typeDefs = fs.readFileSync('./starwars.graphql').toString('utf-8')

const artoo = {
  id: "1",
  name: "R2D2",
  primaryFunction: "Astromech",
  appearsIn: ["NEWHOPE", "EMPIRE", "JEDI"]
}

const luke = {
  id: "2",
  name: "Luke",
  homePlanet: "Tatooine",
  appearsIn: ["NEWHOPE", "EMPIRE", "JEDI"]
}

const leia = {
  id: "3",
  name: "Leïa",
  homePlanet: "Alderaan",
  appearsIn: ["NEWHOPE", "EMPIRE", "JEDI"],
}

artoo.friends = [luke, leia]
luke.friends = [artoo, leia]
leia.friends = [artoo, luke]

const humans = [luke, leia]
const droids = [artoo]

const resolvers = {
  Query: {
    hero: (obj, args) => {
      switch (args.episode) {
        case 'JEDI': return luke
        default: return artoo
      }
    },
    human: (obj, args) => {
      return humans.find(function (human) {
        return human.id == args.id
      })
    },
    droid: (obj, args) => {
      return droids.find(function (droid) {
        return droid.id == args.id
      })
    }
  },
  Character: {
    __resolveType(character){
      if(character.primaryFunction){
        return 'Droid'
      }
      if(character.homePlanet){
        return 'Human'
      }
      return null
    },
  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

schema.getType

function runQuery(query) {
  graphql(schema, query).then((response) => {
    console.log(JSON.stringify(response, null, 2))
  })
}

runQuery(`{
  hero {
    name
    friends {
      name
    }
    ... on Droid {
      primaryFunction
    }
  }
}`)

runQuery(`{
  hero(episode: JEDI) {
    name
    friends {
      name
    }
    ... on Droid {
      primaryFunction
    }
    ... on Human {
      homePlanet
    }
  }
}`)

runQuery(`{
  human(id: "3") {
    name
    friends {
      name
      appearsIn
    }
    homePlanet
  }
}`)

runQuery(`{
  droid(id: "1") {
    name
    friends {
      name
      appearsIn
    }
    primaryFunction
  }
}`)
