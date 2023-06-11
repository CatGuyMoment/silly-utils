//META{"name":"DelayMessage"}*//

async function getGPT3Response(messages) {
    const url = "https://api.openai.com/v1/chat/completions";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer KEY HERE",  // Replace this with your actual API key
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
// ignore the awful indentation, i copy pasted too much nonesense from stack overflow
class DelayMessage {
    getName() {return "DiscordUtils";}
    getDescription() {return "Ghosting, Simplified";}
    getVersion() {return "0.1.0";}
    getAuthor() {return "CatGuyMoment";}

    start() {
        console.log("DelayMessage: start");
        this.initialize();
    }

    initialize() {
        console.log("DelayMessage: initialize");

        setTimeout(() => {
            console.log("DelayMessage: setTimeout callback");
            const MessageModule = BdApi.findModuleByProps("sendMessage");
            if(!MessageModule) {
                console.error('MessageModule could not be found. DelayMessage plugin cannot start.');
                return;
            }

            this.cancel = BdApi.Patcher.instead('DelayMessage', MessageModule, "sendMessage", (thisObject, methodArguments, originalFunction) => {
                const textbox = document.querySelector(".placeholder-1rCBhr.slateTextArea-27tjG0.fontSize16Padding-XoMpjI");
                console.log("DelayMessage: instead sendMessage");
                const [channelId, messageData, thirdOne, fourthOne] = methodArguments;
                this.handleMessage(thisObject, channelId, messageData, thirdOne, fourthOne, originalFunction, textbox);
            });
        }, 1000);
    }
    handleMessage(thisObject, channelId, messageData, thirdOne, fourthOne, originalFunction, textbox) {
                console.log("DelayMessage: instead sendMessage");
                
                const content = messageData.content;
                if (content.startsWith("!tr ")) {
                    console.log("DelayMessage: message starts with !time");
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
                    },0);
                    this.startInterval();
                    setTimeout(() => {
                        console.log(`DelayMessage: sending delayed message after ${time} seconds: "${message}"`);
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
                    setTimeout(() => {
                         messageData.content = msg.trim();
                            originalFunction.call(thisObject, channelId, messageData, thirdOne, fourthOne);
                    }, delayInSeconds * 1000 * i); 
                    });
            } else if (messageData.content.trim() === "!chrep") {
                    if(fourthOne && fourthOne.messageReference) {
                        let repliedMessageId = fourthOne.messageReference.message_id;
                        const channelStore = BdApi.findModuleByProps("getChannel");
                        const messageStore = BdApi.findModuleByProps("getMessage");
                        const channel = channelStore.getChannel(channelId);
                        const repliedMessage = messageStore.getMessage(channelId, repliedMessageId);
                        const messages = [
                    {role: "system", content: "You are a helpful chatbot, replacing a user while he is away. You have a few commands to help you replace the user: !and(delay,message1,message2,...) eg. !and(0.7;by the way; did you know; that 2+2 = 4) !tr delay msg: delays message, in seconds; !trd timein24hours msg, schedules messages for a specific time, eg. !trd 18:30 go to french lessons. You can also combine your commands. Eg. !and(0; i will remind you at 18:30; !trd 18:30 reminding you right now!)"},
                    {role: "user", content: repliedMessage.content}
                ];
                        if (repliedMessage) {
                            getGPT3Response(messages).then((gpt3Response) => {
                            messageData.content = gpt3Response;
                            this.handleMessage(thisObject, channelId, messageData, thirdOne, fourthOne,originalFunction);
                     });
            }
                    }
                } else if (content.startsWith("!trd ")) {
                    console.log("DelayMessage: message starts with !trd");
                    const time = content.split(" ")[1];
                    const message = content.slice(content.indexOf(" ", content.indexOf(" ") + 1) + 1);
                    const [hours, minutes] = time.split(':');
                    const now = new Date();
                    const targetTime = new Date();
                    targetTime.setHours(hours, minutes, 0, 0);
                    if(targetTime < now) {
                        targetTime.setDate(targetTime.getDate() + 1);
                    }
                    const delay = targetTime - now;
                    messageData.content = message;
                    this.originalText = textbox ? textbox.innerText : null;
                    this.delayedMessage = {
                        message: message,
                        remainingTime: parseFloat(delay/1000)
                    };
                    setTimeout(() => {
                        const textbox = document.querySelector(".placeholder-1rCBhr.slateTextArea-27tjG0.fontSize16Padding-XoMpjI");
                        this.originalText = textbox ? textbox.innerText : null;
                    },0);
                    this.startInterval();
                    setTimeout(() => {
                        console.log(`DelayMessage: sending delayed message at ${delay}: "${message}"`);
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
                if(this.delayedMessage.remainingTime <= 0) {
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
        if(this.cancel) {
            this.cancel();
        }
        clearInterval(this.intervalId);
    }
}
