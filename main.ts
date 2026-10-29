import { argv } from 'node:process'
import fs from "fs"

const hasJsonFile = fs.existsSync('usuario.json')

const jsonFile = fs.readFileSync('usuario.json', 'utf-8');
const dataJsonFile = JSON.parse(jsonFile)

switch (argv[2]) {

    case 'list':
        if (!hasJsonFile) {
            console.log("Nenhuma lista de tarefas encontrada!")
            break
        }
        console.log(dataJsonFile)
        let list = []
        for (let i = 0; i < dataJsonFile.length; i++) {

            list.push(`Tarefa [${i}]: ${dataJsonFile[i].task}`)
        }

        console.log("=== MINHAS TAREFAS ===")
        console.log(list.join('\n'))

        break
    case 'add':

        const userTask = argv[3]
        const task = { task: userTask }
        const arrayVazio: Array<object> = []

        //verifica a existencia do json, se n tiver, cria um
        if (!hasJsonFile) {
            const jsonContent = JSON.stringify(arrayVazio)
            fs.writeFileSync("usuario.json", jsonContent, "utf8");
        }

        console.log(`\nTarefa: ${task.task} foi adicionado na lista`)
        dataJsonFile.push(task)

        //transforma ele novamente em string e salva o arquivo
        const saveContent = JSON.stringify(dataJsonFile)
        fs.writeFileSync("usuario.json", saveContent, "utf8");
        break

    case 'remove':

        // Verificar se a lista está vazia
        if (dataJsonFile.length === 0) {
            console.log("É necessário criar uma tarefa antes de tentar remover")
            break
        }

        // Buscar a tarefa pelo índice escolhido pelo usuário
        const indexTask = Number(argv[3]);
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
        //pega o numero do argv[3] e veirifica qual tarefa tem aquela posição
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