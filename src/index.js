require('dotenv').config({ path: 'src/.env'})
const {getWeatherForecast} = require('./api/api-client')
const {formatData} = require('./format/data-mapper')
const {customPrint} = require('./format/print-data')
const {recordData} = require('./storage/save-data')

async function main() {
    let cities = ""
    let days = "3"
    process.argv.forEach((val, index) =>{
        switch (val) {
            case "--city": 
                if (process.argv[index+1]?.startsWith("--")) printError("Необходимо указать город/города!")
                cities = process.argv[index+1] ?? ""
                break
            case "--days":
                if (process.argv[index+1]?.startsWith("--")) printError("Необходимо указать корректное количество дней (1-7)!")
                days = process.argv[index+1] ?? "3"
                break
            case "--no-cache":
                console.log("Утилита итак всегда получает данные из API, так как не реализован функционал, извлекающий информацию из JSON файлов. Однако JSON файлы с прогнозом погоды сохраняются.")
                break
        }
    })

    if (cities.length == 0) printError("Необходимо указать город/города!")

    const countDays = parseInt(days, 10)
    if ((!countDays) || (!((countDays > 0) && (countDays < 8)))) {
        console.error("Необходимо указать корректное количество дней (1-7)!")
        process.exit(1)
    }

    const weatherForecast = await getWeatherForecast(cities.split(",").map(it => it.trim()), countDays)
    const formatWeatherForecast = formatData(weatherForecast)
    await recordData(formatWeatherForecast)
    customPrint(formatWeatherForecast)
    process.exit(0)
}

function printError(text) {
    console.error(text)
    process.exit(1)
}

main()