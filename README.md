# AI Productivity Hub

Build a modern, responsive frontend web application called AI Workplace Productivity Assistant.

The application is a lightweight AI productivity dashboard designed to help professionals automate common workplace tasks.

IMPORTANT PROJECT RULES

This must be a frontend-only application.

Do NOT build a backend.

Do NOT create a database.

Do NOT add login or registration.

Do NOT create authentication pages.

Users should be able to open the application and immediately use the interface without creating an account.

Avoid paid infrastructure and unnecessary external services.

Keep the project lightweight and suitable for a free Lovable account.

Use local/client-side state where necessary.

Do not add features that require persistent user accounts.

DESIGN STYLE

Create a polished, professional SaaS dashboard.

Use:

Lilac as the primary accent color.

Dark grey for text, navigation, and important UI elements.

White/light backgrounds for content areas.

Modern cards with subtle borders and shadows.

Clean typography.

Rounded corners.

Simple professional icons.

Plenty of whitespace.

Smooth hover and transition effects.

The design should feel similar to a modern productivity SaaS platform: clean, minimal, professional, and easy to use.

Make the entire application fully responsive across:

Desktop

Tablet

Mobile

MAIN LAYOUT

Create a dashboard layout with:

Sidebar

Include navigation links for:

Dashboard

Email Generator

Meeting Summarizer

Research Assistant

The sidebar should have the application logo/name at the top and a simple navigation structure.

On mobile, convert the sidebar into a responsive mobile navigation/menu.

Top Header

Include:

Current page title

Short description

Simple user-free interface — do not add login, signup, or account controls

DASHBOARD PAGE

Create a welcoming dashboard homepage.

Include a headline such as:

Work smarter with AI

Supporting text:

Automate everyday workplace tasks, create professional content, and turn information into useful insights.

Add three main feature cards:

Smart Email Generator

Icon: Email

Description:
Create polished professional emails in seconds with AI.

Button:
Generate Email

Meeting Notes Summarizer

Icon: Notes

Description:
Turn lengthy meeting notes into concise summaries, decisions, action items, and deadlines.

Button:
Summarize Notes

AI Research Assistant

Icon: Search/Research

Description:
Summarize topics and articles while generating useful insights and recommendations.

Button:
Start Research

Also include a small Responsible AI information card at the bottom of the dashboard.

SMART EMAIL GENERATOR

Create a dedicated page for generating professional emails.

Include a structured form with:

Recipient / Audience

Email purpose

Key points

Tone selector

Tone options:

Formal

Friendly

Persuasive

Add a prominent button:

Generate Email

Show a loading state when generating.

Display the result inside a large editable text area/card.

Include buttons:

Copy

Regenerate

Clear

The generated email should have:

Subject

Greeting

Main message

Closing/sign-off

Make the generated result editable directly by the user.

MEETING NOTES SUMMARIZER

Create a dedicated Meeting Notes Summarizer page.

Include a large text input area where users can paste their meeting notes.

Add a button:

Summarize Meeting

After processing, display the result in organized sections:

Summary

A concise overview of the meeting.

Key Decisions

Important decisions made during the meeting.

Action Items

Tasks that need to be completed.

Where possible, show:

Task

Responsible person

Deadline

Deadlines

Important dates and deadlines mentioned in the notes.

Make all generated content editable.

Include:

Copy

Regenerate

Clear

AI RESEARCH ASSISTANT

Create a dedicated Research Assistant page.

Allow users to enter:

Research topic or question

Optional article/text content

Add a button:

Research with AI

Display results in structured sections:

Summary

A clear explanation of the topic.

Key Insights

Important findings or ideas.

Recommendations

Practical recommendations based on the research.

Important Considerations

Potential limitations, uncertainties, or areas that require further verification.

Make the output editable.

Include:

Copy

Regenerate

Clear

AI PROMPT STRUCTURE

Use structured prompts for each AI feature.

The prompts should clearly define:

The user's request

The desired output format

The professional context

The selected tone where applicable

Important instructions for accuracy and clarity

Do not expose unnecessary technical prompt details to the user.

INTERACTION & UX

Make the application feel polished and interactive.

Include:

Loading indicators

Empty states

Helpful placeholder text

Form validation

Button hover states

Smooth transitions

Responsive layouts

Clear success feedback when content is copied

Friendly error messages

Do not make the interface complicated.

RESPONSIBLE AI DISCLAIMER

Add a visible but unobtrusive disclaimer:

AI-generated content may contain errors or inaccuracies. Always review and verify AI-generated information before using, sending, or sharing it.

Include this on the dashboard and/or relevant AI tool pages.

FRONTEND-ONLY BEHAVIOR

Because there is no backend, authentication, or database:

Do not create user accounts.

Do not store sensitive information.

Do not create a login flow.

Do not create a registration flow.

Do not require authentication to access any feature.

Keep temporary application state on the client side.

Clearly handle AI functionality in a way that does not require building a custom backend.

FINAL GOAL

The final application should look and feel like a real, polished AI productivity SaaS product, but remain simple, lightweight, frontend-only, and accessible immediately without login or registration.

Prioritize excellent UI/UX, responsive design, clear navigation, editable AI outputs, and professional presentation over unnecessary technical complexity.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/faefa24c-b4e0-4128-9067-e2b5b815add0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
