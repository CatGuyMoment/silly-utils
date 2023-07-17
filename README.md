![Silly Cover](silly-cover.png)

## Introduction

`DiscordUtils` is a plugin for Discord that "enhances" your friend ghosting experience.

## Features

### Delay Sending a Message 

If you wish to delay the sending of a message, use the `!tr` command followed by the delay in seconds, and then the message. For example, `!tr 5 Hello World!` will send "Hello World!" after a delay of 5 seconds.

**Usage:** `!tr` `delay [SECONDS]` `message`


### Send Multiple Messages with a Delay

To send multiple messages with a delay between each one, use the `!and` command followed by the delay in seconds and then the messages, separated by semicolons. For example, `!and(3; Hello; How are you?; Goodbye!)` will send "Hello", "How are you?", and "Goodbye!" with a delay of 3 seconds between each message.

**Usage:** `!and(` `message1`; `message2`; `...)`

### Send a Message at a Particular Time

You can schedule a message to be sent at a particular time with the `!trd` command. For example, `!trd 12:30 It's lunchtime!` will send "It's lunchtime!" at 12:30.

**Usage:** `!trd` `time [24HOURSYSTEM]` `message`

### RSA Encryption/Decryption System

This feature allows you to encrypt your messages for an added layer of security, and subsequently decrypt them. Your messages will only be visible to the intended recipients, ensuring secure communication.

**Usage:**

`!pub` (Sends public key in chat)

`!enc` `message` (replying to a public key, for encryption)

`!dec` (decrypts all messages within a channel or DM)

### Await a Response before Sending a Message

The `!await` command allows you to delay sending a message until a new message is received in the current channel. This is especially useful when you want to ensure that you respond only after the other party has sent their message. To use this command, simply prefix your message with !await. To delay an awaited message, simply stack it with the `!tr` command.

**Usage:** `!await` `message`

### Integrated with OpenAI's GPT-3 API

The plugin also includes an integration with OpenAI's GPT-3 API. If you reply to a message with `!chrep`, the bot will use the replied message as input to the GPT-3 API and send the response as a message, and is capable of using the commands above to automatically respond to your friends' needs. Please note that this requires a valid API key.

**Usage:** `!chrep` (replying to a message)

You can also get GPT-3 to automatically correct and/or add punctiation to your messages.

**Usage:** `!rr` `!message`

### Stackable Commands

Commands provided by the DiscordUtils plugin are stackable, allowing you to mix and match them for more complex interactions. For example, you can schedule a message to be sent at a particular time and also specify that it should automatically reply to a certain message with GPT-3.

**Examples of usage:**

`!and(0; ok ill remind you to go to bed at 10pm; !trd 22:00 go to bed)`

`!trd 16:20 !and(0.7; OH MY GOD BRO; IT'S 4:20 OMG!!!!!; !aw ikrrr)`

`!aw !tr 1 !and(1; anyways; gtg cya)`

### Dynamic Keyword Replacement

This plugin introduces a unique feature where you can utilize placeholders in your messages that will be dynamically replaced by corresponding values from a configuration file, recent message or pre-built command.

To use this feature, you need to use the format `[[KEY]]` in your messages, where `KEY` corresponds to a key in your config.json file. The plugin will automatically replace `[[KEY]]` with the value associated with `KEY` in the config.json file.

For example, if your config.json contains `{ "name": "John Doe" }`, and you send a message "`Hello, [[name]]!`", the plugin will process it as "`Hello, John Doe!`".

As a security measure, if the user specifies `[[openai_api_key]]`, it will be replaced with `************` to prevent accidental exposure of sensitive information.

**Usage:** `literally whatever text you want` `[[KEY]]` `literally whatever text you want`, where `KEY` is a key in the `config.json` file

The user can also type in `$$MSG` and have it dynamically replaced with the most recent message sent in a server or DM.

**Usage:** `literally whatever text you want` `$$MSG` `literally whatever text you want`

As per the standard, I obviously added a `chr[REQUEST]` replacement command which connects to GPT-3 with `REQUEST` as the prompt and is replaced with the response.

**Usage:** `literally whatever text you want` `ch[message]` `literally whatever text you want`

If you don't want the replacements to be instant or want to cancel them entierly, you can do so by putting a `#` before them.

**Usage:** 

`#$$MSG` (sends $$MSG)

`##$$MSG` (sends #$$MSG)

`!aw #$$MSG` (awaits the message and sends the contents of it)

**More Examples:**

`!aw "#$$MSG" -🤓` (automatically wins an argument)

`[ch[pick any number from 1 to 4, only respond with the number]]` (picks out a message randomly out of a config file, assumes you already set `1`, `2`, `3` and `4` with `!config`

`!aw !and(0.5; [[nymane]] is currently away. is there anything I can assist you with?; !aw !aw ####ch[####$$MSG])` ("simple" auto-responding bot, assumes you have already set `nyname` with `!config nymane your name`)

### Misc. Commands

The `!config` command lets you quickly change the config file through discord, without searching around on a file explorer.

**Usage:** `!config` `key` `newvalue`

The `!type` command either enables or disables the "Typing..." notification when you type. `start` keeps everything working as usual, `stop` blocks your notifications and `perm` forces them on until you send a message (perfect for a little tomfoolery).

Usage: `!type` `start/stop/perm`

## Limitations/ Known Issues

1. Awful textbox message handling
2. Unexplained !trd command ~1 minute inaccuracies
3. Commands do not support attachments
4. Stacking delays breaks textbox messages
5. Absolutely zero support for other message-altering plugins, such as [Translator](https://betterdiscord.app/plugin/Translator)
6. Dynamic Keyword Replacement has inconsistent syntax
7. `!type perm` is.. umm... *special*

## Planned/Beta features

uhh i ran out of ideas

## Installation

This plugin is designed to be used with the BetterDiscord application. To install:

1. Download "silliness.plugin.js"
2. Open BetterDiscord
3. Navigate to User Settings > Plugins
4. Click on "Open Plugins Folder"
5. Move the downloaded plugin file into the Plugins folder
6. Switch the plugin toggle to "ON"
7. The plugin should now be available for use
8. (Optional step: type `!config openai_api_key YOURAPIKEY` in any discord chatbox to be able to use the commands which require integration with GPT-3)

## Credits

pico for making the silly cover

betterdiscord for existing

stackoverflow for making this a lot easier
