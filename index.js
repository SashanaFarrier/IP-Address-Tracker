const ipAddressDiv = document.querySelector('.ip-address')
const locationDiv = document.querySelector('.location')
const timezoneDiv = document.querySelector('.timezone')
const ispDiv = document.querySelector('.isp')
const searchInput = document.querySelector(".hero input")
const searchBtn = document.querySelector(".hero button")
const boxOverlay = document.querySelector(".hero__box-overlay")
const ipAddressEl = document.createElement("p")
const locationEl = document.createElement("p")
const timezoneEl = document.createElement("p")
const ISPEl = document.createElement("p")

// Geolocation API Key
const api_key = "at_dSydHKPdTPOcKTla2pKMl6ALSBQV4"

const URL = `https://geo.ipify.org/api/v2/country,city?`

// get user current location
const Userlocation = navigator.geolocation.getCurrentPosition(showPosition)

//get user's IP address on the map on the initial page load
    getIpAddress();

// get user input from search bar
getInput()

function showPosition(position) {
    const lat = position.coords.latitude
    const lng = position.coords.longitude

    if(lat != undefined && lng != undefined) {
        map.setView([lat, lng], 16);
        L.marker([lat, lng], {icon: myIcon}).addTo(map)
    } else {
        map.setView([18.1096, 77.2975], 16);
    }
}

//Leaflet map
//let map = L.map('map').fitWorld();
let map = L.map('map');
let myIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [60, 70],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: './images/icon-location-shadow.svg',
    shadowSize: [70, 70],
    shadowAnchor: [22, 94]
    });
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    function onLocationFound(e) {
        var radius = e.accuracy;
        L.marker(e.latlng, {icon: myIcon}).addTo(map)
    }
    
    map.on('locationfound', onLocationFound);
    
    function onLocationError(e) {
        alert(e.message);
    }
    
    map.on('locationerror', onLocationError);      


function getInput() {
    searchBtn.addEventListener("click", () => {
    let value, type, ip, domain;
    let isIpValid = false;
    let isDomainValid = false;
    
    // check if the user entered a domain or ip address
    if(searchInput.value !== "") {
        value = searchInput.value;
        ip = value.split(".")
        domain = value.split(".")
             
        if(ip.length == 4 && ip.every(val => parseInt(val))) isIpValid = true;
        

        if(domain.length > 1 && !domain.every(val => parseInt(val))) isDomainValid = true;
    
        if(isIpValid) {
            type = "ipAddress";
        } else if(isDomainValid) {
            type = "domain";
              
        } 

        if(!type) {
            alert("Please enter a valid domain or IP address")
            searchInput.value = ""
        } else {
            // return domain or ip address info
            getIpAddress(type, value)
        }

        } 
    
        // if(isIpValid !== false || isDomainValid !== false) {
        //     boxOverlay.classList.remove("d-none")
        //     boxOverlay.classList.add("d-flex")
        // }
    })

}

async function getIpAddress(type, lookup) {
    let lat;
    let lng;

    const url = await fetch(`${URL}apiKey=${api_key}&${type}=${lookup}`).then(res => res.json()).then(data => {
        try{
 
            const {ip, location, isp} = data;
            lat = location.lat;
            lng = location.lng
          
            ipAddressEl.textContent = ip
            locationEl.textContent = `${location.region}, ${location.country}`
            timezoneEl.textContent = `UTC ${location.timezone}`
            ISPEl.textContent = isp
            
            ipAddressDiv.append(ipAddressEl)
            locationDiv.append(locationEl)
            timezoneDiv.append(timezoneEl)
            ispDiv.append(ISPEl)
           
        } catch(err) {
           alert("Not Found. Please enter a valid domain or IP address")
           searchInput .value = ""
        }
    })
    // reset map view to new location where domain or ip address is located
if(lat !== undefined && lng !== undefined) {
     map.setView([lat, lng])
    L.marker([lat, lng], {icon: myIcon}).addTo(map)
}

}

