(() => {

	let currentScrollY = 0;			// 현재 scrollY 위치값
	let currentSection = 0;			// 현재 섹션위치
	let sectionYOffset = 0;			// 현재 섹션에 따른 scrollY 상대값
	
		// sectionSet : n번째 섹션에 대한 각종 정보집합
		const sectionSet = [
			// section0
			{
				height: 0,
				multiplyValue: 5,
				elemInfo: {
					section: document.querySelector(".section0"),
					message: [
						document.querySelector("#section0-message-0"),
						document.querySelector("#section0-message-1"),
						document.querySelector("#section0-message-2"),
						document.querySelector("#section0-message-3"),
					],
					canvas: document.querySelector("#section0-canvas")
				},
				opacitySettingsValues: {	// 투명도 애니메이션 셋팅 값들
					message0_opacity_out: [0, 1, { start: 0.05, end: 0.14 }],
					message0_opacity_in: [1, 0, { start: 0.15, end: 0.24 }],
	
					message1_opacity_out: [0, 1, { start: 0.25, end: 0.34 }],
					message1_opacity_in: [1, 0, { start: 0.35, end: 0.44 }],
	
					message2_opacity_out: [0, 1, { start: 0.45, end: 0.54 }],
					message2_opacity_in: [1, 0, { start: 0.55, end: 0.64 }],
	
					message3_opacity_out: [0, 1, { start: 0.65, end: 0.74 }],
					message3_opacity_in: [1, 0, { start: 0.75, end: 0.84 }],
				},
				tanslateYSettingsValues: {	// 글자 위치 애니메이션 셋팅 값들
					message0_translateY_out: [0, -20, { start: 0.05, end: 0.14 }],
					message0_translateY_in: [-20, -40, { start: 0.15, end: 0.24 }],
	
					message1_translateY_out: [0, -20, { start: 0.25, end: 0.34 }],
					message1_translateY_in: [-20, -40, { start: 0.35, end: 0.44 }],
	
					message2_translateY_out: [0, -20, { start: 0.45, end: 0.54 }],
					message2_translateY_in: [-20, -40, { start: 0.55, end: 0.64 }],
	
					message3_translateY_out: [0, -20, { start: 0.65, end: 0.74 }],
					message3_translateY_in: [-20, -40, { start: 0.75, end: 0.84 }],
				},
				imageSettingsValues: {	// 캔버스 이미지 애니메이션 셋팅 값들
					imageCount: 500,
					imageRange: [0, 499, {start: 0, end: 1}],
					image_in: [1, 0, {start: 0.85, end: 1}],
					images: []
				}
			},
			// section1
			{
				height: 0,
				multiplyValue: 2,
				elemInfo: {
					section: document.querySelector(".section1")
				}
			},
			// section2
			{
				height:0,
				multiplyValue: 2,
				elemInfo: {
					section: document.querySelector(".section2"),
					message: [
						document.querySelector("#section2-message-0")
					]
				},
				opacitySettingsValues: {	// 투명도 애니메이션 셋팅 값들
					message0_opacity_out: [0, 1, { start: 0.00, end: 0.05 }]
				},
				tanslateYSettingsValues: {	// 글자 위치 애니메이션 셋팅 값들
					message0_translateY_out: [0, -40, { start: 0.00, end: 0.05 }],
				},
			}
		];
	
		/////////////////////////////////////////////////////////
		// 일반 함수
	
		// setLayout : window창 크기에 대한  section 사이즈 영역 설정
		//  - parameter : x
		//  - return : x
		const setLayout = function () 
		{
			const currentHeight = window.innerHeight;
	
			for (let i = 0; i < sectionSet.length; i++) 
			{
				sectionSet[i].height = currentHeight * sectionSet[i].multiplyValue;
				sectionSet[i].elemInfo.section.style.height = `${sectionSet[i].height}px`;
			}
		};
	
		// getCurrentSection : scrollY 위치에 따른 현재 section 위치 구하기
		//  - parameter : x
		//  - return : 현재 섹션 값
		const getCurrentSection = function () 
		{
			let value = 0;
			let sum = 0;
			let index = 0;
	
			for (let i = 0; i < sectionSet.length; i++) 
			{
				sum = sum + sectionSet[i].height;
	
				if (currentScrollY <= sum) 
				{
					value = index;
					break;
				}
	
				index++;
			}
	
			return value;
		};
	
		// getSectionYOffset : 현재 섹션 위치에 따른 scrollY의 상대값 구하기
		//  - parameter : x
		//  - return : 현재 섹션 위치에 따른 scrollY 상대값
		const getSectionYOffset = function () 
		{
			let value = currentScrollY;
	
			for (let i = 0; i < currentSection; i++) 
			{
				value = value - sectionSet[i].height;
			}
	
			return value;
		};
	
		// setBodyClass : 현재 섹션 위치에 따른 body class 업데이트
		//                section0의 내용이 다른 섹션에 위치하게 했을 때 안보이게 하기위한 것
		//  - parameter : x
		//  - return : x
		const setBodyClass = function () 
		{
			document.body.className = `show-section${currentSection}`;
		};
	
		// calcValue : 애니메이션에 적용하기 위한 값을 CSS화 한다.
		//  - parameter : 각영역의 투명도설정값 ([0, 1, { start: 0.05, end: 0.14 }])
		//  - return : CSS화한 값
		const calcValue = function (value) 
		{
			let rate;
			let result;
			let height = sectionSet[currentSection].height;
	
			// 비율에 기반한 CSS화한 값
			let startValue = height * value[2].start;
			let endValue = height * value[2].end;
			let heightValue = endValue - startValue;
	
			// 설정범위에 벗어났을 경우 값의 가장 끝 값인 value[0]과 value[1]로
			// 임의로 값을 지정해준다.
			if(sectionYOffset < startValue)
			{
				result = value[0];
			}
			else if(sectionYOffset > endValue)
			{
				result = value[1];
			}
			else
			{
				rate = (sectionYOffset - startValue) / heightValue;
	
				result = (rate * (value[1] - value[0])) + value[0];
			}
			return result;
		};
	
		// playAnimation : 섹션에 따른 애니메이션 동작 시키기
		//  - parameter : x
		//  - return : x
		const playAnimation = function () 
		{
			let value;
			let opacityValue;
			let translateYValue;
			let messageValue;
	
			let imageIndex = 0;
			
	
			const yOffsetRate = sectionYOffset / sectionSet[currentSection].height;
	
			let canvasCtx;
			let images;
			let imageRange;
	
			switch (currentSection) 
			{
				case 0:		// section0
	
					// cnavas info
					canvasCtx = sectionSet[currentSection].elemInfo.canvas.getContext('2d');
					images = sectionSet[currentSection].imageSettingsValues.images;
					imageRange = sectionSet[currentSection].imageSettingsValues.imageRange;
	
					imageIndex = Math.floor(calcValue(imageRange));
					canvasCtx.drawImage(images[imageIndex], 0, 0);
	
					// opacitiy 값 초기화
					sectionSet[0].elemInfo.message.map((el) => {
						el.style.opacity = 0;
					});
	
					opacityValue = sectionSet[0].opacitySettingsValues;
					translateYValue = sectionSet[0].tanslateYSettingsValues;
					messageValue = sectionSet[0].elemInfo.message;
	
					// message0
					if (yOffsetRate < 0.15) 
					{
						value = calcValue(opacityValue.message0_opacity_out);
						messageValue[0].style.opacity = value;
						
						value = calcValue(translateYValue.message0_translateY_out);
						messageValue[0].style.transform = `translateY(${value}%)`;
					} 
					else if (yOffsetRate >= 0.15 && yOffsetRate < 0.25) 
					{
						value = calcValue(opacityValue.message0_opacity_in);
						messageValue[0].style.opacity = value;
	
						value = calcValue(translateYValue.message0_translateY_in);
						messageValue[0].style.transform = `translateY(${value}%)`;
					}
	
					// message1
					else if (yOffsetRate >= 0.25 && yOffsetRate < 0.35) 
					{
						value = calcValue(opacityValue.message1_opacity_out);
						messageValue[1].style.opacity = value;
	
						value = calcValue(translateYValue.message1_translateY_out);
						messageValue[1].style.transform = `translateY(${value}%)`;
					} 
					else if (yOffsetRate >= 0.35 && yOffsetRate < 0.45) 
					{
						value = calcValue(opacityValue.message1_opacity_in);
						messageValue[1].style.opacity = value;
	
						value = calcValue(translateYValue.message1_translateY_in);
						messageValue[1].style.transform = `translateY(${value}%)`;
					}
	
					// message2
					else if (yOffsetRate >= 0.45 && yOffsetRate < 0.55) 
					{
						value = calcValue(opacityValue.message2_opacity_out);
						messageValue[2].style.opacity = value;
	
						value = calcValue(translateYValue.message2_translateY_out);
						messageValue[2].style.transform = `translateY(${value}%)`;
					} 
					else if (yOffsetRate >= 0.55 && yOffsetRate < 0.65) 
					{
						value = calcValue(opacityValue.message2_opacity_in);
						messageValue[2].style.opacity = value;
	
						value = calcValue(translateYValue.message2_translateY_in);
						messageValue[2].style.transform = `translateY(${value}%)`;
					}
	
					// message3
					else if (yOffsetRate >= 0.65 && yOffsetRate < 0.75) 
					{
						value = calcValue(opacityValue.message3_opacity_out);
						messageValue[3].style.opacity = value;
	
						value = calcValue(translateYValue.message3_translateY_out);
						messageValue[3].style.transform = `translateY(${value}%)`;
					} 
					else if (yOffsetRate >= 0.75 && yOffsetRate < 0.85) 
					{
						value = calcValue(opacityValue.message3_opacity_in);
						messageValue[3].style.opacity = value;
	
						value = calcValue(translateYValue.message3_translateY_in);
						messageValue[3].style.transform = `translateY(${value}%)`;
					}
	
					else 
					{
						value = calcValue(sectionSet[currentSection].imageSettingsValues.image_in);
						sectionSet[currentSection].elemInfo.canvas.style.opacity = value;
					}
	
					break;
	
				case 1:		// section1
					break;
	
				case 2:		// section2
					// opacity 값 초기화
					sectionSet[2].elemInfo.message.map((el) => {
						el.style.opacity = 0;
					});
	
					opacityValue = sectionSet[2].opacitySettingsValues;
					translateYValue = sectionSet[2].tanslateYSettingsValues;
					messageValue = sectionSet[2].elemInfo.message;
	
					// message0
					if(yOffsetRate < 0.25)
					{
						value = calcValue(opacityValue.message0_opacity_out);
						messageValue[0].style.opacity = value;
	
						value = calcValue(translateYValue.message0_translateY_out);
						messageValue[0].style.transform = `translateY(${value}%)`;
					}
	
					else	// 0.25범위 지나면 opacity를 1로 계속 유지하도록 설정
					{
						messageValue[0].style.opacity = 1;
					}
	
					break;
			}
		};
	
		// setCanvasImage : 이미지를 로딩하고 캔버스에 이미지를 셋팅한다.
		//  - parameter : x
		//  - return : x
		const setCanvasImage = function() 
		{
			const imageCount = sectionSet[0].imageSettingsValues.imageCount;
			const imagesArr = sectionSet[0].imageSettingsValues.images;
			let imageElem;
	
			for(let i = 0; i < imageCount; i++)
			{
				imageElem = new Image();
				imageElem.src = `./image/apple_${i}.png`;
	
				imagesArr.push(imageElem);
			}
	
			const ctx = sectionSet[0].elemInfo.canvas.getContext('2d');
	
			imageElem.addEventListener("load", () => {
				ctx.drawImage(imagesArr[0], 0, 0);
			});
			
		};
	
		// fixLocalNav : 스크롤을 내릴때 global nav 영역을 벗어나면 position fixed로 변경
		//  - parameter : x
		//  - return : x
		const fixLocalNav = function()
		{
			if(currentScrollY > 44)
			{
				document.body.id = "fix-local";
			}
			else 
			{
				document.body.removeAttribute("id");
			}
		}
	
		/////////////////////////////////////////////////////////
		// 이벤트 핸들러
	
		// 로딩된후에 발생되는 이벤트!
		window.addEventListener("load", () => {
	
			setLayout();
	
			currentScrollY = window.scrollY;
			currentSection = getCurrentSection();
			sectionYOffset = getSectionYOffset();
	
			setBodyClass();
			
			setCanvasImage();
	
		});
	
		// 스크롤을 진행했을시에 발생되는 이벤트!
		window.addEventListener("scroll", () => {
			currentScrollY = window.scrollY;
			currentSection = getCurrentSection();
			sectionYOffset = getSectionYOffset();
	
			setBodyClass();
	
			playAnimation();
	
			fixLocalNav();
		});
	
		// window창의 크기를 변경해주었을때 발생되는 이벤트!
		window.addEventListener("resize", () => {
			setLayout();
	
			currentScrollY = window.scrollY;
			currentSection = getCurrentSection();
			sectionYOffset = getSectionYOffset();
	
			setBodyClass();
		});
	})();
	