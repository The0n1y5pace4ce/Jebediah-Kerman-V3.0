module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Buttons Handler");
    const buttonsFolder = await PG(`${process.cwd()}/Buttons/**/*.js`)

    buttonsFolder.map(async (file) => {
        const buttonFile = require(file);
        if(!buttonFile.id) return;

        client.buttons.set(buttonFile.id, buttonFile);
        Table.setHeading('Name', 'Status')
        Table.addRow(buttonFile.id, "lOADED");
    });
    console.log(Table.toString())
}