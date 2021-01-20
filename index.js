const dataFor3dModelRender = {
    46: {
        slot: "hotspot-first_floor-DGU",
        data_position: "0m 1.5m 5m",
        data_normal: "0 -1.25 1",
        data_tooltip: "Этаж 1. ДГУ"
	},
    44: {
        slot: "hotspot-first_floor-climate_control",
        data_position: "1.25m 1.5m 5m",
        data_normal: "0 -1.25 1",
        data_tooltip: "Этаж 1. Агрегатная климат-контроля"
	},
    60: {
        slot: "hotspot-second_floor-DGU",
        data_position: "0.5m 5m 2.25m",
        data_normal: "0 -4 1",
        data_tooltip: "Этаж 2. ДГУ"
	},
    58: {
        slot: "hotspot-second_floor-SCHVS",
        data_position: "-0.5m 5m 2.25m",
        data_normal: "0 -4 1",
        data_tooltip: "Этаж 2. СЧВС"
	},
    50:  {
        slot: "hotspot-antenne",
        data_position: "0m 18m 3.5m",
        data_normal: "0 0.7 1",
        data_tooltip: "Щитовая №3 - Собирающее зеркало"
	},
    56: {
        slot: "hotspot-second_floor-server_equip",
        data_position: "-1.5m 5m 2m",
        data_normal: "0 -4 1",
        data_tooltip: "Этаж 2. Серверное оборудование"
	},
    48: {
        slot: "hotspot-first_floor-IBP",
        data_position: "-2m 1.5m 4.75m",
        data_normal: "0 -1.25 1",
        data_tooltip: "Этаж 1. ИБП"
	},
}

const modelViewer = document.querySelector("#reveal");

$(document).ready( function(){
	$('#range-x').range({
		min: -100,
		max: 100,
		start: 0,
		onChange: function(value) {
			$('#x-coordinate').html(value / 10 + "m");
			updateButtonPosition()
		}
	});

	$('#range-y').range({
		min: -100,
		max: 200,
		start: 0,
		onChange: function(value) {
			$('#y-coordinate').html(value / 10 + "m");
			updateButtonPosition()
		}
	});

	$('#range-z').range({
		min: -100,
		max: 100,
		start: 0,
		onChange: function(value) {
			$('#z-coordinate').html(value / 10 + "m");
			updateButtonPosition()
		}
	});
});

$('.ui.dropdown')
	.dropdown({
		onChange: function (value, text, $selectedItem) {
			const color = value.split(',').map( (numberString) => {
				return parseFloat(numberString)
			});
			console.log(color)
			const [material] = modelViewer.model.materials;
			console.log(material);
			material.pbrMetallicRoughness.setBaseColorFactor(color);
			console.log("Вывести модель" ,modelViewer.model);
		}
	});

function renderButtons() {
	console.log("start rendering buttons")

	// create buttons
	for (let buttonId in dataFor3dModelRender) {
		let currentButton = dataFor3dModelRender[buttonId];
		modelViewer.insertAdjacentHTML("beforeend", `
		<div
			class="model-button-container"
			slot=${currentButton.slot}
			data-position="${currentButton.data_position}"
			data-normal="${currentButton.data_normal}"
		>
			<button
				class="model-button"
				slot=${currentButton.slot}
				data-position="top center"
				data-tooltip="${currentButton.data_tooltip}"
				data-inverted=""
				data-buttonId=${buttonId}
				data-position-for-script="${currentButton.data_position}"
			>
			</button>
		</div>`
		)
	}

	// add event handlers to buttons
	let modelButtons = document.querySelectorAll(".model-button");
	for (let button of modelButtons) {
		button.onclick = function (event) {
			let currentButton = event.target;
			$('#button-name').text(currentButton.slot);
			$('#apply-changes').attr("data-current-button", currentButton.dataset.buttonid)
			let positionsArr = currentButton.dataset.positionForScript.split(" ");
			positionsArr.forEach((position, index, arr) => {
				arr[index] = Number(position.slice(0, position.length - 1)) * 10
			})
			console.log(positionsArr);
			let [xValue, yValue, zValue] = positionsArr;

			$('#range-x').range('set value', xValue )
			$('#range-y').range('set value', yValue)

			$('#range-z').range('set value', zValue)

		}
	}
}

function deleteButtons() {
	let modelButtons = document.querySelectorAll(".model-button-container");
	for (let button of modelButtons) {
		button.remove()
	}
}

function updateButtonPositionData(buttonId, x, y, z) {
	dataFor3dModelRender[buttonId].data_position = `${x} ${y} ${z}`;
}

function updateButtonPosition() {
	let currentButtonId = $('#apply-changes').attr("data-current-button");
	let xCoordinate = $('#x-coordinate').text();
	let yCoordinate = $('#y-coordinate').text();
	let zCoordinate = $('#z-coordinate').text();

	if (currentButtonId === "") {
		console.log("выберите кнопку которую нужно передвинуть")
	} else {
		deleteButtons()
		updateButtonPositionData(currentButtonId, xCoordinate, yCoordinate, zCoordinate)
		renderButtons()
	}
}

let is_model_loaded_interval = setInterval(() => {
	if (!modelViewer.modelIsVisible) {
		console.log("not loaded yet")
	} else {
		console.log("loaded, stop the interval");
		renderButtons();
		clearInterval(is_model_loaded_interval);
	}
}, 550)

let addModel = document.getElementById("add-model");
let cardsContainer = document.querySelector(".ui.cards.dark");
let applyChangesButton = document.getElementById("apply-changes");

applyChangesButton.onclick = updateButtonPosition

addModel.onclick = function () {
	cardsContainer.insertAdjacentHTML("beforeend", `
		<div class="card dark">
            <div class="image" style="height: 417px">
                <!--                skybox-image="images/spruit_sunrise_1k_HDR.hdr"-->
                <model-viewer
                        id="reveal"
                        ar ar-modes="webxr"
                        camera-controls
                        camera-orbit="-25deg 95deg"
                        style="height: 100%; width: auto; background-color: #1C2E42"
                        src="3dModels/tna.glb"
                        alt="A 3D model of an antenne"
                        poster="3dModels/tnaLoadingPoster.svg"
                >
                </model-viewer>
            </div>
            <div class="content">
                <div class="header">Название</div>
                <div class="description">Antenne</div>
            </div>
            <div class="content">
                <div class="header">Состояние</div>
                <div class="description">Стабильное</div>
            </div>
            <div class="content">
                <div class="header">Выбрать цвет</div>
                <div class="description">
                    <select class="ui dropdown">
                        <option value="">Color</option>
                        <option value="1,0,0,1">Red</option>
                        <option value="0,1,0,1">Green</option>
                        <option value="0.22,0.22,0.22,0.22">Default</option>
                    </select>
                </div>
            </div>
            <div class="content">
                <div class="header">
                    Расположение кнопки
                </div>
                <b id="button-name"></b>
                <br>
                <br>
                <div class="description">
                    <p>
                        <span>Ось Х:</span>
                        <b id="x-coordinate">координаты по икс</b>
                    </p>
                    <div class="ui range" id="range-x"></div>

                    <p>
                        <span>Ось Y:</span>
                        <b id="y-coordinate">координаты по игрек</b>
                    </p>
                    <div class="ui range" id="range-y"></div>

                    <p>
                        <span>Ось Z:</span>
                        <b id="z-coordinate">координаты по зэт</b>
                    </p>
                    <div class="ui range" id="range-z"></div>
                </div>
            </div>
        </div>
        
	`);

}

// setTimeout(() => {
// 	let canvas = modelViewer.shadowRoot.getElementById("webgl-canvas");
// 	console.log(canvas);
// 	canvas.style.backgroundColor = "#1C2E42"
// }, 500)