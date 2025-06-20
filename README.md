A JS class allowing quick and easy creation of customisable accordion components. 

Effortlessly initialise accordions on chosen container elements with chosen selectors, enable single selection for exclusive expansion, and opt to use non-button elements if they are undesired in a Drupal context

# The class

```javascript
export default class Accordion {

  constructor(
    $containerEl, 
    buttonSelector, 
    contentSelector,
    isolatedSibling, // only one of these can be open at a time
    dontUseButtons
  ) {
  // …
  }
}
```


# Here is an example use case:

```javascript
const $accordionItems = $('.accordion-item');
if( $accordionItems.length ) {
  $accordionItems.each(function(){
    const $item = $(this);

    const HEADING_SELECTOR = ('.accordion-heading');
    const CONTENT_SELECTOR = ('.accordion-content');

    if( $heading.length && $content.length ) {
      const accordion = new Accordion(
        $item,
        HEADING_SELECTOR,
        CONTENT_SELECTOR,
        false,
        false
      );
    }

  });
}
```