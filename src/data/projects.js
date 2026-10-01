// Public project copy from docs/Goutam_Portfolio_Project_Content.md.
// Update content and gallery paths here; editorial source notes stay in the document.
export const projects = [
  {
    "id": "hyusk",
    "index": "01",
    "name": "Hyusk",
    "subtitle": "Voice-first desktop agent for Linux",
    "category": "AI agents",
    "group": "personal",
    "status": "Experimental",
    "summary": "A Rust-based desktop agent that turns voice and text requests into actions across Linux applications, terminal tools, and reusable workflows, with persistent memory and an Android companion.",
    "purpose": "Hyusk brings a conversational interface to everyday computer tasks. It combines wake-word detection, speech recognition, spoken responses, and structured tool calling with native desktop integrations. Users can launch applications, navigate websites, control media, run commands, or ask the agent to work through a longer task.",
    "problem": "Desktop automation needs more than an LLM response. It must work with application state, audio input, long-running processes, and the permission model of GNOME on Wayland. Hyusk combines accessibility-based interactions with desktop-portal input and screenshot inspection, depending on what the application exposes.",
    "problemHeading": "Engineering challenge",
    "approach": "I built an event-driven Rust runtime that connects these capabilities while keeping requests interruptible. Common commands and named workflows use a local command router; requests outside that vocabulary go through a model-driven tool loop. This gives routine actions a direct execution path while retaining flexibility for more complex work.",
    "decisions": [
      "Built the Rust agent runtime, structured tool registry, and asynchronous request handling.",
      "Connected wake-word detection, Whisper speech recognition, and local speech output.",
      "Added shell, process, media, computer, and accessibility tools."
    ],
    "contributions": [
      "Built the Rust agent runtime, structured tool registry, and asynchronous request handling.",
      "Connected wake-word detection, Whisper speech recognition, and local speech output.",
      "Added shell, process, media, computer, and accessibility tools.",
      "Implemented cancellable turns, bounded conversation history, and restart-safe session persistence.",
      "Added SQLite-backed memory, local workflows, reminders, and managed background tasks.",
      "Built GNOME integration, a GTK workflow editor, and an opt-in Android companion connection."
    ],
    "stack": [
      "Rust",
      "Tokio",
      "OpenAI-compatible model APIs",
      "Whisper",
      "CPAL",
      "ONNX wake-word models",
      "Piper",
      "SQLite",
      "egui/eframe",
      "GTK4/libadwaita",
      "AT-SPI2",
      "XDG desktop portals",
      "Kotlin/Android",
      "WebSockets"
    ],
    "notes": "Integrating AI reasoning with native operating-system capabilities, asynchronous execution, and a usable desktop interface.",
    "links": [
      {
        "label": "GitHub repository",
        "url": "https://github.com/Goutam-11/hyusk"
      }
    ],
    "image": "/images/projects/hyusk-concept.svg",
    "imageKind": "concept",
    "caption": "Concept illustration — screenshot to be added",
    "gallery": [],
    "features": [
      "Voice and text input with interruptible agent responses.",
      "Application launching, window switching, browser navigation, and media control.",
      "Accessibility inspection and permission-based desktop control.",
      "Named workflows that run locally without a model call.",
      "Persistent memory and scheduled one-time reminders or workflows.",
      "Android companion pairing through an authenticated TLS WebSocket link."
    ]
  },
  {
    "id": "blind",
    "index": "02",
    "name": "Blind",
    "subtitle": "Approval-based credential access for local automation",
    "category": "Developer tools",
    "group": "personal",
    "status": "Design stage",
    "summary": "A Rust-first secret-broker design for Fedora and GNOME, built around encrypted storage and explicit approval before selected credentials are supplied to a requested process.",
    "purpose": "Blind explores a practical problem in agent-assisted development: a tool may need a credential to complete a task, but giving the agent unrestricted plaintext access creates unnecessary exposure. The proposed workflow lets automation request execution using named secrets, then routes that request through policy evaluation and human approval.",
    "problem": "Blind explores a practical problem in agent-assisted development: a tool may need a credential to complete a task, but giving the agent unrestricted plaintext access creates unnecessary exposure. The proposed workflow lets automation request execution using named secrets, then routes that request through policy evaluation and human approval.",
    "problemHeading": "Purpose and context",
    "approach": "I developed the project specification around a broker daemon, a metadata-focused CLI, an encrypted vault, and desktop approval controls. Approval is designed to bind to the requested executable, arguments, working directory, and secret set. The process receives the approved credentials; the agent-facing interface is intended to expose metadata and execution status.",
    "decisions": [
      "Defined the product workflow and boundaries between the client, broker, vault, and approval UI.",
      "Specified encrypted storage and credential injection into an approved child process.",
      "Planned request-bound approvals, denial and timeout handling, and audit records."
    ],
    "contributions": [
      "Defined the product workflow and boundaries between the client, broker, vault, and approval UI.",
      "Specified encrypted storage and credential injection into an approved child process.",
      "Planned request-bound approvals, denial and timeout handling, and audit records.",
      "Defined a staged implementation path for a Rust CLI, GTK application, and thin GNOME extension."
    ],
    "stack": [
      "Rust",
      "SQLite with encrypted secret values",
      "XChaCha20-Poly1305",
      "Linux Secret Service",
      "Unix sockets",
      "D-Bus",
      "GTK4/libadwaita",
      "GNOME Shell extension"
    ],
    "notes": "Security-focused product design and explicit trust boundaries for agent tooling.",
    "links": [],
    "image": "/images/projects/screenshot-placeholder.svg",
    "imageKind": "placeholder",
    "caption": "Project screenshot to be added",
    "gallery": [],
    "stackLabel": "Proposed technologies"
  },
  {
    "id": "dg-converter",
    "index": "03",
    "name": "DG Converter",
    "subtitle": "Document-to-spreadsheet workflow for accounting data",
    "category": "Desktop applications",
    "group": "personal",
    "status": "In development",
    "summary": "A local-first desktop application for extracting tables from digital and scanned PDFs, reviewing transaction data, mapping accounting fields, and exporting Excel files with Tally context.",
    "purpose": "DG Converter is being built to make accounting document processing easier to review and reuse. Instead of stopping at text extraction, the application presents tabular output, supports transaction-field mapping, and prepares spreadsheet exports for downstream work.",
    "problem": "Digital PDFs and scanned documents need different extraction approaches. The product combines document parsing with a review interface so users can inspect the extracted structure and resolve field mappings before export.",
    "problemHeading": "Engineering challenge",
    "approach": "I connected Python document parsers to a React and Tauri desktop interface. The workflow also integrates company, ledger, and voucher-type data from a locally running Tally server, giving users accounting context while preparing their data.",
    "decisions": [
      "Connected Python extraction logic to the desktop frontend.",
      "Built the tabular preview and transaction-mapping workflow.",
      "Integrated local Tally company, ledger, and voucher-type data."
    ],
    "contributions": [
      "Connected Python extraction logic to the desktop frontend.",
      "Built the tabular preview and transaction-mapping workflow.",
      "Integrated local Tally company, ledger, and voucher-type data.",
      "Developed Excel export as part of the document-processing pipeline."
    ],
    "stack": [
      "Python",
      "React",
      "TypeScript",
      "Tauri",
      "PDFPlumber",
      "Docling",
      "Excel export",
      "local Tally integration"
    ],
    "notes": "Combining document processing, desktop interfaces, and an existing business system in one workflow.",
    "links": [],
    "image": "/images/projects/dg-converter-concept.svg",
    "imageKind": "concept",
    "caption": "Concept illustration — screenshot to be added",
    "gallery": []
  },
  {
    "id": "insage",
    "index": "04",
    "name": "Insage",
    "subtitle": "A knowledge inbox for content shared through Instagram",
    "category": "Knowledge tools",
    "group": "personal",
    "status": "In development",
    "summary": "A knowledge-inbox project that uses a dedicated Instagram account as a capture channel, with webhook handling and a web dashboard foundation for organizing shared content.",
    "purpose": "Insage is being developed around a familiar habit: sharing useful posts, Reels, links, and messages through Instagram DMs. Its goal is to turn that capture flow into a personal knowledge library where saved content can become structured records and, as the processing pipeline develops, useful notes.",
    "problem": "Insage is being developed around a familiar habit: sharing useful posts, Reels, links, and messages through Instagram DMs. Its goal is to turn that capture flow into a personal knowledge library where saved content can become structured records and, as the processing pipeline develops, useful notes.",
    "problemHeading": "Purpose and context",
    "approach": "Users send content to a dedicated professional Instagram inbox. My work has focused on the integration foundation: webhook handling, connection testing, a DM-processing flow, and authenticated browser push-subscription APIs. The broader AI processing and content-enrichment workflow remains part of the product's development direction.",
    "decisions": [
      "Developed Instagram webhook handling and integration-testing flows.",
      "Worked on connecting incoming message and content references to backend processing.",
      "Implemented authenticated push-subscription storage and management APIs."
    ],
    "contributions": [
      "Developed Instagram webhook handling and integration-testing flows.",
      "Worked on connecting incoming message and content references to backend processing.",
      "Implemented authenticated push-subscription storage and management APIs.",
      "Investigated real-message delivery and browser push-subscription failures."
    ],
    "stack": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Instagram messaging/webhooks",
      "Cloudflare Workers",
      "Drizzle",
      "Web Push/VAPID"
    ],
    "notes": "Building and debugging external integrations, event ingestion, and account-scoped backend workflows.",
    "links": [],
    "image": "/images/projects/insage.webp",
    "imageKind": "screenshot",
    "caption": "Content library and discovery interface",
    "gallery": [
      {
        "image": "/images/projects/insage.webp",
        "caption": "Content library and discovery interface",
        "alt": "Content library and discovery interface"
      }
    ]
  },
  {
    "id": "sobro",
    "index": "05",
    "name": "Sobro",
    "subtitle": "AI-assisted travel research for nomadic travelers",
    "category": "AI agents",
    "group": "personal",
    "status": "",
    "summary": "A travel-planning agent that combines flight discovery, accommodation discovery, and web research through a custom LangGraph workflow, with user credit and account management.",
    "purpose": "Sobro brings several parts of travel research into one agent-driven application. It combines flight-price discovery from Google Flights, accommodation discovery from Airbnb, and wider web research through DuckDuckGo to help users investigate travel options.",
    "problem": "Sobro brings several parts of travel research into one agent-driven application. It combines flight-price discovery from Google Flights, accommodation discovery from Airbnb, and wider web research through DuckDuckGo to help users investigate travel options.",
    "problemHeading": "Purpose and context",
    "approach": "I built a custom LangGraph agent with tool use, connected it to FastAPI backend services and a React frontend, and implemented Supabase-backed account and credit management. The project brings research orchestration and product infrastructure together in a single application.",
    "decisions": [
      "Built the custom LangGraph agent and research-tool workflow.",
      "Connected flight, accommodation, and web-discovery tools.",
      "Developed backend services and the React interface."
    ],
    "contributions": [
      "Built the custom LangGraph agent and research-tool workflow.",
      "Connected flight, accommodation, and web-discovery tools.",
      "Developed backend services and the React interface.",
      "Implemented Supabase-backed user accounts and credit management."
    ],
    "stack": [
      "React",
      "Python",
      "FastAPI",
      "LangGraph",
      "Supabase",
      "Google Flights discovery",
      "Airbnb discovery",
      "DuckDuckGo research"
    ],
    "notes": "Tool-using agent orchestration integrated with a complete web application.",
    "links": [
      {
        "label": "sobro.xyz",
        "url": "https://sobro.xyz"
      }
    ],
    "image": "/images/projects/sobro.webp",
    "imageKind": "screenshot",
    "caption": "Travel research interface",
    "gallery": [
      {
        "image": "/images/projects/sobro.webp",
        "caption": "Travel research interface",
        "alt": "Travel research interface"
      },
      {
        "image": "/images/projects/sobro2.webp",
        "caption": "Sobro branded loading screen",
        "alt": "Sobro branded loading screen"
      }
    ]
  },
  {
    "id": "shinrai",
    "index": "06",
    "name": "Shinrai-Node",
    "subtitle": "Visual workflow orchestration with AI integrations",
    "category": "Automation platforms",
    "group": "personal",
    "status": "",
    "summary": "A visual workflow platform connecting automation nodes, HTTP services, forms, AI-agent integrations, and payment workflows through typed APIs and background execution.",
    "purpose": "Shinrai-Node lets automation be represented as connected workflow nodes. It brings together service requests, forms, AI integrations, and other workflow steps while storing their configuration and executing work in the background.",
    "problem": "Shinrai-Node lets automation be represented as connected workflow nodes. It brings together service requests, forms, AI integrations, and other workflow steps while storing their configuration and executing work in the background.",
    "problemHeading": "Purpose and context",
    "approach": "I developed visual automation nodes, typed APIs, persistent workflows, and background execution. The project focuses on connecting a usable workflow interface with the backend infrastructure needed to run and manage those automations.",
    "decisions": [
      "Developed visual workflow nodes and their configuration interfaces.",
      "Built typed API communication with tRPC.",
      "Implemented workflow persistence using Prisma and PostgreSQL."
    ],
    "contributions": [
      "Developed visual workflow nodes and their configuration interfaces.",
      "Built typed API communication with tRPC.",
      "Implemented workflow persistence using Prisma and PostgreSQL.",
      "Connected Inngest background execution with service and AI integrations.",
      "Developed HTTP, form, and payment workflow capabilities."
    ],
    "stack": [
      "Next.js",
      "TypeScript",
      "tRPC",
      "Prisma",
      "PostgreSQL",
      "Inngest",
      "AI-agent integrations"
    ],
    "notes": "Visual automation backed by persistent data, typed interfaces, and asynchronous execution.",
    "links": [],
    "image": "/images/projects/shinrai-concept.svg",
    "imageKind": "concept",
    "caption": "Concept illustration — screenshot to be added",
    "gallery": []
  },
  {
    "id": "meu",
    "index": "07",
    "name": "MEU",
    "subtitle": "Trading-agent management and execution infrastructure",
    "category": "AI agents",
    "group": "personal",
    "status": "Experimental",
    "summary": "A trading-automation system combining a Next.js management dashboard with a MongoDB-aware scheduler, BullMQ workers, market-analysis tools, and exchange integrations.",
    "purpose": "MEU connects the configuration and monitoring of trading agents with the services that schedule and execute their work. The dashboard lets users manage agents, exchange connections, model credentials, and trading records. A separate scheduler watches MongoDB for state changes and queues agent runs for background workers.",
    "problem": "An agent dashboard needs to stay aligned with background execution. MEU uses MongoDB change streams, an in-memory agent cache, scheduled queue submissions, and worker results to connect user configuration with execution state.",
    "problemHeading": "Engineering challenge",
    "approach": "I built across the dashboard and execution service, including agent lifecycle management, typed APIs, market-analysis inputs, exchange tools, run logging, and failure notifications. The worker implementation gathers indicator data across multiple timeframes and passes it to a model-driven tool loop for exchange operations.",
    "decisions": [
      "Built the Next.js dashboard for agents, credentials, exchanges, and notifications.",
      "Implemented MongoDB change-stream watchers and scheduling logic.",
      "Connected Redis/BullMQ queues with asynchronous agent workers."
    ],
    "contributions": [
      "Built the Next.js dashboard for agents, credentials, exchanges, and notifications.",
      "Implemented MongoDB change-stream watchers and scheduling logic.",
      "Connected Redis/BullMQ queues with asynchronous agent workers.",
      "Integrated exchange access and technical-indicator inputs.",
      "Added run records and worker-failure notifications."
    ],
    "stack": [
      "Next.js",
      "React",
      "TypeScript",
      "Bun",
      "tRPC",
      "TanStack Query",
      "Prisma",
      "MongoDB",
      "Redis",
      "BullMQ",
      "AI SDK",
      "CCXT",
      "Kite Connect",
      "better-auth",
      "Tailwind CSS"
    ],
    "notes": "Connecting AI agents with event-driven scheduling, queue-based execution, and operational interfaces.",
    "links": [
      {
        "label": "Scheduler and agent service",
        "url": "https://github.com/Goutam-11/meu"
      },
      {
        "label": "Management dashboard",
        "url": "https://github.com/Goutam-11/meu_frontend"
      }
    ],
    "image": "/images/projects/meu2.webp",
    "imageKind": "screenshot",
    "caption": "Trading-agent dashboard",
    "gallery": [
      {
        "image": "/images/projects/meu2.webp",
        "caption": "Trading-agent dashboard",
        "alt": "Trading-agent dashboard"
      },
      {
        "image": "/images/projects/mey.webp",
        "caption": "Agent-management interface",
        "alt": "Agent-management interface"
      }
    ],
    "features": [
      "Agent creation, configuration, and lifecycle controls.",
      "Exchange and model-credential management.",
      "Configurable strategy and risk settings in the management interface.",
      "Scheduled model-driven runs with market-analysis and exchange tools.",
      "Run history and operational error reporting."
    ]
  },
  {
    "id": "pti-job-world",
    "index": "08",
    "name": "PTI Job World",
    "subtitle": "Company Website",
    "category": "Client websites",
    "group": "client",
    "status": "",
    "summary": "A responsive recruitment-company website with SEO-focused public pages and a clear presentation of the business and its services.",
    "purpose": "During my internship at PTI Job World, I developed and maintained the company's public website. My work covered responsive React/Next.js interfaces and SEO-focused pages, helping the business present its services through a consistent web presence. I also supported ongoing maintenance and fixes as requirements evolved.",
    "problem": "During my internship at PTI Job World, I developed and maintained the company's public website. My work covered responsive React/Next.js interfaces and SEO-focused pages, helping the business present its services through a consistent web presence. I also supported ongoing maintenance and fixes as requirements evolved.",
    "problemHeading": "Purpose and context",
    "approach": "During my internship at PTI Job World, I developed and maintained the company's public website. My work covered responsive React/Next.js interfaces and SEO-focused pages, helping the business present its services through a consistent web presence. I also supported ongoing maintenance and fixes as requirements evolved.",
    "decisions": [],
    "contributions": [],
    "stack": [
      "React",
      "Next.js",
      "responsive frontend development",
      "SEO implementation"
    ],
    "notes": "Web Developer Intern",
    "links": [
      {
        "label": "ptijobworld.com",
        "url": "https://ptijobworld.com"
      }
    ],
    "image": "/images/projects/ptijobworld.webp",
    "imageKind": "screenshot",
    "caption": "PTI Job World recruitment website",
    "gallery": [
      {
        "image": "/images/projects/ptijobworld.webp",
        "caption": "PTI Job World recruitment website",
        "alt": "PTI Job World recruitment website"
      }
    ]
  },
  {
    "id": "pti-desk",
    "index": "09",
    "name": "PTI Desk",
    "subtitle": "Internal Recruitment CRM",
    "category": "Business applications",
    "group": "client",
    "status": "",
    "summary": "An internal CRM for managing candidates, companies, jobs, activities, and recruitment operations in one application.",
    "purpose": "I built PTI Desk to support the company's internal recruitment workflows. The application brings candidate records, company information, jobs, and activities into a shared system. This project extended my internship work from public-facing pages into a business application centered on operational data and day-to-day use.",
    "problem": "I built PTI Desk to support the company's internal recruitment workflows. The application brings candidate records, company information, jobs, and activities into a shared system. This project extended my internship work from public-facing pages into a business application centered on operational data and day-to-day use.",
    "problemHeading": "Purpose and context",
    "approach": "I built PTI Desk to support the company's internal recruitment workflows. The application brings candidate records, company information, jobs, and activities into a shared system. This project extended my internship work from public-facing pages into a business application centered on operational data and day-to-day use.",
    "decisions": [],
    "contributions": [],
    "stack": [],
    "notes": "Internal CRM, operational workflows, and business-record management.",
    "links": [
      {
        "label": "ptidesk.ptijobworld.com",
        "url": "https://ptidesk.ptijobworld.com"
      }
    ],
    "image": "/images/projects/ptidesk2.webp",
    "imageKind": "screenshot",
    "caption": "PTI Desk operations dashboard",
    "gallery": [
      {
        "image": "/images/projects/ptidesk2.webp",
        "caption": "PTI Desk operations dashboard",
        "alt": "PTI Desk operations dashboard"
      },
      {
        "image": "/images/projects/ptidesk.webp",
        "caption": "PTI Desk sign-in screen",
        "alt": "PTI Desk sign-in screen"
      }
    ]
  },
  {
    "id": "pti-intake",
    "index": "10",
    "name": "PTI Job World",
    "subtitle": "Application Intake Automation",
    "category": "Business applications",
    "group": "client",
    "status": "",
    "summary": "A Google Forms and Apps Script workflow that stores applications, handles submitted photos, and sends structured email notifications to the team.",
    "purpose": "I created an application-intake workflow connecting Google Forms, stored submission data, and team email notifications. It handles applicant photos alongside form entries and presents the information in structured alerts. The workflow is designed to reduce manual handoffs between receiving an application and making it available for review.",
    "problem": "I created an application-intake workflow connecting Google Forms, stored submission data, and team email notifications. It handles applicant photos alongside form entries and presents the information in structured alerts. The workflow is designed to reduce manual handoffs between receiving an application and making it available for review.",
    "problemHeading": "Purpose and context",
    "approach": "I created an application-intake workflow connecting Google Forms, stored submission data, and team email notifications. It handles applicant photos alongside form entries and presents the information in structured alerts. The workflow is designed to reduce manual handoffs between receiving an application and making it available for review.",
    "decisions": [],
    "contributions": [],
    "stack": [
      "Google Forms",
      "Google Apps Script",
      "spreadsheet storage",
      "email automation"
    ],
    "notes": "Workflow implementation and integration.",
    "links": [],
    "image": "/images/projects/screenshot-placeholder.svg",
    "imageKind": "placeholder",
    "caption": "Project screenshot to be added",
    "gallery": []
  },
  {
    "id": "pavika-foods",
    "index": "11",
    "name": "Pavika Foods",
    "subtitle": "E-Commerce Platform",
    "category": "Client websites",
    "group": "client",
    "status": "",
    "summary": "A custom e-commerce platform combining a React/Next.js storefront, Cloudflare backend services, D1 data storage, and Cashfree payment integration.",
    "purpose": "I built a simple e-commerce platform for Pavika Foods, connecting the customer-facing storefront with backend APIs, data storage, and online payments. The implementation uses Cloudflare Pages and Workers with D1, alongside Cashfree integration. My work covered the application and the deployment configuration needed to bring those services together.",
    "problem": "I built a simple e-commerce platform for Pavika Foods, connecting the customer-facing storefront with backend APIs, data storage, and online payments. The implementation uses Cloudflare Pages and Workers with D1, alongside Cashfree integration. My work covered the application and the deployment configuration needed to bring those services together.",
    "problemHeading": "Purpose and context",
    "approach": "I built a simple e-commerce platform for Pavika Foods, connecting the customer-facing storefront with backend APIs, data storage, and online payments. The implementation uses Cloudflare Pages and Workers with D1, alongside Cashfree integration. My work covered the application and the deployment configuration needed to bring those services together.",
    "decisions": [],
    "contributions": [],
    "stack": [
      "React/Next.js",
      "Cloudflare Pages",
      "Cloudflare Workers",
      "Cloudflare D1",
      "Cashfree Payments"
    ],
    "notes": "Freelance full-stack development.",
    "links": [
      {
        "label": "pavikafoods.com",
        "url": "https://pavikafoods.com"
      }
    ],
    "image": "/images/projects/pavikafoods.webp",
    "imageKind": "screenshot",
    "caption": "Pavika Foods storefront",
    "gallery": [
      {
        "image": "/images/projects/pavikafoods.webp",
        "caption": "Pavika Foods storefront",
        "alt": "Pavika Foods storefront"
      }
    ]
  },
  {
    "id": "stonesera",
    "index": "12",
    "name": "Stonesera",
    "subtitle": "Business Website",
    "category": "Client websites",
    "group": "client",
    "status": "",
    "summary": "A client website built to present Stonesera's business and offerings through a clear, accessible web presence.",
    "purpose": "I delivered the Stonesera website as part of my freelance client work. The project focused on translating the business's requirements into public-facing pages and carrying the implementation through deployment. It reflects my experience delivering websites for clients alongside more complex application projects.",
    "problem": "I delivered the Stonesera website as part of my freelance client work. The project focused on translating the business's requirements into public-facing pages and carrying the implementation through deployment. It reflects my experience delivering websites for clients alongside more complex application projects.",
    "problemHeading": "Purpose and context",
    "approach": "I delivered the Stonesera website as part of my freelance client work. The project focused on translating the business's requirements into public-facing pages and carrying the implementation through deployment. It reflects my experience delivering websites for clients alongside more complex application projects.",
    "decisions": [],
    "contributions": [],
    "stack": [],
    "notes": "Freelance website development and delivery.",
    "links": [
      {
        "label": "stonesera.com",
        "url": "https://stonesera.com"
      }
    ],
    "image": "/images/projects/stonesera.webp",
    "imageKind": "screenshot",
    "caption": "Stonesera business website",
    "gallery": [
      {
        "image": "/images/projects/stonesera.webp",
        "caption": "Stonesera business website",
        "alt": "Stonesera business website"
      }
    ]
  },
  {
    "id": "mahaveer-surface-studio",
    "index": "13",
    "name": "Mahaveer Surface Studio",
    "subtitle": "Business Website",
    "category": "Client websites",
    "group": "client",
    "status": "",
    "summary": "A website developed for Mahaveer Surface Studio to communicate its business identity and offerings online.",
    "purpose": "I developed the Mahaveer Surface Studio website as a freelance engagement. My work focused on implementing the business's content and presentation requirements and supporting deployment. The project contributes to my client-delivery experience: turning requirements into a website that the business can use as its public presence.",
    "problem": "I developed the Mahaveer Surface Studio website as a freelance engagement. My work focused on implementing the business's content and presentation requirements and supporting deployment. The project contributes to my client-delivery experience: turning requirements into a website that the business can use as its public presence.",
    "problemHeading": "Purpose and context",
    "approach": "I developed the Mahaveer Surface Studio website as a freelance engagement. My work focused on implementing the business's content and presentation requirements and supporting deployment. The project contributes to my client-delivery experience: turning requirements into a website that the business can use as its public presence.",
    "decisions": [],
    "contributions": [],
    "stack": [],
    "notes": "Freelance website development and delivery.",
    "links": [
      {
        "label": "mahaveersurfacestudio.com",
        "url": "https://mahaveersurfacestudio.com"
      }
    ],
    "image": "/images/projects/mahaveersurfacestudio.webp",
    "imageKind": "screenshot",
    "caption": "Mahaveer Surface Studio website",
    "gallery": [
      {
        "image": "/images/projects/mahaveersurfacestudio.webp",
        "caption": "Mahaveer Surface Studio website",
        "alt": "Mahaveer Surface Studio website"
      }
    ]
  },
  {
    "id": "moonshine-cleaning",
    "index": "14",
    "name": "Moonshine Cleaning",
    "subtitle": "Service Business Website",
    "category": "Client websites",
    "group": "client",
    "status": "",
    "summary": "A client website for Moonshine Cleaning, built to present the service business through a clear online presence.",
    "purpose": "I delivered a website for Moonshine Cleaning as part of my freelance work. The engagement focused on bringing the client's service-business requirements into a public-facing website, with implementation and deployment support. It adds service-sector delivery experience to my portfolio of business websites and applications.",
    "problem": "I delivered a website for Moonshine Cleaning as part of my freelance work. The engagement focused on bringing the client's service-business requirements into a public-facing website, with implementation and deployment support. It adds service-sector delivery experience to my portfolio of business websites and applications.",
    "problemHeading": "Purpose and context",
    "approach": "I delivered a website for Moonshine Cleaning as part of my freelance work. The engagement focused on bringing the client's service-business requirements into a public-facing website, with implementation and deployment support. It adds service-sector delivery experience to my portfolio of business websites and applications.",
    "decisions": [],
    "contributions": [],
    "stack": [],
    "notes": "Freelance website development and delivery.",
    "links": [
      {
        "label": "moonshinecleaning.ca",
        "url": "https://moonshinecleaning.ca"
      }
    ],
    "image": "/images/projects/moonshinecleaning.webp",
    "imageKind": "screenshot",
    "caption": "Moonshine Cleaning services website",
    "gallery": [
      {
        "image": "/images/projects/moonshinecleaning.webp",
        "caption": "Moonshine Cleaning services website",
        "alt": "Moonshine Cleaning services website"
      }
    ]
  },
  {
    "id": "sri-krishna",
    "index": "15",
    "name": "Sri Krishna Granite & Marbles",
    "subtitle": "Product Showcase Website",
    "category": "Client websites",
    "group": "client",
    "status": "",
    "summary": "A React website with product, service, gallery, and company pages, plus structured SEO data and WhatsApp-based customer inquiries.",
    "purpose": "I built a product-focused website for Sri Krishna Granite & Marbles. The application includes dedicated pages for products, services, the company, a gallery, and contact information. Customer inquiries open a prefilled WhatsApp message, while structured data and page-level SEO components support the site's public presentation. Non-home pages use lazy loading.",
    "problem": "I built a product-focused website for Sri Krishna Granite & Marbles. The application includes dedicated pages for products, services, the company, a gallery, and contact information. Customer inquiries open a prefilled WhatsApp message, while structured data and page-level SEO components support the site's public presentation. Non-home pages use lazy loading.",
    "problemHeading": "Purpose and context",
    "approach": "I built a product-focused website for Sri Krishna Granite & Marbles. The application includes dedicated pages for products, services, the company, a gallery, and contact information. Customer inquiries open a prefilled WhatsApp message, while structured data and page-level SEO components support the site's public presentation. Non-home pages use lazy loading.",
    "decisions": [],
    "contributions": [],
    "stack": [
      "React",
      "Vite",
      "React Router",
      "CSS",
      "Framer Motion",
      "structured data",
      "WhatsApp links"
    ],
    "notes": "Freelance frontend development and website delivery.",
    "links": [
      {
        "label": "srikrishnagranite.com",
        "url": "https://srikrishnagranite.com"
      },
      {
        "label": "GitHub repository",
        "url": "https://github.com/Goutam-11/srikrishnagranitemarble"
      }
    ],
    "image": "/images/projects/screenshot-placeholder.svg",
    "imageKind": "placeholder",
    "caption": "Project screenshot to be added",
    "gallery": []
  }
];

export const featuredProjects = projects.filter(project => ["hyusk", "meu", "insage", "dg-converter"].includes(project.id));
export const bubbleProjects = projects.filter(project => ["meu", "sobro", "insage", "pavika-foods"].includes(project.id));
