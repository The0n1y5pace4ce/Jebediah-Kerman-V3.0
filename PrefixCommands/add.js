module.exports = {
    commands: ['add', 'addition'],
    expectedArgs: '<num1> <num2>',
    permissionError: 'You need Administrator permission to run this command',
    minArgs: 2,
    maxArgs: 2,
    callback: (message, arguments, text) => {
        const num1 = +arguments[0]
        const num2 = +arguments[1]

        const res = num1+num2

        message.reply({ content: `The sum is ${res}`})
    },
    permissions: 'ADMINISTRATOR',
}