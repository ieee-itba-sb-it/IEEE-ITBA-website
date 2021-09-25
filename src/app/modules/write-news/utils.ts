export function sanitizeString(input: string) : string {

    let output: string;
    output = input.toLowerCase();

    //taking care of diatrical signs (tildes, otros signos que se agregan a las letras)
    output = output.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    //clean up troublesome characters (remplaza todo caracter que no sea digito, letra, guion bajo (\w), espacio por vacio (\s), o sea las quita)
    output = output.replace(/[^\w\s]/gi, '')
    //exchange spaces for dashes
    output = output.split(' ').join('-')
    //remove contiguous repeated dashes
    output = output.replace(/-{2,}/g, "-")


    return output;
}