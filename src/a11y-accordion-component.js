/* accordions
 ========================================================================== */

const Accordions = (() => {
  const DATA_COMPONENT = '[data-component="accordion"]';

  const KEY_CODES = {
    enter: 13,
    space: 32,
    pageUp: 33,
    pageDown: 34,
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
      this.currentFocusedIndex = null;

      this.isMultiSelectable = options.isMultiSelectable;
      this.isCollapsible = options.isCollapsible;

      this.onFocus = this.onFocus.bind(this);
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
        if (event.currentTarget === section.trigger) {
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

    onFocus(event) {
      this.state.forEach((section, index) => {
        if (event.target === section.trigger) {
          this.currentFocusedIndex = index;
        }
      });
    }

    setFocus(event) {
      if (event.target.hasAttribute('data-controls')) {
        event.preventDefault();
        event.stopPropagation();

        if (event.which === KEY_CODES.up || event.which === KEY_CODES.pageUp) {
          this.state[this.currentFocusedIndex].prevTrigger.focus();
        }
        if (event.which === KEY_CODES.down || event.which === KEY_CODES.pageDown) {
          this.state[this.currentFocusedIndex].nextTrigger.focus();
        }
        if (event.which === KEY_CODES.home) this.firstTrigger.focus();
        if (event.which === KEY_CODES.end) this.lastTrigger.focus();
      } else {
        if (event.which === KEY_CODES.pageUp || event.which === KEY_CODES.pageDown) {
          event.preventDefault();
          event.stopPropagation();
        }
        if (event.which === KEY_CODES.pageUp) this.state[this.currentFocusedIndex].trigger.focus();
        if (event.which === KEY_CODES.pageDown) this.state[this.currentFocusedIndex].nextTrigger.focus();
      }
    }

    addAttributes() {
      this.accordion.setAttribute('role', 'presentation');

      this.state.forEach((section) => {
        section.trigger.setAttribute('role', 'button');
        section.trigger.setAttribute('tabindex', 0);
        section.trigger.setAttribute('aria-controls', section.trigger.dataset.controls);
        section.panel.setAttribute('role', 'region');
        section.panel.setAttribute('tabindex', -1);
        section.panel.setAttribute('aria-labelledby', section.trigger.id);
      });
    }

    updateAttributes(event) {
      if (event) event.preventDefault();

      this.state.forEach((section) => {
        section.trigger.setAttribute('aria-expanded', section.isExpanded);
        section.trigger.setAttribute('aria-disabled', section.isDisabled);
        section.panel.setAttribute('aria-hidden', !section.isExpanded);
      });
    }

    removeAttributes() {
      delete this.accordion.dataset.component;
      this.accordion.removeAttribute('role');

      this.state.forEach((section) => {
        section.trigger.removeAttribute('role');
        section.trigger.removeAttribute('tabindex');
        section.trigger.removeAttribute('aria-controls');
        section.trigger.removeAttribute('aria-expanded');
        section.trigger.removeAttribute('aria-disabled');
        section.panel.removeAttribute('role');
        section.panel.removeAttribute('tabindex');
        section.panel.removeAttribute('aria-hidden');
        section.panel.removeAttribute('aria-labelledby');
      });
    }

    onClick(event) {
      this.setState(event);
    }

    onKeydown(event) {
      if (event.which === KEY_CODES.enter && event.target.hasAttribute('data-controls')) this.setState(event);
      if (event.which === KEY_CODES.space && event.target.hasAttribute('data-controls')) this.setState(event);
      if (event.which === KEY_CODES.up) this.setFocus(event);
      if (event.which === KEY_CODES.down) this.setFocus(event);
      if (event.which === KEY_CODES.home) this.setFocus(event);
      if (event.which === KEY_CODES.end) this.setFocus(event);
      if (event.which === KEY_CODES.pageUp) this.setFocus(event);
      if (event.which === KEY_CODES.pageDown) this.setFocus(event);
    }

    addEventListeners(trigger, panel) {
      trigger.addEventListener('focus', this.onFocus);
      trigger.addEventListener('click', this.onClick);
      trigger.addEventListener('touchstart', this.onClick);
      trigger.addEventListener('keydown', this.onKeydown);
      panel.addEventListener('keydown', this.onKeydown);
    }

    removeEventListeners(trigger, panel) {
      trigger.removeEventListener('focus', this.onFocus);
      trigger.removeEventListener('click', this.onClick);
      trigger.removeEventListener('touchstart', this.onClick);
      trigger.removeEventListener('keydown', this.onKeydown);
      panel.removeEventListener('keydown', this.onKeydown);
    }

    destroy() {
      this.state.forEach((section) => {
        // remove event listeners
        this.removeEventListeners(section.trigger, section.panel);
      });

      // remove attributes
      this.removeAttributes();
    }

    render() {
      let panel;
      let isExpanded;

      this.triggers.forEach((trigger, index) => {
        panel = document.getElementById(trigger.dataset.controls);
        isExpanded = trigger.dataset.open === 'true';

        if (isExpanded) this.currentFocusedIndex = index;

        this.state.push({
          trigger,
          prevTrigger: this.triggers[index - 1] || this.lastTrigger,
          nextTrigger: this.triggers[index + 1] || this.firstTrigger,
          panel,
          isExpanded,
          isDisabled: !this.isCollapsible ? isExpanded : false,
        });

        // add event listeners
        this.addEventListeners(trigger, panel);
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
