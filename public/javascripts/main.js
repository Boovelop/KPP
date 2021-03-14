window.addEventListener('load', function () {
	// const album = document.getElementById('section-album');
	// album.innerHTML = '<image src="./images/albums/album_0.gif"></image>';

	$('.album-slick').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		Infinity: true,
		centerMode: true,
		arrows: true,
		autoplay: true,
		autoplaySpeed: 3000, // 자동 스크롤 시 다음으로 넘어가는데 걸리는 시간 (ms)
		pauseOnHover: true, // 슬라이드 이동 시 마우스 호버하면 슬라이더 멈추게 설정

		responsive: [
			{
				breakpoint: 960, //화면 사이즈 960px
				settings: {
					//위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 768, //화면 사이즈 768px
				settings: {
					//위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
					slidesToShow: 2,
				},
			},
		],
	});
});
