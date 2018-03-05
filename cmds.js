const model = require('./model');
const {log, biglog, errorlog, colorize} = require("./out");


/**
* Muestra la ayuda.
*
* @param rl Objeto readline usado para implementar el CLI.
*/
exports.helpCmd = rl => {
    log("Comandos");
    log("   h|help -h|help - Muestra esta ayuda.");
    log("   list - Listar los quizzes existentes.");
    log("   show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log("   add - Añadir un nuevo quiz interactivamente.");
    log("   delete <id> - Borrar el quiz indicado.");
    log("   edit <id> - Editar el quiz indicado.");
    log("   test <id> - Probar el quiz indicado.");
    log("   p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("   credits - Créditos.");
    log("   q|quit - Salir del programa.");
    rl.prompt();
};
  
/**
 * Lista todos los quizzes existentes en el modelo.
 * 
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.listCmd = rl => {
    model.getAll().forEach((quiz, id) => {
        log(`  [${ colorize(id, 'magenta')}]: ${quiz.question}`);
    });
    rl.prompt();
};
  
 /**
 * Muestra el quiz indicado en el parámetro: la pregunta y la respuesta.
 *
 * @param id Clave del quiz a mostrar.
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.showCmd = (rl,id) => {

    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`); 
    } else {
        try{
            const quiz = model.getByIndex(id);
            log(`  [${colorize(id, 'magenta')}]:  ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
        } catch(error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};
  
/**
 * Añade un nuevo quiz al modelo.
 * Pregunta interactivamente por la pregunta y por la respuesta.
 * 
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.addCmd = rl => {

    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

        rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {

            model.add(question, answer);
            log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        })
    })
};
  
 /**
 * Borra un quiz del modelo.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a borrar en el modelo.
 */
exports.deleteCmd = (rl,id) => {

    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`); 
    } else {
        try{
            model.deleteByIndex(id);
        } catch(error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};
  
/**
 * Edita un quiz del modelo,
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a editar en el modelo.
 */
exports.editCmd = (rl,id) => {
    
    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`);
        rl.prompt(); 
    } else {
        try{
            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(()=> {rl.write(quiz.question)},0);

            rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
                
                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

                rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {

                    model.update(id,question, answer);
                    log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        } catch(error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
 };
  
  
 /**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a probar.
 */
 exports.testCmd = (rl,id) => {
        
    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`); 
        rl.prompt();
    } else {
        try{
            const quiz = model.getByIndex(id);

            rl.question(colorize(` ${quiz.question}? `,'red'), answer => {
                if(typeof(answer)=== "Undefined"){
                    errorlog(`Falta la respuesta.`);
                    rl.prompt(); 
                }
                answer = answer.trim();
           
                if(answer.toUpperCase() === quiz.answer.toUpperCase()){
                    log('Su respuesta es Correcta');
                    //log('Correcta');
                    rl.prompt();
                } else {
                    log('Su respuesta es:');
                    log('Incorrecta');
                    rl.prompt();
                }
            });
        } catch(error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
 };
  
/**
 * Pregunta todos los quizzes existentes en el modelo en orden aleatorio.
 * Se gana si se contesta a todos satisfactoriamente.
 * 
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.playCmd = rl => {
    let score = 0;
    let toBeResolved = []; 

    for(let i in model.getAll()){
        toBeResolved[i] = i;
    } 

    const playOne = () =>{
        if(toBeResolved.length === 0){
            log('No hay nada más que preguntar');
            log(`Fin del examen. Aciertos: ${score}`);
            biglog(score, 'magenta');
            rl.prompt();
        } else {
            let num = Math.floor((Math.random() * toBeResolved.length));
            let id = toBeResolved[num];
            toBeResolved.splice(num,1); 
    
            let quiz = model.getByIndex(id);
    
            rl.question(colorize(` ${quiz.question}? `,'red'), answer => {
                if(typeof(answer) === "Undefined"){
                    errorlog(`Falta la respuesta.`);
                    rl.prompt(); 
                }
                answer = answer.trim();
                if(answer.toUpperCase() === quiz.answer.toUpperCase()){
                    log('Su respuesta es CORRECTA');                
                    //log(`CORRECTA - Lleva' ${++score} ' aciertos.`);
                    playOne();
    
                } else {
                    log('Su respuesta es:');                
                    log(`INCORRECTA.`);
                    log(`Fin del examen. Aciertos: ${score}`);
                    biglog(score, 'magenta');
                    rl.prompt();
                }
            });
        }
    }
    playOne();
    rl.prompt();
};
  
/**
 * Muestra los nombres de los autores de la práctica
 * 
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.creditsCmd = rl => {
    log('Autores de la práctica: ');
    log('Xinxin Liu','green');
    rl.prompt();
};
  
/**
 * Termina el programa.
 * 
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.quitCmd = rl => {
    rl.close();
};
   

































