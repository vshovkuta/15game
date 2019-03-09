//Объявление счетчика ходов, счетчика времени, инициализация массива игровых клеток;
var COUNT;
var TIME;
var cell = document.getElementsByClassName('cell_game');
var Timer;


initGame();
document.getElementById('Reset').onclick = initGame;
document.getElementById('ResetEnd').onclick = initGame;

//Инициализация игрового поля: инициализация массива значений, заполнение клеток случайными елементами массива значений, добавление data-* атрибутов;
function initGame() {

	document.getElementById('Win').style.display = 'none';
	
	clearInterval(Timer);
	
	let value = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15, ''];
	
	for ( let i = 0; i < cell.length; ++i ) {
		let currentValue = value.splice( Math.floor( Math.random() * value.length ), 1 );
		//console.log ('i = ' + i);
		
		//Проверка на несовпадение значений клетки и ее индекса;
		if ( currentValue != i+1 ) {
			cell[i].innerHTML = currentValue; //Math.floor(Math.random() * (max - min)) + min;
			//console.log( 'different value: i = ' + i + ' currentValue = ' + currentValue );
		} else {
			//console.log( 'same value: i = ' + i + ' currentValue = ' + currentValue );
			value.push( currentValue );
			--i;
			continue;			
		}
		
		//Назначение атрибуту 'data-empty' значения 'true' для пустой клетки
		if (cell[i].innerHTML == '') {
			cell[i].setAttribute('data-empty', 'true');
		} else {
			cell[i].setAttribute('data-empty', 'false');
		}
		
			cell[i].style.backgroundColor = '';
			cell[i].setAttribute('data-number', i);
			cell[i].setAttribute('data-resolved', 'false');
			cell[i].onclick = clickCell;
			
	}
	
	//Проверка на разрешимость текущей расстановки игрового поля
	if(!checkFinite()) {
		initGame();
		//console.log('Unresolve game: trying again!');
		return;
	}
	//console.log('Resolve game!');
	
	//Присвоение начальных значений счетчикам
	TIME = 0;
	COUNT = 0;
	
	Timer = setInterval( spendTime, 1000 );
	document.getElementById('Count').innerText = 'COUNT: ' + COUNT;
}
//Конец инициализация

//Получение индекса пустой ячейки
function getEmptyCell() {
	for (let i = 0; i < cell.length; ++i) {
		if (cell[i].dataset.empty == 'true') {
			return i;
		}
	}
}


function clickCell() {
	let emptyCellIndex = getEmptyCell();
	
	//console.log('Empty cell: ' + emptyCellIndex);
	//console.log('Current cell: ' + this.dataset.number);
	
	if ( this.dataset.number == ( emptyCellIndex + 4 )
			|| this.dataset.number == ( emptyCellIndex - 4 )
			|| this.dataset.number == ( emptyCellIndex + 1 ) 
				&& this.dataset.number % 4 != 0 // this.dataset.number != 4 && this.dataset.number != 8 && this.dataset.number != 12
			|| this.dataset.number == ( emptyCellIndex - 1 ) 
				&& this.dataset.number % 4 != 3 // this.dataset.number != 11 && this.dataset.number != 7 && this.dataset.number != 3
	)
	
		moveValue(this, cell[emptyCellIndex]); 

		document.getElementById('Count').innerText = 'COUNT: ' + COUNT;
		checkWin();
}


//Обмен значениями между пустой ячейкой и нажатой ячейкой
function moveValue( _clickCellIndex, _emptyCellIndex ) {

	_emptyCellIndex.innerText = _clickCellIndex.innerText;
	_emptyCellIndex.dataset.empty = 'false';
	_clickCellIndex.innerText = '';
	_clickCellIndex.dataset.empty = 'true';
	
	if ( _emptyCellIndex.innerText == +_emptyCellIndex.dataset.number + 1 ) {
		_emptyCellIndex.style.backgroundColor = '#9acc9b';
		_emptyCellIndex.dataset.resolved = 'true';
		COUNT++;
	 } else {
		_clickCellIndex.style.backgroundColor = '';
		_clickCellIndex.dataset.resolved = 'false';
		COUNT++;
	 }
	 
}

function checkWin() {
	let resolvedCellCount = 0;
	
	for (let i = 0; i < cell.length; ++i) {
		if (cell[i].dataset.resolved == 'true') { 
			resolvedCellCount++;
		}
	}
	
	if (resolvedCellCount == 15) {
		clearInterval(Timer);
		document.getElementById('Win').style.display = 'flex';
		} 	
}

function checkFinite() {
	let sum = 0;
	let emptyCellIndex = getEmptyCell();
	let emptyRowIndex;
	
	for (let i = 0; i < cell.length; ++i) {
		for (let j = i+1; j < cell.length; ++j) {
			if ( ( +cell[i].innerText > +cell[j].innerText ) && cell[j].innerText != '') {
					//console.log('i: ' + i + ', j: ' + j);
					//console.log('cell[i]: ' + cell[i].innerText + ', cell[j]: ' + cell[j].innerText);
					sum++;				
			}
		}
	}
	//console.log('sum: ' + sum);
	
	if (emptyCellIndex >=0 && emptyCellIndex <=3) emptyRowIndex = 1;
	if (emptyCellIndex >=4 && emptyCellIndex <=7) emptyRowIndex = 2;
	if (emptyCellIndex >=8 && emptyCellIndex <=11) emptyRowIndex = 3;
	if (emptyCellIndex >=12 && emptyCellIndex <=15) emptyRowIndex = 4;
	//console.log('emptyRowIndex: ' + emptyRowIndex);
	
	if ( (sum + emptyRowIndex) % 2 == 0) {
		return true;
	}
	return false;
}


//Отсчет игрового времени
function spendTime() {
	 //console.log(TIME);
	document.getElementById('Spend').innerText = 'TIME: ' + Math.floor(TIME/60) + ':' + (TIME%60<10?'0'+TIME%60:TIME%60);
	TIME++;

}