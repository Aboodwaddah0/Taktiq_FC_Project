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
            <td><img src="${team.team.logo}" width="2px"/></td>
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

    document.querySelector(".table-container").innerHTML = `
        <table border="1">
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


const getHeadtoHead = async () => {
    try {
        const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-apisports-key": "ad8e19b88c6871891ffcc93972dc76d3" // API Key
            },
            params: {
                team:49,   // رقم الفريق المطلوب
                status: 'NS',   // المباريات القادمة (NS = Not Started)
                season: 2024,   // الموسم الحالي
                league: 39,     // مثال: الدوري الإنجليزي
                next:6, // عدد المباريات القادمة المطلوب عرضها
                timezone: 'Asia/Riyadh' // ضبط التوقيت لمنطقتك
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error.message);
    }
};

const displayHeadtoHead = async () => {
    const matches = await getHeadtoHead();
    
    // تحقق مما إذا كانت هناك بيانات قبل محاولة استخدامها
    if (!matches || !matches.response || matches.response.length === 0) {
        console.error("لا توجد مباريات متاحة.");
        return;
    }

  
    const numberOfMatches = 6; 
    const limitedMatches = matches.response.slice(0, numberOfMatches);

    const result = limitedMatches.map(match => {
        return `
         <div class="match-card">
            <div class="details">
                <h1>${match.league.name}</h1>
                <h2>${match.fixture.date}</h2>
            </div>   
            <div class="teams">
                <div class="team1">
                    <img src="${match.teams.home.logo}" alt="${match.teams.home.name}">
                    <p>${match.teams.home.name}</p>
                </div>
                <div class="content">
            
                    <div class="stadium">
    
                    <p>${match.fixture.venue.name}</p></div>
                        <p>Vs</p>
                </div>
                <div class="team2">
                    <img src="${match.teams.away.logo}" alt="${match.teams.away.name}">
                    <p>${match.teams.away.name}</p>
                </div>
            </div>
        </div>
        `;
    }).join("");

    document.querySelector(".matches-box").innerHTML = result;
};


const getResultMatches= async ()=>
{
    try {
        const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-apisports-key": "ad8e19b88c6871891ffcc93972dc76d3" // API Key
            },
            params: {
                team:49,   // رقم الفريق المطلوب
                status: 'FT',   // المباريات القادمة (NS = Not Started)
                season: 2024,   // الموسم الحالي
                league: 39,     // مثال: الدوري الإنجليزي
                timezone: 'Asia/Riyadh' // ضبط التوقيت لمنطقتك
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error.message);
    }
}



const displayResultMatch= async ()=>
{
    const matches = await getResultMatches();

    if (!matches || !matches.response || matches.response.length === 0) {
        console.error("لا توجد مباريات متاحة.");
        return;
    }

  
    const numberOfMatches = 6; 
    const limitedMatches = matches.response.slice(0, numberOfMatches);

    const result = limitedMatches.map(match => {
        return `
        <div class="match-card">
    <div class="details">
        <h1>${match.league.name}</h1>
        <h2>${match.fixture.date}</h2>
    </div>   
    <div class="teams">
        <div class="team1">
            <img src="${match.teams.home.logo}" alt="${match.teams.home.name}">
            <p>${match.teams.home.name}</p>
            <p>${match.score.fulltime.home}</p>
        </div>
        <div class="content">
    
            <div class="info">

            <p>Full Time</p></div>
                <p><span>Vs</span></p>
             <p>${match.fixture.venue.name}</p>
        </div>
        <div class="team2">
            <img src="${match.teams.away.logo}" alt="${match.teams.away.name}">
            <p>${match.teams.away.name}</p>
            <p>${match.score.fulltime.away}</p>
        </div>
    </div>
</div>
        `;
    }).join("");

    document.querySelector(".last-result .result-container").innerHTML = result;
}

displayHeadtoHead();
displayStanding();
displayResultMatch();
