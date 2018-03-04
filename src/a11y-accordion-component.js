/* accordions
 ========================================================================== */

const Accordions = (() => {
  const DATA_COMPONENT = '[data-component="accordion"]';

  const KEY_CODES = {
    enter: 13,
    space: 32,
    end: 35,
    home: 36,
    up: 38,
    down: 40,
  };

  class Accordion {
    constructor(options) {
      this.accordion = options.accordion;
      this.triggers = this.queryFilter(this.accordion.querySelectorAll('[data-controls]'));
      [this.firstTrigger] = this.triggers;
      this.lastTrigger = this.triggers[this.triggers.length - 1];

      this.state = [];

      this.isMultiSelectable = options.isMultiSelectable;
      this.isCollapsible = options.isCollapsible;

      this.onClick = this.onClick.bind(this);
      this.onKeydown = this.onKeydown.bind(this);
    }

    queryFilter(selectors) {
      const elements = [];
      let parent;

      selectors.forEach((selector) => {
        parent = selector.parentNode;

        while (parent !== this.accordion) {
          if (parent.dataset.component === this.accordion.dataset.component) return;
          parent = parent.parentNode;
        }
        elements.push(selector);
      });

      return elements;
    }

    setState(event) {
      this.state.forEach((section) => {
        if (event.target === section.trigger) {
          if (this.isCollapsible) section.isExpanded = !section.isExpanded;
          else {
            section.isDisabled = true;
            section.isExpanded = true;
          }
        } else {
          if (!this.isMultiSelectable) section.isExpanded = false;
          if (!this.isCollapsible) section.isDisabled = false;
        }
      });

      // update attributes
      this.updateAttributes(event);
    }

    setFocus(event) {
      event.preventDefault();

      this.state.forEach((section) => {
        if (event.which === KEY_CODES.up && event.target === section.trigger) section.prevTrigger.focus();
        if (event.which === KEY_CODES.down && event.target === section.trigger) section.nextTrigger.focus();
      });

      if (event.which === KEY_CODES.home) this.firstTrigger.focus();
      if (event.which === KEY_CODES.end) this.lastTrigger.focus();
    }

    addAttributes() {
      this.accordion.setAttribute('role', 'presentation');

      this.state.forEach((section) => {
        section.panel.setAttribute('role', 'region');
        section.panel.setAttribute('aria-labelledby', section.trigger.id);
        section.trigger.setAttribute('role', 'button');
        section.trigger.setAttribute('tabindex', 0);
        section.trigger.setAttribute('aria-controls', section.trigger.dataset.controls);
      });
    }

    updateAttributes(event) {
      if (event) event.preventDefault();

      this.state.forEach((section) => {
        section.panel.setAttribute('aria-hidden', !section.isExpanded);
        section.trigger.setAttribute('aria-expanded', section.isExpanded);
        section.trigger.setAttribute('aria-disabled', section.isDisabled);
      });
    }

    removeAttributes() {
      delete this.accordion.dataset.component;
      this.accordion.removeAttribute('role');

      this.state.forEach((section) => {
        section.panel.removeAttribute('role');
        section.panel.removeAttribute('aria-hidden');
        section.panel.removeAttribute('aria-labelledby');
        section.trigger.removeAttribute('role');
        section.trigger.removeAttribute('tabindex');
        section.trigger.removeAttribute('aria-controls');
        section.trigger.removeAttribute('aria-expanded');
        section.trigger.removeAttribute('aria-disabled');
      });
    }

    onClick(event) {
      this.setState(event);
    }

    onKeydown(event) {
      if (event.which === KEY_CODES.enter) this.setState(event);
      if (event.which === KEY_CODES.space) this.setState(event);
      if (event.which === KEY_CODES.up) this.setFocus(event);
      if (event.which === KEY_CODES.down) this.setFocus(event);
      if (event.which === KEY_CODES.home) this.setFocus(event);
      if (event.which === KEY_CODES.end) this.setFocus(event);
    }

    addEventListeners(trigger) {
      trigger.addEventListener('click', this.onClick);
      trigger.addEventListener('touchstart', this.onClick);
      trigger.addEventListener('keydown', this.onKeydown);
    }

    removeEventListeners(trigger) {
      trigger.removeEventListener('click', this.onClick);
      trigger.removeEventListener('touchstart', this.onClick);
      trigger.removeEventListener('keydown', this.onKeydown);
    }

    destroy() {
      this.triggers.forEach((trigger) => {
        // remove event listeners
        this.removeEventListeners(trigger);
      });

      // remove attributes
      this.removeAttributes();
    }

    render() {
      this.triggers.forEach((trigger, index) => {
        this.state.push({
          trigger,
          prevTrigger: this.triggers[index - 1] || this.lastTrigger,
          nextTrigger: this.triggers[index + 1] || this.firstTrigger,
          panel: document.getElementById(trigger.dataset.controls),
          isExpanded: trigger.dataset.open === 'true',
          isDisabled: !this.isCollapsible ? trigger.dataset.open === 'true' : false,
        });

        // add event listeners
        this.addEventListeners(trigger);
      });

      // add attributes
      this.addAttributes();

      // update attributes
      this.updateAttributes();
    }
  }

  // save all active accordions
  const activeAccordions = [];

  const render = (accordionId, { isMultiSelectable = true, isCollapsible = true } = {}) => {
    const accordion = document.getElementById(accordionId);
    const options = { accordion, isMultiSelectable, isCollapsible };

    // add data component
    accordion.dataset.component = 'accordion';

    const activeAccordion = new Accordion(options);
    activeAccordion.render();

    // add active accordion to array
    activeAccordions.push(activeAccordion);
  };

  const destroy = (accordionId) => {
    activeAccordions.forEach((activeAccordion, index) => {
      if (accordionId === activeAccordion.accordion.id) {
        activeAccordion.destroy();

        // remove accordion from array
        activeAccordions.splice(index, 1);
      }
    });
  };

  const init = () => {
    const components = document.querySelectorAll(DATA_COMPONENT);
    const options = {};

    components.forEach((component) => {
      options.accordion = component;
      options.isMultiSelectable = component.dataset.multiselectable !== 'false';
      options.isCollapsible = component.dataset.collapsible !== 'false';

      const accordion = new Accordion(options);
      accordion.render();
    });
  };

  return { render, destroy, init };
})();

export default Accordions;
