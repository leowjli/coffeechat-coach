import { z } from 'zod';

export const generateKitSchema = z.object({
  profileUrl: z.string().url().optional(),
  rawProfileText: z.string().min(50, 'Profile text must be at least 50 characters'),
});

export const chatMessageSchema = z.object({
  scenario: z.enum(['recruiter', 'alumni', 'pm']),
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
});

export const feedbackSchema = z.object({
  transcript: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })).min(2, 'Transcript must have at least 2 messages'),
});

export const coldEmailSchema = z.object({
  draftText: z.string()
    .min(20, 'Email draft must be at least 20 characters')
    .max(2000, 'Email draft too long'),
});

export function validateProfileInput(data: unknown) {
  const result = generateKitSchema.safeParse(data);
  
  if (!result.success) {
    throw new Error(result.error.errors[0]?.message || 'Invalid input');
  }

  // Additional validation: reject if only URL provided without actual profile text
  if (result.data.profileUrl && result.data.rawProfileText.length < 100) {
    throw new Error('Please paste the actual profile text (About/Experience/Education), not just the link.');
  }

  return result.data;
}

export function validateChatMessage(data: unknown) {
  const result = chatMessageSchema.safeParse(data);
  
  if (!result.success) {
    throw new Error(result.error.errors[0]?.message || 'Invalid message');
  }

  return result.data;
}

export function validateFeedbackRequest(data: unknown) {
  const result = feedbackSchema.safeParse(data);
  
  if (!result.success) {
    throw new Error(result.error.errors[0]?.message || 'Invalid transcript');
  }

  return result.data;
}

export function validateColdEmail(data: unknown) {
  const result = coldEmailSchema.safeParse(data);
  
  if (!result.success) {
    throw new Error(result.error.errors[0]?.message || 'Invalid email draft');
  }

  return result.data;
}