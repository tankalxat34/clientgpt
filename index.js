const MESSAGE_HTML = `<div class="chat-message">
<img class="avatar" src="%avatar_url%" alt="Avatar">
<div class="message-content">
    <div class="message-header">
        <h3 class="sender-name">%sender_name%</h3>
        <small class="message-time">%time%</small>
    </div>
    <div class="message-text">%message_text%</div>
</div>
</div>`
const AVATAR_URL = `https://i0.wp.com/cdn.auth0.com/avatars/ex.png?ssl=1`


var drawMessage = (textarea) => {
    document.querySelector("#chat").innerHTML += translateString(MESSAGE_HTML,
        [ '%avatar_url%', '%sender_name%', '%time%', '%message_text%' ],
        [ AVATAR_URL, 'User', new Date().toLocaleTimeString(), markdown(textarea.value) ]
        )
    textarea.value = new String();
    textarea.style.height = "32px";
    window.scrollTo(0,document.body.scrollHeight);
}

window.onload = () => {

    var textarea = document.getElementById('textarea');
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
        window.scrollTo(0,document.body.scrollHeight);
    });

    textarea.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.keyCode === 13 && !e.ctrlKey && !e.shiftKey) drawMessage(textarea);
    })
    document.querySelector("#send").addEventListener("click", () => drawMessage(textarea))

    console.log(ChatGPT);
}