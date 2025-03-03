import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateArticleImage(title, content) {
  try {
    const prompt = `Create a realistic photograph of a car related to this article: ${title}. Style: Professional automotive photography`;
    
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      model: "dall-e-3",
    });

    return response.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
} 