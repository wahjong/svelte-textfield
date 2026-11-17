import 'svelte/elements';

declare module 'svelte/elements' {
    interface HTMLAttributes<T> {
        onedit?: (event: CustomEvent) => void;
        onenter?: (event: CustomEvent) => void;
        onkeydown2?: (event: CustomEvent) => void;
        onblurcontent?: (event: CustomEvent) => void;
        onfocuscontent?: (event: CustomEvent) => void;
    }
}

export {};
