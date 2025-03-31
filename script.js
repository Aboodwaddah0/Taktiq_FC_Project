const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    autoplay: {
      delay: 3000,
    },

    slidesPerView: 1,
    spaceBetween: 10,

  breakpoints: {
 
    320: {
      slidesPerView: 2,
      spaceBetween: 20
    },
   
    480: {
      slidesPerView: 3,
      spaceBetween: 30
    },
  
    640: {
      slidesPerView: 1,
   spaceBetween:40
    }
  },


  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },

    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });

  const swiper2 = new Swiper('.swiper2', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
   

    slidesPerView: 2,
    spaceBetween:20,



    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });


  function zoomPhoto(img) {
    let overlay = document.querySelector(".overlay");
    let zoomedImage = document.querySelector(".zoomedImage");
    zoomedImage.src = img.src;
    overlay.style.display = "flex";
}

function closeZoom() {
    document.querySelector(".overlay").style.display = "none";
}

const getPlayers = async () => {
  try {
      const response = await axios.get('https://v3.football.api-sports.io/players/squads?team=49', {
          headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-apisports-key": "ad8e19b88c6871891ffcc93972dc76d3" // API Key
          }
      });
      return response.data;
  } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error.message);
      return null;
  }
};

const displayPlayer = async () => {
  const player = await getPlayers();
  if (!player || !player.response || player.response.length === 0) {
      console.error("لم يتم العثور على بيانات اللاعبين.");
      return;
  }
  
  const players = player.response[0].players.slice(0,10);

  const result = players.map(item => `
     <div class="swiper-slide">
      <div class="card">
          <div class="player-photo">
              <img src="${item.photo}" alt="${item.name}">
          </div> 
         <div class="player-info">
          
          <div class="player-name"><h2>${item.name}</h2> </div>
          <div class="player-number"><p>${item.number || "N/A"}</p></div>
         
           </div>
      </div>
       </div>
  `).join("");

  const container = document.querySelector(".players .swiper-wrapper ");
  if (container) {
      container.innerHTML = result;
  } else {
      console.error("العنصر .swiper-slide غير موجود في الصفحة.");
  }
};
displayPlayer();