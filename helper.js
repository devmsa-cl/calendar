export const eventColor = (cl) => {
  if (cl === 3) {
    return "impt-3";
  }
  if (cl === 2) {
    return "impt-2";
  }
  if (cl === 1) {
    return "impt-1";
  }
};

export const createEvent = (event) => {
  const span = document.createElement("span");
  span.classList.add(eventColor(event.status));
  span.dataset.id = event.id;
  span.textContent = event.event;

  return span;
};
