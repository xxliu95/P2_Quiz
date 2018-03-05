const fs = require('fs');

// JSON de quizzes
const DB_FILENAME = "quizzes.json";

//Modelo de datos.
//
// En esta variable se mantienen todos los quizzes existentes.
// Es un array de objetos, donde cada objeto tiene los atributos question
// y answer para guardar el texto de la pregunta y el de la respuesta.

let quizzes = [
    {
      "question": "Capital de Italia",
      "answer": "Roma"
    },
    {
      "question": "Capital de Francia",
      "answer": "París"
    },
    {
      "question": "Capital de España",
      "answer": "Madrid"
    },
    {
      "question": "Capital de Portugal",
      "answer": "Lisboa"
    }
];
  

/**
 *  Carga las preguntas guardadas en el fichero 
 */
const load = () => {

    fs.readFile(DB_FILENAME, (err, data) =>{
        if(err){
            if(err.code === "ENOENT"){
                save();
                return;
            }
        throw err;
        }
        let json = JSON.parse(data);

        if(json){
        quizzes = json;
        }
    });
};

/**
 * Guerda las preguntas en el fichero.
 */
const save = () => {
    fs.writeFile(DB_FILENAME,
        JSON.stringify(quizzes),
        err => {
            if (err) throw err;
        });
};

 /** 
 * Devuelve el número total de preguntas existentes.
 * 
 * @returns {number} nùmero total de preguntas existentes.
 */
exports.count = () => quizzes.length;
  
/**
 * Añade un nuevo quiz
 * 
 * @param question String con la pregunta.
 * @param answer   String con la respuesta.
 */
exports.add = (question, answer) => {
      quizzes.push({
      question: (question || "").trim(),
      answer: (answer || "").trim()
      });
      save();
};
  
/**
 * Actualiza el quiz situado en la posicion index.
 * 
 * @param id       Clave que identifica el quiz a actualizar.
 * @param question String con la pregunta.
 * @param answer   String con la respuesta.
 */
exports.update = (id, question, answer) => {
    const quiz = quizzes[id];
    if(typeof quiz === "undefined") {
        throw new Error(`El valor del parámetro id no es válido.`);
}
    quizzes.splice(id, 1,{
    question: (question || "").trim(),
    answer: (answer || "").trim()
    });
    save();
};
  
/**
 * Devuelve todos los quizzes existentes
 * 
 * Devuelve un clon del valor guardado en la variable quizzes, es decir devuelve un
 * objeto nuevo con todas la preguntas existentes.
 * Para clonar quizzes se usa stringify + parse.
 * 
 * @returns {any}
 */
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));
  
  
/**
 * Devuelve un clon del quiz almacenado en la posición dada.
 * 
 * Para clonar el quiz se usa stringify + parse.
 * 
 * @param id Clave que identifica el quiz a devolver.
 * @returns {question, answer} Devuelve el objeto quiz de la posición dada.
 */
exports.getByIndex = id => {
    const quiz = quizzes[id];
    if(typeof quiz === "undefined") {
        throw new Error(`El valor del parámetro id no es válido.`);
    }
    return JSON.parse(JSON.stringify(quiz));
};
  
/**
 * Elimina el quiz situado en la posición dada.
 * 
 * @param id Clave que identifica el quiz a borrar.
 */
exports.deleteByIndex = id => {
    const quiz = quizzes[id];
    if(typeof quiz === "undefined") {
        throw new Error(`El valor del parámetro id no es válido.`);
    }
    quizzes.splice(id, 1);
    save();
};

// Carga los quizzes almacenados en el fichero.
load();
