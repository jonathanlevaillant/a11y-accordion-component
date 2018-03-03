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
      this.triggers = this.queryFilter(this.accordion.querySelectorAll('[aria-controls]'));
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
      this.update(event);
    }

    setFocus(event) {
      this.state.forEach((section) => {
        if (event.which === KEY_CODES.up && event.target === section.trigger) section.prevTrigger.focus();
        if (event.which === KEY_CODES.down && event.target === section.trigger) section.nextTrigger.focus();
      });

      if (event.which === KEY_CODES.home) this.firstTrigger.focus();
      if (event.which === KEY_CODES.end) this.lastTrigger.focus();
    }

    update(event) {
      if (event) event.preventDefault();

      this.state.forEach((section) => {
        section.trigger.setAttribute('aria-disabled', section.isDisabled);
        section.trigger.setAttribute('aria-expanded', section.isExpanded);
        section.panel.setAttribute('aria-hidden', !section.isExpanded);
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

    render() {
      this.triggers.forEach((trigger, index) => {
        this.state.push({
          trigger,
          prevTrigger: this.triggers[index - 1] || this.lastTrigger,
          nextTrigger: this.triggers[index + 1] || this.firstTrigger,
          panel: document.getElementById(trigger.getAttribute('aria-controls')),
          isExpanded: trigger.getAttribute('aria-expanded') === 'true',
          isDisabled: !this.isCollapsible ? trigger.getAttribute('aria-expanded') === 'true' : false,
        });

        // update attributes
        this.update();

        // add event listeners
        this.addEventListeners(trigger);
      });
    }
  }

  const init = () => {
    const components = document.querySelectorAll(DATA_COMPONENT);
    const options = {};

    components.forEach((component) => {
      options.accordion = component;
      options.isMultiSelectable = component.dataset.multiselectable === 'true';
      options.isCollapsible = component.dataset.collapsible !== 'false';

      const accordion = new Accordion(options);
      accordion.render();
    });
  };

  return { init };
})();

export default Accordions;
