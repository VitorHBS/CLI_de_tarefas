import { argv } from 'node:process'
import fs from "fs"

const hasJsonFile = fs.existsSync('usuario.json')

let jsonFile = ''
let dataJsonFile: Array<{ task: string, completed: boolean }> = []


//verifica se existe o arquivo e transforma em array
if (hasJsonFile) {
    jsonFile = fs.readFileSync('usuario.json', 'utf-8');
    dataJsonFile = JSON.parse(jsonFile)
} else {
    const jsonContent = JSON.stringify(dataJsonFile)
    fs.writeFileSync("usuario.json", jsonContent, "utf8");
}



switch (argv[2]) {

    case 'list':

        if (dataJsonFile.length === 0) {
            console.log("\n É necessário criar uma tarefa antes de tentar listar")
            break
        }

        let list = []
        for (let i = 0; i < dataJsonFile.length; i++) {
            if (dataJsonFile[i].completed) {
                list.push(`Tarefa [${i}]: ${dataJsonFile[i].task} [X]\n`)
            } else {
                list.push(`Tarefa [${i}]: ${dataJsonFile[i].task} [ ]\n`)
            }
        }

        console.log("\n=== MINHAS TAREFAS ===")
        console.log(list.join('\n'))

        break
    case 'add':

        const userTask = argv[3]

        if (typeof (userTask) !== "string" || userTask.trim() === '') {
            console.log('É necessário escrever alguma tarefa')
            break
        }

        const task = { task: userTask, completed: false }

        dataJsonFile.push(task)
        console.log(`\nTarefa: ${task.task} foi adicionado na lista`)

        //transforma ele novamente em string e salva o arquivo
        const saveContent = JSON.stringify(dataJsonFile)
        fs.writeFileSync("usuario.json", saveContent, "utf8");
        break

    case 'remove':

        // Verificar se a lista está vazia
        if (dataJsonFile.length === 0) {
            console.log("\n É necessário criar uma tarefa antes de tentar remover")
            break
        }

        // Buscar a tarefa pelo índice escolhido pelo usuário
        const indexTask = Number(argv[3]);

        const isInvalidIndex = !Number.isInteger(indexTask) || Number.isNaN(indexTask) || indexTask < 0;

        if (isInvalidIndex) {
            console.log("\n É necessário digitar um número válido")
            break
        }

        const hasTask = dataJsonFile[indexTask];

        if (!hasTask) {
            console.log("O número da tarefa digitada não existe!")
            break
        }

        //Remover o objeto da lista
        console.log(`Tarefa: ${dataJsonFile[indexTask].task} foi removida da lista`)
        dataJsonFile.splice(indexTask, 1);
        fs.writeFileSync('usuario.json', JSON.stringify(dataJsonFile, null, 2))

        break
    case 'done':

        //pegar o numero que o user digitou, valido e acho a task com base no numero digitado
        const doneTask = Number(argv[3])

        const isInvalid = !Number.isInteger(doneTask) || Number.isNaN(doneTask) || doneTask < 0;

        if (isInvalid) {
            console.log("\n É necessário escrever um número válido")
            break
        }

        //verificação se existe a task
        const taskToDone = dataJsonFile[doneTask]
        if (!taskToDone) {
            console.log("O número da tarefa digitada não existe!")
            break
        }

        if (taskToDone.completed) {
            console.log("A tarefa selecionada já foi concluida");
            break;
        }
        taskToDone.completed = true;
        console.log(`Você completou a tarefa: ${taskToDone.task}`)

        //salvo as alterações no arquivo json
        fs.writeFileSync('usuario.json', JSON.stringify(dataJsonFile, null, 2))

        break

    default:
        console.log("\n==================================================");
        console.log(" ⚠️  \x1b[31m\x1b[1mOPÇÃO INVÁLIDA\x1b[0m");
        console.log("==================================================");
        console.log(" Você não digitou o comando corretamente.");
        console.log("\n Por favor, escolha uma das opções válidas:");
        console.log("   • \x1b[32madd [número da task]\x1b[0m");
        console.log("   • \x1b[32mremove [número da task]\x1b[0m");
        console.log("   • \x1b[32mlist\x1b[0m");
        console.log("==================================================\n");
}