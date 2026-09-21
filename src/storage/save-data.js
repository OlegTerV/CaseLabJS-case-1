const fs = require("fs")
const path = require("path")

module.exports.recordData = function (data) {
    data
        .filter((it) => it.status=="Success")
        .forEach((it) => {
            const filePath = path.join(__dirname, `./../../reports/${it.city}.json`)

            fs.writeFile(filePath, JSON.stringify(it, null, "\t"), (error) => {
                if (error) throw new Error("Возникла ошибка при записи данных в файл.", error)
            })
        })
}
