const fs = require("fs")

async function recordData(data, cityName) {
    fs.write(`../../reports/${cityName}.json`, JSON.stringify(data, null, "\t"), (error) => {
        if (error) throw "Возникла ошибка при записи данных в файл."
    })
}
