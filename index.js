const MESSAGE_HTML = `<div class="chat-message">
<img class="avatar" src="%avatar_url%" alt="Avatar">
<div class="message-content">
    <div class="message-header">
        <h3 class="sender-name">%sender_name%</h3>
        <small class="message-time">%time%</small>
    </div>
    <div class="message-text">%message_text%</div>
</div>
</div>`;
const HELP_MESSAGE = `This is an alternative ChatGPT client, accessible without a VPN by your personal access key. The client is very lightweight and supports multiple language models.

Available commands:`
const ABC = `abcdefghijklmnopqrstuvwxyz`;
const AVATAR_URL = `https://i0.wp.com/cdn.auth0.com/avatars/${ABC.at(new Number(new Date) % 10) || 'e'}${ABC.at(9 - new Number(new Date) % 10) || 'x'}.png?ssl=1`;
const ASSISTANT_AVATAR_URL = `./static/images/openai-nobg.png`;

const BOT_COMMANDS = {
    remove: {
        help: "removes the saved access token",
        f: () => {
            localStorage.removeItem("accessToken")
            drawMessage('Token has beed destroyed!');
        }
    },
    help: {
        help: "show this help",
        f: () => drawMessage(HELP_MESSAGE + '\n\n\n- ' + Object.keys(BOT_COMMANDS).join("\n\n- "))
    }
}

var drawMessage = (textarea) => {
    document.querySelector("#chat").innerHTML += translateString(MESSAGE_HTML,
            [ '%avatar_url%', '%sender_name%', '%time%', '%message_text%' ],
            [ typeof textarea === 'object' ? AVATAR_URL : ASSISTANT_AVATAR_URL, typeof textarea === 'object' ? 'User' : 'Assistant', new Date().toLocaleTimeString(), markdown(typeof textarea === 'object' ? textarea.value : textarea) ]
        )
    
    try {
        textarea.value = new String();
        textarea.style.height = "32px";
    } catch (error) {
        null;        
    }
    window.scrollTo(0, document.body.scrollHeight);
}

var checkToken = () => {
    console.log(Object.keys(localStorage));
    if (!Object.keys(localStorage).includes("accessToken")) {
        drawMessage(`Before starting you need to send me an access token from OpenAI. I will try to save it in \`localStorage\` of your browser. 
        
To remove access token send me a command \`/remove\`.`);

        let token = prompt("Input your OpenAI access token here:");
        if (token) {
            localStorage.setItem("accessToken", token);
            ChatGPT.uo.accessToken = token;
            drawMessage(`Token successfully saved! Now you can send me messages!`);
        } else {
            window.location.reload();            
        }

    }
}


var messageHandler = (text) => {
    let t = new String(text).trim();
    console.log(t);
    
    if (t.at(0) === "/") {
        try {
            BOT_COMMANDS[t.slice(1)].f()
        } catch {
            drawMessage(`Invalid command. Please, use \`/help\` to know about commands`);
        }
    } else {
        ChatGPT.ask(t)
            .then(r => {
                console.log(r);
                drawMessage(r.choices[0].message);
            })
            .catch(e => {
                console.log(e);
                drawMessage(`${e}`);
            })
    }
}


window.onload = () => {

    $('#welcome_message_time')[0].innerText = new Date().toLocaleTimeString();

    var textarea = $('#textarea')[0];
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
        window.scrollTo(0, document.body.scrollHeight);
    });

    textarea.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.keyCode === 13 && !e.ctrlKey && !e.shiftKey && !!textarea.value) {
            let tav = textarea.value;
            drawMessage(textarea);
            messageHandler(tav);
        }
    })

    console.log(ChatGPT);
    
    checkToken();
}