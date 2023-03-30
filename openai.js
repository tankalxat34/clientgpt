
/**
 * Models list
 */
var models = [
    "gpt-3.5-turbo", 
    "gpt-3.5-turbo-0301",
    "gpt-4", 
    "gpt-4-0314", 
    "gpt-4-32k", 
    "gpt-4-32k-0314", 
]

/**
 * Object to implement ChatGPT. 
 * Must be set to `access_token`
 */
var ChatGPT = {
    access_token: '',
    model: 'gpt-3.5-turbo',
    conversation: new Array(),
    get_headers: function () {
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(this.access_token.trim()),
        };
    },
    /**
     * Clears up the context of the conversation
     */
    clear_context: function () {
        this.conversation = new Array()
    },
    /**
     * Returns a string with the model name
     * @returns `String`
     */
    get_model: function () {
        return this.model;
    },
    /**
     * Makes an asynchronous ChatGPT request. Returns promis.
     * @param {s} s string query
     * @returns promis `r.json()`
     */
    ask: async function (s, save_conversation = true) {
        save_conversation ? this.save_conversation({ "role": "user", "content": s }) : null;
    
        const url = "https://api.openai.com/v1/chat/completions";
    
        const headers = this.get_headers();
    
        const data = {
            model: this.get_model(),
            messages: this.conversation,
        };
    
        const request = new Request(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
    
        try {
            const response = await fetch(request);
            const data = await response.json();
            if (!response.ok) {
                return await data.error.message;
            }
            if (save_conversation) {
                try {
                    this.save_conversation(data.choices[0].message);
                } catch {
                    null;
                }
            }
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * Sets ChatGPT access token
     * @param {s} s string token
     */
    set_token: function (s) {
        this.access_token = s.trim();
    },
    /**
     * Saves a message in a conversation with the ChatGPT bot
     * @param {section} { "role": "user", "content": s }
     */
    save_conversation: function (section) {
        this.conversation.push(section);
    },
    /**
     * Returns a deep copy of the current object
     * @returns `Object`
     */
    copy: function () { return JSON.parse(JSON.stringify(this)) },
    /**
     * Get the current accessToken
     * @returns accessToken
     */
    get_accessToken: function () { return this.access_token }
}