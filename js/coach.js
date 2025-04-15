document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('dashboard').style.display = 'block';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
          
            navLinks.forEach(l => l.classList.remove('active'));
          
            this.classList.add('active');
            
       
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
           
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).style.display ='block';
        });
    });
});  




const getStatistics = async () => {
    try {
        const response = await axios.get('https://v3.football.api-sports.io/teams/statistics?season=2024&team=49&league=39', {
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                'x-apisports-key': 'ad8e19b88c6871891ffcc93972dc76d3'
            }
        });

        return response.data;
    
    } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error.message);
    }
};

const performanceAccount = async () => {
    const statistics = await getStatistics();

    if (!statistics) return;

    const totalMatches = statistics.response.fixtures.played.total;
    const wins = statistics.response.fixtures.wins.total;
    const losses = statistics.response.fixtures.loses.total;
    const draws = statistics.response.fixtures.draws.total;

 
    const winRate = ((wins / totalMatches) * 100).toFixed(2);
    const lossRate = ((losses / totalMatches) * 100).toFixed(2);
    const drawRate = ((draws / totalMatches) * 100).toFixed(2);


    const maxPoints = totalMatches * 3; 
    const earnedPoints = (wins * 3) + (draws * 1);
    const teamPerformance = ((earnedPoints / maxPoints) * 100).toFixed(2);

    console.log("أداء الفريق:", teamPerformance + "%");

  
    updateChart([winRate, lossRate, drawRate, teamPerformance]);
};




const winProbability = async () => {
    const statistics = await getStatistics();

    if (!statistics) return;

    const totalMatches = statistics.response.fixtures.played.total;
    const wins = statistics.response.fixtures.wins.total;
    const losses = statistics.response.fixtures.loses.total;
    const draws = statistics.response.fixtures.draws.total;

    if (totalMatches === 0) return;  


    const winRate = (wins / totalMatches) * 100;
    const lossRate = (losses / totalMatches) * 100;
    const drawRate = (draws / totalMatches) * 100;

 
    const maxPoints = totalMatches * 3;  
    const earnedPoints = (wins * 3) + (draws * 1);
    const teamPerformance = (earnedPoints / maxPoints) * 100;


    const probabilityWin = ((winRate + teamPerformance) / 2).toFixed(2);
    const probabilityLoss = ((lossRate + (100 - teamPerformance)) / 2).toFixed(2);
    const probabilityDraw = ((drawRate + (100 - teamPerformance)) / 2).toFixed(2);

    console.log("احتمالية الفوز:", probabilityWin + "%");
    console.log("احتمالية الخسارة:", probabilityLoss + "%");
    console.log("احتمالية التعادل:", probabilityDraw + "%");


    updateChart2([probabilityWin, probabilityLoss, probabilityDraw]);
};

const updateChart = (data) => {
    const ctx = document.getElementById('myChart');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['فوز %', 'خسارة %', 'تعادل %', 'الاداء %'],
            datasets: [{
                label: 'إحصائيات الفريق',
                data: data,
                backgroundColor: ['green', 'red', 'yellow', 'blue'],
                
            }]
        },
       
    });
};

const updateChart2 = (data) => {
    const ctx = document.getElementById('myChart2');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['فوز %', 'خسارة %', 'تعادل %',],
            datasets: [{
                label: ' احتمالية المباراة القادمة',
                data: data,
                backgroundColor: ['green', 'red', 'yellow', 'blue'],
                
            }]
        },
       
    });
};



const getTeamStatistics = async () => {
    try {
        const response = await axios.get('https://v3.football.api-sports.io/teams/statistics?season=2024&team=49&league=39', {
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                'x-apisports-key': 'ad8e19b88c6871891ffcc93972dc76d3'
            }
        });
        return response.data;
    } catch (error) {
        console.error('❌ حدث خطأ أثناء جلب المباريات:', error.message);
        return null; // Return null in case of error
    }
};



async function init() {
    try {
        const data = await getTeamStatistics();
        if (data) {
            const result1 = data.response.goals.for.minute;
            const result2 = data.response.goals.against.minute;
            updateChart3(result1,result2);
        }
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
}

async function init2() {
    try {
        const data = await getTeamStatistics();
        if (data) {
            const result1 = data.response.cards.red;
            const result2 = data.response.cards.yellow;
            updateChart4(result1,result2);
        }
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
}



let chart3;
let chart4;
function updateChart3(data1,data2) {
  const ctx = document.getElementById('goalsChart1');
  if (!ctx) {
    console.error('Canvas element with ID "goalsChart" not found');
    return
  }

  const labels = [
    "0-15", "16-30", "31-45", "46-60",
    "61-75", "76-90", "91-105", "106-120"
  ];
  const goalsFor = labels.map(label => data1[label]?.total ?? 0);
  const goalsAgainst = labels.map(label => data2[label]?.total ?? 0);
  const backgroundColors = [
    '#4CAF50', '#2196F3', '#FF9800', '#9C27B0',
    '#3F51B5', '#009688', '#FF5722', '#607D8B'
  ];

  if (chart3) chart3.destroy();

  chart3 = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
            label: 'الاهداف المسجلة',
            data: goalsFor,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            fill: true
        },
        {
            label: 'الاهداف المستقبلة',
            data: goalsAgainst,
            borderColor: '#F44336',
            backgroundColor: 'rgba(244, 67, 54, 0.2)',
            fill: true
        }
    ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'الاهداف خلال اوقات المباراة'
        }
      }
    }
  });
}



function updateChart4(data1,data2) {
    const ctx = document.getElementById('goalsChart2');
    if (!ctx) {
      console.error('Canvas element with ID "goalsChart" not found');
      return
    }
  
    const labels = [
      "0-15", "16-30", "31-45", "46-60",
      "61-75", "76-90", "91-105", "106-120"
    ];
    const Rcard = labels.map(label => data1[label]?.total ?? 0);
    const Ycard = labels.map(label => data2[label]?.total ?? 0);
    const backgroundColors = [
      '#4CAF50', '#2196F3', '#FF9800', '#9C27B0',
      '#3F51B5', '#009688', '#FF5722', '#607D8B'
    ];
  
    if (chart4) chart4.destroy();
  
    chart4= new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
              label: 'البطاقات الحمراء',
              data: Rcard,
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              fill: true
          },
          {
              label: 'البطاقات الصفراء',
              data: Ycard,
              borderColor: '#F44336',
              backgroundColor: 'rgba(244, 67, 54, 0.2)',
              fill: true
          }
      ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'الاهداف خلال اوقات المباراة'
          }
        }
      }
    });
  }


const getPredictions = async () => {
    try {
        const response = await axios.get('https://v3.football.api-sports.io/fixtures/players?fixture=169080', {
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                'x-apisports-key': 'ad8e19b88c6871891ffcc93972dc76d3'
            }
        });
console.log(response.data);
        return response.data;
    
    } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error.message);
    }


};

document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      editable: true,
      events: [] 
  });
  
  calendar.render();


  function addEvent() {
      const dateEvent = document.getElementById("date-events").value;
      const timeEvent = document.getElementById("time-events").value;
      const selectElement = document.getElementById("title-events");
      const selectedText = selectElement.options[selectElement.selectedIndex].text;
      if (dateEvent && timeEvent) {
          const dateStringFormat = `${dateEvent}T${timeEvent}`;
          
          calendar.addEvent({
              title: selectedText,
              start: dateStringFormat,
              allDay: false
          });
      } else {
          alert('Please select both date and time');
      }
  }


  document.getElementById('addEventBtn')?.addEventListener('click', addEvent);
});



const getFootballData = async () => {
    try {
        const response = await axios.get('https://v3.football.api-sports.io/standings?league=39&season=2024', {
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                'x-apisports-key': 'ad8e19b88c6871891ffcc93972dc76d3' // API Key
            }
        });
        console.log(response.data)
       return response.data;
    
    } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error.message);
    }
};



const displayStanding = async () => {
    const data = await getFootballData();
    
    if (!data || !data.response || !data.response[0]) {
        console.error("لم يتم العثور على بيانات الترتيب.");
        return;
    }

   
    const teams = data.response[0].league.standings[0];

    const result = teams.map(team => `
        <tr>
            <td>${team.rank}</td>
            <td><img src="${team.team.logo}" width="40px"/></td>
            <td>${team.team.name}</td>
            <td>${team.points}</td>
            <td>${team.all.played}</td>
            <td>${team.all.win}</td>
            <td>${team.all.draw}</td>
            <td>${team.all.lose}</td>
            <td>${team.all.goals.for}</td>
            <td>${team.all.goals.against}</td>
        </tr>
    `).join("");

    document.querySelector(" .table-container2").innerHTML = `
        <table border="3" >
            <thead>
                <tr>
                    <th>المركز</th>
                    <th>الشعار</th>
                    <th>الاسم</th>
                    <th>النقاط</th>
                    <th>المباريات</th>
                    <th>فوز</th>
                    <th>تعادل</th>
                    <th>خسارة</th>
                    <th>أهداف</th>
                    <th>عليه</th>
                </tr>
            </thead>
            <tbody>${result}</tbody>
        </table>
    `;
};
  
displayStanding();
getPredictions();
  init();
  init2();
  performanceAccount();
  winProbability();