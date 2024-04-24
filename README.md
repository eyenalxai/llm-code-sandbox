# LLM Code Sandbox

This application integrates LLMs to simulate the execution of programming code and validate its syntax. 
It allows for the evaluation of code behavior and correctness without actual runtime.

## Features

- **AI Code Validation**: Quickly validate the syntactical and logical correctness of your code using advanced AI model.
- **Simulated Execution**: See how your code would execute without having to run it in a traditional environment.
- **Universal Language Support**: Handles all programming languages, real or imagined.
## Getting Started



### Installation

Clone this repository to your local machine and install the dependencies.

```bash
git clone https://github.com/eyenalxai/llm-code-sandbox.git
cd llm-code-sandbox
yarn
```

### Setting up Environment Variables

For local development, create a `.env.local` file at the root of your project and add your OpenAI API key:

```env
OPEN_AI_API_KEY=sk-1234abcd5678efgh91011ijk
```

### Available Scripts

In the project directory, the following commands are available:

**Local Development**:
- `yarn dev`: Runs the app in development mode.

**Production**:
- Ensure environment variables are properly set in your production environment.
- `yarn build`: Builds the app for production.
- `yarn start`: Runs the built app in production mode.

