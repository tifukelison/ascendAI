require('dotenv').config();
import { LangflowClient } from "@datastax/langflow-client";
import { InputTyp es, OutputTypes } from "@datastax/langflow-client/consts";




exports.handler = async (event) => {

  
   const langflowId = process.env.LANGFLOW_ID; 
   const apiKey = process.env.LANGFLOW_API_KEY; 
    const flowId = process.env.LANGFLOW_FLOW_ID; 
    const useDataStax = true; 
    

  console.log('Environment:', {
    keys: Object.keys(process.env).filter(k => k.includes('LANGFLOW')),
    langflowId: process.env.LANGFLOW_ID,
    apiKey: process.env.LANGFLOW_API_KEY?.slice(0, 3) + '...', // Safe logging
    flowId: process.env.LANGFLOW_FLOW_ID
  });
    const client = new LangflowClient({
      langflowId,
      apiKey,
      baseUrl: useDataStax ? undefined : process.env.LANGFLOW_BASE_URL
    });

    try {
        const body = JSON.parse(event.body);
        const inputData = {
            focusSkill: body.focusSkill,
            level: body.level,
            goal: body.goal,
            challengeFrequency: body.challengeFrequency
        };

        const response = await client.flow(flowId).run(JSON.stringify(inputData), {
            input_type: InputTypes.CHAT, // Adjust as needed
            output_type: OutputTypes.CHAT // Adjust as needed
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache', // Prevent caching
                'Access-Control-Allow-Origin': '*', // Adjust for production
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: JSON.stringify(response.outputs), // Send back the Langflow outputs
        };

    } catch (error) {
        console.error('Error calling Langflow API:', error.message);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: JSON.stringify({ error: 'Failed to communicate with Langflow.' }),
        };
    }
};