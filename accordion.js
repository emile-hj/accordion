var randomId = require('random-id');

export default class Accordion {

  constructor(
    $containerEl, 
    buttonSelector, 
    contentSelector,
    preventLenisScroll,
    isolatedSibling, // only one of these can be open at a time
    dontUseButtons
  ) {
    const thisClass = this;
    var idGenLen = 30;  
    var idGenPattern = 'aA0'; // default is aA0 it has a chance for lowercased capitals and numbers

    $containerEl.addClass('accordion')
                .attr('data-state', 'closed');

    if( isolatedSibling ) {
      $containerEl.addClass('isolated-sibling');
    }   

    const btnID = `btn-${randomId(idGenLen, idGenPattern)}`;
    const contentID = `content-${randomId(idGenLen, idGenPattern)})`;

    var elType = 'button';
    if( dontUseButtons ) {
      elType = 'div';
    }
    var roleType = 'type';
    if( dontUseButtons ) {
      roleType = 'role';
    }

    let $btnEl = $containerEl.find(buttonSelector);

    const btnHTML = `<${elType} ${roleType}="button" class="accordion-btn" data-state="closed" tabindex="0" aria-pressed="false" aria-expanded="false" aria-controls="${contentID}" id="${btnID}" >
                      <span class="inner"></span>
                      <span class="icon-container">
                        <span class="icon"></span>
                      </span>
                    </${elType}>`;
    

    $btnEl.wrapInner(btnHTML);
    $btnEl = $btnEl.find('.accordion-btn');

    var $contentEl = $containerEl.find(contentSelector);
    $contentEl.addClass('accordion-content')
      .attr('id',contentID)
      .attr('aria-labelledby',btnID)
      .attr('data-state', 'closed')
      .attr('tabindex','0')
      .slideUp(0, function(){
        if( ScrollTrigger ) {
          // console.log('refreshing scrolltrigger from accordion setup');
          ScrollTrigger.refresh();
        }
      });

    if( preventLenisScroll ) {
      $contentEl.attr('data-lenis-prevent','true');
    }

    $btnEl.on('click', (event) => {
      const currentState = $btnEl.attr("data-state");
      if( currentState === 'closed' ) {
        // console.log('currentState', currentState);
        thisClass.changeState('open', $btnEl, $contentEl);
      } else {
        // console.log('currentState', currentState);
        thisClass.changeState('closed', $btnEl, $contentEl);
      }
    });    


    window.addEventListener('keydown',function(event){
      // console.log(event);

      if( event.key === 'Escape' ) {
        thisClass.changeState('close', $btnEl, $contentEl);
      }
    });

    if( dontUseButtons ) {
      $btnEl.bind('keypress', function(event){
        // console.log(event);
        // console.log('dont use buttons');

        if( event.key === 'Enter' ) {
          if( $btnEl.attr('data-state') === 'closed' ) {
            thisClass.changeState('open', $btnEl, $contentEl);
          } else {
            thisClass.changeState('closed', $btnEl, $contentEl);
          }
        } else if( event.keyCode === 32 || event.code === 'Space' ) {
          if( $(this).attr('data-state') === 'closed' ) {
            thisClass.changeState('open', $btnEl, $contentEl);
          } else {
            thisClass.changeState('closed', $btnEl, $contentEl);
          }
        }
      });

    }


  }

  changeState(newState, $btnEl, $contentEl) {
    // console.log('newState', newState);
    
    const $containerEl = $btnEl.parents('.accordion');

    if(newState == 'open') {
  
      var waitTime = 0;

      if( $containerEl.hasClass('isolated-sibling') ) {
        const $setContainer = $containerEl.parent();
        const $openSibling = $setContainer.find('.isolated-sibling[data-state="open"]');
        if( $openSibling.length && $openSibling != $containerEl ) {
          waitTime = 250;
          const $openSiblingBtn = $openSibling.find('.accordion-btn');
          const $openSiblingContentEl = $openSibling.find('.accordion-content');
  
          $openSiblingContentEl .attr('data-state', 'closed')
            .slideUp(250);

          $openSiblingBtn.attr('data-state', 'closed')
            .attr('aria-pressed', 'false')
            .attr('aria-expanded', 'false');

          $openSibling.attr('data-state', 'closed');
        }
      }

      let zIndex = $containerEl.css('z-index');
      // console.log('zIndex is', zIndex);
      if( zIndex === 'auto' || zIndex === 'initial' || zIndex === 'inherit' || zIndex === 'unset' || zIndex === '0' ) {
        zIndex = 1;
      } else {
        zIndex = Number(zIndex) + 1;
      }      
      // console.log('after checks, zIndex is', zIndex);
      $containerEl.css({'z-index': zIndex});
  
      setTimeout(function(){
        $contentEl.attr('data-state', 'open')
        .slideDown(250, function(){
          $contentEl.focus();

          if( ScrollTrigger ) {
            // console.log('refreshing scrolltrigger from accordion change state');
            ScrollTrigger.refresh();
          }
        });
  
        $btnEl.attr('data-state', 'open')
          .attr('aria-pressed', 'true')
          .attr('aria-expanded', 'true');

        $containerEl.attr('data-state', 'open');
  
      }, waitTime);
  
    } else {
      $contentEl.attr('data-state', 'closed')
        .slideUp(250, function(){
          $containerEl.css({'z-index': ''});

          if( ScrollTrigger ) {
            // console.log('refreshing scrolltrigger from accordion change state');
            ScrollTrigger.refresh();
          }
        });
  


      $btnEl.attr('data-state', 'closed')
        .attr('aria-pressed', 'false')
        .attr('aria-expanded', 'false');

      $containerEl.attr('data-state', 'closed');
    }
  }

}


