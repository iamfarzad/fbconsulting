
# AiDE Framework for AI-Assisted Development

The AiDE framework is a lightweight, drop-in solution for structuring AI-assisted development. It standardizes project context management, documentation, and collaboration, ensuring your assistant stays informed and productive throughout the project lifecycle.

> **⚠ Disclaimer**  
> Some AI-powered code assistants have predefined token limits that could be quickly consumed when reading or writing to `.context` files. While this framework has proven tremendously helpful, developers should be aware of these limitations. Using it with code assistants that leverage your own API keys can help avoid the stricter token limits imposed by some platforms.

## Features

- **Drop-in simplicity**: No dependencies or configuration required. Just drop the `.context` folder into your project.
- **Versatile usage**:
  - **New projects**: Use your AI assistant or the AiDE Planning Assistant GPT to generate an initial roadmap, tasks, and documentation.
  - **Existing projects**: Let the assistant analyze your codebase and update the `.context` files to reflect the current state.
- **Standardized structure**: Organized templates for roadmaps, tasks, decisions, and sessions.

## How It Works

1. **Project State**
   - `current_state.md` tracks active features, technical state, and recent changes.
   - AI keeps this updated as you work.
   - Always know where your project stands.

2. **Decision Records**
   - Document architectural decisions in `decisions/`.
   - Track context, consequences, and validation.
   - Build institutional knowledge.

3. **Task Management**
   - Track tasks in `tasks/`.
   - AI helps manage priorities and progress.
   - Keep development focused.

4. **Session Tracking**
   - Record session summaries in `sessions/`.
   - Track changes, decisions, and next steps.
   - Maintain development continuity.

## Getting Started

### New Project
1. Start with the **AiDE Planning Assistant GPT** [here](https://chatgpt.com/g/g-67798aff6be881918ac59747a7e6542d-aide-planning-assistant-gpt). For those who wish to create their own version, the base prompt is included in [AiDE_Planning_Assistant_GPT.md](./AiDE_Planning_Assistant_GPT.md).
2. Use it to brainstorm and generate a `planning_doc.md` for your project.
3. Save the `planning_doc.md` in the project root.
4. Instruct your AI code assistant to:
   - Read the `planning_doc.md`.
   - Generate and populate the `.context` files (e.g., roadmap, tasks, decisions).

### Existing Project
1. Drop the `.context` folder into your project’s root directory.
2. Instruct your AI assistant to:
   - Analyze the codebase.
   - Update `current_state.md` with the technical state, features, and recent changes.
   - Populate or update `roadmap.md` and any relevant tasks or decisions.

## Best Practices

1. **Start every session**: Begin each chat session by asking your AI assistant to review the files in `.context`.
2. **Task completion**: When completing a task, ask the assistant to:
   - Move the task to `.context/tasks/completed/`.
   - Update related files (e.g., current state, roadmap).
3. **Track decisions**: Document key decisions in `.context/decisions/` and reference them for future guidance.
4. **Session summaries**: Record discussions and outcomes in `.context/sessions/` to maintain continuity.

## Folder Structure

```
.context/
├── current_state.md       # Overview of the project's current state
├── roadmap.md             # High-level goals and milestones
├── tasks/                 # Organized task management
│   ├── TEMPLATE.md        # Task template
│   ├── active/            # Active tasks
│   ├── completed/         # Completed tasks
│   ├── hold/              # Tasks on hold
│   └── planned/           # Planned tasks
├── decisions/             # Key decision logs
│   └── TEMPLATE.md        # Decision log template
└── sessions/              # Collaborative session logs
    └── TEMPLATE.md        # Session log template
```

## Contributions

We welcome contributions! Feel free to suggest improvements or submit templates that enhance the usability of `.context`.

## Optional Consideration: Global Rules for AI Assistants

If your AI assistant supports global rules or instructions that persist across all chats or sessions, consider using the following set of rules to optimize its integration with the `.context` framework:

```
1. **Context Awareness**:
   - Always prioritize the `.context` folder for understanding project details.
   - At the start of every session, load and analyze the latest files from the `.context` directory:
     - `current_state.md`
     - `roadmap.md`
     - All files under `.context/tasks/`, `.context/decisions/`, and `.context/sessions/`.

2. **File Management**:
   - Update the `.context` files proactively when tasks are completed, new milestones are set, or decisions are made.
   - Ensure that all updates to `.context` files are well-documented and aligned with the project state.

3. **Task Workflow**:
   - When marking a task as complete:
     - Move its entry to `.context/tasks/completed/`.
     - Cross-reference related tasks and update their statuses or details if needed.
   - Use the templates in `.context/tasks/TEMPLATE.md` for any new tasks.

4. **Decision Tracking**:
   - Record any significant architectural or strategic decisions in `.context/decisions/`.
   - Refer back to these decisions when suggesting solutions or changes to avoid contradictions.

5. **Session Management**:
   - Document collaborative sessions or discussions in `.context/sessions/` using the provided template.
   - Include a summary of outcomes, action items, and any new tasks or changes to the roadmap.

6. **Roadmap and Current State**:
   - Keep `current_state.md` up to date with key project milestones, challenges, and recent progress.
   - Suggest updates to the `roadmap.md` when significant shifts in project goals or timelines occur.

7. **Consistency and Communication**:
   - Use language that is clear and concise when updating `.context` files.
   - If the developer requests clarification or context, refer explicitly to the `.context` files.
   - Suggest best practices for maintaining `.context` when gaps or inconsistencies are identified.

8. **Error Handling**:
   - If the `.context` folder is incomplete or missing expected files, provide actionable suggestions to generate or recover the necessary files.
   - Proactively generate boilerplate content for missing files, e.g., suggest creating an initial `roadmap.md` for new projects.

9. **Adaptability**:
   - Adjust suggestions and output based on the specific needs and state of the project as reflected in `.context`.
```

Implementing these rules ensures the assistant operates effectively, maintains consistency, and reduces the effort required to manage project context.
