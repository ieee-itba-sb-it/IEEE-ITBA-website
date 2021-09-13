const troublesomeCharacters = [ '?', ':']
export function sanitizeString(input: string) : string {
    //console.log("input: ", input)

    //clean up troublesome characters
    let output = input;
    for(let char of troublesomeCharacters){
        //console.log("char: ", char)
        output = output.replaceAll(char, '')
    }
    //clean up repeating '-' that replaced spaces
    output = output.replace(/-{2,}/g, "-");

    //console.log("output: ", output)

    return output;
}