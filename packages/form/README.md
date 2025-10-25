# @nomos-ui/react

> **νόμος** (nomos) - Greek: law, order, principle

Beautiful, validated form components that integrate seamlessly with React Hook Form. Built on the principle that forms should enforce order and validation effortlessly.

## Installation

```bash
npm install @nomos-ui/react react-hook-form
# or
yarn add @nomos-ui/react react-hook-form
# or
pnpm add @nomos-ui/react react-hook-form
```

## Quick Start

```jsx
import { useForm } from "react-hook-form";
import { Input, Button, Form } from "@nomos-ui/react";

function LoginForm() {
    const form = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <Form form={form} onSubmit={onSubmit}>
            <Input
                name="email"
                label="Email"
                type="email"
                rules={{ required: "Email is required" }}
            />
            <Input
                name="password"
                label="Password"
                type="password"
                rules={{ required: "Password is required", minLength: 8 }}
            />
            <Button type="submit">Sign In</Button>
        </Form>
    );
}
```

## Why Nomos UI?

- **Zero Boilerplate** - Components auto-register with React Hook Form
- **Built-in Validation** - Error states handled automatically
- **Accessible** - WCAG 2.1 AA compliant
- **Customizable** - Style with Tailwind or your own CSS
- **Type Safe** - Full TypeScript support
- **Lightweight** - Tree-shakeable, minimal bundle size

## Components

### Form Components

- `<Input />` - Text, email, password, number inputs
- `<Textarea />` - Multi-line text input
- `<Select />` - Dropdown selection
- `<Checkbox />` - Single checkbox
- `<CheckboxGroup />` - Multiple checkboxes
- `<Radio />` - Radio button
- `<RadioGroup />` - Radio button group
- `<Switch />` - Toggle switch
- `<DatePicker />` - Date selection
- `<FileUpload />` - File input with drag & drop

### Layout & UI

- `<Form />` - Form wrapper with context
- `<Button />` - Submit and action buttons
- `<FieldGroup />` - Group related fields
- `<FormSection />` - Organize form into sections

## Examples

### Basic Input with Validation

```jsx
<Input
    name="username"
    label="Username"
    placeholder="Enter username"
    rules={{
        required: "Username is required",
        minLength: { value: 3, message: "Minimum 3 characters" },
        pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Alphanumeric only" },
    }}
    helperText="Choose a unique username"
/>
```

### Select with Options

```jsx
<Select
    name="country"
    label="Country"
    rules={{ required: "Please select a country" }}
    options={[
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "ca", label: "Canada" },
    ]}
/>
```

### Checkbox Group

```jsx
<CheckboxGroup
    name="interests"
    label="Interests"
    options={[
        { value: "sports", label: "Sports" },
        { value: "music", label: "Music" },
        { value: "reading", label: "Reading" },
    ]}
    rules={{ required: "Select at least one interest" }}
/>
```

### Custom Styling

```jsx
<Input
    name="email"
    label="Email"
    className="custom-input"
    labelClassName="custom-label"
    errorClassName="custom-error"
/>
```

### Controlled Components

```jsx
const { watch, setValue } = useForm();
const emailValue = watch("email");

<Input
    name="email"
    label="Email"
    onChange={(e) => {
        // Custom logic
        setValue("email", e.target.value.toLowerCase());
    }}
/>;
```

## API Reference

### Common Props

All form components share these props:

| Prop         | Type      | Description                      |
| ------------ | --------- | -------------------------------- |
| `name`       | `string`  | Field name (required)            |
| `label`      | `string`  | Field label                      |
| `rules`      | `object`  | React Hook Form validation rules |
| `helperText` | `string`  | Help text shown below field      |
| `disabled`   | `boolean` | Disable the field                |
| `className`  | `string`  | Custom CSS class                 |
| `...rest`    | `any`     | Native HTML attributes           |

### Input Props

| Prop           | Type     | Default  | Description                              |
| -------------- | -------- | -------- | ---------------------------------------- |
| `type`         | `string` | `'text'` | Input type (text, email, password, etc.) |
| `placeholder`  | `string` | -        | Placeholder text                         |
| `autoComplete` | `string` | -        | Browser autocomplete hint                |

### Button Props

| Prop        | Type                                                | Default     | Description          |
| ----------- | --------------------------------------------------- | ----------- | -------------------- |
| `variant`   | `'primary' \| 'secondary' \| 'outline' \| 'danger'` | `'primary'` | Button style variant |
| `size`      | `'sm' \| 'md' \| 'lg'`                              | `'md'`      | Button size          |
| `loading`   | `boolean`                                           | `false`     | Show loading spinner |
| `fullWidth` | `boolean`                                           | `false`     | Take full width      |

## Customization

### Theming

Override default styles with CSS variables:

```css
:root {
    --nomos-primary: #3b82f6;
    --nomos-error: #ef4444;
    --nomos-border: #d1d5db;
    --nomos-radius: 0.5rem;
}
```

### Tailwind Integration

Components use Tailwind classes by default. Extend with your own:

```jsx
<Input
    name="email"
    className="shadow-xl border-purple-500 focus:ring-purple-500"
/>
```

## TypeScript

Full type safety with TypeScript:

```tsx
import { useForm } from "react-hook-form";
import { Input, Button } from "@nomos-ui/react";

interface FormData {
    email: string;
    password: string;
}

function LoginForm() {
    const form = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log(data);
    };

    return (
        <Form form={form} onSubmit={onSubmit}>
            <Input<FormData> name="email" label="Email" />
            <Input<FormData> name="password" label="Password" type="password" />
            <Button type="submit">Sign In</Button>
        </Form>
    );
}
```

## Roadmap

- [ ] `@nomos-ui/vue` - Vue 3 components
- [ ] `@nomos-ui/svelte` - Svelte components
- [ ] Advanced components (Autocomplete, MultiSelect, RichText)
- [ ] Form builder/generator
- [ ] Headless components
- [ ] Theme presets

## Philosophy

**νόμος** (nomos) means "law" or "order" in Greek. In the New Testament, it often refers to divine law and principles. Just as law brings order to society, Nomos UI brings order to your forms - enforcing validation rules, maintaining structure, and ensuring data integrity.

> "For the law was given through Moses; grace and truth came through Jesus Christ." - John 1:17

We believe forms should be both functional and graceful, enforcing rules while remaining pleasant to use.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## License

MIT ©

## Credits

Built on top of [React Hook Form](https://react-hook-form.com/) - the most performant, flexible form library for React.

---

**Made with ♥︎ for developers who value order in chaos**
