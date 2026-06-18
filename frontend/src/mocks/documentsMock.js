export const documentCategories = ['Lecture Notes', 'Research', 'Summaries', 'Flashcards'];

export const documents = [
  {
    id: 'doc-ml-01',
    title: 'Neural Networks Revision Pack',
    course: 'Machine Learning Foundations',
    type: 'PDF',
    category: 'Summaries',
    pages: 24,
    updatedAt: '2 hours ago',
    size: '3.8 MB',
    author: 'Dr. Naomi Reed',
    progress: 82,
    description: 'A compact study guide covering activations, loss functions, and backpropagation.',
  },
  {
    id: 'doc-ui-02',
    title: 'Design Systems Workshop Slides',
    course: 'UI Systems for Product Teams',
    type: 'PPT',
    category: 'Lecture Notes',
    pages: 36,
    updatedAt: 'Yesterday',
    size: '6.1 MB',
    author: 'Amara Lowe',
    progress: 44,
    description: 'Workshop deck focused on tokens, accessibility, and scaling reusable patterns.',
  },
  {
    id: 'doc-bio-03',
    title: 'Cell Biology Annotated Notes',
    course: 'General Biology',
    type: 'DOCX',
    category: 'Research',
    pages: 18,
    updatedAt: '3 days ago',
    size: '1.7 MB',
    author: 'Study Group A',
    progress: 68,
    description: 'Shared notes with highlighted pathways and review comments for exam prep.',
  },
];


// ============================================================
// Exports từ phần Student Home + Library (Khang)
// ============================================================

// ============================================================
// MOCK DATA - Documents
// ============================================================

export function getAvatarColor(name) {
  const colors = [
    "bg-indigo-500",
    "bg-blue-500",
    "bg-indigo-400",
    "bg-orange-400",
    "bg-green-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-red-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash;
  return colors[hash % colors.length];
}

export function formatViews(n) {
  if (n >= 1000) return Math.floor(n / 1000) + "K";
  return n.toString();
}

const PREFIXES = [
  "Lecture",
  "Tutorial",
  "Exam",
  "Midterm",
  "Final",
  "Lab",
  "Assignment",
  "Quiz",
  "Summary",
  "Review",
  "Solution",
  "Worksheet",
  "Notes",
  "Slides",
  "Report",
];
const TOPICS = [
  "Calculus",
  "Algebra",
  "Statistics",
  "Mechanics",
  "Circuits",
  "Database",
  "Networking",
  "Algorithm",
  "OOP",
  "Physics",
  "Chemistry",
  "Economics",
  "Marketing",
  "Accounting",
  "Biology",
];
const UPLOADERS_FULL = [
  "melodious_song",
  "Nanami87",
  "Hina_Chouno",
  "white_cloud1",
  "sweet_dream",
  "bright_fortune",
  "DinhTai2005",
  "Akaza2005",
  "long_lo",
  "minh_tran99",
  "linh_pham",
  "huy_nguyen",
  "jade_river",
  "starlight_k",
  "tungnt2005",
  "quocbao_dev",
  "thanhle123",
  "minhchau_fpt",
  "ryan_study",
  "khanh_vu",
];
const EXTS = ["pdf", "pdf", "pdf", "docx", "pptx"];
const MONTHS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const YEARS = ["24", "25", "26"];

function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function generateCourseFiles(courseId, total = 54) {
  return Array.from({ length: total }, (_, i) => {
    const prefix =
      PREFIXES[Math.floor(seededRand(i * 3 + 1) * PREFIXES.length)];
    const topic = TOPICS[Math.floor(seededRand(i * 3 + 2) * TOPICS.length)];
    const number = 100 + Math.floor(seededRand(i * 7) * 900);
    const ext = EXTS[Math.floor(seededRand(i * 3 + 3) * EXTS.length)];
    const uploader =
      UPLOADERS_FULL[Math.floor(seededRand(i * 5) * UPLOADERS_FULL.length)];
    const views = 50 + Math.floor(seededRand(i * 11) * 9950);
    const discuss = Math.floor(seededRand(i * 13) * 8);
    const day = 1 + Math.floor(seededRand(i * 17) * 27);
    const month = MONTHS[Math.floor(seededRand(i * 19) * MONTHS.length)];
    const year = YEARS[Math.floor(seededRand(i * 23) * YEARS.length)];
    return {
      id: i + 1,
      name: `${prefix}_${topic}_${number}.${ext}`,
      uploader,
      date: `${day}/${month}/${year}`,
      discussion: discuss,
      views,
      courseId,
      isPublic: seededRand(i * 29) > 0.3,
    };
  });
}

// ============================================================
// DYNAMIC DOCUMENT DATA — thay đổi theo từng file
// ============================================================

const DOC_TEMPLATES = [
  {
    subject: "Calculus",
    pages: [
      {
        title: "Calculus I — Course Syllabus 2024",
        paragraphs: [
          "This course covers the fundamentals of single-variable calculus including limits, derivatives, and integrals. We will explore theoretical foundations alongside practical applications in physics, engineering, and economics.",
          "Prerequisites: Students are expected to have completed Pre-Calculus or equivalent. Familiarity with basic algebra and trigonometry is essential for success in this course.",
          "The course is structured over 15 weeks with three lectures per week. Office hours are held every Tuesday and Thursday from 2:00 PM to 4:00 PM in Room B204.",
          "Grading: Homework 20%, Midterm 1 & 2 each 20%, Final Exam 40%. Late homework incurs a 10% penalty per day.",
        ],
        hasVisual: true,
        visualLabel: "Figure 1.1 — Course Overview",
      },
      {
        title: "Chapter 1: Limits and Continuity",
        paragraphs: [
          "The concept of a limit is fundamental to calculus. Informally, a limit describes the value a function approaches as the input approaches some value.",
          "Definition 1.1: lim(x→a) f(x) = L if for every ε > 0, there exists δ > 0 such that whenever 0 < |x − a| < δ, we have |f(x) − L| < ε.",
          "A function f is continuous at point a if lim(x→a) f(x) = f(a). Common discontinuities include removable, jump, and infinite discontinuities.",
          "The Intermediate Value Theorem states: if f is continuous on [a, b] and k is between f(a) and f(b), then there exists c in (a, b) such that f(c) = k.",
        ],
        hasVisual: true,
        visualLabel: "Figure 1.2 — Epsilon-Delta Illustration",
      },
      {
        title: "Chapter 2: Derivatives",
        paragraphs: [
          "The derivative of f at x is defined as: f'(x) = lim(h→0) [f(x+h) − f(x)] / h. Geometrically, it represents the slope of the tangent line.",
          "Differentiation rules: Power rule (xⁿ)' = nxⁿ⁻¹, Product rule (fg)' = f'g + fg', Chain rule (f∘g)'(x) = f'(g(x))·g'(x).",
          "Implicit differentiation allows us to find dy/dx even when y is not explicitly solved in terms of x. This technique is essential for curves like circles and ellipses.",
          "The Mean Value Theorem guarantees that for a differentiable function on [a, b], there exists c such that f'(c) = [f(b) − f(a)] / (b − a).",
        ],
        hasVisual: false,
      },
      {
        title: "Chapter 3: Applications of Derivatives",
        paragraphs: [
          "Critical points occur where f\u2019(x) = 0 or f\u2019(x) is undefined. The First Derivative Test classifies these as local maxima, minima, or neither.",
          "Concavity is determined by the second derivative. If f″(x) > 0, the function is concave up; if f″(x) < 0, it is concave down. Inflection points occur where concavity changes.",
          "L'Hôpital's Rule: for indeterminate forms 0/0 or ∞/∞, lim f(x)/g(x) = lim f'(x)/g'(x) under appropriate conditions.",
          "Optimization problems involve finding global extrema on closed intervals or local extrema using critical point analysis combined with boundary evaluation.",
        ],
        hasVisual: true,
        visualLabel: "Figure 3.1 — Optimization Example",
      },
      {
        title: "Chapter 4: Integration",
        paragraphs: [
          `The indefinite integral ∫f(x)dx = F(x) + C where F'(x) = f(x). The constant C represents the family of antiderivatives.`,
          "Fundamental Theorem of Calculus: ∫[a,b] f(x)dx = F(b) − F(a). This bridges differentiation and integration as inverse operations.",
          "Integration techniques include u-substitution, integration by parts (∫u dv = uv − ∫v du), trigonometric substitution, and partial fractions.",
          "Applications of integration: area between curves, volumes of solids of revolution (disk/washer method), arc length, and surface area.",
        ],
        hasVisual: true,
        visualLabel: "Figure 4.1 — Area Under Curve",
      },
      {
        title: "Practice Problems & Solutions",
        paragraphs: [
          `Problem Set 1: Evaluate the following limits using algebraic manipulation or L'Hôpital's Rule. Show all intermediate steps clearly.`,
          "Problem Set 2: Find the derivative of each function using appropriate rules. Simplify your answers where possible.",
          "Problem Set 3: For each function, find all critical points, intervals of increase/decrease, and local extrema.",
          "Solutions are provided at the end of this document. Attempt each problem independently before consulting the solutions section.",
        ],
        hasVisual: false,
      },
    ],
    aiSummary: {
      takeaways: [
        "Single-variable calculus: limits, derivatives, and integrals",
        "Epsilon-delta definition and continuity theorems",
        "Differentiation rules: power, product, chain rule",
        "Fundamental Theorem of Calculus connects all concepts",
        "Assessment: 20% homework · 40% midterms · 40% final",
      ],
      detail:
        "This document provides a structured overview of Calculus I, progressing from limits and continuity through differentiation and integration. It includes formal definitions, computational techniques, and real-world applications in physics and engineering. Practice problems with solutions are included for exam preparation.",
      warning: null,
    },
    comments: [
      {
        id: 1,
        name: "John Doe",
        initials: "JD",
        time: "10:45 AM",
        text: "Does anyone know if the final covers Chapter 5 as well? The syllabus seems vague on that.",
        avatarBg: "bg-indigo-200",
        avatarText: "text-indigo-700",
        isLogo: false,
      },
      {
        id: 2,
        name: "Alex Nguyen",
        initials: null,
        time: "11:12 AM",
        text: "Yes, everything up to Chapter 5 is included. Check page 4 under 'Final Examination Content'.",
        avatarBg: "bg-indigo-100",
        avatarText: "text-indigo-600",
        isLogo: true,
      },
      {
        id: 3,
        name: "Minh Tran",
        initials: "MT",
        time: "11:35 AM",
        text: "The epsilon-delta definition on page 2 is super clear. Best explanation I've seen so far!",
        avatarBg: "bg-green-200",
        avatarText: "text-green-700",
        isLogo: false,
      },
      {
        id: 4,
        name: "Linh Pham",
        initials: "LP",
        time: "1:02 PM",
        text: "Is the grading the same as last year? I see homework went up to 20%.",
        avatarBg: "bg-orange-200",
        avatarText: "text-orange-700",
        isLogo: false,
      },
      {
        id: 5,
        name: "Alex Nguyen",
        initials: null,
        time: "1:18 PM",
        text: "Yes it changed — homework was 10% last semester. Chapter 6 has the full breakdown.",
        avatarBg: "bg-indigo-100",
        avatarText: "text-indigo-600",
        isLogo: true,
      },
      {
        id: 6,
        name: "Huy Nguyen",
        initials: "HN",
        time: "3:40 PM",
        text: "The integration by parts formula on page 5 finally makes sense to me. Thank you!",
        avatarBg: "bg-blue-200",
        avatarText: "text-blue-700",
        isLogo: false,
      },
    ],
  },
  {
    subject: "Database",
    pages: [
      {
        title: "Database Systems — Lecture Notes Week 1",
        paragraphs: [
          "A database is an organized collection of structured information or data, typically stored electronically in a computer system. A database is usually controlled by a database management system (DBMS).",
          "The relational model, introduced by E.F. Codd in 1970, organizes data into tables (relations) with rows (tuples) and columns (attributes). This model remains dominant in enterprise applications today.",
          "Key concepts: entity, attribute, primary key, foreign key, and referential integrity. Understanding these fundamentals is essential before learning SQL.",
          "This course covers SQL from basics to advanced queries, normalization (1NF through BCNF), transaction management, indexing strategies, and an introduction to NoSQL databases.",
        ],
        hasVisual: true,
        visualLabel: "Figure 1.1 — Entity-Relationship Diagram",
      },
      {
        title: "Chapter 1: Relational Model & SQL Basics",
        paragraphs: [
          "SQL (Structured Query Language) is the standard language for relational databases. The core statements are SELECT, INSERT, UPDATE, DELETE, CREATE, and DROP.",
          "A SELECT statement retrieves data: SELECT column1, column2 FROM table WHERE condition ORDER BY column. The WHERE clause filters rows; ORDER BY sorts the result set.",
          "JOIN operations combine rows from multiple tables. INNER JOIN returns matching rows; LEFT JOIN returns all rows from the left table; FULL OUTER JOIN returns all rows from both tables.",
          "Aggregate functions: COUNT(), SUM(), AVG(), MIN(), MAX(). Used with GROUP BY to compute statistics per group, and HAVING to filter groups after aggregation.",
        ],
        hasVisual: true,
        visualLabel: "Figure 1.2 — SQL JOIN Types",
      },
      {
        title: "Chapter 2: Normalization",
        paragraphs: [
          "Normalization is the process of organizing a database to reduce redundancy and improve data integrity. It involves decomposing tables according to normal form rules.",
          "First Normal Form (1NF): each column contains atomic values; no repeating groups. Second Normal Form (2NF): in 1NF and every non-key attribute is fully dependent on the primary key.",
          "Third Normal Form (3NF): in 2NF and no transitive dependencies exist between non-key attributes. Boyce-Codd Normal Form (BCNF) is a stronger version of 3NF.",
          "Over-normalization can hurt query performance by requiring excessive JOINs. In practice, denormalization is sometimes applied strategically in data warehouses and OLAP systems.",
        ],
        hasVisual: false,
      },
      {
        title: "Chapter 3: Transactions & Concurrency",
        paragraphs: [
          "A transaction is a sequence of operations treated as a single unit of work. Transactions must satisfy the ACID properties: Atomicity, Consistency, Isolation, and Durability.",
          "Atomicity: all operations in a transaction succeed or all are rolled back. Consistency: a transaction brings the database from one valid state to another.",
          "Isolation levels — READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE — control how concurrent transactions interact and what anomalies are prevented.",
          "Deadlocks occur when two transactions each wait for the other to release a lock. Detection strategies include wait-for graphs; prevention strategies include lock ordering and timeouts.",
        ],
        hasVisual: true,
        visualLabel: "Figure 3.1 — ACID Properties Diagram",
      },
      {
        title: "Chapter 4: Indexing & Query Optimization",
        paragraphs: [
          "Indexes speed up data retrieval at the cost of additional storage and slower write operations. A B-tree index is the most common type, supporting equality and range queries efficiently.",
          "The query optimizer generates execution plans and chooses the most efficient one based on table statistics. EXPLAIN or EXPLAIN ANALYZE shows the chosen plan in PostgreSQL/MySQL.",
          "Index selection guidelines: index columns used in WHERE, JOIN, and ORDER BY clauses. Avoid indexing low-cardinality columns. Composite indexes follow the leftmost prefix rule.",
          "Query tuning techniques: avoid SELECT *, use indexed columns in predicates, minimize subqueries in favor of JOINs, and consider materialized views for expensive recurring queries.",
        ],
        hasVisual: false,
      },
      {
        title: "Lab Exercises & Assignment Guidelines",
        paragraphs: [
          "Lab 1: Design an ER diagram for a university registration system, including Students, Courses, Instructors, and Enrollments with appropriate cardinalities.",
          "Lab 2: Implement the schema in PostgreSQL. Write SQL queries for at least 10 scenarios including multi-table JOINs, subqueries, and aggregate functions.",
          "Assignment: Normalize a provided denormalized dataset to 3NF. Document each step, identify functional dependencies, and justify decomposition decisions.",
          "Final Project: Build a small web application backed by a relational database. Groups of 2–3 students. Deliverables include ER diagram, schema, 20 sample queries, and a 10-minute demo.",
        ],
        hasVisual: true,
        visualLabel: "Table — Lab Grading Rubric",
      },
    ],
    aiSummary: {
      takeaways: [
        "Relational model: tables, keys, and referential integrity",
        "SQL fundamentals: SELECT, JOIN, aggregation, subqueries",
        "Normalization from 1NF to BCNF reduces redundancy",
        "ACID transactions ensure data reliability",
        "Indexing and query optimization for performance",
      ],
      detail:
        "These lecture notes cover core database system concepts from the relational model through advanced query optimization. The material progresses logically from data modeling and SQL basics to normalization, transaction management, and performance tuning. Lab exercises and a group project reinforce theoretical concepts with hands-on implementation.",
      warning: null,
    },
    comments: [
      {
        id: 1,
        name: "Tuan Anh",
        initials: "TA",
        time: "9:15 AM",
        text: "The JOIN diagram on page 2 is exactly what I needed. Finally understand LEFT vs FULL OUTER.",
        avatarBg: "bg-teal-200",
        avatarText: "text-teal-700",
        isLogo: false,
      },
      {
        id: 2,
        name: "Alex Nguyen",
        initials: null,
        time: "9:40 AM",
        text: "Glad it helps! Make sure you practice with the lab exercises — JOINs click much faster when you write them yourself.",
        avatarBg: "bg-indigo-100",
        avatarText: "text-indigo-600",
        isLogo: true,
      },
      {
        id: 3,
        name: "Quynh Le",
        initials: "QL",
        time: "10:05 AM",
        text: "Can someone clarify the difference between 2NF and 3NF with an example? The definitions feel similar.",
        avatarBg: "bg-pink-200",
        avatarText: "text-pink-700",
        isLogo: false,
      },
      {
        id: 4,
        name: "Duc Minh",
        initials: "DM",
        time: "10:30 AM",
        text: "2NF removes partial dependencies; 3NF removes transitive ones. Example: if City depends on ZipCode and ZipCode depends on StudentID, that's a transitive dep — violates 3NF.",
        avatarBg: "bg-blue-200",
        avatarText: "text-blue-700",
        isLogo: false,
      },
      {
        id: 5,
        name: "Alex Nguyen",
        initials: null,
        time: "11:00 AM",
        text: "Perfect explanation Duc! I'll add a visual example to next week's notes.",
        avatarBg: "bg-indigo-100",
        avatarText: "text-indigo-600",
        isLogo: true,
      },
    ],
  },
  {
    subject: "Networking",
    pages: [
      {
        title: "Computer Networks — Midterm Review",
        paragraphs: [
          "This review covers topics from Weeks 1–7: OSI model, TCP/IP stack, subnetting, routing protocols, and transport layer services. The midterm is 90 minutes, closed book.",
          "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. Each layer provides services to the layer above and uses services from the layer below.",
          "TCP/IP collapses OSI into 4 layers: Network Access, Internet, Transport, Application. IP provides unreliable, connectionless delivery; TCP adds reliability, ordering, and flow control on top.",
          "Key protocols to know: HTTP/HTTPS (80/443), DNS (53), DHCP (67/68), FTP (21), SSH (22), SMTP (25), POP3 (110), IMAP (143). Understand what each does and which layer it operates at.",
        ],
        hasVisual: true,
        visualLabel: "Figure 1 — OSI vs TCP/IP Comparison",
      },
      {
        title: "IP Addressing & Subnetting",
        paragraphs: [
          "IPv4 addresses are 32-bit numbers written in dotted-decimal notation (e.g., 192.168.1.1). The address space is divided into network and host portions by a subnet mask.",
          "CIDR notation (e.g., 192.168.1.0/24) indicates the number of network bits. A /24 subnet has 256 addresses (254 usable hosts) with subnet mask 255.255.255.0.",
          "Private address ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. These are not routed on the public internet and require NAT to communicate externally.",
          "IPv6 uses 128-bit addresses in hexadecimal (e.g., 2001:0db8:85a3::8a2e:0370:7334). It eliminates NAT, simplifies headers, and provides built-in support for IPsec.",
        ],
        hasVisual: true,
        visualLabel: "Figure 2 — Subnetting Worksheet",
      },
      {
        title: "Routing Protocols",
        paragraphs: [
          "Static routing requires manual configuration; dynamic routing protocols automatically discover paths. Common protocols: RIP (distance-vector), OSPF (link-state), BGP (path-vector).",
          `RIP uses hop count as metric (max 15 hops). Simple but slow to converge. OSPF uses Dijkstra's algorithm with cost metric based on bandwidth, converges faster.`,
          "BGP is the routing protocol of the internet, connecting autonomous systems. It uses path attributes and complex policies rather than simple metrics for route selection.",
          "Routing table entries: destination network, subnet mask, next-hop address, exit interface, metric, and administrative distance. Lower administrative distance = more trusted source.",
        ],
        hasVisual: false,
      },
      {
        title: "Transport Layer: TCP vs UDP",
        paragraphs: [
          "TCP (Transmission Control Protocol) provides reliable, ordered, error-checked delivery via a three-way handshake (SYN, SYN-ACK, ACK). Used for HTTP, email, file transfer.",
          "UDP (User Datagram Protocol) is connectionless and unreliable but faster with lower overhead. Used for DNS, streaming media, online gaming, and VoIP where some packet loss is acceptable.",
          "TCP flow control uses a sliding window mechanism. Congestion control algorithms (slow start, congestion avoidance, fast retransmit/recovery) prevent network overload.",
          "Port numbers identify processes: 0–1023 well-known ports, 1024–49151 registered, 49152–65535 dynamic/ephemeral. Source and destination ports together with IP addresses form a socket.",
        ],
        hasVisual: true,
        visualLabel: "Figure 4 — TCP Three-Way Handshake",
      },
      {
        title: "Application Layer & Security Basics",
        paragraphs: [
          "DNS resolves domain names to IP addresses using a hierarchical distributed database. Resolution: recursive query to local resolver → root servers → TLD servers → authoritative servers.",
          "HTTP is stateless and text-based. HTTPS adds TLS encryption. HTTP/2 multiplexes multiple requests over a single connection; HTTP/3 uses QUIC (UDP-based) for lower latency.",
          "Common attacks: ARP spoofing, DNS poisoning, man-in-the-middle, SYN flood (DoS), SQL injection, XSS. Defenses include encryption, firewalls, IDS/IPS, and input validation.",
          "TLS handshake: client hello → server hello + certificate → key exchange → session key derived → encrypted communication begins. Certificates verified via chain of trust to a root CA.",
        ],
        hasVisual: false,
      },
      {
        title: "Sample Exam Questions",
        paragraphs: [
          "Q1: A host has IP address 172.16.45.200/20. What is the network address, broadcast address, and valid host range for this subnet?",
          "Q2: Explain the difference between a hub, switch, and router. At which OSI layer does each operate? What are the performance implications of each?",
          "Q3: Trace the steps involved when a browser requests https://example.com. Include DNS resolution, TCP handshake, TLS negotiation, and HTTP exchange.",
          "Q4: Compare RIP and OSPF. Under what circumstances would you choose each? What are the limitations of RIP that OSPF was designed to address?",
        ],
        hasVisual: false,
      },
    ],
    aiSummary: {
      takeaways: [
        "OSI 7-layer vs TCP/IP 4-layer model mapping",
        "IPv4/IPv6 addressing, CIDR subnetting, private ranges",
        "Dynamic routing: RIP (distance-vector) vs OSPF (link-state)",
        "TCP reliable delivery vs UDP low-latency trade-offs",
        "Application protocols: DNS, HTTP/S, TLS handshake",
      ],
      detail:
        "This midterm review document consolidates Weeks 1–7 of Computer Networks, covering the protocol stack from physical transmission to application-layer services. Special emphasis on subnetting calculations, routing protocol comparison, TCP/UDP trade-offs, and security fundamentals. Includes six sample exam questions with hints.",
      warning:
        "This is a student-compiled review sheet. Always verify content against official lecture slides.",
    },
    comments: [
      {
        id: 1,
        name: "Bao Nguyen",
        initials: "BN",
        time: "8:00 AM",
        text: "The TCP handshake diagram on page 4 saved me. I always mixed up SYN and SYN-ACK.",
        avatarBg: "bg-teal-200",
        avatarText: "text-teal-700",
        isLogo: false,
      },
      {
        id: 2,
        name: "Thu Ha",
        initials: "TH",
        time: "8:25 AM",
        text: "Q3 in the sample questions is the hardest one for me — tracing the full HTTPS request step by step.",
        avatarBg: "bg-rose-200",
        avatarText: "text-rose-700",
        isLogo: false,
      },
      {
        id: 3,
        name: "Alex Nguyen",
        initials: null,
        time: "8:50 AM",
        text: "For Q3 start with DNS, then TCP SYN/SYN-ACK/ACK, then TLS Client Hello. Break it into phases and it's manageable.",
        avatarBg: "bg-indigo-100",
        avatarText: "text-indigo-600",
        isLogo: true,
      },
      {
        id: 4,
        name: "Nam Tran",
        initials: "NT",
        time: "9:10 AM",
        text: "Is subnetting definitely on the midterm? The /20 example in Q1 is tricky.",
        avatarBg: "bg-amber-200",
        avatarText: "text-amber-700",
        isLogo: false,
      },
      {
        id: 5,
        name: "Alex Nguyen",
        initials: null,
        time: "9:30 AM",
        text: "100% on the midterm. Practice converting /20 to dotted decimal and finding the block size — that's the key step.",
        avatarBg: "bg-indigo-100",
        avatarText: "text-indigo-600",
        isLogo: true,
      },
      {
        id: 6,
        name: "Bao Nguyen",
        initials: "BN",
        time: "10:00 AM",
        text: "Block size for /20 is 16, so networks go 172.16.0.0, 172.16.16.0, etc. Got it now!",
        avatarBg: "bg-teal-200",
        avatarText: "text-teal-700",
        isLogo: false,
      },
    ],
  },
];

// Chọn template dựa theo tên file — deterministic
function pickTemplate(fileName) {
  if (!fileName) return DOC_TEMPLATES[0];
  const name = fileName.toLowerCase();
  if (
    name.includes("database") ||
    name.includes("db") ||
    name.includes("sql") ||
    name.includes("dbi")
  )
    return DOC_TEMPLATES[1];
  if (
    name.includes("network") ||
    name.includes("nwc") ||
    name.includes("tcp") ||
    name.includes("ip")
  )
    return DOC_TEMPLATES[2];
  // Hash tên file để chọn template ổn định
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return DOC_TEMPLATES[hash % DOC_TEMPLATES.length];
}

export function getDocumentData(file) {
  const template = pickTemplate(file?.name);
  return {
    pages: template.pages,
    aiSummary: template.aiSummary,
    comments: template.comments,
  };
}

// Giữ lại export cũ để không break code hiện tại
export const mockDocumentPages = DOC_TEMPLATES[0].pages;
export const mockAiSummary = DOC_TEMPLATES[0].aiSummary;
export const mockComments = DOC_TEMPLATES[0].comments;

// Library - danh sách tài liệu public
export const libraryDocuments = Array.from({ length: 30 }, (_, i) => {
  const courses = [
    "MAE101",
    "CSI105",
    "MAD101",
    "PRJ301",
    "SWP391",
    "DBI202",
    "LAB211",
    "PRN212",
    "SWT301",
  ];
  const semesters = [
    "Semester 1",
    "Semester 1",
    "Semester 2",
    "Semester 4",
    "Semester 5",
    "Semester 3",
    "Semester 3",
    "Semester 2",
    "Semester 5",
  ];
  const idx = i % courses.length;
  const prefix = PREFIXES[Math.floor(seededRand(i * 3 + 1) * PREFIXES.length)];
  const topic = TOPICS[Math.floor(seededRand(i * 3 + 2) * TOPICS.length)];
  const number = 100 + Math.floor(seededRand(i * 7) * 900);
  const uploader =
    UPLOADERS_FULL[Math.floor(seededRand(i * 5) * UPLOADERS_FULL.length)];
  const views = 50 + Math.floor(seededRand(i * 11) * 9950);
  const discuss = Math.floor(seededRand(i * 13) * 8);
  const day = 1 + Math.floor(seededRand(i * 17) * 27);
  const month = MONTHS[Math.floor(seededRand(i * 19) * MONTHS.length)];
  const year = YEARS[Math.floor(seededRand(i * 23) * YEARS.length)];
  return {
    id: i + 1,
    name: `${prefix}_${topic}_${number}.pdf`,
    uploader,
    date: `${day}/${month}/${year}`,
    discussion: discuss,
    views,
    courseId: courses[idx],
    semester: semesters[idx],
    isPublic: true,
  };
});

// ============================================================
// MOCK DATA - My Library (tài liệu do user upload)
// ============================================================

const MY_PREFIXES = [
  "Calculus_Notes",
  "Syllabus",
  "Midterm_Review",
  "Lab_Report",
  "Assignment",
  "Lecture_Slides",
  "Summary",
  "Practice_Test",
  "Final_Exam_Guide",
  "Project_Proposal",
  "Database_Schema",
  "Network_Diagram",
  "Worksheet",
  "Notes",
  "Algorithm_Analysis",
  "Formula_Sheet",
  "Case_Study",
  "Trial_Balance",
  "Requirement_Spec",
  "Design_Doc",
  "Unit_Test_Plan",
  "ERD_Draft",
  "API_Docs",
  "Cheat_Sheet",
  "Study_Guide",
  "Tutorial",
  "Exercise_Set",
  "Mock_Exam",
  "Class_Notes",
  "Reference_Sheet",
];
const MY_SUFFIXES = [
  "Week1",
  "Week2",
  "Week3",
  "Week4",
  "Week5",
  "Week6",
  "Ch1",
  "Ch2",
  "Ch3",
  "SP24",
  "SU25",
  "FA25",
  "v1",
  "v2",
  "v3",
  "Part1",
  "Part2",
  "Final",
];
const MY_COURSES = [
  "MAE101",
  "CSI104",
  "CSI105",
  "DBI202",
  "PRJ301",
  "SWP391",
  "MAD101",
  "NWC303",
  "ECO111",
  "MKT201",
  "PRF192",
  "SWE202c",
  "CSI106",
  "ECN101",
  "LAB211",
];
const MY_SEMESTERS = [
  "Semester 1",
  "Semester 1",
  "Semester 1",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 2",
  "Semester 5",
  "Semester 1",
  "Semester 3",
  "Semester 1",
  "Semester 5",
  "Semester 1",
  "Semester 1",
  "Semester 3",
];
const MY_EXTS = ["pdf", "pdf", "pdf", "docx", "pptx"];
const MY_SIZES = [
  "512 KB",
  "840 KB",
  "920 KB",
  "1.1 MB",
  "1.2 MB",
  "1.5 MB",
  "1.8 MB",
  "2.1 MB",
  "2.4 MB",
  "3.4 MB",
  "4.2 MB",
];
const MY_UPLOADERS = [
  "Alex_Nguyen",
  "melodious_song",
  "Nanami87",
  "minh_tran99",
  "linh_pham",
  "huy_nguyen",
  "sweet_dream",
  "quocbao_dev",
  "khanh_vu",
  "ryan_study",
];

export const myLibraryDocs = Array.from({ length: 54 }, (_, i) => {
  const prefix =
    MY_PREFIXES[Math.floor(seededRand(i * 3 + 1) * MY_PREFIXES.length)];
  const suffix =
    MY_SUFFIXES[Math.floor(seededRand(i * 3 + 2) * MY_SUFFIXES.length)];
  const ext = MY_EXTS[Math.floor(seededRand(i * 3 + 3) * MY_EXTS.length)];
  const courseIdx = Math.floor(seededRand(i * 7) * MY_COURSES.length);
  const course = MY_COURSES[courseIdx];
  const semester = MY_SEMESTERS[courseIdx];
  const uploader =
    MY_UPLOADERS[Math.floor(seededRand(i * 11) * MY_UPLOADERS.length)];
  const day = 1 + Math.floor(seededRand(i * 31) * 27);
  const month = MONTHS[Math.floor(seededRand(i * 37) * MONTHS.length)];
  const year = YEARS[Math.floor(seededRand(i * 41) * YEARS.length)];
  const views = 10 + Math.floor(seededRand(i * 43) * 990);
  const discuss = Math.floor(seededRand(i * 47) * 8);
  const size = MY_SIZES[Math.floor(seededRand(i * 53) * MY_SIZES.length)];
  return {
    id: i + 1,
    name: `${prefix}_${suffix}.${ext}`,
    ext,
    course,
    semester,
    uploader,
    date: `${day}/${month}/${year}`,
    views,
    discussion: discuss,
    size,
    isPublic: seededRand(i * 59) > 0.35,
  };
});
