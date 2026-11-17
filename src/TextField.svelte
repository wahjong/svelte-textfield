<script lang="ts">
import ContentEdit from './ContentEdit.svelte';
import type { AriaAutocomplete, AriaExpanded, AriaHaspopup } from './ContentEdit.svelte';

type Props = {
    dataset: DOMStringMap;
    cssclass?: string;
    id?: string;
    length?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
    target?: HTMLElement;
    textContent?: string;
    type: 'lines' | 'line';
    width?: string;
}

let {
    dataset = {},
    cssclass,
    id,
    length,
    onChange,
    placeholder,
    target,
    textContent,
    type = 'line',
    width,
}: Props = $props();

let root = $state<HTMLSpanElement>();
let cedit = $state<ContentEdit>();

let ariaActivedescendant = $state<string>();
let ariaAutocomplete = $state<AriaAutocomplete>();
let ariaControls = $state<string>();
let ariaExpanded = $state<AriaExpanded>();
let ariaHaspopup = $state<AriaHaspopup>();
let ariaLabel = $state<string>();
let focused = $state(false);
let describedby = $derived(dataset ? dataset['describedby'] : '');
let labelledby = $derived(dataset ? dataset['labelledby'] : '');

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes') {
            dataset = dataset;
        }
    });
});

if (target) {

    observer.observe(target, {
        attributes: true,
        attributeOldValue : true,
        attributeFilter: ['data-describedby','data-labelledby']
    });

}

function lineReplacer(text: string) {
    return text === '\n' ? '' : text.replace(/\r\n/g, '\n');
}

function blurHandler(content: string, event: FocusEvent) {
}

function editHandler(content: string, event: KeyboardEvent) {

    textContent = content;

    if ( typeof onChange === 'function' ) {
        onChange(lineReplacer(textContent));
    }
}

function enterHandler(content: string, event: KeyboardEvent) {
}

function focusHandler(content: string, event: FocusEvent) {
}

export function getText() {
    return textContent;
}

export function setText(content: string) {
    textContent = content;
}
export function focus() {
    if (cedit)
        cedit.focus();
}

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
    class="txfield {cssclass}"
    style={[
        width && `width:${isNaN(Number(width)) ? width : width + 'px'}`,
    ].join('')}

    bind:this={root}
    class:focus={focused}

    onblurcontent={(event: CustomEvent) => {
    }}

    onedit={(event: CustomEvent) => {
    }}

    onenter={(event: CustomEvent) => {
    }}

    onkeydown={(event: KeyboardEvent) => {

        if (cedit)
            cedit.focus();
    }}

    onkeydown2={(event: CustomEvent) => {
    }}

    onfocuscontent={(event: CustomEvent) => {
    }}

    onfocusin={(event: FocusEvent) => {
    }}

    onfocusout={(event: FocusEvent) => {
    }}
>
    <ContentEdit
        {ariaActivedescendant}
        {ariaAutocomplete}
        {ariaControls}
        {ariaExpanded}
        {ariaLabel}
        {ariaHaspopup}

        {cssclass}
        {id}
        {type}
        {placeholder}
        {length}

        bind:this={cedit}
        bind:focused

        content={textContent}
        propagate={true}

        {describedby}
        {labelledby}

        onBlur={blurHandler}
        onEdit={editHandler}
        onEnter={enterHandler}
        onFocus={focusHandler}

    />
</span>

<style type="text/scss">
.txfield {
    background-color: yellow;
    display: inline-block;
    overflow-x: hidden;
    vertical-align: middle;
}
</style>
