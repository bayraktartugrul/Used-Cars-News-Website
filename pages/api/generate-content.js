import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ error: 'Content is required' })
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY is not configured')
    }

    // Call Deepseek API
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `As an SEO expert and content optimizer, analyze the given content and generate optimized versions. 
            Respond with a JSON object containing the following fields:
            - title (max 60 chars)
            - excerpt (max 160 chars)
            - content (optimized version)
            - meta_title (max 60 chars)
            - meta_description (max 160 chars)
            - keywords (array of 5 relevant keywords)
            - summary (brief overview)`
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Deepseek API Error:', errorData)
      throw new Error(errorData.error?.message || 'Error calling Deepseek API')
    }

    const data = await response.json()
    console.log('Deepseek API Response:', data) // Debug için

    let generatedContent
    try {
      // API yanıtı zaten JSON formatındaysa
      if (typeof data.choices[0].message.content === 'object') {
        generatedContent = data.choices[0].message.content
      } else {
        // String olarak gelen JSON'ı parse et
        generatedContent = JSON.parse(data.choices[0].message.content)
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.log('Raw AI response:', data.choices[0].message.content)
      throw new Error('Invalid response format from AI')
    }

    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content', 'meta_title', 'meta_description', 'keywords', 'summary']
    for (const field of requiredFields) {
      if (!generatedContent[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    return res.status(200).json(generatedContent)

  } catch (error) {
    console.error('Error in generate-content:', error)
    return res.status(500).json({ 
      error: 'Error generating content',
      details: error.message 
    })
  }
} 