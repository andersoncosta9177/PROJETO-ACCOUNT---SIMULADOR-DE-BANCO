//modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

//modulos internos
const fs = require("fs")
operation()

function operation() {
    inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: 'OQUE VOÇE DESEJA FAZER?: ',
            choices: ['CRIAR CONTA', 'CONSULTAR SALDO', 'DEPOSITAR', 'SACAR', 'SAIR']
        }, ])
        .then((answer) => {
             const action = answer['action']
            if (action == 'CRIAR CONTA') {
                createAccount()
            }else if(action == 'CONSULTAR SALDO'){
                    getAccountBalance()
            }else if(action == 'DEPOSITAR'){
                deposit()

            }else if(action == 'SACAR'){
                withDraw()

            }else if(action == 'SAIR'){
                console.log(chalk.bgBlue.black('OBRIGRADO POR USAR O ACCOUNT!'))
                process.exit()

            }

        })
        .catch((err) => console.log(err))
}


//criaçao da conta
function createAccount() {
    console.log(chalk.bgGreen.black('OBRIGADO POR ESCOLHER O ACCOUNT!'))
    console.log(chalk.green("DEFINA AS OPÇOES DA SUA CONTA: "))
    buildAccount()

}

function buildAccount() {
    inquirer.prompt([{
                name: 'accountName',
                message: 'DIGITE O NOME DA SUA CONTA:'
            },

        ])
        .then((answer) => {
            const accountName = answer['accountName']
            console.info(accountName)

            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts')
            }
            if (fs.existsSync(`accounts/${accountName}`)) {
                console.log(chalk.bgRed.black('ESTA CONTA JA EXISTE!'))
                buildAccount()
                return
            }
            fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}',
                function (err) {
                    console.log(err)
                },

            )
            console.log(chalk.green('A SUA CONTA FOI CRIADA!' ))
                
            operation()

        })
        .catch((err) => console.log(err))
}



//adicionar saldo na sua conta
function deposit(){
    inquirer.prompt([
        {
           name: 'accountName',
            message: 'QUAL NOME DA SUA CONTA?: ',
        },
    ])
    .then( (answer)=>{
        const accountName = answer['accountName']
        //verificando se a conta existe
       if(!checkAccount(accountName)){
           return deposit()
       }

       inquirer.prompt([
           {
               name: 'amount',
               message: '   VALOR: '
           },
       ])
       .then( (answer)=>{
           const amount = answer['amount']

           //adicionando valor
           addAmount(accountName,amount )

           operation()
       })
       .catch( (err)=> console.log(err))

    })
    .catch( (err)=>console.log(err))
}



function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed('ESTA CONTA NAO EXISTE!'))
        return false
    }
    return true

}


function addAmount(accountName, amount){
const accountData = getAccount(accountName)
if(!amount){
    console.log(chalk.bgRed.black('OCORREU UM ERRO, TENTE NOVAMENTE!'))
    return deposit()
}
accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err){
        console.log(chalk.bgRed.black(err))
    }
)
console.log(chalk.green(`FOI DEPOSITADO  ${amount} R$ NA SUA CONTA.`))
console.log(chalk.bgBlue.black(
    `SALDO ATUAL R$ ${accountData.balance}`
))


}

function getAccount(accountName){
    const accountJson = fs.readFileSync(`accounts/${accountName}.json`,{
        encoding: 'utf-8',
        flag: 'r'
    })
    return JSON.parse(accountJson)
}



//funcao para mostrar o saldo 
function  getAccountBalance(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'NOME DA CONTA: '
        }
    ]).then( (answer )=>{
        const accountName = answer['accountName']

        //verificar se conta existe
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }
        const accountData = getAccount(accountName)
        console.log(chalk.bgBlue.black(
            `OLA, O SALDO DA SUA CONTA É DE R$ ${accountData.balance}`
        ))
        operation()

    })
    .catch( err => console.log(err))
}




function withDraw(){

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'QUAL O NOME DA SUA CONTA: '
        }
    ]).then( (answer)=>{
        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return withDraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'VALOR A SACAR: '
            }

        ]).then( (answer)=>{
            const amount = answer['amount']
            removeAmount(accountName,amount)

        }).catch( (err) => console.log(err))


    }).catch( (err) => console.log(err))

}



function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('OCORREU UM ERRO!'))
        return withDraw()
    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('SALDO INSUFICIENTE!'))
        return withDraw()
    }
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function(err){
        console.log(err)
    }
)
console.log(chalk.green('SAQUE EFETUADO COM SUCESSO!'),
)
console.log(chalk.bgBlue.black(
    `SALDO ATUAL R$ ${accountData.balance}`
))
operation()
}