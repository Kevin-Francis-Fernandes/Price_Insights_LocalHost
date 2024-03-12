const { MongoClient } = require("mongodb");

const agg = [
  {
  '$search': {
    'index': 'defaultAmazon', 
    'compound': {
      'should': [
        {
          'text': {
            'query': 'Samsung', 
            'path': 'title', 
            'fuzzy': {
              'maxEdits': 2
            }
          }
        },
        // {
        //   'text': {
        //     'query': 'samsung', 
        //     'path': 'Spec', 
        //     'fuzzy': {
        //       'maxEdits': 2
        //     }
        //   }
        // }
      ],
      'minimumShouldMatch': 1 // Optional, depends on your use case
    }
  }
}, 
// {
//   '$project': {
//     'title': 1, 
//     // 'score': {
//     //   '$meta': 'searchScore'
//     // }
//   }
// }, 
{
  '$sort': {
    'score': -1 // Sort in descending order based on the 'score' field
  }
},
{
  '$limit': 4
}
];


async function runQuery() {
  const client = await MongoClient.connect(
    "mongodb+srv://Gaurish:gaurishdhond@mongotest.mrqw7rd.mongodb.net/?retryWrites=true&w=majority&appName=MongoTest"
  );
   
  try {
    const coll = client.db('Amazon').collection('products');
    const cursor = coll.aggregate(agg);
    cursor.map( (c) => console.log(c))
    const result = await cursor.toArray();
    // console.log(result);
  } 
  finally {
    await client.close();
  }
}

// Call the async function
runQuery().catch(error => console.error(error));