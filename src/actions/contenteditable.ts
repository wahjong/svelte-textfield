import { html_entity_encode } from './htmlentities';

export function contenteditable(node: HTMLElement, type: string) {

    let html: string;
    let x = NaN;
    let y = NaN;

    const notKeepReturn = type !== 'lines';

    const flags = {
        bubbles: true,
        cancelable: true,
        composed: true,
    };

    let maxLength: number | undefined;

    if (node.dataset.length) {
        maxLength = parseInt(node.dataset.length, 10);
    }
    // console.log('%cmaxLength', 'background-color:purple', maxLength);

    function checkLength(element: HTMLElement) {
        // console.log('%ccontenteditable.checkLength', 'background-color:green', element);

        if (!maxLength) return;

        if ( element.innerText.length > maxLength ) {
            // console.log('%celement.innerText.length:%s > maxLength:%s', 'background-color:blue', element.innerText.length, maxLength);

            const caretPos = getCaretOffset(element);

            element.innerText = element.innerText.slice(0, maxLength);

            setCaretOffset(
                element,
                Math.min(caretPos, element.innerText.length)
            );
        }
    }

    function handleMousedown(event: MouseEvent) {
        // console.log('%ccontenteditable.handleMousedown', 'background-color:green', event);

        const { clientX: x, clientY: y } = event;
        const rect = node.getBoundingClientRect();

        const isInside =
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom;

        if (isInside) return;

        // console.log('%cnode.dispatchEvent blurcontent', 'background-color:brown');
        node.dispatchEvent(
            new CustomEvent('blurcontent', {
                detail: { srcElement: node},
                ...flags
            })
        );

        node.removeEventListener('compositionend', handleEdit);
        node.removeEventListener('keyup', handleEdit);
        node.removeEventListener('keydown', handleKey);
        document.removeEventListener('mousedown', handleMousedown, true);
    }

    function handleFocus(
        this: HTMLElement,
        event: FocusEvent
    ) {
        // console.log('%ccontenteditable.handleFocus', 'background-color:green', event);
        // console.log('%ctype:%s, notKeepReturn:%s', 'background-color:purple', type, notKeepReturn);

        html = this.innerHTML;

        // console.log('%cnode.dispatchEvent focuscontent', 'background-color:brown');
        node.dispatchEvent(
            new CustomEvent('focuscontent', {
                detail: {
                    html,
                    origin: event,
                },
                ...flags
            })
        );

        node.addEventListener('compositionend', handleEdit);
        node.addEventListener('keyup', handleEdit);
        node.addEventListener('keydown', handleKey);
        document.addEventListener('mousedown', handleMousedown, true);
    }

    function handleKey(
        this: HTMLElement,
        event: KeyboardEvent
    ) {
        // console.log('%ccontenteditable.handleKey', 'background-color:green', event);
        // console.log('%cevent.key:%s, event.shiftKey:%s, event.ctrlKey:%s', 'background-color:purple', event.key, event.shiftKey, event.ctrlKey);

        if (
            (node.dataset.type == 'lines'
                && event.key == 'Enter'
                && !event.shiftKey
            )
            || (node.dataset.type == 'line' && event.key == 'Enter')
            || (event.key == 'b' && event.ctrlKey)
            || (event.key == 'i' && event.ctrlKey)
            || (event.key == 'u' && event.ctrlKey)
            || (
                !/ArrowLeft|ArrowRight|Left|Right|Backspace|Delete|Del/.test(event.key)
                && this.textContent.length >= Number(node.dataset.length ?? '0')
            )
        ) {
            // console.log('%cevent.preventDefault()', 'background-color:brown');
            event.preventDefault();
        }

        // console.log('%cnode.dispatchEvent keydown2', 'background-color:brown');
        node.dispatchEvent(
            new CustomEvent('keydown2', {
                detail: {
                    html,
                    origin: event,
                },
                ...flags
            })
        );
    }

    function handleEdit(
        this: HTMLElement,
        event: CompositionEvent | KeyboardEvent
    ) {
        // console.log('%ccontenteditable.handleEdit', 'background-color:green', event);
        // console.log('%ctype:%s, notKeepReturn:%s', 'background-color:purple', type, notKeepReturn);

        if (event instanceof KeyboardEvent
            && event.key == 'Enter'
            && !event.shiftKey
        ) {
            // console.log('%cnode.dispatchEvent enter', 'background-color:brown');
            node.dispatchEvent(
                new CustomEvent('enter', {
                    detail: {
                        html: this.innerText,
                        origin: event,
                    },
                    ...flags
                })
            );

            return;
        }

        if (html !== this.innerHTML) {
            html = this.innerHTML;

            // console.log('%cnode.dispatchEvent edit', 'background-color:brown');
            node.dispatchEvent(
                new CustomEvent('edit', {
                    detail: {
                        html: html_entity_encode(this.innerText),
                        origin: event,
                    },
                    ...flags
                })
            );
        }
    }

    function getCaretOffset(element: Node) {

        const selection = window.getSelection();

        if (!selection || !selection.rangeCount)
            return 0;

        const range = selection.getRangeAt(0).cloneRange();

        range.selectNodeContents(element);

        if (selection.focusNode) {
            range.setEnd(selection.focusNode, selection.focusOffset);
        }

        return range.toString().length;
    }

    function setCaretOffset(
        element: HTMLElement,
        offset: number
    ) {

        const range = document.createRange();
        const selection = window.getSelection();

        let current = 0;

        function walk(node: Node) {

            if (node.nodeType === Node.TEXT_NODE) {
                const next = current + node.childNodes.length;

                if (offset <= next) {
                    range.setStart(node, offset - current);
                    range.collapse(true);
                    return true;
                }

                current = next;
            }

            for (const child of node.childNodes) {
                if (walk(child)) return true;
            }

            return false;
        }

        walk(element);

        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }

    }

    function handlePaste(this: HTMLElement, event: ClipboardEvent) {
        // console.log('%chandlePaste', 'background-color:green', event);
        // console.log('%ctype:%s, notKeepReturn:%s', 'background-color:purple', type, notKeepReturn);

        console.clear();
        event.stopPropagation();
        event.preventDefault();

        const selection = window.getSelection();
        if (!selection || !selection.rangeCount)
            return;

        const pasted = event.clipboardData?.getData('text/plain');

        // console.log('%cpasted', 'background-color:purple', pasted);
        if (!pasted) return;

        const replacer = notKeepReturn ? ' ' : '<br>';
        const encoded = html_entity_encode(pasted).replace(/\r?\n/g, replacer);
        // console.log('%cencoded', 'background-color:purple', encoded);

        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(
            range.createContextualFragment(encoded)
        );

        checkLength(this);
    }

    node.addEventListener('paste', handlePaste);
    node.addEventListener('focus', handleFocus);

    return {
        destroy() {
            node.removeEventListener('paste', handlePaste);
            node.removeEventListener('focus', handleFocus);
        }
    }
}
