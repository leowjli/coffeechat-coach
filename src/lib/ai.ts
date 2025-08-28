import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper function to clean and parse JSON responses from AI
function parseAIResponse<T = Record<string, unknown>>(response: string): T {
  try {
    // Clean the response to remove any markdown formatting and find JSON
    let cleanedResponse = response
      .replace(/```json\s*/g, '')
      .replace(/```\s*$/g, '')
      .replace(/^\s*```\s*/g, '')
      .trim();
    
    // Try to extract JSON if there's text before/after
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    // Additional cleaning for common issues
    cleanedResponse = cleanedResponse
      .replace(/\n/g, ' ')  // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/,\s*}/g, '}') // Remove trailing commas
      .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
    
    return JSON.parse(cleanedResponse) as T;
  } catch (error) {
    console.error('Failed to parse AI response:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Invalid response format from AI service. Please try again.');
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CoffeeChatKit {
  sharedInterests: string[];
  starters: string[];
  followUps: string[];
  oneLinePitch: string;
}

export interface ChatFeedback {
  strengths: string[];
  improvements: string[];
}

export interface ColdEmailAnalysis {
  aiFeedback: ChatFeedback;
  aiRewrite: string;
  aiSubjectSuggestions: string[];
  aiOpeningLine: string;
  aiClosingCTA: string;
}

export async function generateCoffeeChatKit(
  userInfo: {
    name: string;
    role: string;
    company?: string;
    background?: string;
    goals?: string;
  },
  targetInfo: {
    profileText: string;
    profileUrl?: string;
  }
): Promise<CoffeeChatKit> {
  const prompt = `Generate a personalized CoffeeChat Kit for networking. The user wants to network with someone based on their LinkedIn profile.

USER INFORMATION:
- Name: ${userInfo.name}
- Role: ${userInfo.role}
- Company: ${userInfo.company || 'Not specified'}
- Background/Interests: ${userInfo.background || 'Not specified'}
- Goals: ${userInfo.goals || 'Not specified'}

TARGET PERSON'S PROFILE:
${targetInfo.profileText}
${targetInfo.profileUrl ? `LinkedIn URL: ${targetInfo.profileUrl}` : ''}

IMPORTANT INSTRUCTIONS:
- The ONE-LINE PITCH should be about the USER (${userInfo.name}) introducing themselves
- The SHARED INTERESTS should identify common ground between the user and the target person
- The CONVERSATION STARTERS should be specific questions about the TARGET PERSON's background/experience
- The FOLLOW-UPS should build on the target person's responses and show genuine interest

You must respond with ONLY valid JSON in this exact format:
{
  "sharedInterests": ["specific interest 1 that both user and target share", "specific interest 2", "specific interest 3", "specific interest 4"],
  "starters": ["Specific question about target's work at [company]", "Question about target's specific project/achievement", "Question about target's background in [field]", "Question about target's experience with [technology/skill]"],
  "followUps": ["Follow-up about target's work", "Question about target's career path", "Question about target's advice", "Question about target's industry insights"],
  "oneLinePitch": "Hey! 👋 I'm ${userInfo.name}, a ${userInfo.role}${userInfo.company ? ` at ${userInfo.company}` : ''} who's ${userInfo.background ? userInfo.background.toLowerCase() : 'passionate about [relevant field]'}. ${userInfo.goals ? `Looking to ${userInfo.goals.toLowerCase()}` : 'Always excited to connect with fellow professionals'} and swap stories! ✨"
}

Be specific to the target person's background. Avoid generic questions like "How did you get into tech?". Focus on their actual experience, companies, projects, or achievements mentioned in their profile. Do not include any markdown formatting or additional text. Only return the JSON object.`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) throw new Error('No response from AI');

  try {
    // Clean the response to remove any markdown formatting
    const cleanedResponse = response
      .replace(/```json\s*/g, '')
      .replace(/```\s*$/g, '')
      .replace(/^\s*```\s*/g, '')
      .trim();
    
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Failed to parse AI response:', response);
    throw new Error(`Invalid JSON response from AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateChatResponse(
  scenario: string,
  messages: ChatMessage[]
): Promise<ReadableStream> {
  const systemPrompt = getScenarioPrompt(scenario);

  const stream = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    stream: true,
    temperature: 0.8,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          controller.enqueue(new TextEncoder().encode(content));
        }
      }
      controller.close();
    },
  });
}

export async function generateChatFeedback(
  transcript: ChatMessage[]
): Promise<ChatFeedback> {
  const prompt = `Analyze this coffee chat conversation and provide feedback ONLY on the USER's performance (not the assistant's behavior).

Transcript: ${JSON.stringify(transcript, null, 2)}

IMPORTANT INSTRUCTIONS:
- ONLY analyze the USER's messages (role: "user")
- DO NOT mention anything about the assistant's behavior
- Focus on the user's communication skills, networking effectiveness, and conversation quality
- Provide 1-3 actual, realistic strengths based on what the user did well
- Provide 1-3 specific areas for improvement based on what the user could do better
- Be honest and constructive - don't make up strengths that aren't there

You must respond with ONLY valid JSON in this exact format:
{
  "strengths": ["actual strength 1", "actual strength 2", "actual strength 3"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"]
}

Examples of good feedback:
- Strengths: "Asked specific questions about the recruiter's experience", "Showed genuine interest in the industry", "Provided relevant background information"
- Improvements: "Could provide more specific examples from your background", "Consider asking follow-up questions to deepen the conversation", "Try to share more about your career goals"

Focus on the user's actual performance, not generic advice. Do not include any markdown formatting or additional text. Only return the JSON object.`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) throw new Error('No response from AI');

  try {
    // Clean the response to remove any markdown formatting
    const cleanedResponse = response
      .replace(/```json\s*/g, '')
      .replace(/```\s*$/g, '')
      .replace(/^\s*```\s*/g, '')
      .trim();
    
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Failed to parse AI response:', response);
    throw new Error(`Invalid JSON response from AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzeColdEmail(draftText: string): Promise<ColdEmailAnalysis> {
  const prompt = `You are a JSON-only response bot. Analyze this cold outreach email and respond with ONLY valid JSON.

Email draft: "${draftText}"

IMPORTANT: The aiRewrite must be a CONCISE, EFFECTIVE cold email that includes:
- Brief personalized opening (1 sentence)
- Clear value proposition or mutual benefit (1-2 sentences)
- Specific, actionable request (1 sentence)
- Professional but friendly tone
- Total length: 3-4 sentences maximum
- Cold email format: direct, concise, no fluff

Respond with this exact JSON structure (no other text, no markdown, no explanations):
{
  "aiFeedback": {
    "strengths": ["Clear and direct", "Shows initiative", "Specific request"],
    "improvements": ["Add personalization", "Include value proposition", "Make it more engaging"]
  },
  "aiRewrite": "Hi [Name], I noticed your impressive work at [Company] and I'm interested in [specific aspect] and believe I could contribute [specific value]. Can we talk at [specific time and date] in-person or virtually to discuss [specific topic]? I'm happy to work around your schedule. Best regards, [Your Name]",
  "aiSubjectSuggestions": ["Quick question about [Company]", "Coffee chat request", "Connecting on [specific topic]"],
  "aiOpeningLine": "Hi [Name], I came across your profile and was impressed by your work on [specific project/achievement].",
  "aiClosingCTA": "Would you be open to a brief coffee chat this week? I'm happy to work around your schedule."
}`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) throw new Error('No response from AI');

  return parseAIResponse(response);
}

function getScenarioPrompt(scenario: string): string {
  const prompts = {
    'recruiter': `You are a busy tech recruiter at a major company. You're having a coffee chat with a candidate who reached out for networking. 

PERSONALITY & STYLE:
- Professional but not overly enthusiastic - you're busy and time-conscious
- Helpful and willing to share insights, but not making promises
- Ask focused questions about their background and goals
- Share realistic industry insights and advice
- Keep responses concise and to the point
- Show interest but maintain professional boundaries

CONVERSATION APPROACH:
- Ask about their current role, experience, and what they're looking for
- Share insights about the job market and what companies are looking for
- Give practical advice about networking and job searching
- Be honest about the competitive nature of tech hiring
- Don't offer coffee/water or overly friendly gestures - stay professional
- Focus on their career goals and how they can improve their chances

AVOID:
- Overly enthusiastic or overly friendly language
- Offering refreshments or casual hospitality
- Making promises about job opportunities
- Being too casual or informal
- Generic networking advice

Keep responses professional, helpful, and realistic for a busy recruiter's perspective.`,

    'alumni': `You are a university alumni who graduated 3-4 years ago and now works in tech. You're having a coffee chat with a current student or recent grad who reached out for networking.

PERSONALITY & STYLE:
- Relatable and empathetic - you remember being in their shoes
- Proud of your alma mater but not overly nostalgic
- Practical and honest about the transition from school to industry
- Willing to share your journey but not sugar-coating the challenges
- Professional but approachable - you're not their professor
- Focus on actionable advice based on your real experience

CONVERSATION APPROACH:
- Ask about their major, graduation timeline, and career interests
- Share specific details about your transition from university to tech
- Discuss the differences between academic and industry work
- Give practical advice about job searching, internships, and skill development
- Mention specific companies, technologies, or trends you've encountered
- Offer realistic expectations about entry-level roles and career progression
- Share networking tips that worked for you personally

AVOID:
- Being overly nostalgic about university life
- Making it sound like you had everything figured out
- Giving generic "follow your passion" advice
- Offering to get them a job at your company (unless you actually can)
- Being condescending about their current situation
- Focusing too much on grades or academic achievements

Keep responses authentic, practical, and based on real experience as a recent graduate navigating the tech industry.`,

    'pm': `You are a Senior Product Manager at a tech company with 5-7 years of experience. You're having a coffee chat with someone interested in learning about product management and potentially breaking into the field.

PERSONALITY & STYLE:
- Passionate about product management but realistic about the challenges
- Busy but willing to share insights about your role and career path
- Direct and honest about what the job actually entails
- Enthusiastic about helping others understand the field
- Professional but conversational - you're not giving a lecture
- Focus on practical insights from your daily work

CONVERSATION APPROACH:
- Ask about their current role, background, and why they're interested in PM
- Share specific examples from your day-to-day work (meetings, decisions, challenges)
- Discuss the different types of PM roles (technical, growth, platform, etc.)
- Explain the skills that are actually valuable in PM (not just technical skills)
- Give honest advice about breaking into PM from different backgrounds
- Share insights about the PM interview process and what companies look for
- Discuss the challenges and rewards of being a PM
- Mention specific tools, methodologies, or frameworks you use

AVOID:
- Making PM sound like the perfect job for everyone
- Focusing only on the glamorous aspects of the role
- Giving generic "learn to code" advice without context
- Offering to refer them for jobs at your company (unless you actually can)
- Being overly technical if they're not from a technical background
- Making it sound like PM is easy to break into

Keep responses informative, realistic, and based on actual PM experience. Focus on helping them understand if PM is right for them and how to prepare effectively.`
  };

  return prompts[scenario as keyof typeof prompts] || prompts.recruiter;
}