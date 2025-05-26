const eventList = JSON.parse(localStorage.getItem('events')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('event-form');
    const eventContainer = document.getElementById('event-container');

    // Fetch and display events from backend
    async function fetchEvents() {
        try {
            const response = await fetch('http://192.168.0.112:3000/api/events');
            const events = await response.json();
            displayEvents(events);
        } catch (err) {
            eventContainer.innerHTML = '<div style="color:red;">Failed to load events.</div>';
        }
    }

    // Display events in the UI
    function displayEvents(events) {
        eventContainer.innerHTML = '';
        events.forEach((event, index) => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.innerHTML = `<strong>${event.event_name}</strong> - ${event.event_date} <button class="delete-btn" data-index="${index}">Delete</button>`;
            eventContainer.appendChild(eventDiv);
        });
        attachDeleteEvent(events);
    }

    // Attach delete event listeners
    function attachDeleteEvent(events) {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach((button, idx) => {
            button.addEventListener('click', async () => {
                const event = events[idx];
                try {
                    const response = await fetch(`http://192.168.0.112:3000/api/events/${encodeURIComponent(event.event_name)}/${event.event_date}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        displayToast('Event deleted!');
                        fetchEvents();
                    } else {
                        displayToast('Failed to delete event.');
                    }
                } catch (err) {
                    displayToast('Error connecting to server.');
                }
            });
        });
    }

    // Toast notification
    function displayToast(message) {
        let toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 400);
        }, 1800);
    }

    // Handle form submit
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const eventName = document.getElementById('event-name').value;
        const eventDate = document.getElementById('event-date').value;

        if (eventName && eventDate) {
            try {
                const response = await fetch('http://192.168.0.112:3000/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ event_name: eventName, event_date: eventDate })
                });
                if (response.ok) {
                    displayToast('Event saved to database!');
                    eventForm.reset();
                    fetchEvents();
                } else {
                    displayToast('Failed to save event.');
                }
            } catch (err) {
                displayToast('Error connecting to server.');
            }
        }
    });

    // Initial fetch
    fetchEvents();
});