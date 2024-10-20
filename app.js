const apiURL = 'https://66f91c872a683ce97310ee40.mockapi.io/api/v1/event';

async function fetchEvent() {
    await fetch(apiURL)
    .then(response => response.json())
    .then(data => displayData(data))
    .catch(error => console.log('Error: ', error));
}

fetchEvent();

function displayData(events) {
    const eventParentDiv = document.getElementById("events");
    eventParentDiv.innerHTML = "";

    events.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerHTML = `
        <div class="event-header">
            <img src="${event.avatar}" alt="Event Avatar">
            <div>
                <h3>${event.name}</h3>
                <small>${event.createdAt}</small>
            </div>
        </div>
        <h4>Location: ${event.location}</h4>
        <p>${event.description}</p>
        <h5>Organized by: ${event.organizer}</h5>
        <div class="actions">
            <button class="edit-btn" onclick="editEvent(${event.id})">Edit</button>
            <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
        </div>`;

        eventParentDiv.appendChild(eventDiv);
    });
}

//Add Event
document.getElementById('createEventForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const avatar = document.getElementById('avatar').value;
    const description = document.getElementById('description').value;
    const location = document.getElementById('location').value;
    const organizer = document.getElementById('organizer').value;

    const newEvent = {
        name: name,
        avatar: avatar,
        description: description,
        location: location,
        organizer: organizer,
        createdAt: new Date().toISOString()
    };

    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
    })
    .then(response => response.json())
    .then(data => {
        fetchEvent();
        document.getElementById('createEventForm').reset();
    })
    .catch(error => console.log(error));
});


// Delete Event
function deleteEvent(id) {
    fetch(`${apiURL}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(data => {
        alert(`${data.name} successfully deleted.`);
        fetchEvent();
    })
    .catch(error => console.log('Error deleting event:', error));
}

// Edit Event
function editEvent(id) {
    fetch(`${apiURL}/${id}`)
    .then(response => response.json())
    .then(event => {
        document.getElementById("create-event").style.display = "none";
        document.getElementById("update-event").style.display = "block";
        
        document.getElementById("updateEventForm").name.value = event.name;
        document.getElementById("updateEventForm").avatar.value = event.avatar;
        document.getElementById("updateEventForm").description.value = event.description;
        document.getElementById("updateEventForm").location.value = event.location;
        document.getElementById("updateEventForm").organizer.value = event.organizer;

        document.getElementById("updateEventForm").onsubmit = function(e) {
            e.preventDefault();

            const updatedData = {
                name: document.getElementById("updateEventForm").name.value,
                avatar: document.getElementById("updateEventForm").avatar.value,
                description: document.getElementById("updateEventForm").description.value,
                location: document.getElementById("updateEventForm").location.value,
                organizer: document.getElementById("updateEventForm").organizer.value,
                createdAt: new Date().toISOString()
            };

            fetch(`${apiURL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
            .then(response => response.json())
            .then((data) => {
                alert(`Event with name ${data.name} updated.`);
                fetchEvent();
                document.getElementById("update-event").style.display = "none";
                document.getElementById("create-event").style.display = "block";
            })
            .catch(error => console.log('Error updating event:', error));
        }
    })
    .catch(error => console.log('Error editing event:', error));
}
