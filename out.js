const figlet = require('figlet');
const chalk = require('chalk');

/**
 * Dar color a un string.
 * 
 * @param msg   El string al que hay que dat color.
 * @param color El color con el que pintar msg.
 * @returns {string} Devuelve el string msg con el color indicado.
 */
const colorize = (msg,color) => {
    if (typeof color !== "undefined"){
      msg = chalk[color].bold(msg);
    }
    return msg; 
  };
  
  /**
   * Escribe un mensaje de log.
   * 
   * @param msg   El string a escribir
   * @param color Color del texto,
   */
  const log = (msg, color) => {
    console.log(colorize(msg,color));
  };
  
  /**
   * Escribe un mensaje de log grande.
   * 
   * @param msg   Texto a escribir.
   * @param color Color del texto.
   */
  const biglog = (msg,color) => {
    log(figlet.textSync(msg,{horizontalLayout: 'full'}),color);
  };
  
  /**
   * Escribe el mensaje de error emsg.
   * 
   * @param emsg Texto del mensaje de error.
   */
  const errorlog = (emsg) => {
    log(`${colorize("Error","red")}:${colorize(colorize(emsg, "red"), "bgYellowBright")}`);
  }

  exports = module.exports = {
      colorize,
      log,
      biglog,
      errorlog
  };