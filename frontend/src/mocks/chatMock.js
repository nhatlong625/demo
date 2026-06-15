export const tutorModes = [
  { id: 'guided', title: 'Guided Tutor', description: 'Step-by-step explanations with checkpoints.' },
  { id: 'quiz', title: 'Quiz Coach', description: 'Fast drills with instant feedback.' },
  { id: 'summary', title: 'Summary Maker', description: 'Turn documents into revision notes.' },
];

export const chatThreads = [
  { id: 'thread-01', title: 'SWR Course Overview', topic: 'Software Requirements', updatedAt: '10 min ago' },
];

export const chatMessages = [
  {
    id: 1,
    sender: 'ai',
    text: 'Hi Lena, I reviewed your uploaded notes. Would you like a summary, a quiz, or a concept walkthrough?',
    time: '09:15',
  },
  {
    id: 2,
    sender: 'user',
    text: 'Can you explain backpropagation in a simpler way and then give me 3 questions?',
    time: '09:16',
  },
  {
    id: 3,
    sender: 'ai',
    text: 'Absolutely. Think of backpropagation as a way for the model to trace each mistake backward, figure out which weights contributed, and adjust them gradually.',
    time: '09:16',
  },
  {
    id: 4,
    sender: 'ai',
    text: 'After the walkthrough, I can generate short practice questions with increasing difficulty.',
    time: '09:17',
  },
];

export const chatMock = [
  {
    id: 1,
    role: 'user',
    content: 'Introduce SWR'
  },
  {
    id: 2,
    role: 'assistant',
    content: 'SWR, or Software Requirements, is a subject that teaches how to understand what a software system should do before the development team starts building it.\n\nIn this subject, you typically learn:\n- How to identify stakeholders and understand their needs.\n- How to collect requirements through interviews, questionnaires, observation, and workshops.\n- How to write functional and non-functional requirements clearly.\n- How to prepare documents such as SRS, business rules, vision and scope, and use cases.\n- How to validate requirements so the final system matches user expectations.\n\nWhy it matters:\nSWR helps reduce misunderstandings, prevent costly rework, and make communication clearer between users, clients, analysts, testers, and developers.',
    sources: ['COS SRS.pdf', 'COS Business Rules.pdf', 'COS Vision and Scope.pdf']
  },
  {
    id: 3,
    role: 'user',
    content: 'What documents are usually created in SWR?'
  },
  {
    id: 4,
    role: 'assistant',
    content: 'Common SWR documents include:\n\n```text\n1. Vision and Scope\n2. Software Requirements Specification (SRS)\n3. Business Rules\n4. Use Case Specification\n5. Requirements Traceability Matrix\n```\n\nThese documents help the team agree on what should be built, why it matters, and how each requirement can be verified later.',
    sources: ['COS SRS.pdf', 'COS Vision and Scope.pdf']
  }
];

export const chatMockByThread = {
  'thread-01': chatMock,
  default: chatMock
};
