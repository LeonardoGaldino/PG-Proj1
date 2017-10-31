//Quando o documento estiver completamente carregado,
//Inicialize os elementos com a classe 'modal'.
//Mais especificamente para a tela de 'ajuda'.
$(document).ready(function(){
	$('.modal').modal();
});


// -------------------------------- Configurações -----------------------------------
var canvas = document.getElementById('canvas-node');
var context = canvas.getContext('2d');
var configs = { // Configurações da aplicação
	'strokeWidth': 1,
	'strokeColor': '#ffffff',
	'pointRadius': 5,
	'pointColor': '#7e0d70',
	'minPoints': 4,
	'interpolationBegin': -10,
	'interpolationEnd': 11
};
var canDrag = false; // Controle para o callback de drag
var dragIndex; // Índice do ponto sendo arrastado
var controlPoints = []; // Pontos de controle inseridos
var wasClick = false; // Controle para adição/remoção de pontos

function initCanvas() {
	let canvasParentNode = document.getElementById('canvas-parent');
	canvas.width = canvasParentNode.clientWidth;
	canvas.height = canvasParentNode.clientHeight;
}

initCanvas();

// -------------------------------- Funções gerais -----------------------------------
function eraseCanvas() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function resetApp() {
	eraseCanvas();
	controlPoints = [];
}

function updateInterpolField(numberInterpolations) {
	let elementNode = document.getElementById('interpol-field');
	elementNode.innerHTML = numberInterpolations;
	if(numberInterpolations < 50)
		elementNode.style.backgroundColor = '#0ec70e';
	else if(numberInterpolations >= 50 && numberInterpolations < 100)
		elementNode.style.backgroundColor = '#ffeb3b';
	else
		elementNode.style.backgroundColor = 'red';
}

function updateInterpolation() {
	let numberInterpolations = (0 | document.getElementById('interpolation-number').value);
	configs.interpolationBegin = -parseInt(numberInterpolations/2);
	configs.interpolationEnd = parseInt(numberInterpolations/2+1);
	updateInterpolField(numberInterpolations);
	drawApp();
}

function getMousePos(clickEvent) {
	//Box do DOM node do canvas.
	var canvasBox = canvas.getBoundingClientRect();

	//ClientX e ClientY são as coordenadas do click na tela.
	//Para obtermos as coordenadas em relação ao canvas,
	//Subtraimos os extremos do box do canvas.
	return {
	  x: (clickEvent.clientX - canvasBox.left),
	  y: (clickEvent.clientY - canvasBox.top)
	};
}

function drawApp() {
	eraseCanvas();
	if(controlPoints.length == configs.minPoints)
		drawGrid(context, 
			configs.interpolationBegin, configs.interpolationEnd,
				configs.strokeWidth, configs.strokeColor);
	drawPoints();
}

//Função para tratar tudo relacionado a adicionar um ponto
function addPoint(point) {
	if(controlPoints.length >= configs.minPoints)
		return;
	controlPoints.push(point)
	drawApp();
}

function drawPoints() {
	controlPoints.forEach( (point) => {
		drawPoint(context, point, configs.pointRadius, configs.pointColor);
	});
}

function pointClicked(clickPosition, pointPosition) {
	let squaredRadius = configs.pointRadius*configs.pointRadius;
	let diffX = (clickPosition.x - pointPosition.x);
	let diffY = (clickPosition.y - pointPosition.y);
	return (squaredRadius >= (diffX*diffX + diffY*diffY));
}

function searchPointIndex(clickPosition) {
	for(let i = 0 ; i < controlPoints.length ; ++i) {
		if(pointClicked(clickPosition, controlPoints[i]))
			return i;
	}
	return -1;
}

// -------------------------------- Funções de Callback -----------------------------------
function handleDoubleClick(clickEvent) {
	let clickPosition = getMousePos(clickEvent);
	controlPoints = controlPoints.filter( (point) => {
		return (!pointClicked(clickPosition, point));
	});
	if(controlPoints.length != 4) {
		eraseCanvas();
		drawPoints();
	}	
}

function handleDrag(dragEvent) {
	let point = controlPoints[dragIndex];
	var canvasBox = canvas.getBoundingClientRect();

	if(canDrag) {
		point.x = dragEvent.clientX - canvasBox.left;
		point.y = dragEvent.clientY - canvasBox.top;
		drawApp();
	}
}

function handleMouseDown(clickEvent) {
	let mousePosition = getMousePos(clickEvent);
	dragIndex = searchPointIndex(mousePosition);
	if(dragIndex != -1) {
		canDrag = true;
		canvas.onmousemove = handleDrag;
		wasClick = false; //Clicou em um ponto existente,
							//então não adiciona novo ponto
	} else {
		wasClick = true; //Não clicou em nenhum ponto,
	}						//então poderá adicionar novo ponto
}

function handleMouseUp(clickEvent) {
	canDrag = false;
	canvas.onmousemove = null;
	if(wasClick) {
		if(controlPoints.length < 4) {
			let newPoint = getMousePos(clickEvent);
			addPoint(newPoint);
		}
	}	
}

// -------------------------------- Canvas Listeners -----------------------------------
canvas.addEventListener('dblclick', handleDoubleClick);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);



