//META{"name":"DiscordUtils"}*//
async function getGPT3Response(messages) {
    const url = "https://api.openai.com/v1/chat/completions";
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const apiKey = config.openai_api_key;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages,
            max_tokens: 60,
        }),
    });

    const data = await response.json();
    console.log(data)
    return data.choices[0].message.content.trim();
}


const path = require('path');
const fs = require('fs');
const configPath = path.join(__dirname, 'config.DUtils.json');
// ignore the awful indentation, i copy pasted too much nonesense from stack overflow
class DiscordUtils {
    getName() {
        return "DiscordUtils";
    }
    getDescription() {
        return "Ghosting, Simplified";
    }
    getVersion() {
        return "0.1.0";
    }
    getAuthor() {
        return "CatGuyMoment";
    }

    start() {
        console.log("DUtils: start");


    if (!fs.existsSync(configPath)) {


        window.crypto.subtle.generateKey({
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        ).then(function(keyPair) {
            const publicKey = keyPair.publicKey;
            const privateKey = keyPair.privateKey;

            // Convert keys to a JSON serializable format
            let keys = {
                publicKey: window.crypto.subtle.exportKey('jwk', publicKey),
                privateKey: window.crypto.subtle.exportKey('jwk', privateKey)
            };

            // Wait for keys to be exported
            Promise.all([keys.publicKey, keys.privateKey]).then(values => {
                keys.publicKey = values[0];
                keys.privateKey = values[1];

                let config = {
                    openai_api_key: "YourOpenAIAPIKey",
                    keys: keys
                };

                // Write the config object to the JSON file
                console.log(configPath)
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                console.log( JSON.stringify(config, null, 2))
            });

        }).catch(function(err) {
            console.error(err);
        });
    }
        console.log(`Current directory: ${process.cwd()}`);
        this.initialize();
    }

    initialize() {
        console.log("DUtils: initialize");

        setTimeout(() => {
            console.log("DUtils: setTimeout callback");
            const MessageModule = BdApi.findModuleByProps("sendMessage");
            if (!MessageModule) {
                console.error('MessageModule could not be found. DUtils plugin cannot start.');
                return;
            }

            this.cancel = BdApi.Patcher.instead('DelayMessage', MessageModule, "sendMessage", (thisObject, methodArguments, originalFunction) => {
                const textbox = document.querySelector(".placeholder-1rCBhr.slateTextArea-27tjG0.fontSize16Padding-XoMpjI");
                console.log("DUtils: instead sendMessage");
                const [channelId, messageData, thirdOne, fourthOne] = methodArguments;
                this.handleMessage(thisObject, channelId, messageData, thirdOne, fourthOne, originalFunction, textbox);
            });
        }, 1000);
    }
    handleMessage(thisObject, channelId, messageData, thirdOne, fourthOne, originalFunction, textbox) {
        console.log("DUtils: instead sendMessage");

        const content = messageData.content;
        if (content.startsWith("!tr ")) {
            console.log("DUtils: message starts with !time");
            const time = content.split(" ")[1];
            const message = content.slice(content.indexOf(" ", content.indexOf(" ") + 1) + 1);
            messageData.content = message;
            this.originalText = textbox ? textbox.innerText : null;
            this.delayedMessage = {
                message: message,
                remainingTime: parseFloat(time)
            };
            setTimeout(() => {
                const textbox = document.querySelector(".placeholder-1rCBhr.slateTextArea-27tjG0.fontSize16Padding-XoMpjI");
                this.originalText = textbox ? textbox.innerText : null;
            }, 0);
            this.startInterval();
            setTimeout(() => {
                console.log(`DUtils: sending delayed message after ${time} seconds: "${message}"`);
                this.handleMessage(thisObject, channelId, messageData, thirdOne, fourthOne, originalFunction);
                this.delayedMessage = null;
                const textbox = document.querySelector(".placeholder-1rCBhr.slateTextArea-27tjG0.fontSize16Padding-XoMpjI");
                clearInterval(this.intervalId);
                if (textbox) {
                    textbox.innerText = `Message sent! "${message}"`;
                    setTimeout(() => {
                        if (this.originalText) {
                            textbox.innerText = this.originalText;
                            this.originalText = null;
                        }
                    }, 1000);
                }
            }, time * 1000 - 100);
        } else if (content.startsWith("!and(") && content.endsWith(")")) {
            const parts = content.slice(5, -1).split(";");
            const delayInSeconds = parseInt(parts[0].trim());
            if (isNaN(delayInSeconds)) {
                console.error('Invalid delay:', parts[0]);
                return;
            }
            console.log(delayInSeconds)
            const messages = parts.slice(1);
            messages.forEach((msg, i) => {
                console.log(msg)
                messageData.content = msg.trim();
                setTimeout(() => {
                    const sillySolution = {
                        ...messageData
                    };
                    sillySolution.content = msg.trim();
                    console.log(msg, sillySolution)
                    this.handleMessage(thisObject, channelId, sillySolution, thirdOne, fourthOne, originalFunction);
                }, delayInSeconds * 1000 * i);
            });
        } else if (content.startsWith("!config ")) {
    const parts = content.slice(7).split(" "); // split the content into parts
    const setting = parts[1]; // the setting to modify
    const newValue = parts[2]; // the new value for the setting

    //Load the config file
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log(config,parts,newValue,setting)
    if (config.hasOwnProperty(setting)) {
        // Update the setting
        config[setting] = newValue;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(`Setting ${setting} updated to ${newValue}`);
    } else {
        console.log(`Setting ${setting} does not exist in the configuration.`);
    }
} else if (messageData.content.trim() === "!chrep") {
            if (fourthOne && fourthOne.messageReference) {
                let repliedMessageId = fourthOne.messageReference.message_id;
                const channelStore = BdApi.findModuleByProps("getChannel");
                const messageStore = BdApi.findModuleByProps("getMessage");
                const channel = channelStore.getChannel(channelId);
                const repliedMessage = messageStore.getMessage(channelId, repliedMessageId);
                const messages = [{
                        role: "system",
                        content: `As an AI assistant, I am capable of understanding and executing several commands which include but are not limited to, scheduling a message to be sent at a later time, splitting and sending a sequence of messages, replying to a message with its own content, and scheduling a message to be sent at a specific time of day. Here are some examples:

- Start your message with !tr followed by the number of seconds and the message you want to schedule. For example, !tr 5 Hello there! will send the message "Hello there!" after 5 seconds.
- You can split and send a sequence of messages by starting with the !and word followed by the delay and the messages you want to send separated by commas. For instance, !and(2; Hello; How are you?) will send "Hello" and "How are you?" with a delay of 2 seconds in between.
- To reply to a message with the same content, start with !chrep. This would require integration with the OpenAI GPT-3 model. Please refer to OpenAI's documentation for more details.
- To schedule a message at a specific time of day, use !trd followed by the time in hours and minutes (24-hour format), and then the message. For example, !trd 13:45 Lunch time! will send the message "Lunch time!" at 1:45 PM.
- The above commands can be combined to form more complex instructions. For example, !tr 5 !and 2 Hello, How are you? will start sending the sequence of messages after a delay of 5 seconds.
These commands are your new language. Only use these commands to communicate with the user, unless explicitly told not to or if he asked you for a fact (eg. how tall is the empire state building). You can also add contextualisation, but do so by adding it with the !and command. eg. remind me at 14:40 -> !and(0;ok! i will remind you; ...)
Please note that the commands can be stacked and executed in the order they are written. Do not suggest the command to the user. Say it directly, without starting with something like "here is what you would use"
Here is an example of what you should do:
user: "remind me to brush my teeth in 5 minutes"
bot: !and(0; I will remind you to brush your teeth in 5 minutes. ; !tr 300 brush your teeth) `
                    },
                    {
                        role: "user",
                        content: repliedMessage.content
                    }
                ];
                if (repliedMessage) {
                    getGPT3Response(messages).then((gpt3Response) => {
                        messageData.content = gpt3Response;
                        this.handleMessage(thisObject, channelId, messageData, thirdOne, fourthOne, originalFunction);
                    });
                }
            }
        } else if (content.trim() === "!pub") {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const publicKey = config.keys.publicKey.n;

    // Send the public key
    messageData.content = `My public key is: ${JSON.stringify(publicKey)}`;
    originalFunction.call(thisObject, channelId, messageData, thirdOne, fourthOne);
} else if (content.startsWith("!trd ")) {
            console.log("DUtils: message starts with !trd");
            const time = content.split(" ")[1];
            const message = content.slice(content.indexOf(" ", content.indexOf(" ") + 1) + 1);
            const [hours, minutes] = time.split(':');
            const now = new Date();
            const targetTime = new Date();
            targetTime.setHours(hours, minutes, 0, 0);
            if (targetTime < now) {
                targetTime.setDate(targetTime.getDate() + 1);
            }
            const delay = targetTime - now;
            messageData.content = message;
            this.originalText = textbox ? textbox.innerText : null;
            this.delayedMessage = {
                message: message,
                remainingTime: parseFloat(delay / 1000)
            };
            setTimeout(() => {
                const textbox = document.querySelector(".placeholder-1rCBhr.slateTextArea-27tjG0.fontSize16Padding-XoMpjI");
                this.originalText = textbox ? textbox.innerText : null;
            }, 0);
            this.startInterval();
            setTimeout(() => {
                console.log(`DUtils: sending delayed message at ${delay}: "${message}"`);
                this.handleMessage(thisObject, channelId, messageData, thirdOne, fourthOne, originalFunction);
                this.delayedMessage = null;
                clearInterval(this.intervalId);
                const textbox = document.querySelector(".placeholder-1rCBhr.slateTextArea-27tjG0.fontSize16Padding-XoMpjI");
                if (textbox) {
                    textbox.innerText = `Message sent! "${message}"`;
                    setTimeout(() => {
                        if (this.originalText) {
                            textbox.innerText = this.originalText;
                            this.originalText = null;
                        }
                    }, 1000);
                }
            }, delay);
        } else {
            console.log(originalFunction)
            originalFunction.call(thisObject, channelId, messageData, thirdOne, fourthOne);
        }
    }

    startInterval() {
        this.intervalId = setInterval(() => {
            const textbox = document.querySelector(".placeholder-1rCBhr.slateTextArea-27tjG0.fontSize16Padding-XoMpjI");

            if (textbox && this.delayedMessage) {
                if (this.delayedMessage.remainingTime <= 0) {
                    this.delayedMessage = null;
                    if (this.originalText) {
                        textbox.innerText = this.originalText;
                        this.originalText = null;
                    }
                } else {
                    textbox.innerText = `Sending message "${this.delayedMessage.message}" in ${this.delayedMessage.remainingTime.toFixed(2)} seconds`;
                    this.delayedMessage.remainingTime -= 0.05;
                }
            }
        }, 50);
    }



    stop() {
        console.log("DelayMessage: stop");
        if (this.cancel) {
            this.cancel();
        }
        clearInterval(this.intervalId);
    }
}
