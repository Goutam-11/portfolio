# Goutam Kumar Sharma — Portfolio Project Content

Updated: 1 October 2026

The card descriptions and case-study sections below are website copy. The source and editorial notes at the end are for review and should stay outside the public portfolio.

## Portfolio introduction

### Headline

Building AI agents, automation platforms, and software for real business workflows.

### Introduction

I'm Goutam Kumar Sharma, a full-stack developer and Computer Science undergraduate. I build across web applications, desktop tools, and AI systems—from voice-controlled desktop automation and workflow orchestration to client websites, internal CRMs, and payment-enabled stores. My work connects interfaces with the APIs, data, and background processes that make a product useful.

### Contact details

- **Email:** [goutamkumar.sharmq@gmail.com](mailto:goutamkumar.sharmq@gmail.com)
- **GitHub:** [github.com/Goutam-11](https://github.com/Goutam-11)
- **LinkedIn:** [linkedin.com/in/goutam-kumar-sharma-0209b228a](https://www.linkedin.com/in/goutam-kumar-sharma-0209b228a/)

### Personal-project section introduction

Projects where I explore how software can understand requests, coordinate work, and interact with real systems. Each one tackles a different engineering challenge: desktop control, credential access, document extraction, knowledge capture, travel research, workflow execution, or trading automation.

### Client-work section introduction

Websites and business applications delivered through freelance work and my internship at PTI Job World. My responsibilities have included requirements, implementation, integrations, deployment, and ongoing fixes.

## 1. Hyusk

**Subtitle:** Voice-first desktop agent for Linux

**Category:** AI agents · Desktop automation · Systems development

**Suggested badge:** Experimental

### Project-card description

A Rust-based desktop agent that turns voice and text requests into actions across Linux applications, terminal tools, and reusable workflows, with persistent memory and an Android companion.

### Overview

Hyusk brings a conversational interface to everyday computer tasks. It combines wake-word detection, speech recognition, spoken responses, and structured tool calling with native desktop integrations. Users can launch applications, navigate websites, control media, run commands, or ask the agent to work through a longer task.

I built an event-driven Rust runtime that connects these capabilities while keeping requests interruptible. Common commands and named workflows use a local command router; requests outside that vocabulary go through a model-driven tool loop. This gives routine actions a direct execution path while retaining flexibility for more complex work.

### Engineering challenge

Desktop automation needs more than an LLM response. It must work with application state, audio input, long-running processes, and the permission model of GNOME on Wayland. Hyusk combines accessibility-based interactions with desktop-portal input and screenshot inspection, depending on what the application exposes.

### My contribution

- Built the Rust agent runtime, structured tool registry, and asynchronous request handling.
- Connected wake-word detection, Whisper speech recognition, and local speech output.
- Added shell, process, media, computer, and accessibility tools.
- Implemented cancellable turns, bounded conversation history, and restart-safe session persistence.
- Added SQLite-backed memory, local workflows, reminders, and managed background tasks.
- Built GNOME integration, a GTK workflow editor, and an opt-in Android companion connection.

### Feature highlights

- Voice and text input with interruptible agent responses.
- Application launching, window switching, browser navigation, and media control.
- Accessibility inspection and permission-based desktop control.
- Named workflows that run locally without a model call.
- Persistent memory and scheduled one-time reminders or workflows.
- Android companion pairing through an authenticated TLS WebSocket link.

**Tech stack:** Rust, Tokio, OpenAI-compatible model APIs, Whisper, CPAL, ONNX wake-word models, Piper, SQLite, egui/eframe, GTK4/libadwaita, AT-SPI2, XDG desktop portals, Kotlin/Android, WebSockets.

**What this demonstrates:** Integrating AI reasoning with native operating-system capabilities, asynchronous execution, and a usable desktop interface.

**Link:** [GitHub repository](https://github.com/Goutam-11/hyusk)

## 2. Blind

**Subtitle:** Approval-based credential access for local automation

**Category:** Developer tools · Security architecture · Linux

**Suggested badge:** Design stage

### Project-card description

A Rust-first secret-broker design for Fedora and GNOME, built around encrypted storage and explicit approval before selected credentials are supplied to a requested process.

### Overview

Blind explores a practical problem in agent-assisted development: a tool may need a credential to complete a task, but giving the agent unrestricted plaintext access creates unnecessary exposure. The proposed workflow lets automation request execution using named secrets, then routes that request through policy evaluation and human approval.

I developed the project specification around a broker daemon, a metadata-focused CLI, an encrypted vault, and desktop approval controls. Approval is designed to bind to the requested executable, arguments, working directory, and secret set. The process receives the approved credentials; the agent-facing interface is intended to expose metadata and execution status.

### Design contribution

- Defined the product workflow and boundaries between the client, broker, vault, and approval UI.
- Specified encrypted storage and credential injection into an approved child process.
- Planned request-bound approvals, denial and timeout handling, and audit records.
- Defined a staged implementation path for a Rust CLI, GTK application, and thin GNOME extension.

**Proposed tech stack:** Rust, SQLite with encrypted secret values, XChaCha20-Poly1305, Linux Secret Service, Unix sockets, D-Bus, GTK4/libadwaita, GNOME Shell extension.

**What this demonstrates:** Security-focused product design and explicit trust boundaries for agent tooling.

## 3. DG Converter

**Subtitle:** Document-to-spreadsheet workflow for accounting data

**Category:** Desktop applications · Document processing · Business automation

**Suggested badge:** In development

### Project-card description

A local-first desktop application for extracting tables from digital and scanned PDFs, reviewing transaction data, mapping accounting fields, and exporting Excel files with Tally context.

### Overview

DG Converter is being built to make accounting document processing easier to review and reuse. Instead of stopping at text extraction, the application presents tabular output, supports transaction-field mapping, and prepares spreadsheet exports for downstream work.

I connected Python document parsers to a React and Tauri desktop interface. The workflow also integrates company, ledger, and voucher-type data from a locally running Tally server, giving users accounting context while preparing their data.

### Engineering challenge

Digital PDFs and scanned documents need different extraction approaches. The product combines document parsing with a review interface so users can inspect the extracted structure and resolve field mappings before export.

### My contribution

- Connected Python extraction logic to the desktop frontend.
- Built the tabular preview and transaction-mapping workflow.
- Integrated local Tally company, ledger, and voucher-type data.
- Developed Excel export as part of the document-processing pipeline.

**Tech stack:** Python, React, TypeScript, Tauri, PDFPlumber, Docling, Excel export, local Tally integration.

**What this demonstrates:** Combining document processing, desktop interfaces, and an existing business system in one workflow.

## 4. Insage

**Subtitle:** A knowledge inbox for content shared through Instagram

**Category:** Knowledge tools · API integrations · Web applications

**Suggested badge:** In development

### Project-card description

A knowledge-inbox project that uses a dedicated Instagram account as a capture channel, with webhook handling and a web dashboard foundation for organizing shared content.

### Overview

Insage is being developed around a familiar habit: sharing useful posts, Reels, links, and messages through Instagram DMs. Its goal is to turn that capture flow into a personal knowledge library where saved content can become structured records and, as the processing pipeline develops, useful notes.

Users send content to a dedicated professional Instagram inbox. My work has focused on the integration foundation: webhook handling, connection testing, a DM-processing flow, and authenticated browser push-subscription APIs. The broader AI processing and content-enrichment workflow remains part of the product's development direction.

### My contribution

- Developed Instagram webhook handling and integration-testing flows.
- Worked on connecting incoming message and content references to backend processing.
- Implemented authenticated push-subscription storage and management APIs.
- Investigated real-message delivery and browser push-subscription failures.

**Tech stack:** Next.js, TypeScript, Tailwind CSS, Instagram messaging/webhooks, Cloudflare Workers, Drizzle, Web Push/VAPID.

**What this demonstrates:** Building and debugging external integrations, event ingestion, and account-scoped backend workflows.

## 5. Sobro

**Subtitle:** AI-assisted travel research for nomadic travelers

**Category:** AI agents · Travel tools · Full-stack applications

### Project-card description

A travel-planning agent that combines flight discovery, accommodation discovery, and web research through a custom LangGraph workflow, with user credit and account management.

### Overview

Sobro brings several parts of travel research into one agent-driven application. It combines flight-price discovery from Google Flights, accommodation discovery from Airbnb, and wider web research through DuckDuckGo to help users investigate travel options.

I built a custom LangGraph agent with tool use, connected it to FastAPI backend services and a React frontend, and implemented Supabase-backed account and credit management. The project brings research orchestration and product infrastructure together in a single application.

### My contribution

- Built the custom LangGraph agent and research-tool workflow.
- Connected flight, accommodation, and web-discovery tools.
- Developed backend services and the React interface.
- Implemented Supabase-backed user accounts and credit management.

**Tech stack:** React, Python, FastAPI, LangGraph, Supabase, Google Flights discovery, Airbnb discovery, DuckDuckGo research.

**What this demonstrates:** Tool-using agent orchestration integrated with a complete web application.

**Project URL:** [sobro.xyz](https://sobro.xyz) — supplied in the resume; current availability has not been checked.

## 6. Shinrai-Node

**Subtitle:** Visual workflow orchestration with AI integrations

**Category:** Automation platforms · Workflow tools · Full-stack applications

### Project-card description

A visual workflow platform connecting automation nodes, HTTP services, forms, AI-agent integrations, and payment workflows through typed APIs and background execution.

### Overview

Shinrai-Node lets automation be represented as connected workflow nodes. It brings together service requests, forms, AI integrations, and other workflow steps while storing their configuration and executing work in the background.

I developed visual automation nodes, typed APIs, persistent workflows, and background execution. The project focuses on connecting a usable workflow interface with the backend infrastructure needed to run and manage those automations.

### My contribution

- Developed visual workflow nodes and their configuration interfaces.
- Built typed API communication with tRPC.
- Implemented workflow persistence using Prisma and PostgreSQL.
- Connected Inngest background execution with service and AI integrations.
- Developed HTTP, form, and payment workflow capabilities.

**Tech stack:** Next.js, TypeScript, tRPC, Prisma, PostgreSQL, Inngest, AI-agent integrations.

**What this demonstrates:** Visual automation backed by persistent data, typed interfaces, and asynchronous execution.

## 7. MEU

**Subtitle:** Trading-agent management and execution infrastructure

**Category:** AI agents · Trading infrastructure · Distributed workflows

**Suggested badge:** Experimental

### Project-card description

A trading-automation system combining a Next.js management dashboard with a MongoDB-aware scheduler, BullMQ workers, market-analysis tools, and exchange integrations.

### Overview

MEU connects the configuration and monitoring of trading agents with the services that schedule and execute their work. The dashboard lets users manage agents, exchange connections, model credentials, and trading records. A separate scheduler watches MongoDB for state changes and queues agent runs for background workers.

I built across the dashboard and execution service, including agent lifecycle management, typed APIs, market-analysis inputs, exchange tools, run logging, and failure notifications. The worker implementation gathers indicator data across multiple timeframes and passes it to a model-driven tool loop for exchange operations.

### Engineering challenge

An agent dashboard needs to stay aligned with background execution. MEU uses MongoDB change streams, an in-memory agent cache, scheduled queue submissions, and worker results to connect user configuration with execution state.

### My contribution

- Built the Next.js dashboard for agents, credentials, exchanges, and notifications.
- Implemented MongoDB change-stream watchers and scheduling logic.
- Connected Redis/BullMQ queues with asynchronous agent workers.
- Integrated exchange access and technical-indicator inputs.
- Added run records and worker-failure notifications.

### Feature highlights

- Agent creation, configuration, and lifecycle controls.
- Exchange and model-credential management.
- Configurable strategy and risk settings in the management interface.
- Scheduled model-driven runs with market-analysis and exchange tools.
- Run history and operational error reporting.

**Tech stack:** Next.js, React, TypeScript, Bun, tRPC, TanStack Query, Prisma, MongoDB, Redis, BullMQ, AI SDK, CCXT, Kite Connect, better-auth, Tailwind CSS.

**What this demonstrates:** Connecting AI agents with event-driven scheduling, queue-based execution, and operational interfaces.

**Links:** [Scheduler and agent service](https://github.com/Goutam-11/meu) · [Management dashboard](https://github.com/Goutam-11/meu_frontend)

## Client and internship projects

### PTI Job World — Company Website

**Card description:** A responsive recruitment-company website with SEO-focused public pages and a clear presentation of the business and its services.

**Detail copy:** During my internship at PTI Job World, I developed and maintained the company's public website. My work covered responsive React/Next.js interfaces and SEO-focused pages, helping the business present its services through a consistent web presence. I also supported ongoing maintenance and fixes as requirements evolved.

**Role:** Web Developer Intern

**Tech stack:** React, Next.js, responsive frontend development, SEO implementation.

**Link:** [ptijobworld.com](https://ptijobworld.com)

### PTI Desk — Internal Recruitment CRM

**Card description:** An internal CRM for managing candidates, companies, jobs, activities, and recruitment operations in one application.

**Detail copy:** I built PTI Desk to support the company's internal recruitment workflows. The application brings candidate records, company information, jobs, and activities into a shared system. This project extended my internship work from public-facing pages into a business application centered on operational data and day-to-day use.

**Role:** Web Developer Intern

**Project focus:** Internal CRM, operational workflows, and business-record management.

**Link:** [ptidesk.ptijobworld.com](https://ptidesk.ptijobworld.com)

### PTI Job World — Application Intake Automation

**Card description:** A Google Forms and Apps Script workflow that stores applications, handles submitted photos, and sends structured email notifications to the team.

**Detail copy:** I created an application-intake workflow connecting Google Forms, stored submission data, and team email notifications. It handles applicant photos alongside form entries and presents the information in structured alerts. The workflow is designed to reduce manual handoffs between receiving an application and making it available for review.

**Role:** Workflow implementation and integration.

**Tech stack:** Google Forms, Google Apps Script, spreadsheet storage, email automation.

### Pavika Foods — E-Commerce Platform

**Card description:** A custom e-commerce platform combining a React/Next.js storefront, Cloudflare backend services, D1 data storage, and Cashfree payment integration.

**Detail copy:** I built a simple e-commerce platform for Pavika Foods, connecting the customer-facing storefront with backend APIs, data storage, and online payments. The implementation uses Cloudflare Pages and Workers with D1, alongside Cashfree integration. My work covered the application and the deployment configuration needed to bring those services together.

**Role:** Freelance full-stack development.

**Tech stack:** React/Next.js, Cloudflare Pages, Cloudflare Workers, Cloudflare D1, Cashfree Payments.

**Link:** [pavikafoods.com](https://pavikafoods.com)

### Stonesera — Business Website

**Card description:** A client website built to present Stonesera's business and offerings through a clear, accessible web presence.

**Detail copy:** I delivered the Stonesera website as part of my freelance client work. The project focused on translating the business's requirements into public-facing pages and carrying the implementation through deployment. It reflects my experience delivering websites for clients alongside more complex application projects.

**Role:** Freelance website development and delivery.

**Link:** [stonesera.com](https://stonesera.com)

### Mahaveer Surface Studio — Business Website

**Card description:** A website developed for Mahaveer Surface Studio to communicate its business identity and offerings online.

**Detail copy:** I developed the Mahaveer Surface Studio website as a freelance engagement. My work focused on implementing the business's content and presentation requirements and supporting deployment. The project contributes to my client-delivery experience: turning requirements into a website that the business can use as its public presence.

**Role:** Freelance website development and delivery.

**Link:** [mahaveersurfacestudio.com](https://mahaveersurfacestudio.com)

### Moonshine Cleaning — Service Business Website

**Card description:** A client website for Moonshine Cleaning, built to present the service business through a clear online presence.

**Detail copy:** I delivered a website for Moonshine Cleaning as part of my freelance work. The engagement focused on bringing the client's service-business requirements into a public-facing website, with implementation and deployment support. It adds service-sector delivery experience to my portfolio of business websites and applications.

**Role:** Freelance website development and delivery.

**Link:** [moonshinecleaning.ca](https://moonshinecleaning.ca)

### Sri Krishna Granite & Marbles — Product Showcase Website

**Card description:** A React website with product, service, gallery, and company pages, plus structured SEO data and WhatsApp-based customer inquiries.

**Detail copy:** I built a product-focused website for Sri Krishna Granite & Marbles. The application includes dedicated pages for products, services, the company, a gallery, and contact information. Customer inquiries open a prefilled WhatsApp message, while structured data and page-level SEO components support the site's public presentation. Non-home pages use lazy loading.

**Role:** Freelance frontend development and website delivery.

**Tech stack:** React, Vite, React Router, CSS, Framer Motion, structured data, WhatsApp links.

**Links:** [srikrishnagranite.com](https://srikrishnagranite.com) · [GitHub repository](https://github.com/Goutam-11/srikrishnagranitemarble)

## Suggested portfolio placement

Use the short descriptions in the project grid. Use the overview, contribution, and technology sections inside each project detail view. Hyusk and MEU have enough accessible technical evidence to support deeper case studies. DG Converter, Sobro, and Shinrai show different product and integration strengths. Keep Blind's design-stage badge and Insage's development badge visible until their current implementation can be reviewed.

Client work can use a compact grid, with fuller detail views for PTI Desk, Pavika Foods, and Sri Krishna Granite & Marbles. Treat the PTI website, CRM, and intake automation as parts of one internship engagement when describing client or company counts.

## Project image assets

The following owner-supplied screenshots are available under `public/images/projects/`. Use them as project previews or case-study gallery images. Add concise alt text that describes the visible screen, and add captions only when they clarify the image. These are product and website screenshots; the concept SVGs listed separately are illustrative placeholders.

| Project | Image paths | Suggested use |
| --- | --- | --- |
| MEU — trading-agent system | `public/images/projects/meu2.png`, `public/images/projects/mey.png` | Trading dashboard and agent-management views. |
| Insage | `public/images/projects/insage.png` | Content discovery and saved-item dashboard. |
| Sobro | `public/images/projects/sobro.png`, `public/images/projects/sobro2.png` | Travel research interface and branded loading screen. |
| PTI Desk | `public/images/projects/ptidesk.png`, `public/images/projects/ptidesk2.png` | CRM sign-in and operations dashboard. |
| PTI Job World | `public/images/projects/ptijobworld.png` | Public recruitment website. |
| Pavika Foods | `public/images/projects/pavikafoods.png` | E-commerce storefront. |
| Mahaveer Surface Studio | `public/images/projects/mahaveersurfacestudio.png` | Surface and stone business website. |
| Moonshine Cleaning | `public/images/projects/moonshinecleaning.png` | Cleaning-services website. |
| Stonesera | `public/images/projects/stonesera.png` | Stone showroom website. |

The sample portfolio projects also have concept illustrations: `public/images/projects/hyusk-concept.svg`, `public/images/projects/trading-concept.svg`, `public/images/projects/shinrai-concept.svg`, and `public/images/projects/dg-converter-concept.svg`. Keep their “concept image” labeling until real screenshots are supplied. The trading screenshots above are for MEU; confirm whether they can also represent the separate Multi-Agent Trading System entry before reusing them there.

## Source and editorial notes — exclude from the public website

### Evidence coverage

| Project | Evidence used | Publication guidance |
| --- | --- | --- |
| Hyusk | Current GitHub README, architecture document, dependency manifest, and source-tree structure | Experimental implementation is documented. No runtime verification was performed. |
| Blind | Current BLIND_PROJECT_PLAN.md specification and prior project discussion | Describe the architecture and intended workflow. The available evidence does not establish implementation completion. |
| DG Converter | Supplied resume | Resume explicitly describes the project as being built. Repository unavailable through this connection. |
| Insage | Prior user discussions and previously shared code details | Webhook and push API work is supported. Latest repository and end-to-end behavior are unverified. |
| Sobro | Supplied resume | Agent, tools, backend, frontend, and account/credit work are resume-supported. Current launch status is unverified. |
| Shinrai-Node | Supplied resume | Nodes, typed APIs, persistence, and background execution are resume-supported. Current repository is unavailable. |
| MEU | Current scheduler/dashboard GitHub READMEs, dependency manifests, worker and agent source | Implementation exists, but advertised features are broader than the inspected execution path. Keep claims scoped to infrastructure and configurable settings. |
| PTI website, CRM, and intake automation | Supplied resume | Work and responsibilities are documented. Live behavior and per-application stack beyond the stated website stack were not checked. |
| Pavika Foods | Supplied resume | Store and listed integrations are supported by the resume. Current live behavior was not checked. |
| Stonesera, Mahaveer Surface Studio, Moonshine Cleaning | Supplied resume | Website delivery is supported. Specific features, individual stacks, and results are not established. |
| Sri Krishna Granite & Marbles | Supplied resume and current repository package.json, App.jsx, Contact.jsx, and source-tree structure | Routes, lazy loading, SEO components, and WhatsApp inquiry flow are source-supported. Live deployment was not tested. |

### Important wording decisions

- The GitHub account resolved to Goutam-11. Hyusk, MEU, MEU Frontend, and Sri Krishna Granite & Marbles were accessible. Exact-name attempts for Blind, Insage, DG Converter, Sobro, and Shinrai-Node returned unavailable resources; do not infer that these projects do not exist.
- Hyusk's local command router handles a defined vocabulary. Do not describe every natural-language request as offline or deterministic. Model-driven requests still depend on configured providers.
- Blind's design does not establish that secrets are inaccessible to every same-user process or that approved child processes cannot disclose them. Avoid absolute security claims.
- Insage's previous real-DM delivery and browser push-subscription issues were unresolved in the available discussions. Do not advertise reliable production push delivery, unrestricted Reel analysis, completed semantic search, or a finished AI-note pipeline without current evidence.
- Sobro's integrations are described as discovery/research tools. Do not claim official Google Flights or Airbnb API partnerships, automated booking, or guaranteed live prices.
- MEU is presented as trading infrastructure. Do not claim profitability, audited execution, guaranteed risk enforcement, or production reliability. The inspected worker path does not demonstrate enforcement of all dashboard risk settings or complete exchange synchronization. The inspected model adapter uses an NVIDIA-compatible endpoint; avoid claiming every documented provider is active in that path.
- Current MEU GitHub evidence supports a TypeScript/Bun scheduler and worker stack. The resume lists Python for the overall project, but Python was not established in the inspected repositories, so it is omitted from the public stack here.
- Client URLs come from the supplied resume; current availability was not checked. No traffic, conversion, revenue, performance-score, or time-saving metrics were invented.
- The specific frontend/backend framework choices for Pavika Foods are listed as React/Next.js because that is how the resume describes them. Use the exact current framework once its implementation is available.
- Do not attach GitHub buttons for inaccessible projects using guessed repository URLs. Add those links once the correct accessible URLs are available.

### Primary source links

- [Hyusk README](https://github.com/Goutam-11/hyusk/blob/main/README.md)
- [Hyusk architecture](https://github.com/Goutam-11/hyusk/blob/main/ARCHITECTURE.md)
- [Hyusk dependencies](https://github.com/Goutam-11/hyusk/blob/main/Cargo.toml)
- [MEU scheduler README](https://github.com/Goutam-11/meu/blob/main/README.md)
- [MEU worker implementation](https://github.com/Goutam-11/meu/blob/main/schedulerService/src/workers/worker.ts)
- [MEU agent implementation](https://github.com/Goutam-11/meu/blob/main/schedulerService/src/agent/vercelAgent.ts)
- [MEU dashboard README](https://github.com/Goutam-11/meu_frontend/blob/main/README.md)
- [Sri Krishna website routing](https://github.com/Goutam-11/srikrishnagranitemarble/blob/main/src/App.jsx)
- [Sri Krishna contact implementation](https://github.com/Goutam-11/srikrishnagranitemarble/blob/main/src/components/Contact.jsx)
- Goutam_Kumar_Sharma_ATS_Resume_Final.pdf — supplied attachment.
- BLIND_PROJECT_PLAN.md — current design specification, read in full.
