const { Configuration, OpenAIApi } = require("openai");
import { PineconeClient } from "@pinecone-database/pinecone";


export default async function handler(req, res) {
    const query = req.body.query;
    console.log("query", query);
    // make embedding for query
    // pass embedding to pinecone
    // get results

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: query,
    });
    var embedding = response.data.data[0].embedding;




    fetch('https://semantic-search-openai-b36158e.svc.us-west4-gcp.pinecone.io/query', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Api-Key': process.env.NEXT_PUBLIC_PINECONE
        },
        body: JSON.stringify({
            includeValues: false,
            includeMetadata: true,
            vector: embedding,
            topK: 5,
        })
    })
        .then(response => response.json())
        .then(data => {console.log(data)
        return res.status(200).json(data.matches);
        }
        
        
        )
        .catch(error => {console.error(error)
        return res.status(500).json({error: error});
        });

}



// const sendTwilio = async (perscription) => {
//     const res = await fetch("/api/twilio", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ drug: perscription, phone: FBuser.phone }),
//     });
// };