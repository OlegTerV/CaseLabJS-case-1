module.exports.customPrint = function (data) {
    data.forEach((it) => {
        const currentCity = Object.entries(it)
        const lastIndex = currentCity.length - 1
        let flag = false

        currentCity.forEach((val, index) => {
            if (index != lastIndex){
                const [propName, propVal] = val
                if ((propName =="status") && (propVal == "Success")) {
                    flag = true
                }
                console.log(`${propName}: ${propVal}`)
            } else {
                if (flag) {
                    console.table(val[1])
                }
            }
        })
        console.log("\n")
    })
}