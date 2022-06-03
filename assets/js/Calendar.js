import * as helper from '../../helper.js';
export default class Calendar {
  #months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  constructor(el, data) {
    this.element = {};
    this.data = data;
    this.element.root = el;
    this.element.curExpandEvent = '';
    this.element.root.append(this.markup());
    this.element.days = this.element.root.querySelector('.days');
    this.element.dates = this.element.root.querySelector('.dates');
    this.element.form = null;

    this.date = new Date();
    this.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    this.element.currentMonth =
      this.element.root.querySelector('.calendar-ctrl h2');
    this.element.prevMonth = this.element.root.querySelector(
      '.calendar-ctrl span:first-child'
    );
    this.element.nextMonth = this.element.root.querySelector(
      '.calendar-ctrl span:last-child'
    );

    this.displayMonthAndYear();

    this.ctrlMonth();

    this.data.currentDate = new Date();
    this.data.currentDate.setDate(1);
  }

  ctrlMonth() {
    this.element.prevMonth.addEventListener(
      'click',
      this.prevMonthHandler.bind(this)
    );
    this.element.nextMonth.addEventListener(
      'click',
      this.nextMonthHandler.bind(this)
    );
  }

  prevMonthHandler() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1);
    this.data.currentDate = this.date;
    this.generateNewCalendar();
  }
  nextMonthHandler() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1);
    this.data.currentDate = this.date;
    this.generateNewCalendar();
  }

  displayMonthAndYear() {
    this.element.currentMonth.textContent =
      this.#months[this.date.getMonth()] + ' ' + this.date.getFullYear();
  }
  generateNewCalendar() {
    this.element.dates.innerHTML = '';
    this.element.dates.append(this.generateDates());
    this.displayMonthAndYear();
  }

  generateDays() {
    const html = document.createDocumentFragment();
    for (let i = 0; i < this.days.length; i++) {
      let day = document.createElement('span');
      day.textContent = this.days[i];
      html.appendChild(day);
    }

    return html;
  }

  generateDates() {
    let dateEl = document.createDocumentFragment();
    let lastDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDate();

    let lastMonthLastDay = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      0
    );

    let boxLeft =
      7 - new Date(this.date.getFullYear(), this.date.getMonth() + 1).getDay();

    // function determine current date
    const isCurrentDate = (date) => {
      const current = this.date;
      current.setDate(date);
      const now = new Date(Date.now());

      if (
        current.getFullYear() === now.getFullYear() &&
        current.getMonth() === now.getMonth() &&
        current.getDate() === now.getDate()
      )
        return true;

      return false;
    };

    // create an event on the date box
    const isEvent = (date, div, nextDateEvent) => {
      let currentDate = this.date;

      // next month event
      if (nextDateEvent) {
        currentDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          date
        );
      }

      // // previouse month event
      if (nextDateEvent === false) {
        currentDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          date
        );
      }

      const events = this.data.events.filter((event) => {
        const date = new Date(event.date);
        // console.log(date.toDateString());
        if (date.toDateString() === currentDate.toDateString()) return true;

        return false;
      });

      if (events.length > 0) {
        events.forEach((event) => {
          const span = document.createElement('span');
          span.textContent = event.event.slice(0, 15) + '...';

          span.classList.add(`${helper.eventColor(event.status)}`);
          span.dataset.id = event.id;

          div.appendChild(span);
        });
      }

      return false;
    };

    // Loop previous month date to fill the calendar first
    for (
      let i = 0;
      i <= lastMonthLastDay.getDay() && lastMonthLastDay.getDay() < 6;
      i++
    ) {
      const div = document.createElement('div');
      div.classList.add('date', 'previous-date');
      const h4 = document.createElement('h4');
      const prevDate =
        lastMonthLastDay.getDate() - lastMonthLastDay.getDay() + i;
      h4.textContent = prevDate;
      div.appendChild(h4);

      isEvent(prevDate, div, false);

      // append add button to date box
      const button = document.createElement('button');
      button.classList.add('add-event');
      button.textContent = '+';
      div.appendChild(button);

      dateEl.appendChild(div);
    }

    // loop the current month dates
    for (let i = 0; i < lastDate; i++) {
      const div = document.createElement('div');

      // highlight box current date of the month
      if (isCurrentDate(i + 1)) {
        div.setAttribute('class', 'today');
      }

      const h4 = document.createElement('h4');
      h4.textContent = i + 1;
      div.appendChild(h4);
      div.classList.add('date');
      isEvent(i + 1, div);

      // append add button to the
      const button = document.createElement('button');
      button.classList.add('add-event');
      button.textContent = '+';

      div.appendChild(button);

      dateEl.appendChild(div);
    }

    // next month date render
    for (let i = 0; i < boxLeft; i++) {
      const div = document.createElement('div');
      div.classList.add('date', 'next-date');
      const h4 = document.createElement('h4');
      h4.textContent = i + 1;
      div.appendChild(h4);
      isEvent(i + 1, div, true);

      // append add button to the
      const button = document.createElement('button');
      button.classList.add('add-event');
      button.textContent = '+';
      div.appendChild(button);

      dateEl.appendChild(div);
    }

    return dateEl;
  }

  markup() {
    const doc = document.createDocumentFragment();

    const div = document.createElement('div');
    div.classList.add('calendar-ctrl');
    div.innerHTML = '<span><</span> <h2>May</h2> <span>></span>';

    const div1 = document.createElement('div');
    div1.classList.add('days');

    const div2 = document.createElement('div');
    div2.classList.add('dates');

    div2.addEventListener('dblclick', (e) => {
      // remove any current open form
      if (this.element.form) this.element.form.remove();
      const target = e.target.closest('span');
      if (this.element.curExpandEvent)
        this.element.curExpandEvent.classList.remove('active');
      if (!target) return;

      this.element.curExpandEvent = target;

      // case event expand larger than it's parent container
      const parent = e.target.closest('.dates');
      const { width: parentWith } = parent.getBoundingClientRect();
      const { width, left } = target.getBoundingClientRect();

      this.element.curExpandEvent.classList.add('active');
      if (width + left + 100 > window.innerWidth) {
        this.element.curExpandEvent.style.left = '-30%';
        console.log('larger screen width');
      }

      // append all the rest of content
      this.element.curExpandEvent.textContent = this.data.events.filter(
        (even) => even.id === +this.element.curExpandEvent.dataset.id
      )[0].event;
    });

    // reverse the expeanded even on the date box
    div2.addEventListener('click', (e) => {
      // target is not form
      if (!e.target.closest('form')) {
        // remove any current open form
        if (this.element.form) this.element.form.remove();
      }

      if (this.element.curExpandEvent && !e.target.closest('span')) {
        this.element.curExpandEvent.classList.remove('active');
        this.element.curExpandEvent.textContent =
          this.element.curExpandEvent.textContent.slice(0, 15) + '...';
      }

      // click on the add button
      if (e.target.closest('.add-event')) {
        this.createForm(e);
      }
    });

    doc.append(div);
    doc.append(div1);
    doc.append(div2);

    return doc;
  }

  createForm(e) {
    const form = document.createElement('form');
    const range = document.createRange();
    const inputs = range.createContextualFragment(`
    <div class="form-group">
    <label for="event">Event</label>
    <input type="text" name="event" id="event">
  </div>
  <div class="form-check">
    <input type="radio" name="e-status" id="e-status3" value="3">
    <label for="e-status3">Normal</label>
    <input type="radio" name="e-status" id="e-status2" value="2">
    <label for="e-status2">Important</label>
    <input type="radio" name="e-status" id="e-status1" value="1">
    <label for="e-status1">Very important</label>
  </div>
          <button type="submit">Add Event</button>
    `);

    form.appendChild(inputs);

    e.target.closest('.date').appendChild(form);
    this.element.form = form;

    this.element.form.addEventListener('submit', this.formHandler.bind(this));

    const { left, width } = this.element.form.getBoundingClientRect();

    // form width is overflow the x-axis
    // move the form to the right
    if (left + width > window.innerWidth) {
      const overWidth = left + width - window.innerWidth;
      this.element.form.style.left = -Math.round(overWidth) + 20 + 'px';
    }
  }

  formHandler(e) {
    e.preventDefault();
    const formData = new FormData(this.element.form);
    const input = Object.fromEntries(formData);
    const dateEl = e.path[0].parentNode;

    let date;

    if (dateEl.classList.contains('previous-date')) {
      const d = e.path[0].parentNode.querySelector('h4').textContent;
      date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, d);
    } else if (dateEl.classList.contains('next-date')) {
      const d = e.path[0].parentNode.querySelector('h4').textContent;
      date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, d);
    } else {
      const d = e.path[0].parentNode.querySelector('h4').textContent;
      date = new Date(this.date.getFullYear(), this.date.getMonth(), d);
    }

    // create a new event
    const event = {
      id: Math.floor(Math.random() * 10000),
      event: input.event,
      date: date.toLocaleDateString(),
      status: +input['e-status'] || 3, // 1 normal, 2 important, 3 very important
    };

    // save to our data
    this.data.events.push(event);

    // append to the dom
    dateEl.appendChild(helper.createEvent(event));
    this.element.form.remove();
  }

  render() {
    this.element.days.append(this.generateDays());
    this.element.dates.append(this.generateDates());
  }
}
