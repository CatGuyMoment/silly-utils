//META{"name":"DelayMessage"}*//

class DelayMessage {
    getName() {return "DelayMessage";}
    getDescription() {return "Ghosting, simplified";}
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
                        originalFunction.call(thisObject, channelId, messageData, thirdOne, fourthOne);
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
                        originalFunction.call(thisObject, channelId, messageData, thirdOne, fourthOne);
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
                    
                    originalFunction.call(thisObject, channelId, messageData, thirdOne, fourthOne);
                }
            });
        }, 1000); 
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
