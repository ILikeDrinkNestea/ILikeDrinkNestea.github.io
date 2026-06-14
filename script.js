function notifyuser(task, time) {
    if (Notification.permission === "granted") {
        new Notification("Reminder", { body : `Time for ${task} at ${time}` });
    }
}

function scheduleReminder(task, time) {
    const now = new Date();
    const reminderTime = new Date(time);
    const delay = reminderTime - now;

    if (delay > 0) {
        setTimeout(() => notifyuser(task, time), delay);
    }
}

function addTodo() {
    const input = document.getElementById("todo-input");
    const timeInput = document.getElementById("todo-time");
    const newTodoText = input.value.trim();
    const reminderTime = timeInput.value;

    if (newTodoText !== '') {
        const li = document.createElement("li");
        li.className = "todo-item";

        const textSpan = document.createElement("span");
        textSpan.textContent = newTodoText;

        const timeSpan = document.createElement("span");
        timeSpan.textContent = reminderTime ? `提醒日期與時間: ${new Date(reminderTime).toLocaleString()}` : '沒有設定提醒時間';

        li.appendChild(textSpan);
        li.appendChild(timeSpan);

        li.onclick = function() {
            this.classlist.toggle("completed");
        };

        li.onclick = function() {
            this.remove();
        };
        
        document.getElementById("todo-list").appendChild(li);
        input.value = '';
        timeInput.value = '';

        if (reminderTime) {
            scheduleReminder(newTodoText, reminderTime);
        }
    }
}
