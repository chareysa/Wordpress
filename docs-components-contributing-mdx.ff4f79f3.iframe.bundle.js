"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[4520],{"./node_modules/@mdx-js/react/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{NF:()=>withMDXComponents,Zo:()=>MDXProvider,ah:()=>useMDXComponents,pC:()=>MDXContext});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const MDXContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext({});function withMDXComponents(Component){return function boundMDXComponent(props){const allComponents=useMDXComponents(props.components);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component,{...props,allComponents})}}function useMDXComponents(components){const contextComponents=react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext);return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>"function"==typeof components?components(contextComponents):{...contextComponents,...components}),[contextComponents,components])}const emptyObject={};function MDXProvider({components,children,disableParentContext}){let allComponents;return allComponents=disableParentContext?"function"==typeof components?components({}):components||emptyObject:useMDXComponents(components),react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXContext.Provider,{value:allComponents},children)}},"./storybook/stories/docs/components/contributing.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>contributing});__webpack_require__("./node_modules/react/index.js");var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),lib=__webpack_require__("./node_modules/@mdx-js/react/lib/index.js"),dist=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs");const CONTRIBUTINGraw_namespaceObject="# Contributing\n\nThank you for taking the time to contribute.\n\nThe following is a set of guidelines for contributing to the `@wordpress/components` package to be considered in addition to the general ones described in our [Contributing Policy](/CONTRIBUTING.md).\n\nThis set of guidelines should apply especially to newly introduced components. In fact, while these guidelines should also be retroactively applied to existing components, it is sometimes impossible to do so for legacy/compatibility reasons.\n\n-   [Introducing new components](#introducing-new-components)\n-   [Compatibility](#compatibility)\n-   [Compound components](#compound-components)\n-   [Components & Hooks](#components--hooks)\n-   [Naming Conventions](#naming-conventions)\n-   [TypeScript](#typescript)\n-   [Styling](#styling)\n-   [Context system](#context-system)\n-   [Unit tests](#unit-tests)\n-   [Storybook](#storybook)\n-   [Documentation](#documentation)\n-   [README example](#README-example)\n-   [Folder structure](#folder-structure)\n-   [Component versioning](#component-versioning)\n\n## Introducing new components\n\n### Does it belong in the component library?\n\nA component library should include components that are generic and flexible enough to work across a variety of products. It should include what’s shared across many products and omit what’s not.\n\nTo determine if a component should be added, ask yourself:\n\n-   Could this component be used by other products/plugins?\n-   Does the new component overlap (in functionality or visual design) with any existing components?\n-   How much effort will be required to make and maintain?\n-   Is there a clear purpose for the component?\n\nHere’s a flowchart that can help determine if a new component is necessary:\n\n[![New component flowchart](https://wordpress.org/gutenberg/files/2019/07/New_component_flowchart.png)](https://coggle.it/diagram/WtUSrld3uAYZHsn-/t/new-ui-component/992b38cbe685d897b4aec6d0dd93cc4b47c06e0d4484eeb0d7d9a47fb2c48d94)\n\n### First steps\n\nIf you have a component you'd like added or changed, start by opening a GitHub issue. Include a detailed description in which you:\n\n-   Explain the rationale\n-   Detail the intended behavior\n-   Clarify whether it’s a variation of an existing component, or a new asset\n-   Include mockups of any fidelity (optional)\n-   Include any inspirations from other products (optional)\n\nThis issue will be used to discuss the proposed changes and track progress. Reviewers start by discussing the proposal to determine if it's appropriate for WordPress Components, or if there's overlap with an existing component.\n\nIt’s encouraged to surface works-in-progress. If you’re not able to complete all of the parts yourself, someone in the community may be able to pick up where you left off.\n\n### Next steps\n\nOnce the team has discussed and approved the change, it's time to start implementing it.\n\n1. **Provide a rationale**: Explain how your component will add value to the system and the greater product ecosystem. Be sure to include any user experience and interaction descriptions.\n2. **Draft documentation**: New components need development, design, and accessibility guidelines. Additionally, if your change adds additional behavior or expands a component’s features, those changes will need to be fully documented as well. Read through existing component documentation for examples. Start with a rough draft, and reviewers will help polish documentation.\n3. **Provide working code**: The component or enhancement must be built in React. See the [developer contribution guidelines](https://github.com/WordPress/gutenberg/blob/HEAD/docs/contributors/code/README.md).\n4. **Create a design spec**: Create sizing and styling annotations for all aspects of the component. This spec should provide a developer with everything they need to create the design in code. [Figma automatically does this for you](https://help.figma.com/article/32-developer-handoff).\n\nRemember, it’s unlikely that all parts will be done by one person. Contribute where you can, and others will help.\n\n### Component refinement\n\nBefore a component is published it will need to be fine-tuned:\n\n1. **Expand** the features of the component to a minimum. Agree on what features should be included.\n2. **Reduce** scope and leave off features lacking consensus.\n3. **Quality assurance**: each contribution must adhere to system standards.\n\n#### Quality assurance\n\nTo ensure quality, each component should be tested. The testing process should be done during the development of the component and before the component is published.\n\n-   **Accessibility**: Has the design and implementation accounted for accessibility? Please use the [WordPress accessibility guidelines](https://make.wordpress.org/accessibility/handbook/best-practices/). You must use the \"Needs Accessibility Feedback\" label and get a review from the accessibility team. It's best to request a review early (at the documentation stage) in order to ensure the component is designed inclusively from the outset.\n-   **Visual quality**: Does the component apply visual style — color, typography, icons, space, borders, and more — using appropriate variables, and does it follow [visual guidelines](https://make.wordpress.org/design/handbook/design-guide/)? You must use the \"Needs Design Feedback\" label and get a review from the design team.\n-   **Documentation**: Ensure that the component has proper documentation for development, design, and accessibility.\n-   **Sufficient states & variations**: Does it cover all the necessary variations (primary, secondary, dense, etc.) and states (default, hover, active, disabled, loading, etc.), within the intended scope?\n-   **Functionality**: Do all behaviors function as expected?\n-   **Responsiveness**: Does it incorporate responsive behaviors as needed? Is the component designed from a mobile-first perspective? Do all touch interactions work as expected?\n-   **Content resilience**: Is each dynamic word or image element resilient to too much, too little, and no content at all, respectively? How long can labels be, and what happens when you run out of space?\n-   **Composability**: Does it fit well when placed next to or layered with other components to form a larger composition?\n-   **Browser support**: Has the component visual quality and accuracy been checked across Safari, Chrome, Firefox, IE, etc? Please adhere to our [browser support requirements](https://github.com/WordPress/gutenberg/blob/HEAD/packages/browserslist-config/index.js).\n\n## Compatibility\n\nThe `@wordpress/components` package includes components that are relied upon by many developers across different projects. It is, therefore, very important to avoid introducing breaking changes.\n\nIn these situations, one possible approach is to \"soft-deprecate\" a given legacy API. This is achieved by:\n\n1. Removing traces of the API from the docs, while still supporting it in code.\n2. Updating all places in Gutenberg that use that API.\n3. Adding deprecation warnings (only after the previous point is completed, otherwise the Browser Console will be polluted by all those warnings and some e2e tests may fail).\n\nWhen adding new components or new props to existing components, it's recommended to create a [private version](/packages/private-apis/README.md)) of the component until the changes are stable enough to be exposed as part of the public API.\n\n### Learn more\n\n-   [How to preserve backward compatibility for a React Component](/docs/contributors/code/backward-compatibility.md#how-to-preserve-backward-compatibility-for-a-react-component)\n-   [Experimental and Unstable APIs](/docs/contributors/code/coding-guidelines.md#legacy-experimental-apis-plugin-only-apis-and-private-apis)\n-   [Deprecating styles](#deprecating-styles)\n\n\x3c!-- ## Polymorphic Components (i.e. the `as` prop)\n\nThe primary way to compose components is through the `as` prop. This prop can be used to change the underlying element used to render a component, e.g.:\n\n```tsx\nfunction LinkButton( { href, children } ) {\n\treturn <Button variant=\"primary\" as=\"a\" href={href}>{ children }</Button>;\n}\n```\n--\x3e\n\n## Compound components\n\nWhen creating components that render a list of subcomponents, prefer to expose the API using the [Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks) technique over array props like `items` or `options`:\n\n```jsx\n// ❌ Don't:\n<List\n\titems={ [ { value: 'Item 1' }, { value: 'Item 2' }, { value: 'Item 3' } ] }\n/>\n```\n\n```jsx\n// ✅ Do:\n<List>\n\t<List.Item value=\"Item 1\" />\n\t<List.Item value=\"Item 2\" />\n\t<List.Item value=\"Item 3\" />\n</List>\n```\n\nWhen implementing this pattern, avoid using `React.Children.map` and `React.cloneElement` to map through the children and augment them. Instead, use React Context to provide state to subcomponents and connect them:\n\n```jsx\n// ❌ Don't:\nfunction List ( props ) {\n\tconst [ state, setState ] = useState();\n\treturn (\n\t\t<div { ...props }>\n\t\t\t{ Children.map( props.children, ( child ) => cloneElement( child, { state } ) ) ) }\n\t\t</div>\n\t);\n}\n```\n\n```jsx\n// ✅ Do:\nconst ListContext = createContext();\n\nfunction List( props ) {\n\tconst [ state, setState ] = useState();\n\treturn (\n\t\t<ListContext.Provider value={ state }>\n\t\t\t<div { ...props } />\n\t\t</ListContext.Provider>\n\t);\n}\n\nfunction ListItem( props ) {\n\tconst state = useContext( ListContext );\n\t...\n}\n```\n\n\x3c!-- ## (Semi-)Controlled components\n\nTBD\n\n## Layout \"responsibilities\"\n\nTBD — Components' layout responsibilities and boundaries (i.e., a component should only affect the layout of its children, not its own) --\x3e\n\n## Components & Hooks\n\nOne way to enable reusability and composition is to extract a component's underlying logic into a hook (living in a separate `hook.ts` file). The actual component (usually defined in a `component.tsx` file) can then invoke the hook and use its output to render the required DOM elements. For example:\n\n```tsx\n// in `hook.ts`\nfunction useExampleComponent(\n\tprops: PolymorphicComponentProps< ExampleProps, 'div' >\n) {\n\t// Merge received props with the context system.\n\tconst { isVisible, className, ...otherProps } = useContextSystem(\n\t\tprops,\n\t\t'Example'\n\t);\n\n\t// Any other reusable rendering logic (e.g. computing className, state, event listeners...)\n\tconst cx = useCx();\n\tconst classes = useMemo(\n\t\t() => cx( styles.example, isVisible && styles.visible, className ),\n\t\t[ className, isVisible ]\n\t);\n\n\treturn {\n\t\t...otherProps,\n\t\tclassName: classes,\n\t};\n}\n\n// in `component.tsx`\nfunction Example(\n\tprops: PolymorphicComponentProps< ExampleProps, 'div' >,\n\tforwardedRef: React.ForwardedRef< any >\n) {\n\tconst exampleProps = useExampleComponent( props );\n\n\treturn <View { ...spacerProps } ref={ forwardedRef } />;\n}\n```\n\nA couple of good examples of how hooks are used for composition are:\n\n-   the `Card` component, which builds on top of the `Surface` component by [calling the `useSurface` hook inside its own hook](/packages/components/src/card/card/hook.ts);\n-   the `HStack` component, which builds on top of the `Flex` component and [calls the `useFlex` hook inside its own hook](/packages/components/src/h-stack/hook.tsx).\n\n\x3c!-- ## API Consinstency\n\n[To be expanded] E.g.:\n\n- Boolean component props should be prefixed with `is*` (e.g. `isChecked`), `has*` (e.g. `hasValue`) or `enable*` (e.g. `enableScroll`)\n- Event callback props should be prefixed with `on*` (e.g. `onChanged`)\n- Subcomponents naming conventions (e.g `CardBody` instead of `Card.Body`)\n- ...\n\n## Performance\n\nTDB --\x3e\n\n## Naming Conventions\n\nIt is recommended that compound components use dot notation to separate the namespace from the individual component names. The top-level compound component should be called the namespace (no dot notation).\n\nDedicated React context should also use dot notation, while hooks should not.\n\nWhen exporting compound components and preparing them to be consumed, it is important that:\n\n-   the JSDocs appear correctly in IntelliSense;\n-   the top-level component's JSDoc appears in the Storybook docs page;\n-   the top-level and subcomponent's prop types appear correctly in the Storybook props table.\n\nTo meet the above requirements, we recommend:\n\n-   using `Object.assign()` to add subcomponents as properties of the top-level component;\n-   using named functions for all components;\n-   using a separate file for each component, context and hook;\n-   setting explicitly the `displayName` on all subcomponents;\n-   adding the top-level JSDoc to the result of the `Object.assign` call;\n-   adding inline subcomponent JSDocs inside the `Object.assign` call.\n\nThe following example implements all of the above recommendations.\n\n```tsx\n//=======================\n// subcomponent.tsx\n//=======================\nimport { forwardRef } from '@wordpress/element';\n\nexport const ComponentSubcomponent = forwardRef(\n\tfunction UnforwardedComponentSubcomponent( props, ref ) {\n\t\t/* ... */\n\t}\n);\n\n//=======================\n// context.ts\n//=======================\nimport { createContext } from '@wordpress/element';\n\nexport const ComponentContext = createContext();\n\n//=======================\n// hook.ts\n//=======================\n\n/** The hook's JSDoc. */\nexport function useComponent() {\n\t/* ... */\n}\n\n//=======================\n// component.tsx\n//=======================\nimport { forwardRef } from '@wordpress/element';\nimport { ComponentSubcomponent } from './subcomponent';\nimport { ComponentContext } from './context';\n\n/** The top-level component's JSDoc. */\nexport const Component = Object.assign(\n\tforwardRef( function UnforwardedTopLevelComponent( props, ref ) {\n\t\t/* ... */\n\t} ),\n\t{\n\t\t/** The subcomponent's JSDoc. */\n\t\tSubcomponent: Object.assign(ComponentSubcomponent, {\n\t\t\tdisplayName: 'Component.SubComponent';,\n\t\t}),\n\t\t/** The context's JSDoc. */\n\t\tContext: Object.assign(ComponentContext, {\n\t\t\tdisplayName: 'Component.Context'\n\t\t}),\n\t}\n);\n\nexport default Component;\n\n//=======================\n// App.tsx\n//=======================\nimport { Component, useComponent } from '@wordpress/components';\nimport { useContext } from '@wordpress/element';\n\nfunction CompoundComponentExample() {\n\treturn (\n\t\t<Component>\n\t\t\t<Component.SubComponent />\n\t\t</Component>\n\t);\n}\n\nfunction ContextProviderExample() {\n\treturn (\n\t\t<Component.Context.Provider value={ /* ... */ }>\n\t\t\t{ /* React tree */ }\n\t\t</Component.Context.Provider>\n\t);\n}\n\nfunction ContextConsumerExample() {\n\tconst componentContext = useContext( Component.Context );\n\n\t// etc\n}\n\nfunction HookExample() {\n\tconst hookReturnValue = useComponent();\n\n\t// etc.\n}\n```\n\n## TypeScript\n\nWe strongly encourage using TypeScript for all new components.\n\nExtend existing components’ props if possible, especially when a component internally forwards its props to another component in the package:\n\n```ts\ntype NumberControlProps = Omit<\n\tInputControlProps,\n\t'isDragEnabled' | 'min' | 'max'\n> & {\n\t/* Additional props specific to NumberControl */\n};\n```\n\nUse JSDocs syntax for each TypeScript property that is part of the public API of a component. The docs used here should be aligned with the component’s README. Add `@default` values where appropriate:\n\n```ts\n/**\n * Renders with elevation styles (box shadow).\n *\n * @default false\n * @deprecated\n */\nisElevated?: boolean;\n```\n\nPrefer `unknown` to `any`, and in general avoid it when possible.\n\nIf the component forwards its `...restProps` to an underlying element/component, you should use the `WordPressComponentProps` type for the component's props:\n\n```ts\nimport type { WordPressComponentProps } from '../context';\nimport type { ComponentOwnProps } from './types';\n\nfunction UnconnectedMyComponent(\n\t// The resulting type will include:\n\t// - all props defined in `ComponentOwnProps`\n\t// - all HTML props/attributes from the component specified as the second\n\t//   parameter (`div` in this example)\n\t// - the special `as` prop (which marks the component as polymorphic),\n\t//   unless the third parameter is `false`\n\tprops: WordPressComponentProps< ComponentOwnProps, 'div', true >\n) {\n\t/* ... */\n}\n```\n\n### Considerations for the docgen\n\nMake sure you have a **named** export for the component, not just the default export ([example](https://github.com/WordPress/gutenberg/blob/trunk/packages/components/src/divider/component.tsx)). This ensures that the docgen can properly extract the types data. The naming should be so that the connected/forwarded component has the plain component name (`MyComponent`), and the raw component is prefixed (`UnconnectedMyComponent` or `UnforwardedMyComponent`). This makes the component's `displayName` look nicer in React devtools and in the autogenerated Storybook code snippets.\n\n```js\nfunction UnconnectedMyComponent() {\n\t/* ... */\n}\n\n// 👇 Without this named export, the docgen will not work!\nexport const MyComponent = contextConnect(\n\tUnconnectedMyComponent,\n\t'MyComponent'\n);\nexport default MyComponent;\n```\n\nOn the component's main named export, add a JSDoc comment that includes the main description and the example code snippet from the README ([example](https://github.com/WordPress/gutenberg/blob/43d9c82922619c1d1ff6b454f86f75c3157d3de6/packages/components/src/date-time/date-time/index.tsx#L193-L217)). _At the time of writing, the `@example` JSDoc keyword is not recognized by StoryBook's docgen, so please avoid using it_.\n\n\x3c!-- TODO: add to the previous paragraph once the composision section gets added to this document.\n(more details about polymorphism can be found above in the \"Components composition\" section). --\x3e\n\n## Styling\n\nAll new component should be styled using [Emotion](https://emotion.sh/docs/introduction).\n\nNote: Instead of using Emotion's standard `cx` function, the custom [`useCx` hook](/packages/components/src/utils/hooks/use-cx.ts) should be used instead.\n\n### Deprecating styles\n\nChanging the styles of a non-experimental component must be done with care. To prevent serious breakage in third-party usage, in some cases we may want a grace period before fully removing the old styles. This can be done by temporarily placing the new styles behind a feature flag prop prefixed by `__next`, accompanied by a `deprecate()` warning in the console. The feature flag should be opt-in (false by default), and have a reasonably descriptive name (**not** `__nextHasNewStyles`). A descriptive name allows for multiple deprecations to proceed in parallel, separated by concerns or by deprecation version.\n\n```jsx\n// component.tsx\nimport deprecated from '@wordpress/deprecated';\nimport { Wrapper } from './styles.ts';\n\nfunction MyComponent( { __nextHasNoOuterMargins = false } ) {\n\tif ( ! __nextHasNoOuterMargins ) {\n\t\tdeprecated( 'Outer margin styles for wp.components.MyComponent', {\n\t\t\tsince: '6.0',\n\t\t\tversion: '6.2', // Set a reasonable grace period depending on impact\n\t\t\thint: 'Set the `__nextHasNoOuterMargins` prop to true to start opting into the new styles, which will become the default in a future version.',\n\t\t} );\n\t}\n\treturn <Wrapper __nextHasNoOuterMargins={ __nextHasNoOuterMargins } />;\n}\n```\n\nStyles should be structured so the deprecated styles are cleanly encapsulated, and can be easily removed when the deprecation version arrives.\n\n```js\n// styles.ts\nconst deprecatedMargins = ( { __nextHasNoOuterMargins } ) => {\n\tif ( ! __nextHasNoOuterMargins ) {\n\t\treturn css`\n\t\t\tmargin: 8px;\n\t\t`;\n\t}\n};\n\nexport const Wrapper = styled.div`\n\tmargin: 0;\n\n\t${ deprecatedMargins }\n`;\n```\n\nOnce deprecated, code examples in docs/stories should include the opt-in prop set to `true` so that new consumers are encouraged to adopt it from the start.\n\nRemember to [add a **Needs Dev Note** label](/docs/contributors/code/backward-compatibility.md##dev-notes) to the pull request so third-party developers can be informed of the deprecation.\n\nWhen the grace period is over and the deprecation version arrives, the `__next*` prop, deprecation notice, and deprecated styles should all be completely removed from the codebase.\n\n#### Criteria for putting styles changes behind a feature flag\n\nNot all style changes justify a formal deprecation process. The main thing to look for is whether the changes could cause layouts to break in an obvious or harmful way, given that the component is being used in a standard fashion.\n\n##### DOES need formal deprecation\n\n-   Removing an outer margin.\n-   Substantial changes to width/height, such as adding or removing a size restriction.\n\n##### DOES NOT need formal deprecation\n\n-   Breakage only occurs in non-standard usage, such as when the consumer is overriding component internals.\n-   Minor layout shifts of a few pixels.\n-   Internal layout changes of a higher-level component.\n\n## Context system\n\nThe `@wordpress/components` context system is based on [React's `Context` API](https://react.dev/reference/react/createContext), and is a way for components to adapt to the \"context\" they're being rendered in.\n\nComponents can use this system via a couple of functions:\n\n-   they can provide values using a shared `ContextSystemProvider` component\n-   they can connect to the Context via `contextConnect`\n-   they can read the \"computed\" values from the context via `useContextSystem`\n\nAn example of how this is used can be found in the [`Card` component family](/packages/components/src/card). For example, this is how the `Card` component injects the `size` and `isBorderless` props down to its `CardBody` subcomponent — which makes it use the correct spacing and border settings \"auto-magically\".\n\n```jsx\n//=========================================================================\n// Simplified snippet from `packages/components/src/card/card/hook.ts`\n//=========================================================================\nimport { useContextSystem } from '../../context';\n\nexport function useCard( props ) {\n\t// Read any derived registered prop from the Context System in the `Card` namespace\n\tconst derivedProps = useContextSystem( props, 'Card' );\n\n\t// [...]\n\n\treturn computedHookProps;\n}\n\n//=========================================================================\n// Simplified snippet from `packages/components/src/card/card/component.ts`\n//=========================================================================\nimport { contextConnect, ContextSystemProvider } from '../../context';\n\nfunction Card( props, forwardedRef ) {\n\tconst { size, isBorderless, ...otherComputedHookProps } = useCard( props );\n\n\t// [...]\n\n\t// Prepare the additional props that should be passed to subcomponents via the Context System.\n\tconst contextProviderValue = useMemo( () => {\n\t\treturn {\n\t\t\t// Each key in this object should match a component's registered namespace.\n\t\t\tCardBody: {\n\t\t\t\tsize,\n\t\t\t\tisBorderless,\n\t\t\t},\n\t\t};\n\t}, [ isBorderless, size ] );\n\n\treturn (\n\t\t/* Write additional values to the Context System */\n\t\t<ContextSystemProvider value={ contextProviderValue }>\n\t\t\t{ /* [...] */ }\n\t\t</ContextSystemProvider>\n\t);\n}\n\n// Connect to the Context System under the `Card` namespace\nconst ConnectedCard = contextConnect( Card, 'Card' );\nexport default ConnectedCard;\n\n//=========================================================================\n// Simplified snippet from `packages/components/src/card/card-body/hook.ts`\n//=========================================================================\nimport { useContextSystem } from '../../context';\n\nexport function useCardBody( props ) {\n\t// Read any derived registered prop from the Context System in the `CardBody` namespace.\n\t// If a `CardBody` component is rendered as a child of a `Card` component, the value of\n\t// the `size` prop will be the one set by the parent `Card` component via the Context\n\t// System (unless the prop gets explicitely set on the `CardBody` component).\n\tconst { size = 'medium', ...otherDerivedProps } = useContextSystem(\n\t\tprops,\n\t\t'CardBody'\n\t);\n\n\t// [...]\n\n\treturn computedHookProps;\n}\n```\n\n## Unit tests\n\nPlease refer to the [JavaScript Testing Overview docs](/docs/contributors/code/testing-overview.md#snapshot-testing).\n\n## Storybook\n\nAll new components should add stories to the project's [Storybook](https://storybook.js.org/). Each [story](https://storybook.js.org/docs/react/get-started/whats-a-story) captures the rendered state of a UI component in isolation. This greatly simplifies working on a given component, while also serving as an interactive form of documentation.\n\nA component's story should be showcasing its different states — for example, the different variants of a `Button`:\n\n```jsx\nimport Button from '../';\n\nexport default { title: 'Components/Button', component: Button };\n\nconst Template = ( args ) => <Button { ...args } />;\n\nexport const Default = Template.bind( {} );\nDefault.args = {\n\ttext: 'Default Button',\n\tisBusy: false,\n\tisSmall: false,\n};\n\nexport const Primary = Template.bind( {} );\nPrimary.args = {\n\t...Default.args,\n\ttext: 'Primary Button',\n\tvariant: 'primary',\n};\n```\n\nA great tool to use when writing stories is the [Storybook Controls addon](https://storybook.js.org/addons/@storybook/addon-controls). Ideally props should be exposed by using this addon, which provides a graphical UI to interact dynamically with the component without needing to write code. Historically, we used [Knobs](https://storybook.js.org/addons/@storybook/addon-knobs), but it was deprecated and later removed in [#47152](https://github.com/WordPress/gutenberg/pull/47152).\n\nThe default value of each control should coincide with the default value of the props (i.e. it should be `undefined` if a prop is not required). A story should, therefore, also explicitly show how values from the Context System are applied to (sub)components. A good example of how this may look like is the [`Card` story](https://wordpress.github.io/gutenberg/?path=/story/components-card--default) (code [here](/packages/components/src/card/stories/index.tsx)).\n\nStorybook can be started on a local machine by running `npm run storybook:dev`. Alternatively, the components' catalogue (up to date with the latest code on `trunk`) can be found at [wordpress.github.io/gutenberg/](https://wordpress.github.io/gutenberg/).\n\n## Documentation\n\nAll components, in addition to being typed, should be using JSDoc when necessary — as explained in the [Coding Guidelines](/docs/contributors/code/coding-guidelines.md#javascript-documentation-using-jsdoc).\n\nEach component that is exported from the `@wordpress/components` package should include a `README.md` file, explaining how to use the component, showing examples, and documenting all the props.\n\n## README example\n\n````markdown\n# `ComponentName`\n\n\x3c!-- If component is experimental, add the following section: --\x3e\n<div class=\"callout callout-alert\">\nThis feature is still experimental. “Experimental” means this is an early implementation subject to drastic and breaking changes.\n</div>\n\n\x3c!-- If component is deprecated, add the following section: --\x3e\n<div class=\"callout callout-alert\">\nThis component is deprecated. Please use `{other component}` from the `{other package}` package instead.\n</div>\n\nDescription of the component.\n\n## Usage\n\nCode example using correct markdown syntax and formatted using project's formatting rules. See [ItemGroup](/packages/components/src/item-group/item-group/README.md#usage) for a real-world example.\n\n```jsx\nimport { ExampleComponent } from '@wordpress/components';\n\nfunction Example() {\n\treturn (\n\t\t<ExampleComponent>\n\t\t\t<p>Code is poetry</p>\n\t\t</ExampleComponent>\n\t);\n}\n```\n\n## Props\n\nThe component accepts the following props:\n\n### `propName`: Typescript style type i.e `string`, `number`, `( nextValue: string ) => void`\n\nProp description. With a new line before and after the description and before and after type/required blocks.\n\n-   Required: Either `Yes` or `No`\n\x3c!-- If the prop has a default value, add the following line: --\x3e\n-   Default: [default value]\n\n### Inherited props\n\nAdd this section when there are props that are drilled down into an internal component. See [ClipboardButton](/packages/components/src/clipboard-button/README.md) for an example.\n\n\x3c!-- Only add the next section if the component relies on the [Context System](#context-system) --\x3e\n\n## Context\n\nSee examples for this section for the [ItemGroup](/packages/components/src/item-group/item-group/README.md#context) and [`Card`](/packages/components/src/card/card/README.md#context) components.\n````\n\n## Folder structure\n\nAs a result of the above guidelines, all new components (except for shared utilities) should _generally_ follow this folder structure:\n\n```text\ncomponent-name/\n├── stories\n│   └── index.js\n├── test\n│   └── index.js\n├── component.tsx\n├── context.ts\n├── hook.ts\n├── index.ts\n├── README.md\n├── styles.ts\n└── types.ts\n```\n\nIn case of a family of components (e.g. `Card` and `CardBody`, `CardFooter`, `CardHeader` ...), each component's implementation should live in a separate subfolder, while code common to the whole family of components (e.g types, utils, context...) should live in the family of components root folder:\n\n```text\ncomponent-family-name/\n├── sub-component-name/\n│   ├── index.ts\n│   ├── component.tsx\n│   ├── hook.ts\n│   ├── README.md\n│   └── styles.ts\n├── sub-component-name/\n│   ├── index.ts\n│   ├── component.tsx\n│   ├── hook.ts\n│   ├── README.md\n│   └── styles.ts\n├── stories\n│   └── index.js\n├── test\n│   └── index.js\n├── context.ts\n├── index.ts\n├── types.ts\n└── utils.ts\n```\n\n## Component versioning\n\nAs the needs of the package evolve with time, sometimes we may opt to fully rewrite an existing component — either to introduce substantial changes, support new features, or swap the implementation details.\n\n### Glossary\n\nHere is some terminology that will be used in the upcoming sections:\n\n-   \"Legacy\" component: the version(s) of the component that existsted on `trunk` before the rewrite;\n-   API surface: the component's public APIs. It includes the list of components (and subcomponents) exported from the package, their props, any associated React context. It does not include internal classnames and internal DOM structure of the components.\n\n### Approaches\n\nWe identified two approaches to the task.\n\n#### Swap the implementation, keep the same API surface\n\nOne possible approach is to keep the existing API surface and only swap the internal implementation of the component.\n\nThis is by far the simplest approach, since it doesn't involve making changes to the API surface.\n\nIf the existing API surface is not a good fit for the new implementation, or if it is not possible (or simply not desirable) to preserve backward compatibility with the existing implementation, there is another approach that can be used.\n\n#### Create a new component (or component family)\n\nThis second approach involves creating a new, separate version (ie. export) of the component. Having two separate exports will help to keep the package tree-shakeable, and it will make it easier to potentially deprecated and remove the legacy component.\n\nIf possible, the legacy version of the component should be rewritten so that it uses the same underlying implementation of the new version, with an extra API \"translation\" layer to adapt the legacy API surface to the new API surface, e.g:\n\n```\n// legacy-component/index.tsx\n\nfunction LegacyComponent( props ) {\n\tconst newProps = useTranslateLegacyPropsToNewProps( props );\n\n\treturn ( <NewComponentImplementation { ...newProps } /> );\n}\n\n// new-component/index.tsx\nfunction NewComponent( props ) {\n\treturn ( <NewComponentImplementation { ...props } /> );\n}\n\n// new-component/implementation.tsx\nfunction NewComponentImplementation( props ) {\n\t// implementation\n}\n\n```\n\nIn case that is not possible (eg. too difficult to reconciliate new and legacy implementations, or impossible to preserve backward compatibility), then the legacy implementation can stay as-is.\n\nIn any case, extra attention should be payed to legacy component families made of two or more subcomponents. It is possible, in fact, that the a legacy subcomponent is used as a parent / child of a subcomponent from the new version (this can happen, for example, when Gutenberg allows third party developers to inject React components via Slot/Fill). To avoid incompatibility issues and unexpected behavior, there should be some code in the components warning when the above scenario happens — or even better, aliasing to the correct version of the component.\n\n##### Naming\n\nWhen it comes to naming the newly added component, there are two options.\n\nIf there is a good reason for it, pick a new name for the component. For example, some legacy components have names that don't correspond to the corrent name of UI widget that they implement (for example, `TabPanel` should be called `Tabs`, and `Modal` should be called `Dialog`).\n\nAlternatively, version the component name. For example, the new version of `Component` could be called `ComponentV2`. This also applies for namespaced subcomponents (ie. `ComponentV2.SubComponent`).\n\n### Methodology\n\nRegardless of the chosen approach, we recommend adopting the following methodology:\n\n1. First, make sure that the legacy component is well covered by automated tests. Using those tests against the new implementation will serve as a great first layer to make sure that we don't break backward compatibility where necessary, and that we are otherwise aware of any differences in behavior;\n2. Create a new temporary folder, so that all the work can be done without affecting publicly exported APIs; make it explicit in the README, JSDocs and Storybook (by using badges) that the components are WIP and shouldn't be used outside of the components package;\n3. Once the first iteration of the new component(s) is complete, start testing it by exporting it via private APIs, and replacing usages of the legacy component across the Gutenberg repository. This process is great to gather more feedback, spot bugs and missing features;\n4. Once all usages are migrated, you can replace the legacy component with the new implementation, and delete the temporary folder and private exports. Don't forget to write a dev note when necessary.\n";function _createMdxContent(props){return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(dist.h_,{title:"Components/Contributing Guidelines"}),"\n",(0,jsx_runtime.jsx)(dist.UG,{children:CONTRIBUTINGraw_namespaceObject})]})}const contributing=function MDXContent(props={}){const{wrapper:MDXLayout}=Object.assign({},(0,lib.ah)(),props.components);return MDXLayout?(0,jsx_runtime.jsx)(MDXLayout,Object.assign({},props,{children:(0,jsx_runtime.jsx)(_createMdxContent,props)})):_createMdxContent()}}}]);