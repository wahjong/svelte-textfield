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
    // console.log('%clineReplacer', 'background-color:green', text, text === '\n');
    return text === '\n' ? '' : text.replace(/\r\n/g, '\n');
}

function blurHandler(content: string, event: FocusEvent) {
    // console.log('%cTextField.blurHandler', 'background-color:green', content, event);
}

function editHandler(content: string, event: KeyboardEvent) {
    // console.log('%cTextField.editHandler', 'background-color:green', content, event);

    textContent = content;

    if ( typeof onChange === 'function' ) {
        onChange(lineReplacer(textContent));
    }
}

function enterHandler(content: string, event: KeyboardEvent) {
    // console.log('%cTextField.enterHandler', 'background-color:green', content, event);
}

function focusHandler(content: string, event: FocusEvent) {
    // console.log('%cTextField.focusHandler', 'background-color:green', content, event);
}

export function getText() {
    // console.log('%cTextField.getText', 'background-color:green');
    return textContent;
}

export function setText(content: string) {
    // console.log('%cTextField.setText', 'background-color:green', content);
    textContent = content;
}
export function focus() {
    // console.log('%cTextField.focus', 'background-color:green');
    if (cedit)
        cedit.focus();
}

</script>

<!-- TextField.svelte -->

<!-- ariaActivedescendant: {ariaActivedescendant}, -->
<!-- ariaAutocomplete: {ariaAutocomplete}, -->
<!-- ariaControls: {ariaControls}, -->
<!-- ariaExpanded: {ariaExpanded}, -->
<!-- ariaLabel: {ariaLabel}, -->

<!-- cedit: {cedit}, -->
<!-- cssclass: {cssclass}, -->
<!-- dataset: {JSON.stringify(dataset)}, -->
<!-- describedby: {describedby}, -->
<!-- focused: {focused}, -->
<!-- id: {id}, -->
<!-- labelledby: {labelledby}, -->
<!-- length: {length}, -->
<!-- onChange: {onChange}, -->
<!-- placeholder: {placeholder}, -->
<!-- root: {root}, -->
<!-- target: {target}, -->
<!-- textContent: {textContent}, -->
<!-- type: {type}, -->
<!-- width: {width}, -->

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
    class="txfield {cssclass}"
    style={[
        width && `width:${isNaN(Number(width)) ? width : width + 'px'}`,
    ].join('')}

    bind:this={root}
    class:focus={focused}

    onblurcontent={(event: CustomEvent) => {
        // console.log('>>> onblurcontent', event);
    }}

    onedit={(event: CustomEvent) => {
        // console.log('>>> onedit', event);
    }}

    onenter={(event: CustomEvent) => {
        // console.log('>>> onenter', event);
    }}

    onkeydown={(event: KeyboardEvent) => {
        // console.log('>>> onkeydown', event);

        if (cedit)
            cedit.focus();
    }}

    onkeydown2={(event: CustomEvent) => {
        // console.log('>>> onkeydown2', event);
    }}

    onfocuscontent={(event: CustomEvent) => {
        // console.log('>>> onfocuscontent', event);
    }}

    onfocusin={(event: FocusEvent) => {
        // console.log('>>> onfocusin', event);
    }}

    onfocusout={(event: FocusEvent) => {
        // console.log('>>> onfocusout', event);
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
