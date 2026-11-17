import { mount } from 'svelte';
import TextField from './TextField.svelte';
import { html_entity_decode, html_entity_encode } from './actions/htmlentities';

interface TextFieldElement extends HTMLElement {
    field: HTMLInputElement | null;
}

document.querySelectorAll<TextFieldElement>('textfield').forEach((ele, i) => {

    const name = ele.dataset.name || 'textfield_' + i;

    if (ele.dataset['field']) {
        ele.field = document.querySelector(`input[type=hidden][id="${ele.dataset['field']}"]`);
    } else {
        ele.field = ele.querySelector('input[type=hidden]')
    }

    let content = '';
    if (ele.field) {
        try {
            content = decodeURIComponent(ele.field.value);
        }
        catch(err) {
            console.warn(`TextField <input type="hidden" id="${ele.field}"> invalid value`);
        }
    }

    window[name] = mount(TextField, {
        target: ele,
        props: {
            dataset: ele.dataset,
            cssclass: ele.dataset['cssclass'],
            id: ele.dataset['id'],
            length: ele.dataset['maxLength'],
            placeholder: ele.dataset['placeholder'],
            target: ele,
            textContent: html_entity_encode(content),
            type: ele.dataset['type'],
            width: ele.dataset['width'],
            onChange: function(html: string) {
                if (ele.field) {
                    ele.field.value = ele.field ? encodeURIComponent(html_entity_decode(html)) : '';
                }
            },
        }
    });

});
