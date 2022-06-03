import * as helper from '../../helper.js';
export default class Event {
  constructor(data) {
    this.data = data;
    this.element = {};
    this.element.root = this.markup();

    this.element.container =
      this.element.root.querySelector('.event-container');

    this.element.container.appendChild(this.generateEvent(this.data.events));
  }

  generateEvent(events) {
    const html = document.createDocumentFragment();

    events.forEach((event) => {
      const li = document.createElement('li');

      const p = document.createElement('p');
      p.textContent = event.event;

      const span = document.createElement('span');
      span.textContent = new Date(event.date).toLocaleDateString();

      li.appendChild(p);
      li.appendChild(span);

      li.classList.add(helper.eventColor(event.status));

      html.appendChild(li);
    });

    return html;
  }

  markup() {
    const doc = document.createDocumentFragment();
    const div = document.createElement('div');
    div.setAttribute('class', 'events');
    const h1 = document.createElement('h1');
    h1.textContent = 'Upcoming events';
    div.appendChild(h1);
    const ul = document.createElement('ul');
    ul.setAttribute('class', 'event-container');
    div.appendChild(ul);

    doc.appendChild(div);

    return doc;
  }
}
