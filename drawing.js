// ------------------------- Funções de desenho no Canvas -----------------------------------

//Desenha uma linha entre os pontos point1 e point2
function drawLine(context, point1, point2, strokeWidth, strokeColor) {
  	context.beginPath();
	context.moveTo(point1.x, point1.y);
	context.lineTo(point2.x, point2.y);
	context.lineWidth = strokeWidth;
	context.strokeStyle = strokeColor;
	context.stroke();
}

//Pinta um ponto no canvas de acordo com as coordenadas de point
function drawPoint(context, point, pointRadius, fillColor) {
	context.beginPath();
	context.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI, false);
	context.fillStyle = fillColor;
	context.fill();
}

//Desenha o grid. _begin e _end são os extremos das interpolações
function drawGrid(context, _begin, _end, strokeWidth, strokeColor) {

	for(let i = _begin ; i <= _end ; ++i) {
		let point1Interpol1 = {
			'x': (controlPoints[0].x*(1-i) + controlPoints[1].x*i),
			'y': (controlPoints[0].y*(1-i) + controlPoints[1].y*i)
		};
		let point2Interpol1 = {
			'x': (controlPoints[2].x*(1-i) + controlPoints[3].x*i),
			'y': (controlPoints[2].y*(1-i) + controlPoints[3].y*i)
		};
		let point1Interpol2 = {
			'x': (controlPoints[0].x*(1-i) + controlPoints[2].x*i),
			'y': (controlPoints[0].y*(1-i) + controlPoints[2].y*i)
		};
		let point2Interpol2 = {
			'x': (controlPoints[1].x*(1-i) + controlPoints[3].x*i),
			'y': (controlPoints[1].y*(1-i) + controlPoints[3].y*i)
		};

		let lastPointInterpol1 = undefined, lastPointInterpol2 = undefined;
		for(let j = _begin ; j <= _end ; ++j) {
			let curInterpol1 = {
				'x': (point1Interpol1.x*(1-j) + point2Interpol1.x*j),
				'y': (point1Interpol1.y*(1-j) + point2Interpol1.y*j)
			};
			let curInterpol2 = {
				'x': (point1Interpol2.x*(1-j) + point2Interpol2.x*j),
				'y': (point1Interpol2.y*(1-j) + point2Interpol2.y*j)
			};
			if(j != _begin) {
				drawLine(context, curInterpol1, lastPointInterpol1,
									strokeWidth, strokeColor);
				drawLine(context, curInterpol2, lastPointInterpol2,
									strokeWidth, strokeColor);
			}
			lastPointInterpol1 = curInterpol1;
			lastPointInterpol2 = curInterpol2;
		}
	}
}