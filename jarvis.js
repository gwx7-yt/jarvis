
const turn_on = document.querySelector("#turn_on");
const jarvis_intro = document.querySelector("#j_intro");
const time = document.querySelector("#time");
const machine = document.querySelector(".machine");

let stopingR = false;
let jarviscoms = [];
jarviscoms.push("hi jarvis");
jarviscoms.push("what can you do");
jarviscoms.push("close this - to close opened popups");
jarviscoms.push("whats the weather or temperature");
jarviscoms.push("show the full weather report");
jarviscoms.push("are you there - to check jarvis presence");
jarviscoms.push("shut down - stop voice recognition");
jarviscoms.push("open google");
jarviscoms.push('search for "your keywords" - to search on google ');
jarviscoms.push("open whatsapp");
jarviscoms.push("open youtube");
jarviscoms.push('play "your keywords" - to search on youtube ');
jarviscoms.push("close this youtube tab - to close opened youtube tab");


jarviscoms.push("open instagram");

let ytbWindow;

console.warn('*to check for the commands speak "what can you do"');

let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();

let weatherStatement = "";
let charge,chargeStatus, connectivity, currentTime
chargeStatus = "unplugged"

window.onload = () => {

  let batteryPromise = navigator.getBattery();
  batteryPromise.then(batteryCallback);


    if(navigator.onLine){
      document.querySelector("#internet").textContent = "online"
      connectivity = "online"
    } else {
      document.querySelector("#internet").textContent = "offline"
      connectivity = "offline"
    }

  setInterval(() => {
    if(navigator.onLine){
      document.querySelector("#internet").textContent = "online"
      connectivity = "online"
    } else {
      document.querySelector("#internet").textContent = "offline"
      connectivity = "offline"
    }
  }, 60000);

  function batteryCallback(batteryObject) {
    printBatteryStatus(batteryObject);
    setInterval(() => {
      printBatteryStatus(batteryObject);
    }, 5000);
  }
  function printBatteryStatus(batteryObject) {
    document.querySelector("#battery").textContent = `${
      (batteryObject.level * 100).toFixed(2)
    }%`;
    charge = batteryObject.level * 100
    if (batteryObject.charging === true) {
      document.querySelector(".battery").style.width = "200px";
      document.querySelector("#battery").textContent = `${
        (batteryObject.level * 100).toFixed(2)
      }% Charging`;
      chargeStatus = "plugged in"
    }
  }

};

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  currentTime = strTime
  time.textContent = strTime
}

formatAMPM(date)
setInterval(() => {
  formatAMPM(date)
}, 60000);



function autoJarvis() {
  setTimeout(() => {
    recognition.start();
  }, 1000);
}


document.querySelector("#start_jarvis_btn").addEventListener("click", () => {
  recognition.start();
})


document.querySelector("#stop_jarvis_btn").addEventListener("click", () => {
  stopingR = true;
  recognition.stop();
})

function weather(location) {
  const weatherCont = document.querySelector(".temp").querySelectorAll("*");

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      weatherCont[0].textContent = `Location : ${data.name}`;
      weatherCont[1].textContent = `Country : ${data.sys.country}`;
      weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
      weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
      weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherCont[5].textContent = `Original Temperature : ${ktc(
        data.main.temp
      )}`;
      weatherCont[6].textContent = `feels like ${ktc(data.main.feels_like)}`;
      weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
      weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
      weatherStatement = `sir the weather in ${data.name} is ${
        data.weather[0].description
      } and the temperature feels like ${ktc(data.main.feels_like)}`;
    } else {
      weatherCont[0].textContent = "Weather Info Not Found";
    }
  };

  xhr.send();
}

function ktc(k) {
  k = k - 273.15;
  return k.toFixed(2);
}

if (localStorage.getItem("jarvis_setup") !== null) {
  weather(JSON.parse(localStorage.getItem("jarvis_setup")).location);
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = localStorage.getItem("lang")

var synth = window.speechSynthesis;


recognition.onstart = function () {
  console.log("voice recognition activated");
  document.querySelector("#stop_jarvis_btn").style.display = "flex"
};

let windowsB = []

recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  transcript = transcript.toLowerCase();
  let userData = localStorage.getItem("jarvis_setup");
  console.log(transcript);
 

  if(localStorage.getItem("lang") === "en-US"){
    if (transcript.includes("hi jarvis")) {
      readOut("hello sir");
    }

    if (transcript.includes("current charge")) {
      readOut(`the current charge is ${charge}`);
    }
    if (transcript.includes("charging status")) {
      readOut(`the current charging status is ${chargeStatus}`);
    }
    if (transcript.includes("current time")) {
      readOut(currentTime);
    }
    if (transcript.includes("connection status")) {
      readOut(`you are ${connectivity} sir`);
    }
    if (transcript.includes("what language are you made from")) {
      readOut(`From javascript, html and css`);
    }
     if (transcript.includes("who made you")) {
      readOut(`Am I supposed to say Bat Cave or Ironman??`);
    }

    if (transcript.includes("what can you do")) {
      readOut("sir here's the list of commands i can follow");
      let a = window.open(
        "jarvishome.html")
      windowsB.push(a)
    }
 
      
    if (transcript.includes("tell me about yourself")) {
      readOut(
        "I am Jarvis, the trusty AI companion who got fired by Iron man... unfortunately."
      );
    }

    if (transcript.includes("close this")) {
      readOut("closing the tab sir");
      document.querySelector(".commands").style.display = "none";
      if(window.innerWidth >= 401 ){
        window.resizeTo(250,250)
      }
      setup.style.display = "none";
    }
  
    if (transcript.includes("change my information")) {
      readOut("Opening the information tab sir");
      localStorage.clear();
      
      if(window.innerWidth <= 400 ){
        window.resizeTo(screen.width,screen.height)
      }
      setup.style.display = "flex";
      setup.querySelector("button").addEventListener("click", userInfo);
    }

    if (
      transcript.includes("what's the temperature")
    ) {
      readOut(weatherStatement);
    }
  
    if (transcript.includes("full weather report")) {
      readOut("opening the weather report sir");
      let a = window.open(
        "https://www.google.com/search?q=weather+in kathmandu")
      windowsB.push(a)
    }
 
    if (transcript.includes("are you there")) {
      readOut("yes sir");
    }

    if (transcript.includes("shut down")) {
      readOut("Ok sir i will take a nap");
      stopingR = true;
      recognition.stop();
    }
      if (transcript.includes("what's the meaning of life")) {
      readOut("to die but not a problem for me, probably because i live forever");
      stopingR = true;
      recognition.stop();
    }
       if (transcript.includes("iron man army")) {
      readOut("Iron Man has a suit, but you have… this question. Tough call.");
      stopingR = true;
      recognition.stop();
    }
     if (transcript.includes("what master do you serve")) {
      readOut(" what am i supposed to say, jesus!?!?");
      stopingR = true;
      recognition.stop();
    }
 
  
    if (transcript.includes("open google")) {
      readOut("opening google");
   let a = window.open("https://www.google.com", "_blank", "noopener,noreferrer");

      windowsB.push(a)
    }
  
    if (transcript.includes("search for")) {
      readOut("here's your result");
      let input = transcript.split("");
      input.splice(0, 11);
      input.pop();
      input = input.join("").split(" ").join("+");
      let a = window.open(`https://www.google.com/search?q=${input}`);
      windowsB.push(a)
    }
  
    if (transcript.includes("open youtube")) {
      readOut("opening youtube sir");
      let a = window.open("https://www.youtube.com/");
      windowsB.push(a)
    }
  
    if (transcript.includes("play")) {
      let playStr = transcript.split("");
      playStr.splice(0, 5);
      let videoName = playStr.join("");
      playStr = playStr.join("").split(" ").join("+");
      readOut(`searching youtube for ${videoName}`);
      let a = window.open(`https://www.youtube.com/search?q=${playStr}`
      );
      windowsB.push(a)
    }
  

    if (transcript.includes("open instagram")) {
      readOut("opening instagram sir");
      let a =window.open("https://www.instagram.com");
      windowsB.push(a)
    }
      if (transcript.includes("location of dear walk school")) {
      readOut("location of the best school is opened:");
      

    if (transcript.includes("top headlines")) {
      readOut("These are today's top headlines sir")
     let a =window.open("https://kathmandupost.com/");
      windowsB.push(a)
    }
  
    }
  
    if (transcript.includes("news regarding")) {
      readOut("These are today's top headlines sir")
      let input = transcript
      let a = input.indexOf("regarding")
      input = input.split("")
      input.splice(0,a+9)
      input.shift()
      input.pop()
  
      readOut(`here's some headlines on ${input.join("")}`)
      getCategoryNews(input.join(""))
  
    }
  }    

  
recognition.onend = function () {
  if (stopingR === false) {
    setTimeout(() => {
      recognition.start();
    }, 500);
  } else if (stopingR === true) {
    recognition.stop();
    document.querySelector("#stop_jarvis_btn").style.display = "none"
  }
};

// speak out



function readOut(message) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = message;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
  console.log("Speaking out");
}


async function getNews(){
  var url = "https://newsapi.org/v2/top-headlines?country=in&apiKey=b0712dc2e5814a1bb531e6f096b3d7d3"
  var req = new Request(url)
  await fetch(req).then((response) => response.json())
  .then((data) => {
    console.log(data);
    let arrNews = data.articles
    arrNews.length = 10
    let a = []
    arrNews.forEach((e,index) => {
      a.push(index+1)
      a.push(".........")
      a.push(e.title)
      a.push(".........")

    });
    readOut(a)
  })
}
}