<script module lang="ts">
export type AriaAutocomplete = 'none' | 'inline' | 'list' | 'both';
export type AriaExpanded = boolean | null | undefined;
export type AriaHaspopup = 'dialog' | 'menu' | 'grid' | 'listbox' | 'tree' | boolean | null | undefined;
</script>

<script lang="ts">
import { onMount } from 'svelte';
import { contenteditable } from './actions/contenteditable';
import { html_entity_encode } from './actions/htmlentities';

type Props = {
    ariaActivedescendant?: string;
    ariaAutocomplete?: AriaAutocomplete;
    ariaControls?: string;
    ariaExpanded?: AriaExpanded;
    ariaHaspopup?: AriaHaspopup;
    ariaLabel?: string;

    content?: string;
    cssclass?: string;
    describedby?: string;
    focused: boolean;
    id?: string;
    labelledby?: string;
    length?: string;
    placeholder?: string;
    propagate: boolean;
    role?: 'textbox';
    type: 'lines' | 'line';

    onBlur: (content: string, event: FocusEvent) => void;
    onEdit: (content: string, event: KeyboardEvent) => void;
    onEnter: (content: string, event: KeyboardEvent) => void;
    onFocus: (content: string, event: FocusEvent) => void;
}

let {
    ariaActivedescendant,
    ariaAutocomplete = 'none',
    ariaControls,
    ariaExpanded,
    ariaHaspopup,
    ariaLabel,

    content = '',
    cssclass,
    describedby,
    focused = $bindable(false),
    id,
    labelledby,
    length,
    placeholder,
    propagate = false,
    role = 'textbox',
    type = 'line',

    onEdit,
    onEnter,
    onBlur,
    onFocus,

}: Props = $props();

let editor = $state<HTMLSpanElement>();
let label = $state<HTMLLabelElement | null>(null);
let isempty = $state<boolean>();

export function focus() {
    //console.log('%cContentEdit.focus -> editor.focus()', 'background-color:green');
    if (editor)
        editor.focus();
}

onMount(async () => {
    // console.log('%cContentEdit3.onMount', 'background-color:green', title);
    label = document.querySelector(`label[for="${id}"]`);
    // console.log(`%clabel[for=${id}]`, 'background-color:brown', label);
    if (label) {
        label.addEventListener('click', clickLabel);
    }
});

$effect(() => {
    // console.log('%cContentEdit.$effect', 'background-color:brown', content);
    if (!editor) return;

    if (html_entity_encode(editor.innerText) != content) {
        editor.innerHTML = content ? content.replace(/\r?\n/ig, '<br>') : '';
    }
});

function selectAll(element: HTMLElement) {
    //console.log('%cselectAll', 'background-color:green', element);
    element.focus();
}

function clickLabel(event: MouseEvent) {
    //console.log('%cclickLabel', 'background-color:green', event, id);
    if (!editor) return;

    selectAll(editor);
}

</script>

<!-- ContentEdit.svelte -->
<!-- content: {content}, -->
<!-- editor: {editor}, -->
<!-- focused: {focused}, -->
<!-- id: {id}, -->
<!-- isempty: {isempty} -->
<!-- describedby: {describedby}, -->
<!-- labelledby: {labelledby}, -->
<!-- placeholder: {placeholder}, -->
<!-- role: {role}, -->
<!-- type: {type}, -->

<span
    {id}
    bind:this={editor}
    class:isempty
    class={cssclass}
    contenteditable="true"
    role={role}
    spellcheck="false"

    aria-activedescendant={ariaActivedescendant}
    aria-autocomplete={ariaAutocomplete}
    aria-controls={ariaControls}
    aria-describedby={describedby ? describedby : null}
    aria-expanded={ariaExpanded}
    aria-haspopup={ariaHaspopup}
    aria-label={ariaLabel}
    aria-labelledby={labelledby ? labelledby : null}
    aria-multiline={type == 'lines' ? true : false}

    data-length={length}
    data-placeholder={placeholder}
    data-type={type}

    use:contenteditable={type}

    onblur={(event) => {
        //console.log('%cContentEdit.onblur', 'background-color:green', event);

        focused = document.activeElement === editor;

        const selection = window.getSelection();

        if (selection) {
            selection.removeAllRanges();
        }

        if (onBlur)
            onBlur(content, event);
    }}

    onclick={(event) => {
        //console.log('%cContentEdit.onclick', 'background-color:green', event);
        if (!propagate) event.stopPropagation();
    }}

    onedit={(event) => {
        //console.log('%cContentEdit.onedit', 'background-color:green', event);

        isempty = event.detail.html === '\n';

        onEdit(event.detail.html, event.detail.origin);
    }}

    onenter={(event) => {
        //console.log('%cContentEdit.onenter', 'background-color:green', event);

        onEnter(event.detail.html, event.detail.origin);
    }}

    onfocus={(event) => {
        //console.log('%cContentEdit.onfocus', 'background-color:green', event);

        const target = event.target as Element;
        const html = target.innerHTML;

        if (placeholder) {
            html == placeholder && (target.innerHTML = '');
        }

        if (editor) {
            focused = document.activeElement === editor;
            selectAll(editor);
        }

        onFocus(html, event);
    }}

    onfocusin={(event) => {
        //console.log('%cContentEdit.onfocusin', 'background-color:green', event);
    }}

    onfocusout={(event) => {
        //console.log('%cContentEdit.onfocusout', 'background-color:green', event);
    }}

    onkeydown2={(event) => {
        //console.log('%cContentEdit.keydown2', 'background-color:green', event);
    }}
></span>

<style type="text/scss">
span {
    cursor: text;
    display: block;
}

[contenteditable] {
    border: 1px dotted transparent;
    mix-blend-mode: multiply;
    position: relative;
}

[contenteditable]:empty:before,
[contenteditable].isempty:before {
    color: #666;
    content: attr(data-placeholder);
    position: absolute;
    white-space: nowrap;
}
</style>
