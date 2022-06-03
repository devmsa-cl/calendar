import Calendar from './assets/js/Calendar.js';
import * as Model from './Model.js';
import Event from './assets/js/Event.js';
import * as helper from './helper.js';
const addBtn = document.querySelector('.add-btn');
const form = document.querySelector('.form');
const formContainer = document.querySelector('.form-container');
function app() {
  const calendar = new Calendar(
    document.querySelector('#calendar'),
    Model.state
  );
  calendar.render();

  const newEvent = new Event(Model.state);

  document.querySelector('#calendar').appendChild(newEvent.element.root);

  addBtn.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');

    btn.classList.toggle('active');
    formContainer.classList.toggle('active');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const input = Object.fromEntries(formData);

    let event = {
      id: Math.floor(Math.random() * 10000),
      event: input.event,
      date: new Date(
        input['event-date'].replace(/-/g, '/')
      ).toLocaleDateString(),
      status: +input['event-status'] || 3,
      done: false, // 0 false, 1 true,
    };
    Model.state.events.push({ ...event });

    form.querySelectorAll('input').forEach((input) => {
      if (input.type === 'text') {
        input.value = '';
      } else if (input.type === 'date') {
        input.value = '';
      } else {
        input.checked = false;
      }
    });
    // append the new event on the page if it new event date match current display calendar
    insertNewEvent(event);
  });

  function insertNewEvent(event) {
    const current = new Date(Model.state.currentDate);
    const curYear = current.getFullYear();
    const curMonth = current.getMonth();
    const curEvent = new Date(event.date);

    if (
      curYear === curEvent.getFullYear() &&
      curMonth === curEvent.getMonth()
    ) {
      const dateEl = document.querySelectorAll('.date');

      //create a event
      const newEvent = helper.createEvent(event);
      // append to the calendar
      dateEl[curEvent.getDate() - 1].appendChild(newEvent);
    } else {
      // case when new event is in the new month
      const currentMonthLastDay = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0
      ).getDay();

      if (currentMonthLastDay !== 6) {
        // check new event date is between the cells
        // const eventDate = new Date(curEvent.date).getDay();
        if (curEvent.getDay() > currentMonthLastDay && curEvent.getDay() <= 6) {
          const dateEl = [...document.querySelectorAll('.next-date')];
          // create a event
          const newEvent = helper.createEvent(event);
          // append to the calendar
          dateEl[curEvent.getDay() - dateEl.length + 1].appendChild(newEvent);
        }
      }
    }
  }
}

app();
