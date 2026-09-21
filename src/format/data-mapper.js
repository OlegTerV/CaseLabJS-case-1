module.exports.formatData = function(data) {
    const result = data.map(it => {
        if (it.element.status !== "rejected") {
            return {
                city: it.city,
                status: "Success",
                country: it.element.value.data_coords.results[0].country,
                latitude: it.element.value.data_coords.results[0].latitude,
                longitude: it.element.value.data_coords.results[0].longitude,
                weatherForecast: it.element.value.data_weather.daily
            }
        } else {
            return {
                city: it.city,
                status: it.element.reason,
                country: "-",
                latitude: "-",
                longitude: "-",
                weatherForecast: "-"
            }
        }
    })

    return result
}