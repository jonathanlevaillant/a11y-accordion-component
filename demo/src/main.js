import Accordions from './../../dist/a11y-accordion-component.es.js';

document.addEventListener('DOMContentLoaded', () => {

  // initial config
  Accordions.init();

  // programmatically add accordion
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      Accordions.render('accordion-2', {
        isMultiSelectable: false,
        isCollapsible: false,
      });
    } else {
      Accordions.destroy('accordion-2');
    }
  });
});
