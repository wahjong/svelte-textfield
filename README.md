# svelte-textfield

A customizable and accessible text field component for Svelte.

## Features

- Accessibility support with aria-labelledby and aria-describedby
- Focus management
- Supports <label for="..."> association using an id
- Hidden field value binding by id or by placing the field inside the component
- Custom CSS classes
- Maximum length support
- Flexible width:
  - fit-content
  - Percentage values, such as 100%
  - Numeric values

## Installation

bash
npm install

## Usage

### Basic Example

```html
<label for="id_text01" id="aaa">This is label one</label>

<textfield
    data-id="id_text01"
    data-type="line"
    data-cssclass="line"
    data-max-length="100"
    data-labelledby="aaa"
    data-describedby="bbb"
    data-placeholder=""
    data-width="fit-content"
>
    <input type="hidden" value="">
</textfield>

<span id="bbb">Please input label one</span>
```

### Configuration

The `<textfield>` element can be configured using `data-*` attributes:

- `data-id` - Sets the text field ID and allows association with `<label for="...">`.
- `data-type` - Defines the text field type, such as `line`.
- `data-cssclass` - Adds a custom CSS class.
- `data-max-length` - Sets the maximum input length.
- `data-labelledby` - Associates the field with a labelling element.
- `data-describedby` - Associates the field with descriptive text.
- `data-placeholder` - Sets the placeholder text.
- `data-width` - Sets the field width, such as `fit-content`, a percentage, or a numeric value.

A hidden `<input>` can be placed inside the component to store and bind the field value.
