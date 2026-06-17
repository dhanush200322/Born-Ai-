# Frontend Design OS

Enterprise Frontend Starter Repository for AI SaaS, Dashboards, CRM, ERP, Internal Tools, AI Agents, and Modern Web Applications.

---

# Purpose

This repository serves as a reusable Frontend Design Operating System.

The goal is to provide a consistent, enterprise-grade frontend foundation that can be reused across multiple projects without rebuilding architecture, design systems, or UI patterns from scratch.

Before implementing any feature, AI agents must:

1. Analyze the repository structure.
2. Analyze installed packages.
3. Analyze existing components.
4. Analyze documentation.
5. Analyze project requirements.
6. Generate architecture.
7. Generate implementation plan.
8. Begin development.

Never generate code before completing the analysis phase.

---

# Tech Stack

## Core

* Next.js
* React 19
* TypeScript
* Tailwind CSS v4

## UI & Design

* shadcn/ui
* Framer Motion
* Lucide React
* tw-animate-css

## State Management

* Zustand

## Forms

* React Hook Form
* Zod

## Data & Tables

* TanStack Table
* TanStack Query

## Charts & Analytics

* Recharts

## Notifications

* Sonner

## Commands

* CMDK

## Uploads

* React Dropzone

## AI & Visualization

* React Flow
* Mermaid
* React Markdown

---

# Repository Structure

```txt
src/
├── app/
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── forms/
│   ├── landing/
│   └── ai/
├── features/
├── hooks/
├── store/
├── providers/
├── lib/
├── types/
├── constants/


# Repository Rules

AI Agents MUST:

* Reuse existing components before creating new components.
* Reuse existing hooks before creating new hooks.
* Reuse existing stores before creating new stores.
* Reuse existing layouts before creating new layouts.
* Follow folder structure strictly.
* Follow naming conventions.
* Avoid duplicate logic.
* Avoid duplicate UI components.
* Avoid unnecessary dependencies.
* Use only installed packages whenever possible.

Always extend existing architecture before introducing new patterns.

---

# AI Agent Workflow

Every AI Agent must follow this exact sequence.

---

## Phase 1 — Repository Analysis

Analyze:

* package.json
* tsconfig.json
* next.config.js
* components/
* features/
* hooks/
* store/
* providers/
* docs/

Understand:

* Installed packages
* Existing architecture
* Component patterns
* Design standards
* Existing utilities

Do NOT generate code.

---

## Phase 2 — Product Analysis

Analyze:

* Product requirements
* User goals
* User workflows
* Business requirements
* Pages
* Features
* Components

Create:

* Page architecture
* Component architecture
* State architecture
* Data flow architecture

Do NOT generate code.

---

## Phase 3 — UI Planning

Create:

* Layout plan
* Navigation plan
* Dashboard plan
* Responsive strategy
* Animation strategy
* Design hierarchy

Use only packages already installed in this repository.

Do NOT generate code.

---

## Phase 4 — Implementation Planning

Create:

* Component tree
* Folder structure
* State structure
* Route structure
* API integration plan

Do NOT generate code.

---

## Phase 5 — Development

Generate:

* Components
* Pages
* Layouts
* Forms
* Tables
* Charts
* Dashboards
* Workspaces

Follow repository standards.

---

# UI Standards

Every page must include:

* Responsive Design
* Dark Mode Support
* Loading States
* Empty States
* Error States
* Success States
* Accessibility Support

Every form must include:

* Validation
* Error Handling
* Success Feedback
* Loading State

Every table must include:

* Search
* Sorting
* Filtering
* Pagination
* Empty State

Every dashboard must include:

* Mobile Support
* Responsive Layout
* Skeleton Loading
* Analytics Components

---

# Design Principles

UI must follow:

* Vercel Quality
* Linear Quality
* Stripe Quality
* Notion Quality

Requirements:

* Modern SaaS Design
* Enterprise-grade UX
* Clean Visual Hierarchy
* Accessibility-first
* Mobile-first
* Performance-first

Never create generic UI.

Never sacrifice usability for animations.

Never sacrifice accessibility for aesthetics.

---

# Design Hierarchy

Priority Order:

1. Usability
2. Accessibility
3. Performance
4. Responsiveness
5. Visual Polish
6. Animations

Focus on solving user problems before visual enhancements.

---

# Animation Guidelines

Use animations to improve clarity, not decoration.

Preferred animations:

* Page transitions
* Fade-ins
* Staggered reveals
* Hover interactions
* Loading animations

Avoid:

* Excessive motion
* Distracting effects
* Performance-heavy animations

---

# Required AI Workflow

Before writing code:

Step 1:
Analyze repository.

Step 2:
Analyze installed packages.

Step 3:
Analyze project requirements.

Step 4:
Generate architecture.

Step 5:
Generate component tree.

Step 6:
Generate page structure.

Step 7:
Generate implementation plan.

Step 8:
Start coding.

Never skip analysis.

Never start coding immediately.

---

# Prompt Template

Use this before every project:

```txt
Read the repository first.

Analyze:
- package.json
- folder structure
- documentation
- design system
- installed packages

Understand available components and architecture.

Analyze product requirements.

Create:
- architecture plan
- page structure
- component structure
- state structure

Use only installed packages.

Follow repository standards.

Generate enterprise-grade UI.

Do not start coding until analysis is complete.
```

---

# Goal

One Repository.

Unlimited Projects.

Consistent UI Quality.

Enterprise-grade Architecture.

AI-first Development Workflow.

Build Faster.

Launch Faster.

Scale Faster.
