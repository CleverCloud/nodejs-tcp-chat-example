import ansi from './ansi-escapes.js';
import * as colors from 'https://deno.land/std@0.50.0/fmt/colors.ts';
import { getRandomAlias } from './utils.js';

// We need to force colors because on the server, it's automatically disabled
colors.setColorEnabled(true);

export class TcpChat {

  static #HISTORY_SIZE = 12;
  static #SCREEN_WIDTH = 120;
  static #LINES_BEFORE_PROMPT = TcpChat.#HISTORY_SIZE + 4;
  static #ALIAS_WIDTH = 8;
  // -2 for brackets and -2 for "> "
  static #MESSAGE_WIDTH = TcpChat.#SCREEN_WIDTH - TcpChat.#ALIAS_WIDTH - 2 - 2;

  // Keep track of the chat clients
  #clientList = new Set();

  // Store messages
  #messages = Array.from(new Array(TcpChat.#HISTORY_SIZE));

  addClient (client) {

    // Identify this client
    client.alias = getRandomAlias();

    // Put this new client in the list
    this.#clientList.add(client);

    // Prepare prompt
    client.write(ansi.clearScreen);
    client.write(this._displayScreen(client));

    this.processMessage(`[${client.alias}] joined the chat`, client, { italic: true });
  }

  processMessage (rawText, client, options = { italic: false }) {

    const text = rawText.trim();

    if (text.startsWith('/alias ')) {

      const oldAlias = client.alias;
      const newAlias = text
        .replace(/^\/alias /, '')
        .substr(0, TcpChat.#ALIAS_WIDTH)
        .padEnd(TcpChat.#ALIAS_WIDTH, ' ');

      client.alias = newAlias;

      return this.processMessage(`[${oldAlias}] changed alias to [${newAlias}]`, client, { italic: true });
    }

    // Split messages large messages
    if (text.length > TcpChat.#MESSAGE_WIDTH) {
      const partsCount = Math.ceil(text.length / TcpChat.#MESSAGE_WIDTH);
      return Array
        .from(new Array(partsCount))
        .map((a, i) => {
          const from = i * TcpChat.#MESSAGE_WIDTH;
          const to = (i + 1) * TcpChat.#MESSAGE_WIDTH;
          return text.substring(from, to);
        })
        .map((p) => this.processMessage(p, client));
    }

    if (client != null) {
      client.write(ansi.cursorTo(2, TcpChat.#LINES_BEFORE_PROMPT) + ansi.eraseDown);
    }

    const styledText = options.italic
      ? colors.italic(text)
      : text;

    const message = { text: styledText, client };
    this.#messages.push(message);
    this.#messages.shift();

    console.log(this._formatMessage(message));

    this._broadcastState();
  }

  removeClient (client) {
    this.#clientList.delete(client);
    this.processMessage(`[${client.alias}] left the chat`, null, { italic: true });
  }

  _displayScreen (client) {
    return [
      colors.bgBlue(`Welcome to this TCP chat demo hosted on Clever Cloud!!`),
      colors.gray(colors.italic(`Use "/alias John" to change your alias...`)),
      '-'.repeat(TcpChat.#SCREEN_WIDTH),
      this.#messages.map((m) => this._formatMessage(m, client)).join('\n'),
      '-'.repeat(TcpChat.#SCREEN_WIDTH),
      '> ',
    ].join('\n');
  }

  _formatMessage (message, client) {
    if (message == null) {
      return '';
    }
    const alias = message.client?.alias ?? '????????';
    const prefix = `[${alias}]>`;
    const coloredPrefix = (client != null && message.client === client)
      ? colors.blue(colors.bold(prefix))
      : prefix;
    return `${coloredPrefix} ${message.text}`;
  }

  _broadcastState () {
    for (const [client] of this.#clientList.entries()) {
      client.write([
        ansi.cursorSavePosition,
        ansi.cursorTo(0, TcpChat.#LINES_BEFORE_PROMPT),
        ansi.eraseUp,
        ansi.cursorTo(0, 0),
        this._displayScreen(client),
        ansi.cursorRestorePosition,
      ].join(''));
    }
  }
}
