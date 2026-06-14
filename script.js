// 頁面載入時，主動請求通知權限
document.addEventListener("DOMContentLoaded", () => {
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
});

function notifyUser(task, time) {
    if (Notification.permission === "granted") {
        new Notification("待辦事項提醒", { 
            body: `該執行工作囉：${task} (${new Date(time).toLocaleString()})`,
            icon: "https://cdn-icons-png.flaticon.com/512/1792/1792931.png" // 可自行更換圖示
        });
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

function addTodo() {
    const input = document.getElementById("todo-input");
    const timeInput = document.getElementById("todo-time");
    const newTodoText = input.value.trim();
    const reminderTime = timeInput.value;

    // 檢查防呆：內容不可為空
    if (newTodoText === '') {
        alert("請輸入待辦事項內容！");
        return;
    }

    // 檢查防呆：提醒時間不可為過去的時間
    if (reminderTime) {
        const now = new Date();
        const chosenTime = new Date(reminderTime);
        if (chosenTime <= now) {
            alert("提醒時間不能設定為過去的時間！");
            return;
        }
    }

    // 建立列表項目 (li)
    const li = document.createElement("li");
    li.className = "todo-item";

    // 建立左側內容區塊 (包含文字與時間)
    const contentDiv = document.createElement("div");
    contentDiv.className = "todo-content";

    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = newTodoText;

    const timeSpan = document.createElement("span");
    timeSpan.className = "todo-date";
    timeSpan.textContent = reminderTime ? `⏰ 提醒時間: ${new Date(reminderTime).toLocaleString()}` : ' 沒有設定提醒時間';

    contentDiv.appendChild(textSpan);
    contentDiv.appendChild(timeSpan);
    li.appendChild(contentDiv);

    // 點擊左側內容區塊，可以切換「完成/未完成」狀態
    contentDiv.onclick = function() {
        li.classList.toggle("completed");
    };

    // 建立右側刪除按鈕
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "刪除";
    deleteBtn.onclick = function(event) {
        event.stopPropagation(); // 防止觸發父層的完成狀態切換
        li.remove();
    };
    li.appendChild(deleteBtn);
    
    // 加入清單
    document.getElementById("todo-list").appendChild(li);
    
    // 安排排程提醒
    if (reminderTime) {
        scheduleReminder(newTodoText, reminderTime);
    }

    // 清空輸入框並還原焦點
    input.value = '';
    timeInput.value = '';
    input.focus();
}

// 支援按下 Enter 鍵也能直接新增
document.getElementById("todo-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTodo();
    }
});
