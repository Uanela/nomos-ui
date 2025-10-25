# Nomos UI

> **νόμος** (nomos) - Greek: law, order, principle

A multi-framework component library for building validated, accessible forms. Born from the principle that forms should enforce order and validation effortlessly, across any framework.

---

## 🏛️ Philosophy

**νόμος** (nomos) appears throughout the New Testament, referring to divine law and principles that bring order to chaos. In ancient Greek, it represented the fundamental rules that governed society and nature.

Just as law brings structure to society, Nomos UI brings structure to your forms - enforcing validation rules, maintaining data integrity, and ensuring accessibility across all modern frameworks.

> "For the law was given through Moses; grace and truth came through Jesus Christ." - John 1:17

Like the biblical concept of law working alongside grace, Nomos UI combines strict validation with graceful user experiences.

---

## 📦 Packages

| Package                               | Version | Description                        | Status         |
| ------------------------------------- | ------- | ---------------------------------- | -------------- |
| [@nomos-ui/react](./packages/react)   | `1.0.0` | React + React Hook Form components | ✅ Stable      |
| [@nomos-ui/vue](./packages/vue)       | `0.1.0` | Vue 3 components (coming soon)     | 🚧 Planned     |
| [@nomos-ui/svelte](./packages/svelte) | `0.1.0` | Svelte components (coming soon)    | 🚧 Planned     |
| [@nomos-ui/core](./packages/core)     | `1.0.0` | Shared utilities and validation    | ✅ Stable      |
| [@nomos-ui/styles](./packages/styles) | `1.0.0` | Shared themes and CSS              | 🚧 In Progress |

---

## 🚀 Quick Start

### React

```bash
npm install @nomos-ui/react react-hook-form
```

```jsx
import { useForm } from "react-hook-form";
import { Input, Button, Form } from "@nomos-ui/react";

function MyForm() {
    const form = useForm();

    return (
        <Form form={form} onSubmit={(data) => console.log(data)}>
            <Input
                name="email"
                label="Email"
                rules={{ required: "Email is required" }}
            />
            <Button type="submit">Submit</Button>
        </Form>
    );
}
```

[📚 React Documentation](./packages/react/README.md)

### Vue (Coming Soon)

```bash
npm install @nomos-ui/vue
```

```vue
<script setup>
import { NomosInput, NomosButton } from "@nomos-ui/vue";
</script>

<template>
    <form @submit="handleSubmit">
        <NomosInput name="email" label="Email" :rules="{ required: true }" />
        <NomosButton type="submit">Submit</NomosButton>
    </form>
</template>
```

### Svelte (Coming Soon)

```bash
npm install @nomos-ui/svelte
```

```svelte
<script>
  import { Input, Button } from '@nomos-ui/svelte';
</script>

<form on:submit={handleSubmit}>
  <Input name="email" label="Email" rules={{ required: true }} />
  <Button type="submit">Submit</Button>
</form>
```

---

## ✨ Features

- **🎯 Zero Boilerplate** - Components integrate seamlessly with form libraries
- **✅ Built-in Validation** - Error states handled automatically
- **♿ Accessible** - WCAG 2.1 AA compliant by default
- **🎨 Customizable** - Use with Tailwind, CSS-in-JS, or vanilla CSS
- **📘 Type Safe** - Full TypeScript support across all packages
- **🪶 Lightweight** - Tree-shakeable, optimized bundle sizes
- **🌍 Framework Agnostic** - Same API across React, Vue, Svelte

---

## 🏗️ Repository Structure

```
nomos-ui/
├── packages/
│   ├── react/              # @nomos-ui/react
│   │   ├── src/
│   │   ├── dist/
│   │   ├── package.json
│   │   └── README.md
│   ├── vue/                # @nomos-ui/vue (planned)
│   ├── svelte/             # @nomos-ui/svelte (planned)
│   ├── core/               # @nomos-ui/core
│   │   ├── src/
│   │   │   ├── validation/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── package.json
│   └── styles/             # @nomos-ui/styles
│       ├── themes/
│       └── package.json
├── apps/
│   ├── docs/               # Documentation site
│   └── playground/         # Component playground
├── .github/
│   └── workflows/          # CI/CD pipelines
├── package.json            # Root workspace config
├── turbo.json              # Turborepo config
└── README.md               # This file
```

---

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm 8+ (recommended) or npm/yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/nomos-ui.git
cd nomos-ui

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development
pnpm dev
```

### Working with Packages

```bash
# Work on React package
cd packages/react
pnpm dev

# Build specific package
pnpm --filter @nomos-ui/react build

# Run tests for specific package
pnpm --filter @nomos-ui/react test
```

---

## 🗺️ Roadmap

### Phase 1: Foundation (Current)

- [x] Monorepo setup with Turborepo
- [x] Core utilities and validation logic
- [x] React package with basic components
- [ ] Complete React component library
- [ ] Documentation site
- [ ] Storybook integration

### Phase 2: Expansion

- [ ] Vue 3 package
- [ ] Svelte package
- [ ] Advanced components (Autocomplete, MultiSelect, RichText)
- [ ] Theme system
- [ ] CSS-in-JS support

### Phase 3: Ecosystem

- [ ] Form builder/generator UI
- [ ] Headless components
- [ ] CLI for scaffolding
- [ ] Framework adapters
- [ ] Integration examples

### Phase 4: Enterprise

- [ ] Design system tokens
- [ ] Accessibility testing suite
- [ ] Performance monitoring
- [ ] i18n support
- [ ] Enterprise support packages

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Philosophy

1. **Order over Chaos** - Clean, predictable APIs
2. **Grace over Rigidity** - Flexible, forgiving UX
3. **Truth over Shortcuts** - Proper validation, no hacks
4. **Accessibility First** - Everyone deserves great forms
5. **Framework Equality** - No framework is second-class

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

---

## 📄 License

MIT © 2025 Nomos UI

Each package in this monorepo is licensed under the MIT License. See individual package LICENSE files for details.

---

## 🙏 Acknowledgments

**Inspired by:**

- The Greek concept of **νόμος** - bringing order through law
- The biblical principle of **law and grace** working together
- **Noah's Ark** (Arkos) - providing structure in the storm

**Built with:**

- [React Hook Form](https://react-hook-form.com/) - Performant form validation
- [Turborepo](https://turbo.build/) - High-performance monorepo build system
- [TypeScript](https://www.typescriptlang.org/) - Type safety across packages
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling

---

## 🔗 Links

- [Documentation](https://nomos-ui.dev) _(coming soon)_
- [Component Playground](https://play.nomos-ui.dev) _(coming soon)_
- [GitHub](https://github.com/yourusername/nomos-ui)
- [npm Organization](https://www.npmjs.com/org/nomos-ui)
- [Discord Community](https://discord.gg/nomos-ui) _(coming soon)_

---

## 💬 Support

- 📧 Email: support@nomos-ui.dev
- 💬 Discord: [Join our community](https://discord.gg/nomos-ui)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/nomos-ui/issues)
- 💡 Discussions: [GitHub Discussions](https://github.com/yourusername/nomos-ui/discussions)

---

**Made with ♥︎ by developers who believe in order, grace, and truth**

_"In the beginning was the Word, and the Word was with God, and the Word was God." - John 1:1_
