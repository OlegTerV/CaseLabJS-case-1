# CaseLabJS-case-1
Разработанная утилита позволяет запросить с [API](https://github.com/open-meteo/open-meteo) информацию о прогнозе погоды в городе/городах. Запросы, завершенные с успешным статусом, сохраняются в json файлы.

### Требования к окружению
* Node.Js: 22.x.x
* npm: 10.x.x
* ОС: Windows 10/11

### Установка
1. Клонируйте репозиторий:
`
git clone https://github.com/OlegTerV/CaseLabJS-case-1
`
2. Перейдите в папку проекта:
`
cd <путь_к_папке...>/CaseLabJS-case-1
`
3. Установите зависимости:
`
npm install
`

### Настройка
1. Скопируйте файл с заглушками:
`
cd src
`
,
`
copy .env.example .env
`
2. Задайте значения переменным окружения:

|Переменная|Тип|
|:---------|:-|
|COORDS_URL|string|
|WEATHER_URL|string|
|TIMEOUT|int|
|REPORT_PATH|string|

### Запуск
После настройки перменных окружения вернитесь в корневой каталог (CaseLabJS-case-1-main):
```cmd
cd ..
```
Команда запуска:
```cmd
node src/index.js --city <city> [city_2,...] [--days<days count>]
```
Примеры команд запуска:
```cmd
node src/index.js --city "Rostov-on-Don" --days 5
node src/index.js --city "Rostov-on-Don, Moscow, Ufa"
```

### Структура проекта
Проект разбит на модули по зонам ответственности:
1. **src/api.** Реализован api-клиент, отправляющий запросы в API [open-meteo](https://github.com/open-meteo/open-meteo). Для каждого из городов, указанного в параметрах запроса, запрашиваются координаты. Затем для полученных координат загружается (также из API) прогноз погоды.
2. **src/format.** Реализован маппер, который формирует объекты, содержащие нужную информацию: название города, статус, название страны, координаты, прогноз погоды. Реализован метод, обеспечивающий (почти) красивый вывод в консоль.
3. **src/storage.** Реализована логика сохранения информации о прогнозе погоды для городов с успешным статусом запроса в файлы формата json.
4. **src/docs.** Содержит json коллекции Postman для двух видов запроса.

### Примеры работы
<details>
<summary>
1. Один город, пять дней.
</summary>
  
```cmd
node src/index.js --city "Rostov-on-Don" --days 5  
◇ injected env (4) from src\.env  
city: Rostov-on-Don  
status: Success  
country: Россия  
latitude: 47.21997  
longitude: 39.70769 
```

|(index)|0|1|2|3|4|
|:------|:-|:-|:-|:-|:-|
|time|'2026-09-21'|'2026-09-22'|'2026-09-23'|'2026-09-24'|'2026-09-25'|
|temperature_2m_max |28|24|25.5|18.4|22.1|
|temperature_2m_min |16.9|14.9|17.5|13.1|11.8|
|precipitation_sum  |0|0.9|2.6|6.9|0|
</details>
<details>  
<summary>
2. Три города, не указываем количество дней (3 дня по умолчанию).
</summary>

```cmd
node src/index.js --city "Rostov-on-Don, Moscow, Ufa"`
◇ injected env (4) from src\.env
city: Rostov-on-Don
status: Success
country: Россия
latitude: 47.21997
longitude: 39.70769
```
  
|(index)|0|1|2|
|:----|:-|:-|:-|
|time|'2026-09-21'|'2026-09-22'|'2026-09-23'|
|temperature_2m_max|28|24|25.5|
|temperature_2m_min|16.9|14.9|17.5|
|precipitation_sum|0|0.9|2.6|

```cmd
city: Moscow
status: Success
country: Россия
latitude: 55.75204
longitude: 37.61781
```

|(index)|0|1|2|
|:----|:-|:-|:-|
|time|'2026-09-21'|'2026-09-22'|'2026-09-23'|
|temperature_2m_max|21|17.1|18.9|
|temperature_2m_min|13.7|13.1|14.4|
|precipitation_sum|0|7.6|2.4|

```cmd
city: Ufa
status: Success
country: Россия
latitude: 54.74306
longitude: 55.96779
```

|(index)|0|1|2|
|:----|:-|:-|:-|
|time|'2026-09-21'|'2026-09-22'|'2026-09-23'|
|temperature_2m_max|22.2|23.6|23.2|
|temperature_2m_min|10.9|8.7|7.2|
|precipitation_sum|0|0|0 |
</details>
<details>  
<summary>
3. Запрос погоды в несуществующем городе.
</summary>

```cmd
node src/index.js --city "qwertyuiop"
◇ injected env (4) from src\.env
city: qwertyuiop
status: Город "qwertyuiop" не найден!
country: -
latitude: -
longitude: -
```
</details>

### Обрабатываемые ошибки
В утилите предусмотрена обработка следующих типов ошибок:
* Некорректные параметры в запросе
* Ошибки 4xx
* Ошибки 5xx
* Некорректная конфигурация переменных окружения
* Превышение времени ожидания
* Невалидный JSON

#### Коды завершения
1 - при указании некорректных параметров в теле запроса  
0 - в остальных случаях  
*Возможны ситуации падения утилиты, так как я мог что-то не обработать*