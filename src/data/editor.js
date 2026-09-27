// Static content for the interactive code playground.

export const FILE_NAME = 'strike.js'

export const WELCOME_CODE = `// Strike Platform - Welcome Code
const welcome = async () => {
    const user = await getUser();
    console.log(\`Welcome \${user.name}!\`);
    console.log(\`Level: \${user.level}\`);
    return { status: "success" };
};

const getUser = async () => ({
    name: "Guest User",
    level: "Beginner"
});

welcome();`

// Lines printed to the terminal when "Run Code" executes the welcome program.
export const RUN_OUTPUT = [
  { type: 'cmd', text: '$ node strike.js' },
  { type: 'log', text: 'Welcome Guest User!' },
  { type: 'log', text: 'Level: Beginner' },
  { type: 'ok', text: '→ { status: "success" }' },
  { type: 'muted', text: 'Process exited with code 0' },
]

// AI Assistant → Quick Suggestions
export const SUGGESTIONS = [
  { t: 'Refactor welcome()', d: 'Extract user fetch and logging into separate utils for better testability.' },
  { t: 'Add input validation', d: 'Validate user.level against enum: Beginner | Advanced | Expert.' },
  { t: 'Improve typing', d: 'Define a User type and return type for getUser and welcome.' },
  { t: 'Implement error handling', d: 'Add try-catch blocks and custom errors for async operations.' },
  { t: 'Add loading states', d: 'Show skeleton loaders while fetching user data for better UX.' },
  { t: 'Optimize re-renders', d: 'Wrap components with React.memo and useMemo for heavy work.' },
]

// AI Assistant → Thoughts
export const THOUGHTS = [
  'Consider debouncing the typing effect to save renders.',
  'Memoize the highlighter with code length as the cache key.',
  'Precompile regex patterns outside the component body.',
]

// Bug Shots tab — real, inspectable diagnostics content
export const BUG_SHOTS = [
  {
    level: 'warning',
    line: 4,
    title: 'Unhandled promise rejection',
    detail: 'getUser() may reject; welcome() has no try/catch. Wrap the await in error handling.',
  },
  {
    level: 'info',
    line: 6,
    title: 'Implicit any on return',
    detail: 'Return object { status } is untyped. Add an explicit WelcomeResult type.',
  },
  {
    level: 'hint',
    line: 3,
    title: 'Prefer template literal',
    detail: 'String concatenation elsewhere can reuse the `${}` template style used here.',
  },
]
