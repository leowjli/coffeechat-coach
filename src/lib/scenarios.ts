export interface Scenario {
  id: string;
  title: string;
  description: string;
  persona: string;
}

export const scenarios: Scenario[] = [
  {
    id: 'recruiter',
    title: 'Recruiter Coffee Chat',
    description: 'Practice networking with a tech recruiter. Learn about opportunities, share your background, and make a great impression.',
    persona: 'Tech Recruiter at a Major Company'
  },
  {
    id: 'alumni',
    title: 'Alumni Networking',
    description: 'Connect with a university alumni working in tech. Get career advice and insights from someone who\'s been in your shoes.',
    persona: 'University Alumni (3-4 years experience)'
  },
  {
    id: 'pm',
    title: 'Product Manager Info Interview',
    description: 'Learn about product management from a Senior PM. Understand the role, career path, and how to break into PM.',
    persona: 'Senior Product Manager'
  },
  {
    id: 'designer',
    title: 'UX Designer Portfolio Review',
    description: 'Get feedback on your design work from a Senior UX Designer. Learn about design processes, career growth, and industry trends.',
    persona: 'Senior UX Designer'
  }
];

export function getScenario(id: string): Scenario | null {
  return scenarios.find(s => s.id === id) || null;
}