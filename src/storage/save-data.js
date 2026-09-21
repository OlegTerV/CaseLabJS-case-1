const fs = require("fs/promises")
const path = require("path")

module.exports.recordData = async function(data) {
    let reportPath
    if (!process.env.REPORT_PATH) {
        console.log("Переменная окружения (REPORT_PATH), указывающая путь сохранения файлов, задана некорректно!")
        reportPath = "./../../reports"
    } else {
        reportPath = process.env.REPORT_PATH
    }

    await Promise.allSettled(
        data
        .filter(it => it.status == "Success")
        .map(async (it) => {
            const filePath = path.join(__dirname, `${reportPath}/${it.city}.json`)
            await fs.writeFile(filePath, JSON.stringify(it, null, "\t"))
        })
    )
}

//например, REPORT_PATH = REPORT_PATH = ./../../reports