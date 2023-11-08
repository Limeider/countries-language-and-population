const getElement = (selector) => document.querySelector(selector)

const subtitleElement = getElement('.subtitle')
const populationButton = getElement('.population')
const languagesButton = getElement('.languages')
const graphTitleElement = getElement('.graph-title')
const graphContainer = getElement('.graphs')
const graphWrapper = getElement('.graph-wrapper')

let countriesData
const fetchCountriesData = async () => {
    try {
        const response = await fetch('countries.json')
        if (!response.ok) {
            throw new Error('Network error')
        }
        const data = await response.json()
        countriesData = data
    } catch (error) {
        console.log(error)
    }
}

window.addEventListener('load', async function () {
    await fetchCountriesData()
    subtitleElement.textContent = `Currently, we have ${countriesData ? Object.keys(countriesData).length : 0} countries`
})

populationButton.addEventListener('click', async function () {
    if (graphContainer.classList.contains('hidden')) {
        graphContainer.classList.remove('hidden')
    }
    graphWrapper.innerHTML = ''
    graphTitleElement.textContent = displayTitle('populated countries')
    const topTenPopulation = await getTopTenData(countriesData, 'population')
    topTenPopulation.forEach(country => {
        createName(country)
        createBar(country, topTenPopulation[0].count)
        createValue(country)
    })
})

languagesButton.addEventListener('click', async function () {
    if (graphContainer.classList.contains('hidden')) {
        graphContainer.classList.remove('hidden')
    }
    graphWrapper.innerHTML = ''
    graphTitleElement.textContent = displayTitle('spoken languages')
    const topTenLanguages = await getTopTenData(countriesData, 'languages')
    topTenLanguages.forEach(language => {
        createName(language)
        createBar(language, topTenLanguages[0].count)
        createValue(language)
    })
})

function displayTitle(value) {
    return `10 most ${value} in the world`
}

const getTopTenData = async (data, type) => {
    if (!data) return null

    if (type === 'population') {
        let namesAndPopulation = []
        const sortedCountriesPopulation = data.sort((a, b) => b.population - a.population)
        const topTenCountries = sortedCountriesPopulation.slice(0, 10)
        topTenCountries.map(country => {
            const { name, population } = country
            namesAndPopulation.push({ name, count: population })
        })
        namesAndPopulation[2].name = 'USA' // its name is too long for mobile display
        return namesAndPopulation
    } else if (type == 'languages') {
        const languagesMap = new Map()
        data.forEach(country => {
            country.languages.forEach(language => {
                languagesMap.set(language, (languagesMap.get(language) || 0) + 1)
            })
        })
        const sortedTenLanguages = [...languagesMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)

        const languagesObject = sortedTenLanguages.map(([name, count]) => ({ name, count }))
        return languagesObject
    }
}

function createName(element) {
    const nameSpan = document.createElement('span')
    nameSpan.classList.add('name', 'text-style')
    nameSpan.textContent = element.name
    graphWrapper.appendChild(nameSpan)
}

function createBar(element, maxCount) {
    const barDiv = document.createElement('div')
    barDiv.classList.add('bar')
    barDiv.style.width = getWidth(element.count, maxCount)
    graphWrapper.appendChild(barDiv)
}

function createValue(element) {
    const valueSpan = document.createElement('span')
    valueSpan.classList.add('value', 'text-style')
    valueSpan.textContent = element.count
    graphWrapper.appendChild(valueSpan)
}

function getWidth(count, max) {
    const value = ((count / max) * 100).toFixed(2)
    const width = value + '%'
    return width
}