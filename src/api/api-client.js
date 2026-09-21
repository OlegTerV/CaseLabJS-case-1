require('dotenv').config({ path: 'src/.env'})

module.exports.getWeatherForecast = async function(names, countDays = 3) {
    if (!(parseInt(process.env.TIMEOUT, 10))) {
        console.log("Переменная окружения TIMEOUT задана некорректно")
    }

    const requests = names.map(it => it.trim()).map( (currentName) =>
        getWeatherForCity(currentName, countDays)
    )

    const allWeatherForecasts = await Promise.allSettled(requests)
    const result = allWeatherForecasts.map((element, index) => (
        {city: names[index], element}
    ))
    return result
}

async function getWeatherForCity(name, countDays){
    if (name.length === 0) throw "Название города не должно быть пустой строкой!"

    let getCoordsURL

    try {
        getCoordsURL = process.env.COORDS_URL.replace("{city}", encodeURIComponent(name))
    } catch (error) {
        throw "Переменная окружения COORDS_URL задана некорректно"
    }

    const data_coords = await doFetchAndGetJson(getCoordsURL)
    if (!data_coords.results || data_coords.results.length === 0) {
        throw `Город "${name}" не найден!`
    }

    const coords_object = data_coords.results[0]
    let getWeatherURL

    try {
    getWeatherURL = process.env.WEATHER_URL
        .replace("{lat}", coords_object.latitude)
        .replace("{lon}", coords_object.longitude)
        .replace("{n}", countDays)
    } catch (error) {
        throw "Переменная окружения WEATHER_URL задана некорректно"
    }

    const data_weather = await doFetchAndGetJson(getWeatherURL)

    return {data_coords, data_weather}
}

async function doFetchAndGetJson(url){
    const controller = new AbortController()
    const signal = controller.signal
    let response

    const timerId = setTimeout(() => controller.abort(), parseInt(process.env.TIMEOUT, 10) || 5000)
    try {
        response = await fetch(url, {signal})
    } catch (error) {
        switch (error.name) {
            case "AbortError": throw "Превышено время ожидания!"
            case "TypeError": throw "Запрос не смог выполниться на сетевом уровне!"
            default: throw "Какая-то ошибка...!"
        }
    } 
    finally{
        clearTimeout(timerId)
    }

    if (!response.ok) {
        throw `HTTP request error! Статус: ${response.status}.`
    }

    let data
    try {
        data = await response.json()
    } catch (error) {
        throw "Невалидный JSON!"
    }

    return data
}