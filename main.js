(() => {
	/*
  currentScrollY : 현재 scrollY 위치값
  currentSection : 현재 섹션위치
  sectionYOffset : 현재 섹션에 따른 scrollY 상대값
  */
	let currentScrollY = 0;
	let currentSection = 0;
	let sectionYOffset = 0;

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
			},
			opacitySettingsValues: {
				message0_opacity_out: [0, 1, { start: 0.05, end: 0.14 }],
				message0_opacity_in: [1, 0, { start: 0.15, end: 0.24 }],

				message1_opacity_out: [0, 1, { start: 0.25, end: 0.34 }],
				message1_opacity_in: [1, 0, { start: 0.35, end: 0.44 }],

				message2_opacity_out: [0, 1, { start: 0.45, end: 0.54 }],
				message2_opacity_in: [1, 0, { start: 0.55, end: 0.64 }],

				message3_opacity_out: [0, 1, { start: 0.65, end: 0.74 }],
				message3_opacity_in: [1, 0, { start: 0.75, end: 0.84 }],
			},
		},
		// section1
		{
			height: 0,
			multiplyValue: 3,
			elemInfo: {
				section: document.querySelector(".section1"),
			},
		},
	];

	/////////////////////////////////////////////////////////
	// 일반 함수

	// setLayout : window창 크기에 대한  section 사이즈 영역 설정
	//  - parameter : x
	//  - return : x
	const setLayout = function () {
		const currentHeight = window.innerHeight;

		for (let i = 0; i < sectionSet.length; i++) {
			sectionSet[i].height = currentHeight * sectionSet[i].multiplyValue;
			sectionSet[i].elemInfo.section.style.height = `${sectionSet[i].height}px`;
		}
	};

	// getCurrentSection : scrollY 위치에 따른 현재 section 위치 구하기
	//  - parameter : x
	//  - return : 현재 섹션 값
	const getCurrentSection = function () {
		let value = 0;
		let sum = 0;
		let index = 0;

		for (let i = 0; i < sectionSet.length; i++) {
			sum = sum + sectionSet[i].height;

			if (currentScrollY <= sum) {
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
	const getSectionYOffset = function () {
		let value = currentScrollY;

		for (let i = 0; i < currentSection; i++) {
			value = value - sectionSet[i].height;
		}

		return value;
	};

	// setBodyClass : 현재 섹션 위치에 따른 body class 업데이트
	//                section0의 내용이 다른 섹션에 위치하게 했을 때 안보이게 하기위한 것
	//  - parameter : x
	//  - return : x
	const setBodyClass = function () {
		document.body.className = `show-section${currentSection}`;
	};

	// calcValue : 애니메이션에 적용하기 위한 값을 CSS화 한다.
	//  - parameter : 각영역의 투명도설정값 ([0, 1, { start: 0.05, end: 0.14 }])
	//  - return : CSS화한 값
	const calcValue = function (opacityValue) {
		let rate;
		let result;
		let height = sectionSet[currentSection].height;

		let startValue = height * opacityValue[2].start;
		let endValue = height * opacityValue[2].end;
		let heightValue = endValue - startValue;

		rate = (sectionYOffset - startValue) / heightValue;

		result = rate * (opacityValue[1] - opacityValue[0]) + opacityValue[0];

		if (result < 0) {
			result = 0;
		} else if (result > 1) {
			result = 1;
		}

		return result;
	};

	// playAnimation : 섹션에 따른 애니메이션 동작 시키기
	//  - parameter : x
	//  - return : x
	const playAnimation = function () {
		let value;
		let opacityValue;
		let messageValue;

		const yOffsetRate = sectionYOffset / sectionSet[currentSection].height;

		switch (currentSection) {
			case 0:
				sectionSet[0].elemInfo.message.map((el) => {
					el.style.opacity = 0;
				});

				opacityValue = sectionSet[0].opacitySettingsValues;
				messageValue = sectionSet[0].elemInfo.message;

				if (yOffsetRate < 0.15) {
					value = calcValue(opacityValue.message0_opacity_out);
					messageValue[0].style.opacity = value;
				} else if (yOffsetRate >= 0.15 && yOffsetRate < 0.25) {
					value = calcValue(opacityValue.message0_opacity_in);
					messageValue[0].style.opacity = value;
				} else if (yOffsetRate >= 0.25 && yOffsetRate < 0.35) {
					value = calcValue(opacityValue.message1_opacity_out);
					messageValue[1].style.opacity = value;
				} else if (yOffsetRate >= 0.35 && yOffsetRate < 0.45) {
					value = calcValue(opacityValue.message1_opacity_in);
					messageValue[1].style.opacity = value;
				} else if (yOffsetRate >= 0.45 && yOffsetRate < 0.55) {
					value = calcValue(opacityValue.message2_opacity_out);
					messageValue[2].style.opacity = value;
				} else if (yOffsetRate >= 0.55 && yOffsetRate < 0.65) {
					value = calcValue(opacityValue.message2_opacity_in);
					messageValue[2].style.opacity = value;
				} else if (yOffsetRate >= 0.65 && yOffsetRate < 0.75) {
					value = calcValue(opacityValue.message3_opacity_out);
					messageValue[3].style.opacity = value;
				} else if (yOffsetRate >= 0.75 && yOffsetRate < 0.85) {
					value = calcValue(opacityValue.message3_opacity_in);
					messageValue[3].style.opacity = value;
				} else {
				}
				break;

			case 1:
				break;
		}
	};
	/////////////////////////////////////////////////////////
	// 이벤트 핸들러

	window.addEventListener("load", () => {
		setLayout();

		currentScrollY = window.scrollY;
		currentSection = getCurrentSection();
		sectionYOffset = getSectionYOffset();

		setBodyClass();
	});

	window.addEventListener("scroll", () => {
		currentScrollY = window.scrollY;
		currentSection = getCurrentSection();
		sectionYOffset = getSectionYOffset();

		setBodyClass();

		playAnimation();
	});
})();
