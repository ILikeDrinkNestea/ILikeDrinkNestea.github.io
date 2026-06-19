console.log('JavaScript 載入成功，待辦事項功能已啟用。');

let visitorname = prompt('請輸入你的名字：');

if (visitorname === '' || visitorname === null){
    visitorname = '訪客'
}

window.alert('Hello ' + visitorname + '，歡迎來到課程成果頁面！');

const logoElement = document.getElementById('main-logo');
logoElement.innerText = visitorname + "'s Website";

const titleElement = document.getElementById('hero-title');
titleElement.innerHTML = `歡迎來到 <span class="highlight">${visitorname}</span> 的業師課程成果`;

function changeColor(){
    const highlight = document.querySelector('.highlight');
    if (highlight.style.color === 'red'){
        highlight.style.color = '#38bdf8'
    } else {
        highlight.style.color = 'red'
    }
}

function notifyUser(task, time) {
    if (Notification.permission === "granted") {
        new Notification("待辦事項提醒", { body : `${task}，時間：${time}` });
    }
}

function scheduleReminder(task, time) {
    const now = new Date();
    const reminderTime = new Date(time);
    const delay = reminderTime - now;

    if (delay > 0) {
        setTimeout(() => notifyUser(task, time), delay);
    }
}

function formatDateTime(time) {
    if (!time) {
        return '未設定提醒時間';
    }

    return new Date(time).toLocaleString('zh-TW');
}

function createTodoItem(task, time) {
    const li = document.createElement("li");
    li.className = "todo-item";

    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = task;

    const timeSpan = document.createElement("span");
    timeSpan.className = "todo-time";
    timeSpan.textContent = formatDateTime(time);

    const deleteButton = document.createElement("button");
    deleteButton.className = "todo-delete";
    deleteButton.textContent = "刪除";

    li.addEventListener("click", function() {
        li.classList.toggle("completed");
    });

    deleteButton.addEventListener("click", function(event) {
        event.stopPropagation();
        li.remove();
    });

    li.appendChild(textSpan);
    li.appendChild(timeSpan);
    li.appendChild(deleteButton);

    return li;
}

function addTodoFromValues(task, time) {
    const newTodoText = task.trim();

    if (newTodoText === '') {
        alert('請輸入待辦事項');
        return false;
    }

    document.getElementById("todo-list").appendChild(createTodoItem(newTodoText, time));

    if (time) {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
        scheduleReminder(newTodoText, time);
    }

    return true;
}

function addTodo() {
    const input = document.getElementById("todo-input");
    const timeInput = document.getElementById("todo-time");
    const success = addTodoFromValues(input.value, timeInput.value);

    if (success) {
        input.value = '';
        timeInput.value = '';
    }
}

function normalizeDateTime(value) {
    const dateMatch = value.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})[ T](\d{1,2}):(\d{2})/);

    if (!dateMatch) {
        return '';
    }

    const year = dateMatch[1];
    const month = dateMatch[2].padStart(2, '0');
    const day = dateMatch[3].padStart(2, '0');
    const hour = dateMatch[4].padStart(2, '0');
    const minute = dateMatch[5];

    return `${year}-${month}-${day}T${hour}:${minute}`;
}

function parseTodoCommand(message) {
    const hasTodoKeyword = message.includes('新增待辦') || message.includes('待辦') || message.includes('提醒我');

    if (!hasTodoKeyword) {
        return null;
    }

    const time = normalizeDateTime(message);
    const task = message
        .replace(/新增待辦|設定待辦|待辦|提醒我/g, '')
        .replace(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})[ T](\d{1,2}):(\d{2})/, '')
        .replace(/時間[:：]?/g, '')
        .trim();

    return {
        task: task,
        time: time
    };
}

const SendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const aiResponse = document.getElementById('ai-response');

SendBtn.addEventListener('click', function(){
    const userMessage = userInput.value.trim();

    if (userMessage === ''){
        alert('請輸入訊息或待辦指令');
        return;
    }

    setTimeout(function(){
        const todoCommand = parseTodoCommand(userMessage);

        if (todoCommand) {
            const success = addTodoFromValues(todoCommand.task, todoCommand.time);
            aiResponse.innerText = success
                ? `AI 回覆：已新增待辦「${todoCommand.task}」${todoCommand.time ? '，提醒時間是 ' + formatDateTime(todoCommand.time) : '，尚未設定提醒時間'}。`
                : 'AI 回覆：請在指令中加入待辦內容。';
        }
        else if (userMessage.includes('你好') || userMessage.includes('嗨')){
            aiResponse.innerText = 'AI 回覆：你好，很高興見到你！';
        } 
        else if (userMessage.includes('亮色') || userMessage.includes('淺色')){
            document.body.className = 'theme-light';
            aiResponse.innerText = 'AI 回覆：已切換成亮色主題。';
        }
        else if (userMessage.includes('矩陣') || userMessage.includes('綠色')){
            document.body.className = 'theme-matrix';
            aiResponse.innerText = 'AI 回覆：已切換成矩陣風格主題。';
        }
        else if (userMessage.includes('深色') || userMessage.includes('預設')){
            document.body.className = '';
            aiResponse.innerText = 'AI 回覆：已切換回預設主題。';
        }
        else {
            aiResponse.innerText = 'AI 回覆：我收到「' + userMessage + '」。你也可以輸入「新增待辦 交作業 2026-06-20 09:00」。';
        }
    }, 300)


    userInput.value = '';
});
