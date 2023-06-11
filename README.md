# DiscordUtils: Ghosting, simplified.

## Introduction

`DiscordUtils` is a plugin for Discord that "enhances" your friend ghosting experience.

## Features

### Delay Sending a Message 

If you wish to delay the sending of a message, use the `!tr` command followed by the delay in seconds, and then the message. For example, `!tr 5 Hello World!` will send "Hello World!" after a delay of 5 seconds.

**Usage:** `!tr` `delay [SECONDS]` `message`


### Send Multiple Messages with a Delay

To send multiple messages with a delay between each one, use the `!and` command followed by the delay in seconds and then the messages, separated by commas. For example, `!and 3 Hello, How are you?, Goodbye!` will send "Hello", "How are you?", and "Goodbye!" with a delay of 3 seconds between each message.

**Usage:** `!and(``message1`; `message2`; `...)`

### Send a Message at a Particular Time

You can schedule a message to be sent at a particular time with the `!trd` command. For example, `!trd 12:30 It's lunchtime!` will send "It's lunchtime!" at 12:30.

**Usage:** `!trd` `time [24HOURSYSTEM]` `message`


### Integrated with OpenAI's GPT-3 API

The plugin also includes an integration with OpenAI's GPT-3 API. If you reply to a message with `!chrep`, the bot will use the replied message as input to the GPT-3 API and send the response as a message, and is capable of using the commands above to automatically respond to your friends' needs. Please note that this requires a valid API key.

**Usage:** `!chrep` (replying to a message)

### Stackable Commands

Commands provided by the DelayMessage plugin are stackable, allowing you to mix and match them for more complex interactions. For example, you can schedule a message to be sent at a particular time and also specify that it should automatically reply to a certain message with GPT-3.

**Examples of usage:**

`!and(0; reminding you to go to bed; !trd 22:00 go to bed)`

`!trd 16:20 !and(0.7; OH MY GOD BRO; IT'S 4:20 OMG!!!!!)`

## Limitations/ Known Issues

1. Awful textbox message handling
2. Delayed messages do not support attachments
3. Stacking delays breaks textbox messages

## Planned features

"!config" command which lets you quickly change settings like your GPT-3 API key

## Installation

This plugin is designed to be used with the BetterDiscord application. To install:

1. Download "silliness.plugin.js"
2. Open BetterDiscord
3. Navigate to User Settings > Plugins
4. Click on "Open Plugins Folder"
(Optional step: edit the "silliness.plugin.js file and add your API key to be able to use the !chrep command)
5. Move the downloaded plugin file into the Plugins folder
6. Switch the plugin toggle to "ON"
7. The plugin should now be available for use

