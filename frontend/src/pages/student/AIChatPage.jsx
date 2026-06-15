import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ChatSidebar from '../../components/student/chat/ChatSidebar';
import ChatMessage from '../../components/student/chat/ChatMessage';
import ChatInput from '../../components/student/chat/ChatInput';
import Modal from '../../components/common/Modal';
import { chatMock, chatMockByThread, chatThreads } from '../../mocks/chatMock';

const sourcePreviewMock = {
  'COS SRS.pdf': {
    type: 'PDF',
    pages: 'SRS document',
    summary: 'Describes the functional and non-functional requirements for the Course Online System.',
    excerpt: 'The SRS defines what the system must provide, including user roles, core features, constraints, and acceptance criteria.',
    sections: [
      {
        heading: '1. Introduction',
        body: 'The Course Online System supports students, instructors, and administrators in managing online courses, learning materials, practice tests, and study progress.'
      },
      {
        heading: '2. Functional Requirements',
        body: 'The system shall allow students to browse available courses, enroll in eligible courses, view uploaded documents, and generate AI-supported study sessions.'
      },
      {
        heading: '3. Non-functional Requirements',
        body: 'The system should provide responsive page loading, role-based access control, secure file handling, and a consistent user interface across student and admin workflows.'
      }
    ]
  },
  'COS Business Rules.pdf': {
    type: 'PDF',
    pages: 'Business rules',
    summary: 'Lists the business constraints and policies that the Course Online System must follow.',
    excerpt: 'Business rules describe conditions such as enrollment limits, course access rules, payment validation, and user permission boundaries.',
    sections: [
      {
        heading: 'BR-01 Course Enrollment',
        body: 'A student can enroll in a course only when the course is active and the student account has permission to access that learning package.'
      },
      {
        heading: 'BR-02 Document Access',
        body: 'Students can view documents linked to their enrolled courses. Admin users can upload, replace, or archive course documents.'
      },
      {
        heading: 'BR-03 Practice Test Generation',
        body: 'Practice tests should be generated from approved materials only, and each generated question should remain traceable to its source document.'
      }
    ]
  },
  'COS Vision and Scope.pdf': {
    type: 'PDF',
    pages: 'Vision and scope',
    summary: 'Introduces the product vision, target users, goals, and project boundaries for the Course Online System.',
    excerpt: 'The vision and scope document explains why the system is needed, who it serves, and which features are included or excluded.',
    sections: [
      {
        heading: 'Product Vision',
        body: 'The Course Online System aims to help learners organize course content, interact with study materials, and receive AI-supported explanations in one workspace.'
      },
      {
        heading: 'Target Users',
        body: 'The primary users are students who need guided study support, instructors who manage course content, and administrators who monitor documents and platform activity.'
      },
      {
        heading: 'Project Scope',
        body: 'The initial scope includes course browsing, document viewing, AI chat support, practice test generation, and basic admin management features.'
      }
    ]
  },
  'Software_Requirements_3rd_Edition.pdf': {
    type: 'PDF',
    pages: 'Chapter 4, pages 92-105',
    summary: 'Explains requirement elicitation techniques, including interviews, workshops, questionnaires, and observation.',
    excerpt: 'Interviews help analysts discover stakeholder goals, clarify ambiguous requirements, and capture business rules before documenting the SRS.'
  },
  'SWR_Elicitation_Techniques.pdf': {
    type: 'PDF',
    pages: 'Section 2.1',
    summary: 'Compares common SWR elicitation methods and when each method should be used.',
    excerpt: 'Interview is useful when the analyst needs detailed context, examples, exceptions, and direct confirmation from stakeholders.'
  },
  'Stakeholder_Interview_Checklist.docx': {
    type: 'DOCX',
    pages: 'Checklist',
    summary: 'A practical checklist for preparing, conducting, and validating stakeholder interviews.',
    excerpt: 'Ask about current pain points, expected outcomes, user roles, exceptions, priorities, and acceptance criteria.'
  },
  'Requirements_Interview_Template.pdf': {
    type: 'PDF',
    pages: 'Template',
    summary: 'Template questions for eliciting functional and non-functional requirements.',
    excerpt: 'Start with open-ended questions, then narrow the conversation into specific workflows and measurable requirements.'
  },
  'SRS_Practical_Guide.docx': {
    type: 'DOCX',
    pages: 'Section 3',
    summary: 'Shows how interview notes can be converted into clear SRS requirement statements.',
    excerpt: 'Each confirmed stakeholder need should be rewritten as a testable, traceable requirement.'
  },
  'Linear_Algebra_Chapter_5.pdf': {
    type: 'PDF',
    pages: 'Chapter 5, pages 118-132',
    summary: 'Introduces eigenvectors, eigenvalues, and their relationship to matrix transformations.',
    excerpt: 'An eigenvector keeps its direction under a linear transformation, while the eigenvalue describes the scale factor applied to that direction.'
  },
  'Matrix_Transformations_Notes.pdf': {
    type: 'PDF',
    pages: 'Lecture notes, section 3',
    summary: 'Explains how matrices transform vectors through scaling, rotation, reflection, and shearing.',
    excerpt: 'Eigenvectors reveal the directions that remain stable under a transformation.'
  },
  'Linear_Algebra_Worked_Examples.pdf': {
    type: 'PDF',
    pages: 'Examples 4-6',
    summary: 'Worked examples for finding eigenvalues and eigenvectors from simple matrices.',
    excerpt: 'For a diagonal matrix, the standard basis vectors are eigenvectors and the diagonal entries are their eigenvalues.'
  }
};

function getSourcePreview(source) {
  return sourcePreviewMock[source] || {
    type: source.split('.').pop()?.toUpperCase() || 'FILE',
    pages: 'Mock preview',
    summary: 'This is sample preview data for the selected citation.',
    excerpt: 'Preview content will be loaded from the real document once backend document parsing is connected.',
    sections: [
      {
        heading: 'Mock Document Content',
        body: 'This preview uses sample content. A real implementation can replace it with parsed PDF, DOCX, or document chunks returned from the backend.'
      }
    ]
  };
}

function createMockAiResponse(text) {
  const normalizedText = text.toLowerCase();

  if (normalizedText.includes('introduce') && normalizedText.includes('swr')) {
    return {
      role: 'assistant',
      content: 'SWR, or Software Requirements, is a subject that teaches how to understand what a software system should do before the development team starts building it.\n\nIn this subject, you typically learn:\n- How to identify stakeholders and understand their needs.\n- How to collect requirements through interviews, questionnaires, observation, and workshops.\n- How to write functional and non-functional requirements clearly.\n- How to prepare documents such as SRS, business rules, vision and scope, and use cases.\n- How to validate requirements so the final system matches user expectations.\n\nWhy it matters:\nSWR helps reduce misunderstandings, prevent costly rework, and make communication clearer between users, clients, analysts, testers, and developers.',
      sources: ['COS SRS.pdf', 'COS Business Rules.pdf', 'COS Vision and Scope.pdf']
    };
  }

  if (normalizedText.includes('interview') && normalizedText.includes('swr')) {
    return {
      role: 'assistant',
      content: 'I found several useful references about Interview as a requirements elicitation technique in SWR (Software Requirements). In this context, an interview is a structured or semi-structured conversation used to collect requirements from stakeholders.\n\nKey meaning:\n- It helps analysts understand real user and business needs.\n- It clarifies vague requirements before they are written into the SRS.\n- It reveals constraints, exceptions, workflows, and pain points.\n- It creates a basis for validating requirements with stakeholders.\n\nRecommended materials:\n1. Software Requirements - Elicitation Techniques\n2. Requirements Engineering Interview Guide\n3. Stakeholder Interview Checklist for SRS',
      sources: ['Software_Requirements_3rd_Edition.pdf', 'SWR_Elicitation_Techniques.pdf', 'Stakeholder_Interview_Checklist.docx']
    };
  }

  return {
    role: 'assistant',
    content: `Temporary mock answer\n\nI cannot connect to the real AI chatbot yet because the backend/API integration has not been added.\n\nYour question was: "${text}".\n\nFor now, this mock response can be used to preview the chat experience:\n- The chatbot received your question successfully.\n- A real implementation would send this message to the backend.\n- The backend would call the AI provider and return a generated answer.\n- If document search is enabled, the response would also include matched sources and citations.\n\nOnce the API is connected, this placeholder can be replaced with the real AI answer.`,
    sources: []
  };
}

function createPendingAiMessage(id) {
  return {
    id,
    role: 'assistant',
    content: 'Äang gá»­i cÃ¢u há»i tá»›i AI...',
    sources: [],
    isPending: true
  };
}

function AiChatPage() {
  const { chatId } = useParams();
  const location = useLocation();
  const initialMessage = !chatId ? location.state?.initialMessage : null;
  const initialCourses = !chatId ? location.state?.selectedCourses || [] : [];
  const initialMessageIdRef = useRef(Date.now());
  const initialResponseHandledRef = useRef(false);
  const localThreadIdRef = useRef(`mock-current-chat-${Date.now()}`);
  const localThreadMessagesRef = useRef(null);
  const [messages, setMessages] = useState(() => {
    if (chatId) return chatMockByThread[chatId] || [];
    if (initialMessage) {
      return [{
        id: initialMessageIdRef.current,
        role: 'user',
        content: initialMessage
      }];
    }
    return [];
  });
  const [localThreads, setLocalThreads] = useState(chatThreads);
  const [selectedCourses, setSelectedCourses] = useState(initialCourses);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const hasUserQuestion = messages.some(message => message.role === 'user');

  useEffect(() => {
    if (chatId) {
      setMessages(chatMockByThread[chatId] || localThreadMessagesRef.current || []);
      setSelectedCourses([]);
    } else if (initialMessage) {
      setMessages([{
        id: initialMessageIdRef.current,
        role: 'user',
        content: initialMessage
      }]);
      setSelectedCourses(initialCourses);
    } else {
      setMessages([]);
    }
    setHighlightedMessageId(null);
  }, [chatId, initialMessage]);

  useEffect(() => {
    if (chatId || !initialMessage || initialResponseHandledRef.current) return undefined;

    initialResponseHandledRef.current = true;
    localThreadMessagesRef.current = [{
      id: initialMessageIdRef.current,
      role: 'user',
      content: initialMessage
    }];
    setLocalThreads(prev => {
      if (prev.some(thread => thread.id === localThreadIdRef.current)) return prev;

      return [
        {
          id: localThreadIdRef.current,
          title: initialMessage.length > 28 ? `${initialMessage.slice(0, 28)}...` : initialMessage,
          topic: 'Current mock chat',
          updatedAt: 'Just now'
        },
        ...prev
      ];
    });

    const pendingResponseId = initialMessageIdRef.current + 1;
    const pendingResponse = createPendingAiMessage(pendingResponseId);
    setMessages(prev => {
      const hasInitialResponse = prev.some(message => message.id === pendingResponseId);
      const nextMessages = hasInitialResponse ? prev : [...prev, pendingResponse];
      localThreadMessagesRef.current = nextMessages;
      return nextMessages;
    });

    setTimeout(() => {
      const aiResponse = {
        id: pendingResponseId,
        ...createMockAiResponse(initialMessage)
      };
      setMessages(prev => {
        const nextMessages = prev.map(message => (
          message.id === pendingResponseId ? aiResponse : message
        ));
        localThreadMessagesRef.current = nextMessages;
        return nextMessages;
      });
    }, 700);

    return undefined;
  }, [chatId, initialMessage]);

  const citedSources = messages.reduce((acc, msg) => {
    if (msg.sources && msg.sources.length > 0) {
      msg.sources.forEach(src => {
        if (!acc.find(item => item.source === src)) {
          acc.push({ source: src, messageId: msg.id });
        }
      });
    }
    return acc;
  }, []);
  const swrCourseFiles = citedSources
    .map(item => item.source)
    .filter(source => source.startsWith('COS '));
  const courseFolder = swrCourseFiles.length > 0
    ? { name: 'SWR', files: swrCourseFiles }
    : null;

  const handleSourceClick = (sourceOrItem) => {
    const source = typeof sourceOrItem === 'string' ? sourceOrItem : sourceOrItem.source;
    const messageId = typeof sourceOrItem === 'string' ? null : sourceOrItem.messageId;

    setSelectedSource(source);

    if (!messageId) return;

    setHighlightedMessageId(messageId);
    setTimeout(() => {
      setHighlightedMessageId(null);
    }, 3000);
  };

  const handleSendMessage = (text) => {
    const userMessageId = Date.now();
    const pendingResponseId = userMessageId + 1;
    const newMessage = {
      id: userMessageId,
      role: 'user',
      content: text
    };
    const pendingResponse = createPendingAiMessage(pendingResponseId);
    
    setMessages(prev => {
      const nextMessages = [...prev, newMessage, pendingResponse];
      localThreadMessagesRef.current = nextMessages;
      return nextMessages;
    });
    setLocalThreads(prev => {
      if (chatId || prev.some(thread => thread.id === localThreadIdRef.current)) return prev;

      return [
        {
          id: localThreadIdRef.current,
          title: text.length > 28 ? `${text.slice(0, 28)}...` : text,
          topic: 'Current mock chat',
          updatedAt: 'Just now'
        },
        ...prev
      ];
    });

    setTimeout(() => {
      const aiResponse = {
        id: pendingResponseId,
        ...createMockAiResponse(text)
      };
      setMessages(prev => {
        const nextMessages = prev.map(message => (
          message.id === pendingResponseId ? aiResponse : message
        ));
        localThreadMessagesRef.current = nextMessages;
        return nextMessages;
      });
    }, 1000);
  };

  const handleAddCourse = (course) => {
    setSelectedCourses(prev => (
      prev.some(item => item.code === course.code) ? prev : [...prev, course]
    ));
  };

  const handleRemoveCourse = (courseCode) => {
    setSelectedCourses(prev => prev.filter(course => course.code !== courseCode));
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 78px)', width: '100%', minWidth: 0, overflow: 'hidden', background: '#fafafa' }}>
      <ChatSidebar
        threads={localThreads}
        citedSources={citedSources}
        onSourceClick={handleSourceClick}
        variant={courseFolder ? 'newChat' : 'sources'}
        showCourseFolders={Boolean(courseFolder)}
        courseFolder={courseFolder}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px', overflow: 'hidden' }}>
        <main style={{ flex: 1, overflowY: 'auto', padding: '40px 0' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isHighlighted={msg.id === highlightedMessageId}
                onSourceClick={handleSourceClick}
              />
            ))}
          </div>
        </main>
        <ChatInput
          onSendMessage={handleSendMessage}
          selectedCourses={selectedCourses}
          onAddCourse={handleAddCourse}
          onRemoveCourse={handleRemoveCourse}
        />
      </div>
      <Modal
        isOpen={Boolean(selectedSource)}
        title={selectedSource || 'Source preview'}
        onClose={() => setSelectedSource(null)}
        contentClassName="modal-content-wide"
      >
        {selectedSource && (
          <div style={{ display: 'grid', gap: '14px', color: '#1f2937', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Document Preview
                </div>
                <div style={{ marginTop: '4px', fontSize: '1.05rem', fontWeight: 850, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedSource}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span style={{ borderRadius: '999px', background: '#eef2ff', color: '#4338ca', padding: '6px 10px', fontSize: '0.78rem', fontWeight: 800 }}>
                  {getSourcePreview(selectedSource).type}
                </span>
                <span style={{ borderRadius: '999px', background: '#f1f5f9', color: '#475569', padding: '6px 10px', fontSize: '0.78rem', fontWeight: 700 }}>
                  {getSourcePreview(selectedSource).pages}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr)', gap: '18px', alignItems: 'start' }}>
              <aside style={{ display: 'grid', gap: '10px' }}>
                <div style={{ borderRadius: '10px', background: '#f8fafc', border: '1px solid #e5e7eb', padding: '12px' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '0.85rem' }}>Summary</h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', lineHeight: 1.55 }}>
                    {getSourcePreview(selectedSource).summary}
                  </p>
                </div>
                <div style={{ borderRadius: '10px', background: '#faf7ff', border: '1px solid #e9d5ff', padding: '12px' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '0.85rem' }}>Matched excerpt</h4>
                  <p style={{ margin: 0, color: '#4c1d95', fontSize: '0.8rem', lineHeight: 1.55 }}>
                    {getSourcePreview(selectedSource).excerpt}
                  </p>
                </div>
              </aside>

              <div style={{ maxHeight: '62vh', overflowY: 'auto', background: '#f1f5f9', borderRadius: '12px', padding: '20px' }}>
                <article style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)', padding: '36px 42px', minHeight: '620px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, marginBottom: '18px' }}>
                    Preview page 1
                  </div>
                  <h2 style={{ margin: '0 0 16px', color: '#111827', fontSize: '1.35rem', lineHeight: 1.25 }}>
                    {selectedSource.replace(/\.[^/.]+$/, '')}
                  </h2>
                  {getSourcePreview(selectedSource).sections.map((section) => (
                    <section key={section.heading} style={{ marginTop: '20px' }}>
                      <h3 style={{ margin: '0 0 8px', color: '#1f2937', fontSize: '1rem' }}>
                        {section.heading}
                      </h3>
                      <p style={{ margin: 0, color: '#334155', fontSize: '0.92rem', lineHeight: 1.75 }}>
                        {section.body}
                      </p>
                    </section>
                  ))}
                </article>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AiChatPage;

