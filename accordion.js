const randomId = require('random-id');

export default class Accordion {

  constructor(
    $containerEl, 
    buttonSelector, 
    contentSelector,
    isSelectList,
    isolatedSibling, // only one of these can be open at a time
    dontUseButtons
  ) {
    const thisClass = this;
    this.$containerEl = $containerEl;
    thisClass.$containerEl = $containerEl;

    var idGenLen = 30;  
    var idGenPattern = 'aA0'; // default is aA0 it has a chance for lowercased capitals and numbers

    $containerEl.addClass('accordion')
      .attr('data-state', 'closed');

    if( isolatedSibling ) {
      $containerEl.addClass('isolatedSibling');
    }   

    const btnID = randomId(idGenLen, idGenPattern);
    const contentID = randomId(idGenLen, idGenPattern);

    var elType = 'button';
    if( dontUseButtons ) {
      elType = 'div';
    }
    var roleType = 'type';
    if( dontUseButtons ) {
      roleType = 'role';
    }

    const HTML_btn = `<${elType} ${roleType}="button" class="accordionBtn" data-state="closed" tabindex="0" aria-pressed="false" aria-expanded="false" aria-controls="${contentID}" id="${btnID}" >
                      <span class="inner"></span>
                    </${elType}>`;
    
    var $btnEl = $containerEl.find(buttonSelector);
    $btnEl.wrapInner(HTML_btn);
    $btnEl = $btnEl.find('.accordionBtn');
    this.$btnEl = $btnEl;

    const $contentEl = $containerEl.find(contentSelector);
    this.$contentEl = $contentEl;
    $contentEl.addClass('accordionContent')
      .attr('id',contentID)
      .attr('aria-labelledby',btnID)
      .attr('data-state', 'closed')
      .attr('tabindex','0')
      .attr('data-lenis-prevent','true')
      .slideUp(0);

      $btnEl.on('click', (event) => {
      const currentState = $btnEl.attr("data-state");
      if( currentState === 'closed' ) {
        // console.log('currentState', currentState);
        thisClass.changeState('open');
      } else {
        // console.log('currentState', currentState);
        thisClass.changeState('closed');
      }
    });    


    window.addEventListener('keydown', function(event){
      // console.log(event);

      if( event.key === 'Escape' ) {
        thisClass.changeState('closed');
      }
    });

    if( dontUseButtons ) {
      $btnEl.bind('keypress', function(event){
        // console.log(event);
        // console.log('dont use buttons');

        if( event.key === 'Enter' ) {
          if( $btnEl.attr('data-state') === 'closed' ) {
            thisClass.changeState('open');
          } else {
            thisClass.changeState('closed');
          }
        } else if( event.keyCode === 32 || event.code === 'Space' ) {
          if( $(this).attr('data-state') === 'closed' ) {
            thisClass.changeState('open');
          } else {
            thisClass.changeState('closed');
          }
        }
      });

    }

    if( isSelectList ) {
      // console.log('is select list');
      $containerEl.addClass('selectList');
      const $checkboxes = $contentEl.find('input[type="checkbox"]');
      if( $checkboxes.length ) {
        $containerEl.addClass('filterSelectList');
      }

      const $selectedCheckboxes = $contentEl.find('input:checked');
      if( $selectedCheckboxes.length ) {

        const checkedCount = $selectedCheckboxes.length;
        
        $btnEl.find('.inner').append(`<span>(${checkedCount})</span>`);
      }

      const focusableEls = $contentEl[0].querySelectorAll('a, button, input, .proxyApplyBtn');
      // console.log('focusableEls',focusableEls);
      const focusableElCount = focusableEls.length;

      focusableEls.forEach( (el, i) => {
        $(el).attr('data-focusable-index', i);
      });

      // keydown on the accordion content or anything inside
      $contentEl[0].addEventListener('keydown', function(event){

        if( event.key === 'ArrowDown' || event.key === 'ArrowUp' ) {
          // console.log('target', event);
          // console.log(event.target);
          event.preventDefault();

          // current focus is the accordion content
          if( event.target === $contentEl[0] ) {
            $(focusableEls[0]).trigger('focus');
          } else {
            // current focus is a focusable el

            var currentElIndex = $(event.target).attr('data-focusable-index');
            currentElIndex = parseFloat(currentElIndex);
            // console.log('currentElIndex',currentElIndex);

            if( event.key === 'ArrowDown' ) {            
              const nextElIndex = currentElIndex + 1;
              // console.log('nextElIndex',nextElIndex);
              if( nextElIndex < focusableElCount ) {
                const $nextEl = $contentEl.find(`[data-focusable-index="${nextElIndex}"]`);
                $nextEl.trigger('focus');
              }
            } else if( event.key === 'ArrowUp' ) {
              const prevElIndex = currentElIndex - 1;
              // console.log('prevElIndex',prevElIndex);
              if( prevElIndex >= 0 ) {
                const $prevEl = $contentEl.find(`[data-focusable-index="${prevElIndex}"]`);
                $prevEl.trigger('focus');
              }
            }
          }


        }
      });
    }
  }

  changeState(newState) {
    // console.log('newState', newState);
    
    const $containerEl = this.$containerEl;
    const $contentEl = this.$contentEl;
    const $btnEl = this.$btnEl;

    if(newState == 'open') {
  
      var waitTime = 0;

      if( $containerEl.hasClass('isolatedSibling') ) {
        const $setContainer = $containerEl.parent();
        const $openSibling = $setContainer.find('.isolatedSibling[data-state="open"]');
        if( $openSibling.length && $openSibling != $containerEl ) {
          waitTime = 250;
          const $openSiblingBtn = $openSibling.find('.accordionBtn');
          const $openSiblingContentEl = $openSibling.find('.accordionContent');
  
          $openSiblingContentEl .attr('data-state', 'closed')
            .slideUp(250);

          $openSiblingBtn.attr('data-state', 'closed')
            .attr('aria-pressed', 'false')
            .attr('aria-expanded', 'false');

          $openSibling.attr('data-state', 'closed');
        }
      }
  
      setTimeout(function(){
        $contentEl.attr('data-state', 'open')
        .slideDown(250,
          () => {
            $contentEl.focus();
          }
        );
  
        $btnEl.attr('data-state', 'open')
          .attr('aria-pressed', 'true')
          .attr('aria-expanded', 'true');

        $containerEl.attr('data-state', 'open');
  
      }, waitTime);
  
    } else {
      $contentEl.attr('data-state', 'closed')
        .slideUp(250);
  
      $btnEl.attr('data-state', 'closed')
        .attr('aria-pressed', 'false')
        .attr('aria-expanded', 'false');

      $containerEl.attr('data-state', 'closed');
    }
  }

}


