document.addEventListener('DOMContentLoaded', () => {

  const notesInput = document.getElementById('notes');
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const pills = document.querySelectorAll('.pill');

  const API_KEY = 'AIzaSyBjGW9bHUG6lGl-7jJQc9RIHBxrhJ_lEh0';

  function addMessage(role, text) {
    const message = document.createElement('div');
    message.classList.add('message', role);

    if (role === 'buddy') {
      const avatar = document.createElement('div');
      avatar.classList.add('avatar');
      avatar.textContent = 'SB';
      message.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    console.log('original text:', text);
    bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
    message.appendChild(bubble);

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function sendMessage(userText) {
    if (!userText.trim()) return;

    addMessage('user', userText);
    userInput.value = '';
    addMessage('buddy', 'Thinking...');

    const notes = notesInput.value;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{
              text: `You are a helpful and friendly study buddy. The user has provided these notes: ${notes}. Use these notes to help them. Write equations in plain text only, never use LaTeX. Now respond to this: ${userText}`
            }]
          }
        ]
      })
    });

    const data = await response.json();
    console.log(data);
    const reply = data.candidates[0].content.parts[0].text;

    const bubbles = chatBox.querySelectorAll('.message.buddy .bubble');
   bubbles[bubbles.length - 1].innerHTML = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
  }

  sendBtn.addEventListener('click', () => {
    sendMessage(userInput.value);
  });

  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage(userInput.value);
    }
  });

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      sendMessage(pill.textContent);
    });
  });

});