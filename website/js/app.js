/** Global variables */
const baseURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&zip=";
const appKey = "db8fa316fd33b034502722f0c294eeab";

/** Get element to create an click event */
document.getElementById('generate').addEventListener('click', performAction);

/** Function to get Weather based on user information */
function performAction(e){
    const zip = document.getElementById('zip').value;
    const country = document.getElementById('countries').value;
    const content = document.getElementById('feelings').value;
    const fullURL = `${baseURL}${zip},${country}&appid=${appKey}`;    
    const dateNow = new Date().toUTCString();

    getWeather(fullURL)    
    .then(function(data){
        document.getElementById('weather-city').innerHTML = `${data.sys.country}, <span>${data.name}</span>`;   
        document.getElementById('date-time').innerHTML = dateNow;      
        document.getElementById('temperature').innerHTML = `Temperature: ${data.main.temp}°F`;
        document.getElementById('condition').innerHTML = `Condition: ${data.weather[0].description} <br>
                                                            Humidity: ${data.main.humidity}%<br>
                                                            Pressure: ${data.main.pressure}hPa`;        
        document.getElementById('max-min').innerHTML = `Min. ${data.main.temp_min}°F <br>
                                                        Max. ${data.main.temp_max}°F`; 
        document.getElementById('wind').innerHTML = `Wind: ${data.wind.speed}mph`;
        document.getElementById('visibility').innerHTML = `Visibility: ${data.visibility}m`;

        postWeather('/weatherData', {
            date: dateNow,
            temp: data.main.temp,
            content: content
        });

        /** Post data to projectData endpoint */
        postWeather('/add', {
            date: dateNow,
            temp: data.main.temp,
            content: content
        });

        updateUI();
        updateHist();
    });
};

/** Function to make a async get request to an external API */
const getWeather = async (url) => {
    const res = await fetch(url);
    try {
        const data = await res.json();
        return data;
    }
    catch(error) {
        console.log(error);
    }
}

/** Async Post method to pass the data to the server side */
const postWeather = async (url='', data={}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data),    
    });
    try {
        const newData = await response.json();
        // console.log(newData);
        return newData;
    }
    catch(error) {
        console.log(error);
    }
}

/** Update UI with the data stored on projectData */ 
const updateUI = async () => {
    //const request = await fetch('/allData');
    const request = await fetch('/all');
    
    try {
        const all = await request.json(); 
       
        document.getElementById('date').innerHTML = `Date: ${all.date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${all.temp}°F`;
        document.getElementById('content').innerHTML = `Content: ${all.content}`;  
    }
    catch(error) {
        console.log(error);
    }
}

/** Update UI with the research history data stored on weatherData */ 
const updateHist = async () => {
    const request = await fetch('/allData');

    try {
        const allData = await request.json();
       
        document.getElementById('date').innerHTML = `Date: ${allData[allData.length - 1].date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${allData[allData.length - 1].temp}°F`;
        document.getElementById('content').innerHTML = `Content: ${allData[allData.length - 1].content}`;    

        /** Cleaning content to add the new content */ 
        document.getElementById('historic-data').innerHTML = "";
        for(record of allData){
            const hist = document.getElementById('historic-data');
            let div = document.createElement('div');
            div.innerHTML = `${record.date}, ${record.temp}, ${record.content}`;
            hist.appendChild(div);   
        }
    }
    catch(error) {
        console.log(error);
    }
}

