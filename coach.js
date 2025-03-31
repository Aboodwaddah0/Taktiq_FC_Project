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
performanceAccount();
