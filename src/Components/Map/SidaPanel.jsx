// Example: Query OpenAI API for historical events with coordinates

import { useEffect, useState } from "react";


/*
async function getHistoricalEvents(year) {
  const apiKey = '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'; // Replace with your actual API key
  
  const prompt = `List 5 significant historical events that occurred in ${year}. 
    For each event, provide:
    1. Event name
    2. Date (as specific as possible)
    3. Location name
    4. Coordinates (latitude, longitude)
    5. Brief summary (2-3 sentences)

    Format the response as a JSON array with this structure:
    [
    {
        "name": "Event name",
        "date": "Month Day, ${year}",
        "location": "City, Country",
        "coordinates": {
        "lat": 0.0,
        "lng": 0.0
        },
        "summary": "Brief description of what happened and why it was significant."
    }
    ]

    Only return valid JSON, no additional text.`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that provides accurate historical information in JSON format.'
            },
            {
                role: 'user',
                content: prompt
            }
            ],
            temperature: 0.7,
            max_tokens: 1500
        })
        });

        const data = await response.json();
        
        // Extract the JSON from the response
        const content = data.choices[0].message.content;
        
        // Parse the JSON (remove any markdown formatting if present)
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const events = JSON.parse(cleanContent);
        
        return events;
        
    } catch (error) {
        console.error('Error querying OpenAI API:', error);
        throw error;
    }
}*/

export default function SidePanel(yearProp){

}
    /*async function main() {
    try {
        console.log(`Fetching events for ${year}...`);
        
        console.log(`\nFound ${events.length} events:\n`);
        events.forEach((event, index) => {
        console.log(`${index + 1}. ${event.name}`);
        console.log(`   Date: ${event.date}`);
        console.log(`   Location: ${event.location}`);
        console.log(`   Coordinates: ${event.coordinates.lat}, ${event.coordinates.lng}`);
        console.log(`   Summary: ${event.summary}`);
        console.log('');
        });
        
    } catch (error) {
        console.error('Failed to fetch events:', error.message);
    }
}*/
